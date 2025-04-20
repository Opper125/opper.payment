import { 
  users, type User, type InsertUser,
  transactions, type Transaction, type InsertTransaction,
  favorites, type Favorite,
  bills, type Bill,
  systemStats, type SystemStat,
  serviceStatus, type ServiceStat
} from "@shared/schema";
import { format } from "date-fns";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser & { securityPin: string, status?: string }): Promise<User>;
  updateUserLastLogin(id: number): Promise<User | undefined>;
  updateUserBalance(id: number, newBalance: number): Promise<User | undefined>;
  getUsers(): Promise<User[]>;
  getNewUsers(limit?: number): Promise<User[]>;
  
  // Transaction operations
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransaction(id: number): Promise<Transaction | undefined>;
  getTransactionByTransactionId(transactionId: string): Promise<Transaction | undefined>;
  getUserTransactions(userId: number): Promise<Transaction[]>;
  getRecentActivities(limit?: number): Promise<Transaction[]>;
  
  // Recipient operations
  getRecentRecipients(userId: number): Promise<{ id: number; name: string; phone: string; }[]>;
  
  // System operations
  getSystemStats(): Promise<SystemStat>;
  getServiceStatus(): Promise<ServiceStat[]>;
}

export class MemStorage implements IStorage {
  private usersData: Map<number, User>;
  private transactionsData: Map<number, Transaction>;
  private favoritesData: Map<number, Favorite>;
  private billsData: Map<number, Bill>;
  private systemStatsData: SystemStat;
  private serviceStatusData: ServiceStat[];
  private userIdCounter: number;
  private transactionIdCounter: number;
  private favoriteIdCounter: number;
  private billIdCounter: number;

  constructor() {
    this.usersData = new Map();
    this.transactionsData = new Map();
    this.favoritesData = new Map();
    this.billsData = new Map();
    this.userIdCounter = 1;
    this.transactionIdCounter = 1;
    this.favoriteIdCounter = 1;
    this.billIdCounter = 1;

    // Initialize with some sample data
    this.initializeData();
  }

