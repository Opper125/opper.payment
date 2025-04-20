import { useQuery } from "@tanstack/react-query";
import { Transaction } from "@shared/schema";

const ActivityTable = () => {
  const { data: activities, isLoading, error } = useQuery<Transaction[]>({
    queryKey: ["/api/admin/activities"],
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-secondary-100 mb-6 overflow-hidden">
        <div className="p-6 border-b border-secondary-100">
          <div className="animate-pulse flex justify-between items-center">
            <div className="h-5 bg-gray-200 rounded w-40"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-full">
            <div className="bg-secondary-50 p-3">
              <div className="grid grid-cols-6 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
            <div className="bg-white p-4 border-t border-secondary-200">
              {[1, 2, 3].map((row) => (
                <div key={row} className="py-4 grid grid-cols-6 gap-4 animate-pulse">
                  {[1, 2, 3, 4, 5, 6].map((cell) => (
                    <div key={`${row}-${cell}`} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-secondary-100 mb-6 p-6 text-destructive text-center">
        <p>လုပ်ဆောင်ချက်များ ရယူရာတွင် အမှားဖြစ်ပွားနေပါသည်။</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-secondary-100 mb-6 overflow-hidden">
      <div className="p-6 border-b border-secondary-100">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-secondary-800">လတ်တလော လုပ်ဆောင်ချက်များ</h3>
          <div className="relative">
            <span className="pulse-dot"></span>
            <span className="inline-flex h-3 w-3 rounded-full bg-success"></span>
            <span className="ml-2 text-sm text-secondary-500">အချိန်နှင့်တပြေးညီ</span>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-secondary-200">
          <thead className="bg-secondary-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                အသုံးပြုသူ
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                လုပ်ဆောင်ချက်
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                ပမာဏ
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                အခြေအနေ
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                အချိန်
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                လုပ်ဆောင်ရန်
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-secondary-200">
            {activities && activities.length > 0 ? (
              activities.map((activity) => (
                <tr key={activity.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-800">
                        {activity.senderId?.toString().charAt(0) || "?"}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-secondary-800">User ID: {activity.senderId}</div>
                        <div className="text-sm text-secondary-500">Transaction ID: {activity.transactionId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-secondary-800">
                      {activity.transactionType === 'transfer' ? 'ငွေလွှဲပြောင်းခြင်း' : 
                      activity.transactionType === 'deposit' ? 'ငွေဖြည့်သွင်းခြင်း' : 'ငွေထုတ်ယူခြင်း'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-secondary-800">
                      {Number(activity.amount).toLocaleString()} ကျပ်
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${activity.status === 'completed' ? 'bg-green-100 text-success' : 
                      activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      {activity.status === 'completed' ? 'အောင်မြင်' : 
                      activity.status === 'pending' ? 'ဆိုင်းငံ့ထား' : 'မအောင်မြင်ပါ'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                    {new Date(activity.createdAt).toLocaleDateString('en-GB', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button type="button" className="text-primary-800 hover:text-primary-900">
                      {activity.status === 'pending' ? 'အတည်ပြုရန်' : 'ကြည့်ရှုရန်'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-secondary-500">
                  လုပ်ဆောင်ချက် မှတ်တမ်းများ မရှိသေးပါ
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-3 border-t border-secondary-200 bg-white">
        <div className="flex justify-between items-center">
          <div className="text-sm text-secondary-700">
            စုစုပေါင်း {activities?.length || 0} ခု
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-secondary-300 rounded bg-white text-secondary-700 hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled={!activities || activities.length === 0}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="px-3 py-1 border border-secondary-300 rounded bg-white text-secondary-700 hover:bg-secondary-50" disabled={!activities || activities.length === 0}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityTable;
