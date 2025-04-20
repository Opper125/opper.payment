import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { SystemStat } from "@shared/schema";

const StatsCards = () => {
  const { data: stats, isLoading, error } = useQuery<SystemStat>({
    queryKey: ["/api/admin/stats"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6 animate-pulse">
            <CardContent className="p-0">
              <div className="flex justify-between items-start">
                <div>
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
              </div>
              <div className="mt-3 flex items-center">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 mb-6 text-destructive text-center">
        <p>အချက်အလက်များ ရယူရာတွင် အမှားဖြစ်ပွားနေပါသည်။</p>
      </Card>
    );
  }

  const statCards = [
    {
      title: "စုစုပေါင်း အသုံးပြုသူများ",
      value: stats?.totalUsers || 0,
      change: "+12.5%",
      changeText: "ပြီးခဲ့သည့်လထက်",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      title: "ယနေ့ ငွေလွှဲပြောင်းမှုများ",
      value: stats?.dailyTransactions || 0,
      change: "+8.3%",
      changeText: "ပြီးခဲ့သည့်ရက်ထက်",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
    },
    {
      title: "ငွေကြေးလည်ပတ်မှု",
      value: Number(stats?.dailyVolume || 0) / 1000000,
      valueFormat: (value: number) => `${value.toFixed(1)}M`,
      change: "+15.2%",
      changeText: "ပြီးခဲ့သည့်လထက်",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "အသစ်မှတ်ပုံတင်သူများ",
      value: stats?.pendingUsers || 0,
      change: "-5.7%",
      changeIsNegative: true,
      changeText: "ပြီးခဲ့သည့်ရက်ထက်",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="p-6">
          <CardContent className="p-0">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-secondary-500 text-sm mb-1">{stat.title}</p>
                <h3 className="text-2xl font-bold text-secondary-800">
                  {stat.valueFormat ? stat.valueFormat(stat.value) : stat.value.toLocaleString()}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                {stat.icon}
              </div>
            </div>
            <div className="mt-2 flex items-center">
              <span className={`text-sm font-medium ${stat.changeIsNegative ? 'text-error' : 'text-success'}`}>
                {stat.change}
              </span>
              <span className="text-secondary-500 text-sm ml-1">{stat.changeText}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
