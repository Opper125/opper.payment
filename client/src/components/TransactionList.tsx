import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Transaction } from "@shared/schema";
import { Card } from "@/components/ui/card";

const TransactionList = () => {
  const { data: transactions, isLoading, error } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="flex justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
              <div className="text-right">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-4 text-center text-destructive">
        <p>လုပ်ငန်းဆောင်တာများ ကြည့်ရှုရာတွင် အမှား ဖြစ်ပွားနေပါသည်။</p>
      </Card>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Card className="p-4 text-center">
        <p>လုပ်ငန်းဆောင်တာများ မရှိသေးပါ။</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <Card key={transaction.id} className="p-4 border border-secondary-100">
          <div className="flex justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-800" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
                </svg>
              </div>
              <div>
                <p className="text-secondary-800 font-medium">
                  {transaction.transactionType === 'transfer' ? 'ငွေလွှဲခြင်း' : 
                   transaction.transactionType === 'deposit' ? 'ငွေဖြည့်သွင်းခြင်း' : 'ငွေထုတ်ယူခြင်း'}
                </p>
                <p className="text-xs text-secondary-500">
                  {new Date(transaction.createdAt).toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-medium ${Number(transaction.amount) < 0 ? 'text-error' : 'text-success'}`}>
                {Number(transaction.amount) < 0 ? '-' : '+'} {Math.abs(Number(transaction.amount)).toLocaleString()} ကျပ်
              </p>
              <span className="text-xs px-2 py-1 bg-green-100 text-success rounded-full">
                {transaction.status === 'completed' ? 'အောင်မြင်' : 
                 transaction.status === 'pending' ? 'ဆောင်ရွက်ဆဲ' : 'မအောင်မြင်ပါ'}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default TransactionList;
