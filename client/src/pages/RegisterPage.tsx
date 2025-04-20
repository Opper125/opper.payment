import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { apiRequest } from "@/lib/queryClient";
import UserFooter from "@/components/UserFooter";
import { useMutation } from "@tanstack/react-query";

const registerSchema = z.object({
  fullName: z.string().min(2, "အမည်အပြည့်အစုံ ထည့်သွင်းပါ"),
  phone: z.string().min(10, "ဖုန်းနံပါတ် အနည်းဆုံး ၁၀ လုံး ရှိရပါမည်"),
  nrcNumber: z.string().min(6, "မှတ်ပုံတင်နံပါတ် ထည့်သွင်းပါ"),
  password: z.string().min(6, "စကားဝှက် အနည်းဆုံး ၆ လုံး ရှိရပါမည်"),
  confirmPassword: z.string().min(6, "စကားဝှက် အတည်ပြုပါ"),
  securityPin: z.string().length(4, "လုံခြုံရေးကုဒ် ၄ လုံး ထည့်သွင်းပါ"),
  terms: z.boolean().refine((val) => val === true, {
    message: "စည်းမျဉ်းစည်းကမ်းများကို လက်ခံရန် လိုအပ်ပါသည်",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "စကားဝှက်နှင့် အတည်ပြုစကားဝှက် မတူညီပါ",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      nrcNumber: "",
      password: "",
      confirmPassword: "",
      securityPin: "",
      terms: false,
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterForm) => {
      // Remove confirmPassword and terms from data before sending to API
      const { confirmPassword, terms, ...userData } = data;
      const response = await apiRequest("POST", "/api/auth/register", userData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "အကောင့်ဖွင့်ခြင်း အောင်မြင်ပါသည်",
        description: "သင့်အကောင့်ကို အောင်မြင်စွာ ဖန်တီးပြီးပါပြီ",
      });
      navigate("/");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "အကောင့်ဖွင့်ခြင်း မအောင်မြင်ပါ",
        description: error instanceof Error ? error.message : "အမှားတစ်ခု ဖြစ်ပွားနေပါသည်",
      });
    },
  });

  const onSubmit = (data: RegisterForm) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-primary-800 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-secondary-800">Opper Payment</h2>
            <p className="mt-1 text-sm text-secondary-500">မြန်မာ့ငွေပေးချေမှုစနစ်</p>
          </div>

          <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="mb-6 text-center">
              <h2 className="text-xl font-semibold text-secondary-800">အကောင့်အသစ် ဖွင့်ရန်</h2>
              <p className="text-sm text-secondary-500">သင့်အချက်အလက်များ ဖြည့်သွင်းပါ</p>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-secondary-700">အမည်အပြည့်အစုံ</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="အမည်အပြည့်အစုံ ထည့်သွင်းပါ"
                          className="auth-input"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-secondary-700">ဖုန်းနံပါတ်</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="09xxxxxxxxx"
                          className="auth-input"
                          type="tel"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nrcNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-secondary-700">မှတ်ပုံတင်နံပါတ်</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="x/xxxxx(န)xxxxxx"
                          className="auth-input"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-secondary-700">စကားဝှက်</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="စကားဝှက် ရိုက်ထည့်ပါ"
                          className="auth-input"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-secondary-700">စကားဝှက် အတည်ပြုပါ</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="စကားဝှက် ပြန်လည်ရိုက်ထည့်ပါ"
                          className="auth-input"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="securityPin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-secondary-700">လုံခြုံရေးကုဒ် (၄ လုံး)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="ဂဏန်း ၄ လုံး ရိုက်ထည့်ပါ"
                          className="auth-input"
                          type="password"
                          maxLength={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm text-secondary-700">
                          ကျွန်ုပ်သည် <a href="#" className="text-primary-800 hover:text-primary-700">စည်းမျဉ်းစည်းကမ်းများ</a>ကို လက်ခံပါသည်
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit"
                  className="auth-btn"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? "အကောင့်ဖွင့်နေသည်..." : "အကောင့်ဖွင့်မည်"}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-sm text-secondary-500">
                အကောင့်ရှိပြီးသားလား? <a href="#" onClick={() => navigate("/")} className="text-primary-800 hover:text-primary-700 font-semibold">ဝင်ရောက်ရန်</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <UserFooter />
    </div>
  );
};

export default RegisterPage;
