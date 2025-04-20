import { Link, useLocation } from "wouter";

const BottomNavigation = () => {
  const [location] = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-secondary-200 px-6 py-2 md:hidden">
      <div className="flex justify-between">
        <Link href="/dashboard">
          <a className="flex flex-col items-center justify-center w-1/4 pt-2 pb-1">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-6 w-6 ${location === '/dashboard' ? 'text-primary-800' : 'text-secondary-400'}`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs mt-1">ပင်မ</span>
          </a>
        </Link>
        
        <button className="flex flex-col items-center justify-center w-1/4 pt-2 pb-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span className="text-xs mt-1">ဝန်ဆောင်မှု</span>
        </button>
        
        <button className="flex flex-col items-center justify-center w-1/4 pt-2 pb-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs mt-1">ဘေလ်များ</span>
        </button>
        
        <button className="flex flex-col items-center justify-center w-1/4 pt-2 pb-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-xs mt-1">ပရိုဖိုင်</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNavigation;
