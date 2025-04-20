import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import StatsCards from "@/components/StatsCards";
import ActivityTable from "@/components/ActivityTable";
import NewUsersList from "@/components/NewUsersList";
import SystemStats from "@/components/SystemStats";
import { User } from "@shared/schema";

const AdminDashboard = () => {
  const [, navigate] = useLocation();
  
  // Check if user is admin
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/me"],
  });

  useEffect(() => {
    if (!isLoading && user && user.role !== "admin") {
      navigate("/");
    }
  }, [isLoading, user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-destructive mb-4">အကောင့်သို့ ဝင်ရောက်ရာတွင် အမှားဖြစ်ပွားနေပါသည်</p>
          <button 
            onClick={() => navigate("/")} 
            className="px-4 py-2 bg-primary-800 text-white rounded-lg"
          >
            ပြန်လည်ဝင်ရောက်ရန်
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="flex-1 ml-64">
        <AdminHeader />

        <div className="p-6">
          <StatsCards />
          <ActivityTable />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-secondary-100 overflow-hidden md:col-span-2">
              <div className="p-6 border-b border-secondary-100">
                <h3 className="text-lg font-medium text-secondary-800">အသုံးပြုသူအသစ်များ</h3>
              </div>
              <NewUsersList />
              <div className="px-6 py-3 border-t border-secondary-200 bg-white text-right">
                <button className="text-sm text-primary-800 hover:text-primary-900">အားလုံးကြည့်ရန်</button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-secondary-100">
              <div className="p-6 border-b border-secondary-100">
                <h3 className="text-lg font-medium text-secondary-800">စနစ်အခြေအနေ</h3>
              </div>
              <SystemStats />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
