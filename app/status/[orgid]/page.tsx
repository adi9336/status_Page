// app/status/[orgId]/page.tsx

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function StatusPage({ params }: { params: Promise<{ orgId: string }> }) {
  const { orgId } = await params;

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
    <main className="p-4 sm:p-6 max-w-4xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">🔧 Service Status</h1>

      {services.length === 0 && (
        <p className="text-gray-500 text-sm sm:text-base">No services found for this organization.</p>
      )}

      <ul className="space-y-3 sm:space-y-4">
        {services.map(service => (
          <li key={service.id} className="p-4 sm:p-6 border rounded-lg bg-white shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-2 sm:mb-0">
              <div className="font-semibold text-sm sm:text-base">{service.name}</div>
              <div className="text-sm sm:text-base">
                Status: <strong className={`${
                  service.status === 'OPERATIONAL' ? 'text-green-600' :
                  service.status === 'DEGRADED' ? 'text-yellow-600' :
                  service.status === 'PARTIAL_OUTAGE' ? 'text-orange-600' :
                  'text-red-600'
                }`}>{service.status}</strong>
              </div>
            </div>

            {service.incidents.length > 0 && (
              <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-red-500">
                <div className="font-medium mb-1 sm:mb-2">Recent incidents:</div>
                <ul className="list-disc ml-4 sm:ml-6 space-y-1">
                  {service.incidents.map(incident => (
                    <li key={incident.id} className="text-gray-700">
                      {incident.title} 
                      <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                        {incident.status}
                      </span>
                    </li>
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
