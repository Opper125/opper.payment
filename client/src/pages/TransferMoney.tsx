import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "@shared/schema";

const transferSchema = z.object({
  receiverPhone: z.string().min(10, "ဖုန်းနံပါတ် အနည်းဆုံး ၁၀ လုံး ရှိရပါမည်"),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "မှန်ကန်သော ပမာဏ ထည့်သွင်းပါ",
  }),
  note: z.string().optional(),
});

type TransferForm = z.infer<typeof transferSchema>;

type RecentRecipient = {
  id: number;
  name: string;
  phone: string;
};

const TransferMoney = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [searchedUser, setSearchedUser] = useState<User | null>(null);

  const { data: user } = useQuery<User>({
    queryKey: ["/api/auth/me"],
  });

  const { data: recentRecipients } = useQuery<RecentRecipient[]>({
    queryKey: ["/api/transfers/recent-recipients"],
  });

  const form = useForm<TransferForm>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      receiverPhone: "",
      amount: "",
      note: "",
    },
  });

  const onSubmit = (data: TransferForm) => {
    // Store transfer data in sessionStorage to access in confirmation page
    sessionStorage.setItem(
      "transferData",
      JSON.stringify({
        receiverPhone: data.receiverPhone,
        receiverName: searchedUser?.fullName || "Unknown",
        amount: data.amount,
        note: data.note,
      })
    );
    navigate("/confirm");
  };

  const handleSearchUser = async () => {
    const phone = form.getValues("receiverPhone");
    if (!phone || phone.length < 10) {
      form.setError("receiverPhone", {
        type: "manual",
        message: "ဖုန်းနံပါတ် အနည်းဆုံး ၁၀ လုံး ရှိရပါမည်",
      });
      return;
    }

    try {
      const response = await fetch(`/api/users/search?phone=${phone}`);
      if (!response.ok) {
        throw new Error("အသုံးပြုသူ ရှာမတွေ့ပါ");
      }
      const userData = await response.json();
      setSearchedUser(userData);
      toast({
        title: "အသုံးပြုသူ ရှာတွေ့ပါသည်",
        description: `${userData.fullName} (${userData.username})`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "အသုံးပြုသူ ရှာဖွေခြင်း မအောင်မြင်ပါ",
        description: error instanceof Error ? error.message : "အမှားတစ်ခု ဖြစ်ပွားနေပါသည်",
      });
    }
  };

  const selectRecipient = (recipient: RecentRecipient) => {
    form.setValue("receiverPhone", recipient.phone);
    setSearchedUser({
      id: recipient.id,
      fullName: recipient.name,
      username: recipient.phone,
    } as User);
    toast({
      title: "လက်ခံသူ ရွေးချယ်ပြီးပါပြီ",
      description: `${recipient.name} (${recipient.phone})`,
    });
  };

  return (
    <div className="h-full min-h-screen bg-secondary-50 flex flex-col">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center">
            <button type="button" onClick={() => navigate("/dashboard")} className="mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-lg font-medium text-secondary-800">ငွေလွှဲရန်</h1>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-md mx-auto px-4 sm:px-6 py-8">
        <Card className="mb-6">
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="mb-6">
                  <FormField
                    control={form.control}
                    name="receiverPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium text-secondary-700 mb-1">ငွေလက်ခံမည့်သူ</FormLabel>
                        <div className="flex">
                          <FormControl>
                            <Input
                              placeholder="09xxxxxxxxx"
                              className="flex-1 rounded-l-lg"
                              {...field}
                              value={searchedUser ? field.value : field.value}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            onClick={handleSearchUser}
                            className="bg-primary-800 text-white rounded-r-lg"
                          >
                            ရှာရန်
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mb-6 pb-6 border-b border-secondary-200">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium text-secondary-700 mb-1">ပေးပို့မည့်ပမာဏ</FormLabel>
                        <div className="flex items-center">
                          <FormControl>
                            <Input
                              placeholder="0"
                              className="text-2xl font-bold text-right"
                              {...field}
                            />
                          </FormControl>
                          <span className="ml-2 text-secondary-700 font-medium">ကျပ်</span>
                        </div>
                        <div className="mt-2 flex justify-between text-sm">
                          <span className="text-secondary-500">လက်ကျန်ငွေ</span>
                          <span className="text-secondary-800 font-medium">
                            {user ? Number(user.balance).toLocaleString() : "0"} ကျပ်
                          </span>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mb-6">
                  <FormField
                    control={form.control}
                    name="note"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium text-secondary-700 mb-1">မှတ်ချက်</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="မှတ်ချက် ရေးရန် (ရေးလည်းရ မရေးလည်းရ)"
                            className="w-full rounded-lg"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={!searchedUser}
                  className="w-full bg-primary-800 text-white py-3 rounded-lg font-semibold transition-all hover:bg-primary-900 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  ဆက်လုပ်ရန်
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {recentRecipients && recentRecipients.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-base font-medium text-secondary-800 mb-4">လတ်တလော ငွေလွှဲခဲ့သူများ</h3>
              
              <div className="space-y-4">
                {recentRecipients.map((recipient) => (
                  <div key={recipient.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-primary-800 font-medium">{recipient.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-secondary-800 font-medium">{recipient.name}</p>
                        <p className="text-xs text-secondary-500">{recipient.phone}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => selectRecipient(recipient)}
                      className="text-primary-800 text-sm font-medium"
                    >
                      ရွေးရန်
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TransferMoney;
