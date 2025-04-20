import { useQuery } from "@tanstack/react-query";
import { SystemStat, ServiceStat } from "@shared/schema";

const SystemStats = () => {
  const { data: stats, isLoading: statsLoading } = useQuery<SystemStat>({
    queryKey: ["/api/admin/system-stats"],
  });

  const { data: services, isLoading: servicesLoading } = useQuery<ServiceStat[]>({
    queryKey: ["/api/admin/service-status"],
  });

  if (statsLoading || servicesLoading) {
    return (
      <div className="p-6 animate-pulse space-y-6">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="flex justify-between mb-1">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-10"></div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2"></div>
            </div>
          ))}
        </div>

        <div className="border-t border-secondary-100 pt-4">
          <div className="h-4 bg-gray-200 rounded w-32 mb-3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-gray-200 mr-3"></div>
                <div className="flex-1 flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-secondary-700">စနစ်ဝန်အား</span>
            <span className="text-sm text-secondary-700">{stats?.systemLoad || 0}%</span>
          </div>
          <div className="w-full bg-secondary-200 rounded-full h-2">
            <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${stats?.systemLoad || 0}%` }}></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-secondary-700">လုပ်ငန်းအောင်မြင်မှုနှုန်း</span>
            <span className="text-sm text-secondary-700">{stats?.successRate || 0}%</span>
          </div>
          <div className="w-full bg-secondary-200 rounded-full h-2">
            <div className="bg-success h-2 rounded-full" style={{ width: `${stats?.successRate || 0}%` }}></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-secondary-700">သိမ်းဆည်းမှုကန့်သတ်ချက်</span>
            <span className="text-sm text-secondary-700">{stats?.storageUsage || 0}%</span>
          </div>
          <div className="w-full bg-secondary-200 rounded-full h-2">
            <div className="bg-warning h-2 rounded-full" style={{ width: `${stats?.storageUsage || 0}%` }}></div>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-secondary-100 pt-4">
        <h4 className="text-sm font-medium text-secondary-800 mb-3">ဝန်ဆောင်မှု အခြေအနေ</h4>
        <div className="space-y-3">
          {services && services.length > 0 ? (
            services.map((service) => (
              <div key={service.id} className="flex items-center">
                <div className="relative mr-3">
                  {service.status === 'available' && <span className="pulse-dot"></span>}
                  <span className={`inline-flex h-3 w-3 rounded-full ${
                    service.status === 'available' ? 'bg-success' : 
                    service.status === 'maintenance' ? 'bg-warning' : 'bg-error'
                  }`}></span>
                </div>
                <div className="flex-1 flex justify-between">
                  <span className="text-sm text-secondary-700">{service.serviceName}</span>
                  <span className={`text-xs ${
                    service.status === 'available' ? 'text-success' : 
                    service.status === 'maintenance' ? 'text-warning' : 'text-error'
                  }`}>
                    {service.status === 'available' ? 'အသုံးပြုနိုင်' : 
                     service.status === 'maintenance' ? 'ပြင်ဆင်နေဆဲ' : 'မရနိုင်ပါ'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-secondary-500 py-2">
              <p>ဝန်ဆောင်မှု အခြေအနေ မရှိသေးပါ</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemStats;
