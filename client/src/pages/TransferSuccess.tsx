import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type TransactionResult = {
  id: number;
  transactionId: string;
  amount: string;
  receiverName: string;
  receiverPhone: string;
  status: string;
  createdAt: string;
};

const TransferSuccess = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [transaction, setTransaction] = useState<TransactionResult | null>(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem("transactionResult");
    if (!storedData) {
      toast({
        variant: "destructive",
        title: "လုပ်ငန်းဆောင်တာ အချက်အလက် မတွေ့ရှိပါ",
        description: "ကျေးဇူးပြု၍ ပြန်လည်စတင်ပါ။",
      });
      navigate("/dashboard");
      return;
    }
    setTransaction(JSON.parse(storedData));
  }, [navigate, toast]);

  const handleDownloadReceipt = () => {
    // In a real implementation, this would generate and download a receipt
    toast({
      title: "ပြေစာ ဒေါင်းလုပ်",
      description: "ပြေစာကို ဒေါင်းလုပ်လုပ်နေပါသည်...",
    });
  };

  const handleFinish = () => {
    sessionStorage.removeItem("transactionResult"); // Clean up
    navigate("/dashboard");
  };

  if (!transaction) {
    return (
      <div className="h-full min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800"></div>
      </div>
    );
  }

  return (
    <div className="h-full min-h-screen bg-secondary-50 flex flex-col">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center">
            <h1 className="text-lg font-medium text-secondary-800">လုပ်ငန်းအောင်မြင်ပါသည်</h1>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-md mx-auto px-4 sm:px-6 py-8">
        <Card className="mb-6 text-center">
          <CardContent className="p-6">
            <div className="w-16 h-16 mx-auto bg-success/10 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h3 className="text-lg font-medium text-secondary-800 mb-2">ငွေလွှဲမှု အောင်မြင်ပါသည်</h3>
            <p className="text-secondary-500 mb-6">သင့်ငွေလွှဲမှု အောင်မြင်စွာ ပြီးဆုံးပါပြီ</p>

            <div className="bg-secondary-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-secondary-500">ငွေလက်ခံသူ</span>
                <span className="text-secondary-800 font-medium">
                  {transaction.receiverName} ({transaction.receiverPhone})
                </span>
              </div>

              <div className="flex justify-between items-center mb-3">
                <span className="text-secondary-500">ပမာဏ</span>
                <span className="text-secondary-800 font-medium">
                  {Number(transaction.amount).toLocaleString()} ကျပ်
                </span>
              </div>

              <div className="flex justify-between items-center mb-3">
                <span className="text-secondary-500">လုပ်ငန်းအမှတ်</span>
                <span className="text-secondary-800 font-medium">
                  {transaction.transactionId}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-secondary-500">နေ့စွဲ/အချိန်</span>
                <span className="text-secondary-800 font-medium">
                  {new Date(transaction.createdAt).toLocaleDateString('my-MM', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleDownloadReceipt}
              >
                ပြေစာဒေါင်းလုပ်
              </Button>
              <Button
                className="flex-1 bg-primary-800 text-white"
                onClick={handleFinish}
              >
                ပြီးပါပြီ
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransferSuccess;
