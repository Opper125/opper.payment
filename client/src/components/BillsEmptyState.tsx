const BillsEmptyState = () => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-secondary-100 text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary-100 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="text-secondary-800 font-medium mb-2">ငွေတောင်းခံလွှာမရှိပါ</h3>
      <p className="text-secondary-500 text-sm mb-4">လက်ရှိတွင် ငွေတောင်းခံလွှာများ မရှိသေးပါ</p>
      <button className="bg-primary-50 text-primary-800 px-4 py-2 rounded-lg font-medium text-sm">ငွေတောင်းခံလွှာ ဖန်တီးရန်</button>
    </div>
  );
};

export default BillsEmptyState;
