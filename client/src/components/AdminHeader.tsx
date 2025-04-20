import { Link } from "wouter";

const AdminHeader = ({ title = "ဒက်ရှ်ဘုတ်", subtitle = "အချက်အလက်များကို တစ်နေရာတည်းမှ ကြည့်ရှုစီမံပါ" }) => {
  return (
    <div className="bg-white border-b border-secondary-200 py-4 px-6 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-medium text-secondary-800">{title}</h1>
        <p className="text-sm text-secondary-500">{subtitle}</p>
      </div>
      
      <div className="flex items-center space-x-4">
        <button type="button" className="relative p-1 rounded-full bg-white focus:ring-2 focus:ring-primary-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary-800"></span>
        </button>
        
        <div className="relative">
          <Link href="/">
            <a className="flex items-center space-x-2 focus:outline-none">
              <div className="w-8 h-8 bg-primary-100 text-primary-800 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm font-medium text-secondary-700">အက်ဒမင်</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-secondary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