  private initializeData() {
    // Create admin and sample user
    const adminUser: User = {
      id: this.userIdCounter++,
      fullName: "အက်ဒမင်",
      username: "09111222333",
      password: "admin123",
      nrcNumber: "12/ABCDE(N)123456",
      balance: "5000000",
      securityPin: "1234",
      createdAt: new Date().toISOString(),
      status: "active",
      role: "admin",
      lastLogin: new Date().toISOString()
    };

    const sampleUser: User = {
      id: this.userIdCounter++,
      fullName: "မင်းသားကြီး",
      username: "09123456789",
      password: "user123",
      nrcNumber: "12/FGHIJ(N)654321",
      balance: "1200000",
      securityPin: "4321",
      createdAt: new Date().toISOString(),
      status: "active",
      role: "user",
      lastLogin: new Date().toISOString()
    };

    this.usersData.set(adminUser.id, adminUser);
    this.usersData.set(sampleUser.id, sampleUser);

    // Sample transactions
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();

    const transaction1: Transaction = {
      id: this.transactionIdCounter++,
      transactionType: "transfer",
      amount: "-50000",
      senderId: sampleUser.id,
      receiverId: adminUser.id,
      status: "completed",
      transactionId: "OPP12345678",
      fee: "0",
      createdAt: oneHourAgo,
      completedAt: oneHourAgo
    };

    const transaction2: Transaction = {
      id: this.transactionIdCounter++,
      transactionType: "transfer",
      amount: "100000",
      senderId: adminUser.id,
      receiverId: sampleUser.id,
      status: "completed",
      transactionId: "OPP23456789",
      fee: "0",
      createdAt: twoHoursAgo,
      completedAt: twoHoursAgo
    };

    const transaction3: Transaction = {
      id: this.transactionIdCounter++,
      transactionType: "deposit",
      amount: "200000",
      senderId: null,
      receiverId: sampleUser.id,
      status: "completed",
      transactionId: "OPP34567890",
      fee: "0",
      createdAt: threeDaysAgo,
      completedAt: threeDaysAgo
    };

    this.transactionsData.set(transaction1.id, transaction1);
    this.transactionsData.set(transaction2.id, transaction2);
    this.transactionsData.set(transaction3.id, transaction3);

    // Sample favorites
    const favorite1: Favorite = {
      id: this.favoriteIdCounter++,
      userId: sampleUser.id,
      favoriteUserId: adminUser.id,
      createdAt: new Date().toISOString()
    };

    this.favoritesData.set(favorite1.id, favorite1);

    // System stats
    this.systemStatsData = {
      id: 1,
      totalUsers: 2,
      activeUsers: 2,
      pendingUsers: 0,
      dailyTransactions: 2,
      monthlyTransactions: 3,
      dailyVolume: "150000",
      monthlyVolume: "350000",
      systemLoad: "65",
      successRate: "95",
      storageUsage: "43",
      updatedAt: new Date().toISOString()
    };

    // Service status
    this.serviceStatusData = [
      {
        id: 1,
        serviceName: "အဓိကဝန်ဆောင်မှု",
        status: "available",
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        serviceName: "ဘဏ်ချိတ်ဆက်မှု",
        status: "available",
        updatedAt: new Date().toISOString()
      },
      {
        id: 3,
        serviceName: "QR ငွေပေးချေမှု",
        status: "maintenance",
        updatedAt: new Date().toISOString()
      }
    ];
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.usersData.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersData.values()).find(user => user.username === username);
  }

  async createUser(user: InsertUser & { securityPin: string, status?: string }): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date().toISOString();
    const newUser: User = {
      ...user,
      id,
      balance: "0",
      createdAt: now,
      status: user.status || "pending",
      role: "user"
    };
    this.usersData.set(id, newUser);
    
    // Update system stats
    this.systemStatsData.totalUsers += 1;
    if (newUser.status === "active") {
      this.systemStatsData.activeUsers += 1;
    } else if (newUser.status === "pending") {
      this.systemStatsData.pendingUsers += 1;
    }
    this.systemStatsData.updatedAt = now;
    
    return newUser;
  }

  async updateUserLastLogin(id: number): Promise<User | undefined> {
    const user = this.usersData.get(id);
    if (user) {
      user.lastLogin = new Date().toISOString();
      this.usersData.set(id, user);
    }
    return user;
  }

  async updateUserBalance(id: number, newBalance: number): Promise<User | undefined> {
    const user = this.usersData.get(id);
    if (user) {
      user.balance = newBalance.toString();
      this.usersData.set(id, user);
    }
    return user;
  }

  async getUsers(): Promise<User[]> {
    return Array.from(this.usersData.values());
  }

  async getNewUsers(limit: number = 5): Promise<User[]> {
    return Array.from(this.usersData.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  // Transaction operations
  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const id = this.transactionIdCounter++;
    const now = new Date().toISOString();
    const newTransaction: Transaction = {
      ...transaction,
      id,
      createdAt: now,
      completedAt: transaction.status === "completed" ? now : undefined
    };
    this.transactionsData.set(id, newTransaction);
    
    // Update system stats
    this.systemStatsData.dailyTransactions += 1;
    this.systemStatsData.monthlyTransactions += 1;
    this.systemStatsData.dailyVolume = (Number(this.systemStatsData.dailyVolume) + Number(transaction.amount)).toString();
    this.systemStatsData.monthlyVolume = (Number(this.systemStatsData.monthlyVolume) + Number(transaction.amount)).toString();
    this.systemStatsData.updatedAt = now;
    
    return newTransaction;
  }

  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactionsData.get(id);
  }

  async getTransactionByTransactionId(transactionId: string): Promise<Transaction | undefined> {
    return Array.from(this.transactionsData.values()).find(
      transaction => transaction.transactionId === transactionId
    );
  }

  async getUserTransactions(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactionsData.values())
      .filter(transaction => 
        transaction.senderId === userId || transaction.receiverId === userId
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getRecentActivities(limit: number = 5): Promise<Transaction[]> {
    return Array.from(this.transactionsData.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  // Recipient operations
  async getRecentRecipients(userId: number): Promise<{ id: number; name: string; phone: string; }[]> {
    // Get unique receiver IDs from user's sent transactions
    const sentTransactions = Array.from(this.transactionsData.values())
      .filter(transaction => transaction.senderId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    const recipientIds = new Set<number>();
    const recipients: { id: number; name: string; phone: string; }[] = [];
    
    for (const transaction of sentTransactions) {
      if (transaction.receiverId && !recipientIds.has(transaction.receiverId)) {
        recipientIds.add(transaction.receiverId);
        const recipient = this.usersData.get(transaction.receiverId);
        if (recipient) {
          recipients.push({
            id: recipient.id,
            name: recipient.fullName,
            phone: recipient.username
          });
        }
      }
    }
    
    return recipients.slice(0, 5); // Limit to 5 recipients
  }

  // System operations
  async getSystemStats(): Promise<SystemStat> {
    return this.systemStatsData;
  }

  async getServiceStatus(): Promise<ServiceStat[]> {
    return this.serviceStatusData;
  }
}

// Use database storage instead of memory storage
import { DatabaseStorage } from "./database-storage";
export const storage = new DatabaseStorage();
