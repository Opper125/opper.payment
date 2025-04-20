import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { User } from "@shared/schema";
import UserHeader from "@/components/UserHeader";
import BottomNavigation from "@/components/BottomNavigation";
import TransactionList from "@/components/TransactionList";
import ServiceGrid from "@/components/ServiceGrid";
import BillsEmptyState from "@/components/BillsEmptyState";

const UserDashboard = () => {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("transactions");
  
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/me"],
  });

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleTransferMoney = () => {
    navigate("/transfer");
  };

  const handleDepositMoney = () => {
    // This would navigate to deposit page in a full implementation
    alert("ငွေဖြည့်ခြင်း ဝန်ဆောင်မှုကို လက်ရှိတွင် ပြင်ဆင်နေဆဲဖြစ်ပါသည်။");
  };

  const handleShowQRCode = () => {
    // This would show QR code in a full implementation
    alert("QR ကုဒ် ဝန်ဆောင်မှုကို လက်ရှိတွင် ပြင်ဆင်နေဆဲဖြစ်ပါသည်။");
  };

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
    <div className="min-h-screen flex flex-col pb-16 md:pb-0">
      <UserHeader username={user?.fullName} />

      {/* Balance Section */}
      <div className="bg-gradient-to-r from-primary-800 to-primary-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center text-center">
            <p className="text-white/80 text-sm mb-1">လက်ကျန်ငွေ</p>
            <h1 className="text-white text-3xl font-bold mb-2">
              {Number(user?.balance || 0).toLocaleString()} ကျပ်
            </h1>
            <div className="flex space-x-4 mt-4">
              <button onClick={handleTransferMoney} className="flex flex-col items-center justify-center w-20">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <span className="text-white text-xs">ငွေလွှဲရန်</span>
              </button>
              
              <button onClick={handleDepositMoney} className="flex flex-col items-center justify-center w-20">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <span className="text-white text-xs">ငွေဖြည့်ရန်</span>
              </button>
              
              <button onClick={handleShowQRCode} className="flex flex-col items-center justify-center w-20">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <span className="text-white text-xs">QR ကုဒ်</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1">
        {/* Tabs */}
        <div className="border-b border-secondary-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "transactions" ? "tab-active" : "tab-inactive"
              }`}
              onClick={() => handleTabChange("transactions")}
            >
              လုပ်ငန်းဆောင်တာများ
            </button>
            <button
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "services" ? "tab-active" : "tab-inactive"
              }`}
              onClick={() => handleTabChange("services")}
            >
              ဝန်ဆောင်မှုများ
            </button>
            <button
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "bills" ? "tab-active" : "tab-inactive"
              }`}
              onClick={() => handleTabChange("bills")}
            >
              ငွေတောင်းခံလွှာများ
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className={activeTab === "transactions" ? "py-4" : "py-4 hidden"}>
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-medium text-secondary-800">မကြာသေးမီက လုပ်ငန်းဆောင်တာများ</h3>
            <a href="#" className="text-sm text-primary-800">အားလုံးကြည့်ရန်</a>
          </div>
          <TransactionList />
        </div>

        <div className={activeTab === "services" ? "py-4" : "py-4 hidden"}>
          <ServiceGrid />
        </div>

        <div className={activeTab === "bills" ? "py-4" : "py-4 hidden"}>
          <BillsEmptyState />
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default UserDashboard;
