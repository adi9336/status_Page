import { auth } from "@clerk/nextjs/server";

interface ClerkWebhookEvent {
  data: {
    id: string;
    email_addresses: { email_address: string }[];
    first_name?: string;
    last_name?: string;
    // ...other fields you expect
  };
  // ...other fields if needed
}

export default async function TestAuthPage() {
  try {
    const session = await auth();
    const userId = session?.userId;
    
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Auth Test Page</h1>
        <div className="space-y-2">
          <p><strong>Session:</strong> {session ? 'Present' : 'None'}</p>
          <p><strong>User ID:</strong> {userId || 'Not authenticated'}</p>
          <p><strong>Status:</strong> {userId ? 'Authenticated' : 'Not authenticated'}</p>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Auth Test Page</h1>
        <p className="text-red-500">Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }
} 