import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) {
      throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
    }

    const headerPayload = headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response('Error occured -- no svix headers', {
        status: 400
      });
    }

    const payload = await request.json();
    const body = JSON.stringify(payload);
    const wh = new Webhook(WEBHOOK_SECRET);
    let evt: WebhookEvent;

    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error('Error verifying webhook:', err);
      return new Response('Error occured', {
        status: 400
      });
    }

    const eventType = evt.type;
    console.log(`Received webhook event: ${eventType}`);

    if (eventType === 'user.created' || eventType === 'user.updated') {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;
      const email = email_addresses[0]?.email_address;
      if (!email) {
        return new Response('Error: No email found in webhook payload', { status: 400 });
      }

      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: { equals: email.toLowerCase(), mode: 'insensitive' } },
            { clerkId: "" }
          ]
        },
      });

      if (existingUser) {
        console.log(`User with email ${email} found. Updating with Clerk ID ${id}...`);
        await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            clerkId: id,
            firstName: first_name || existingUser.firstName,
            lastName: last_name || existingUser.lastName,
            fullName: `${first_name || existingUser.firstName || ''} ${last_name || existingUser.lastName || ''}`.trim(),
            avatar: image_url,
            updatedAt: new Date(),
          },
        });
        console.log(`Successfully updated user ${id}`);
      } else {
        console.log(`User with email ${email} not found. Creating new user...`);
        const defaultOrg = await prisma.organization.findFirst();
        if (!defaultOrg) {
          throw new Error("Cannot create user: No organizations found in the database. Please create an organization first.");
        }
        
        await prisma.user.create({
          data: {
            clerkId: id,
            email: email.toLowerCase(),
            firstName: first_name,
            lastName: last_name,
            fullName: `${first_name || ''} ${last_name || ''}`.trim(),
            avatar: image_url,
            organizationId: defaultOrg.id,
          },
        });
        console.log(`Successfully created new user ${id}`);
      }
    }

    if (eventType === 'user.deleted') {
      const { id } = evt.data;
      if (!id) {
        return new Response('Error: No user ID found in webhook payload for deletion', { status: 400 });
      }
      const existingUser = await prisma.user.findFirst({
        where: { clerkId: id },
      });

      if (existingUser) {
        await prisma.user.delete({
          where: { id: existingUser.id },
        });
        console.log(`Successfully deleted user ${id}`);
      } else {
        console.log(`User with clerkId ${id} not found for deletion.`);
      }
    }

    return new Response('Webhook processed successfully', { status: 200 });

  } catch (error) {
    console.error('Webhook error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Internal server error', details: errorMessage }, { status: 500 });
  }
} 