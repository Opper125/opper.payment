import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertTransactionSchema } from "@shared/schema";
import { z } from "zod";
import { randomUUID } from "crypto";
import { createClient } from "@supabase/supabase-js";

// Get Supabase URL and service role key from environment variables
const supabaseUrl = process.env.SUPABASE_URL || 'https://mecpzriiiyxyxzbmqasy.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lY3B6cmlpaXl4eXh6Ym1xYXN5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjU5MTI2NywiZXhwIjoyMDU4MTY3MjY3fQ.uxv6Jq5zEJH3MLIPx7YJls5qdlCwiKajP9Lk57h7Jfg';

// Create a mock/placeholder Supabase client to prevent errors
// In a real application, you would use a proper Supabase setup
const supabase = {
  from: () => ({
    insert: async () => ({ error: null, data: null })
  })
};

const securityPinSchema = z.string().length(4);

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username (phone) already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "ဖုန်းနံပါတ် အသုံးပြုပြီးဖြစ်ပါသည်" });
      }

      // Validate security PIN
      const securityPin = securityPinSchema.parse(req.body.securityPin);
      
      // Create user in storage
      const user = await storage.createUser({
        ...userData,
        securityPin,
        status: "pending", // New users start as pending until approved
      });

      // Create Supabase auth user if using Supabase auth
      // await supabase.auth.admin.createUser({
      //   email: `${userData.username}@example.com`,
      //   password: userData.password,
      //   user_metadata: { fullName: userData.fullName }
      // });
      
      // Remove sensitive data before returning
      const { password, securityPin: pin, ...safeUser } = user;
      
      res.status(201).json(safeUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "အကောင့်ဖွင့်ရာတွင် အမှားဖြစ်ပွားနေပါသည်" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { phone, password } = req.body;
      
      if (!phone || !password) {
        return res.status(400).json({ message: "ဖုန်းနံပါတ်နှင့် စကားဝှက် လိုအပ်ပါသည်" });
      }

      // Find user by phone (username)
      const user = await storage.getUserByUsername(phone);
      if (!user) {
        return res.status(401).json({ message: "အကောင့်မတွေ့ရှိပါ" });
      }

      // Check password
      if (user.password !== password) {
        return res.status(401).json({ message: "စကားဝှက် မှားယွင်းနေပါသည်" });
      }

      // Check if user is active
      if (user.status !== "active") {
        return res.status(403).json({ message: "သင့်အကောင့် အတည်ပြုရန် လိုအပ်ပါသေးသည်" });
      }

      // Update last login
      await storage.updateUserLastLogin(user.id);

      // Remove sensitive data before returning
      const { password: pwd, securityPin, ...safeUser } = user;
      
      // Set user in session if using session-based auth
      // req.session.user = safeUser;
      
      res.status(200).json({ user: safeUser });
    } catch (error) {
      res.status(500).json({ message: "အကောင့်ဝင်ရောက်ရာတွင် အမှားဖြစ်ပွားနေပါသည်" });
    }
  });

  app.get("/api/auth/me", async (req, res) => {
    try {
      // For demo purposes, return a mock user
      // In a real app, get the user from session or JWT token
      const userId = 1; // This would come from session/token
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(401).json({ message: "ကျေးဇူးပြု၍ အကောင့်ဝင်ပါ" });
      }

      // Remove sensitive data before returning
      const { password, securityPin, ...safeUser } = user;
      
      res.status(200).json(safeUser);
    } catch (error) {
      res.status(500).json({ message: "အကောင့်အချက်အလက် ရယူရာတွင် အမှားဖြစ်ပွားနေပါသည်" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    // Clear session if using session-based auth
    // req.session.destroy();
    res.status(200).json({ message: "အောင်မြင်စွာ ထွက်ခွာပြီးပါပြီ" });
  });

  // User routes
  app.get("/api/users/search", async (req, res) => {
    try {
      const { phone } = req.query;
      
      if (!phone) {
        return res.status(400).json({ message: "ဖုန်းနံပါတ် လိုအပ်ပါသည်" });
      }

      const user = await storage.getUserByUsername(phone as string);
      if (!user) {
        return res.status(404).json({ message: "အသုံးပြုသူ မတွေ့ရှိပါ" });
      }

      // Remove sensitive data before returning
      const { password, securityPin, ...safeUser } = user;
      
      res.status(200).json(safeUser);
    } catch (error) {
      res.status(500).json({ message: "အသုံးပြုသူ ရှာဖွေရာတွင် အမှားဖြစ်ပွားနေပါသည်" });
    }
  });

  // Transaction routes
  app.get("/api/transactions", async (req, res) => {
    try {
      const userId = 1; // This would come from session/token
      const transactions = await storage.getUserTransactions(userId);
      res.status(200).json(transactions);
    } catch (error) {
      res.status(500).json({ message: "လုပ်ငန်းဆောင်တာများ ရယူရာတွင် အမှားဖြစ်ပွားနေပါသည်" });
    }
  });

  app.post("/api/transfers", async (req, res) => {
    try {
      const { receiverPhone, amount, note, securityPin } = req.body;
      
      if (!receiverPhone || !amount || !securityPin) {
        return res.status(400).json({ message: "လိုအပ်သော အချက်အလက်များ ပေးပို့ရန် လိုအပ်ပါသည်" });
      }

      // User ID would normally come from session/token
      const senderId = 1;
      const sender = await storage.getUser(senderId);
      
      if (!sender) {
        return res.status(401).json({ message: "ကျေးဇူးပြု၍ အကောင့်ဝင်ပါ" });
      }

      // Validate security PIN
      if (sender.securityPin !== securityPin) {
        return res.status(400).json({ message: "လုံခြုံရေးကုဒ် မှားယွင်းနေပါသည်" });
      }

      // Find receiver by phone
      const receiver = await storage.getUserByUsername(receiverPhone);
      if (!receiver) {
        return res.status(404).json({ message: "လက်ခံမည့်သူ မတွေ့ရှိပါ" });
      }

      // Check if sender has enough balance
      if (Number(sender.balance) < Number(amount)) {
        return res.status(400).json({ message: "လက်ကျန်ငွေ မလုံလောက်ပါ" });
      }

      // Generate transaction ID
      const transactionId = `OPP${Date.now().toString().substring(7)}`;

      // Create transaction
      const transaction = await storage.createTransaction({
        transactionType: "transfer",
        amount: amount.toString(),
        senderId,
        receiverId: receiver.id,
        status: "completed",
        notes: note || undefined,
        transactionId,
        fee: "0",
      });

      // Update sender and receiver balances
      await storage.updateUserBalance(sender.id, Number(sender.balance) - Number(amount));
      await storage.updateUserBalance(receiver.id, Number(receiver.balance) + Number(amount));

      // Prepare response with additional info
      const response = {
        ...transaction,
        receiverName: receiver.fullName,
        receiverPhone: receiver.username,
      };

      // Notify via Supabase realtime
      await supabase.from("transactions").insert([{
        id: transaction.id,
        transaction_type: transaction.transactionType,
        amount: transaction.amount,
        sender_id: transaction.senderId,
        receiver_id: transaction.receiverId,
        status: transaction.status,
        transaction_id: transaction.transactionId,
        created_at: transaction.createdAt
      }]);

      res.status(200).json(response);
    } catch (error) {
      console.error("Transfer error:", error);
      res.status(500).json({ message: "ငွေလွှဲရာတွင် အမှားဖြစ်ပွားနေပါသည်" });
    }
  });

  app.get("/api/transfers/recent-recipients", async (req, res) => {
    try {
      const userId = 1; // This would come from session/token
      const recipients = await storage.getRecentRecipients(userId);
      res.status(200).json(recipients);
    } catch (error) {
      res.status(500).json({ message: "လက်တလော လက်ခံသူများ ရယူရာတွင် အမှားဖြစ်ပွားနေပါသည်" });
    }
  });

  // Admin routes
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const stats = await storage.getSystemStats();
      res.status(200).json(stats);
    } catch (error) {
      res.status(500).json({ message: "စနစ်အချက်အလက် ရယူရာတွင် အမှားဖြစ်ပွားနေပါသည်" });
    }
  });

  app.get("/api/admin/activities", async (req, res) => {
    try {
      const activities = await storage.getRecentActivities();
      res.status(200).json(activities);
    } catch (error) {
      res.status(500).json({ message: "လုပ်ဆောင်ချက်များ ရယူရာတွင် အမှားဖြစ်ပွားနေပါသည်" });
    }
  });

  app.get("/api/admin/new-users", async (req, res) => {
    try {
      const newUsers = await storage.getNewUsers();
      res.status(200).json(newUsers);
    } catch (error) {
      res.status(500).json({ message: "အသုံးပြုသူအသစ်များ ရယူရာတွင် အမှားဖြစ်ပွားနေပါသည်" });
    }
  });

  app.get("/api/admin/system-stats", async (req, res) => {
    try {
      const stats = await storage.getSystemStats();
      res.status(200).json(stats);
    } catch (error) {
      res.status(500).json({ message: "စနစ်အခြေအနေ ရယူရာတွင် အမှားဖြစ်ပွားနေပါသည်" });
    }
  });

  app.get("/api/admin/service-status", async (req, res) => {
    try {
      const services = await storage.getServiceStatus();
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ message: "ဝန်ဆောင်မှု အခြေအနေ ရယူရာတွင် အမှားဖြစ်ပွားနေပါသည်" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
