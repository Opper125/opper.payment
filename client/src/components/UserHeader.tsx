import { Link } from "wouter";

interface UserHeaderProps {
  username?: string;
}

const UserHeader = ({ username = "အသုံးပြုသူ" }: UserHeaderProps) => {
  return (
    <div className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between py-4 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link href="/dashboard" className="flex items-center">
              <span className="h-10 w-10 rounded-full bg-primary-800 flex items-center justify-center mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <span className="font-bold text-secondary-800 text-lg">Opper Payment</span>
            </Link>
          </div>
          
          <div className="md:flex items-center justify-end hidden">
            <button type="button" className="flex items-center text-sm font-medium text-secondary-700 hover:text-secondary-800">
              <span className="w-8 h-8 bg-primary-100 text-primary-800 rounded-full flex items-center justify-center mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </span>
              <span>{username}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
