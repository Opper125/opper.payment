import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import UserFooter from "@/components/UserFooter";
import { useMutation } from "@tanstack/react-query";

const loginSchema = z.object({
  phone: z.string().min(10, "ဖုန်းနံပါတ် အနည်းဆုံး ၁၀ လုံး ရှိရပါမည်"),
  password: z.string().min(6, "စကားဝှက် အနည်းဆုံး ၆ လုံး ရှိရပါမည်"),
});

type LoginForm = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "အကောင့်ဝင်ရောက်ခြင်း အောင်မြင်ပါသည်",
        description: "သင့်အကောင့်သို့ အောင်မြင်စွာ ဝင်ရောက်ပြီးပါပြီ",
      });
      
      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "အကောင့်ဝင်ရောက်ခြင်း မအောင်မြင်ပါ",
        description: error instanceof Error ? error.message : "အမှားတစ်ခု ဖြစ်ပွားနေပါသည်",
      });
    },
  });

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data);
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
              <h2 className="text-xl font-semibold text-secondary-800">အကောင့်ဝင်ရန်</h2>
              <p className="text-sm text-secondary-500">သင့်အကောင့်သို့ ဝင်ရောက်ပါ</p>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                      <div className="mt-1 text-right">
                        <a href="#" className="text-xs text-primary-800 hover:text-primary-700">စကားဝှက် မေ့နေပါသလား?</a>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit"
                  className="auth-btn"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "ဝင်ရောက်နေသည်..." : "ဝင်ရောက်မည်"}
                </Button>
              </form>
            </Form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-secondary-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-secondary-500">သို့မဟုတ်</span>
                </div>
              </div>

              <div className="mt-6">
                <Button 
                  type="button" 
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/register")}
                >
                  အကောင့်အသစ် ဖွင့်မည်
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <UserFooter />
    </div>
  );
};

export default LoginPage;
