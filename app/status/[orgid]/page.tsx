// app/status/[orgId]/page.tsx

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function StatusPage({ params }: { params: { orgId: string } }) {
  const orgId = params.orgId;

  // Get all services for the organization
  const services = await prisma.service.findMany({
    where: { organizationId: orgId },
    include: {
      incidents: {
        orderBy: { createdAt: 'desc' },
        take: 5, // only show recent
      },
    },
  });

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">🔧 Service Status</h1>

      {services.length === 0 && <p>No services found for this organization.</p>}

      <ul className="space-y-4">
        {services.map(service => (
          <li key={service.id} className="p-4 border rounded">
            <div className="font-semibold">{service.name}</div>
            <div>Status: <strong>{service.status}</strong></div>

            {service.incidents.length > 0 && (
              <div className="mt-2 text-sm text-red-500">
                Recent incidents:
                <ul className="list-disc ml-6">
                  {service.incidents.map(incident => (
                    <li key={incident.id}>{incident.title} ({incident.status})</li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
