import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";

const NewUsersList = () => {
  const { data: newUsers, isLoading, error } = useQuery<User[]>({
    queryKey: ["/api/admin/new-users"],
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200"></div>
            <div className="ml-4 flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-destructive">
        <p>အသုံးပြုသူအသစ်များ ရယူရာတွင် အမှား ဖြစ်ပွားနေပါသည်။</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="space-y-4">
        {newUsers && newUsers.length > 0 ? (
          newUsers.map((user) => (
            <div key={user.id} className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-800">
                {user.fullName.charAt(0)}
              </div>
              <div className="ml-4 flex-1">
                <div className="flex justify-between">
                  <div>
                    <div className="text-sm font-medium text-secondary-800">{user.fullName}</div>
                    <div className="flex items-center">
                      <div className="text-xs text-secondary-500">{user.username}</div>
                      <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${user.status === 'active' ? 'bg-green-100 text-success' : 
                        user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {user.status === 'active' ? 'အတည်ပြုပြီး' : 
                        user.status === 'pending' ? 'ဆိုင်းငံ့ထား' : 'ပိတ်ထားသည်'}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-secondary-500">
                    {new Date(user.createdAt).toLocaleDateString('en-GB', {
                      hour: 'numeric',
                      minute: 'numeric',
                    })} အကွာ
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-secondary-500 py-4">
            <p>အသုံးပြုသူအသစ်များ မရှိသေးပါ</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewUsersList;
