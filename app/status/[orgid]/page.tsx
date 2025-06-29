// app/status/[orgId]/page.tsx

import { prisma } from "@/lib/prisma";

type IncidentUpdate = {
  id: string;
  content: string;
  createdAt: string | Date;
};

type Incident = {
  id: string;
  title: string;
  status: string;
  createdAt: string | Date;
  updates: IncidentUpdate[];
};

type Service = {
  id: string;
  name: string;
  status: string;
  incidents: Incident[];
};

export default async function StatusPage({ params }: { params: { orgId: string } }) {
  const { orgId } = params;

  // Get all services for the organization
  const services: Service[] = await prisma.service.findMany({
    where: { organizationId: orgId },
    include: {
      incidents: {
        orderBy: { createdAt: 'desc' },
        take: 5, // only show recent
        include: {
          updates: {
            orderBy: { createdAt: 'desc' },
            take: 3, // only show 3 most recent updates
          }
        }
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
        {services.map((service) => (
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
              <div className="mt-3 sm:mt-4 text-xs sm:text-sm">
                <div className="font-medium mb-1 sm:mb-2 text-red-500">Recent incidents:</div>
                <ul className="space-y-2">
                  {service.incidents.map((incident) => (
                    <li key={incident.id} className="border-l-2 border-red-400 pl-3">
                      <div className="text-gray-700 font-medium">{incident.title}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {incident.status}
                      </span>
                        <span className="text-xs text-gray-500">
                          {new Date(incident.createdAt).toLocaleString()}
                        </span>
                      </div>
                      
                      {/* Show recent updates */}
                      {incident.updates && incident.updates.length > 0 && (
                        <div className="mt-2 space-y-1">
                          <div className="text-xs font-medium text-gray-600">Latest updates:</div>
                          {incident.updates.map((update) => (
                            <div key={update.id} className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                              <div>{update.content}</div>
                              <div className="text-gray-400 mt-1">
                                {new Date(update.createdAt).toLocaleString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
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
