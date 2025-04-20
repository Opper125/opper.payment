import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

const pinSchema = z.object({
  securityPin: z.string().length(4, "လုံခြုံရေးကုဒ် ၄ လုံး ထည့်သွင်းပါ"),
});

type PinForm = z.infer<typeof pinSchema>;

type TransferData = {
  receiverPhone: string;
  receiverName: string;
  amount: string;
  note?: string;
};

const TransferConfirmation = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [transferData, setTransferData] = useState<TransferData | null>(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem("transferData");
    if (!storedData) {
      toast({
        variant: "destructive",
        title: "ငွေလွှဲမှုအချက်အလက် မတွေ့ရှိပါ",
        description: "ကျေးဇူးပြု၍ ပြန်လည်စတင်ပါ။",
      });
      navigate("/transfer");
      return;
    }
    setTransferData(JSON.parse(storedData));
  }, [navigate, toast]);

  const form = useForm<PinForm>({
    resolver: zodResolver(pinSchema),
    defaultValues: {
      securityPin: "",
    },
  });

  const transferMutation = useMutation({
    mutationFn: async (data: PinForm & TransferData) => {
      const response = await apiRequest("POST", "/api/transfers", data);
      return response.json();
    },
    onSuccess: (data) => {
      // Store transaction data for success page
      sessionStorage.setItem("transactionResult", JSON.stringify(data));
      sessionStorage.removeItem("transferData"); // Clean up
      navigate("/success");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "ငွေလွှဲမှု မအောင်မြင်ပါ",
        description: error instanceof Error ? error.message : "အမှားတစ်ခု ဖြစ်ပွားနေပါသည်",
      });
    },
  });

  const onSubmit = (data: PinForm) => {
    if (!transferData) {
      toast({
        variant: "destructive",
        title: "ငွေလွှဲမှုအချက်အလက် မတွေ့ရှိပါ",
        description: "ကျေးဇူးပြု၍ ပြန်လည်စတင်ပါ။",
      });
      navigate("/transfer");
      return;
    }

    transferMutation.mutate({
      ...data,
      ...transferData,
    });
  };

  if (!transferData) {
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
            <button type="button" onClick={() => navigate("/transfer")} className="mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-lg font-medium text-secondary-800">အတည်ပြုရန်</h1>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-md mx-auto px-4 sm:px-6 py-8">
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="text-center text-lg font-medium text-secondary-800 mb-6">ငွေလွှဲမှု အသေးစိတ်</h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-secondary-100">
                <span className="text-secondary-500">ငွေလက်ခံသူ</span>
                <span className="text-secondary-800 font-medium">
                  {transferData.receiverName} ({transferData.receiverPhone})
                </span>
              </div>

              <div className="flex justify-between items-center pb-4 border-b border-secondary-100">
                <span className="text-secondary-500">ပမာဏ</span>
                <span className="text-secondary-800 font-medium text-lg">
                  {Number(transferData.amount).toLocaleString()} ကျပ်
                </span>
              </div>

              <div className="flex justify-between items-center pb-4 border-b border-secondary-100">
                <span className="text-secondary-500">ဝန်ဆောင်ခ</span>
                <span className="text-secondary-800 font-medium">၀ ကျပ်</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-secondary-800 font-medium">စုစုပေါင်း</span>
                <span className="text-secondary-800 font-bold text-lg">
                  {Number(transferData.amount).toLocaleString()} ကျပ်
                </span>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8">
                <FormField
                  control={form.control}
                  name="securityPin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-secondary-700 mb-1">လုံခြုံရေးကုဒ်</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="လုံခြုံရေးကုဒ် ရိုက်ထည့်ပါ"
                          className="w-full rounded-lg"
                          maxLength={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={transferMutation.isPending}
                  className="w-full bg-primary-800 text-white py-3 rounded-lg font-semibold transition-all hover:bg-primary-900 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 mt-6"
                >
                  {transferMutation.isPending ? "အတည်ပြုနေသည်..." : "အတည်ပြုသည်"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransferConfirmation;
