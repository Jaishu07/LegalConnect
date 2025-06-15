// Authentication and localStorage utilities

export interface User {
  id: string;
  name: string;
  email: string;
  role: "client" | "lawyer";
  photo?: string;
  phone?: string;
  address?: string;
  specialty?: string; // for lawyers
  experience?: number; // for lawyers
  rating?: number; // for lawyers
  fees?: string; // for lawyers
  bio?: string; // for lawyers
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role: "client" | "lawyer";
}

export interface SignupData extends LoginCredentials {
  name: string;
  phone?: string;
  specialty?: string; // for lawyers
  experience?: number; // for lawyers
  fees?: string; // for lawyers
}

export interface Appointment {
  id: string;
  clientId: string;
  lawyerId: string;
  clientName: string;
  lawyerName: string;
  date: string;
  time: string;
  duration: number; // in minutes
  status: "pending" | "confirmed" | "completed" | "cancelled";
  meetLink?: string;
  notes?: string;
  caseType: string;
  createdAt: string;
}

export interface Case {
  id: string;
  clientId: string;
  lawyerId: string;
  clientName: string;
  lawyerName: string;
  title: string;
  description: string;
  type: string;
  status: "active" | "closed" | "pending";
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
  documents: Document[];
  tasks: Task[];
  progress: number; // 0-100
}

export interface Document {
  id: string;
  caseId: string;
  name: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
  url: string;
  folder: string;
}

export interface Task {
  id: string;
  caseId: string;
  title: string;
  description: string;
  assignedTo: string; // client or lawyer id
  assignedBy: string;
  dueDate: string;
  status: "pending" | "completed";
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  caseId: string;
  senderId: string;
  senderName: string;
  senderRole: "client" | "lawyer";
  message: string;
  timestamp: string;
  attachments?: Document[];
  isRead: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "appointment" | "message" | "document" | "task" | "case";
  isRead: boolean;
  createdAt: string;
  link?: string;
}

// Storage keys
const STORAGE_KEYS = {
  USER: "legal_platform_user",
  TOKEN: "legal_platform_token",
  APPOINTMENTS: "legal_platform_appointments",
  CASES: "legal_platform_cases",
  DOCUMENTS: "legal_platform_documents",
  TASKS: "legal_platform_tasks",
  MESSAGES: "legal_platform_messages",
  NOTIFICATIONS: "legal_platform_notifications",
} as const;

// Dummy users for demo
const DEMO_USERS: User[] = [
  {
    id: "1",
    name: "John Client",
    email: "client@demo.com",
    role: "client",
    phone: "+1 234 567 8900",
    address: "123 Main St, New York, NY",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Sarah Chen",
    email: "lawyer@demo.com",
    role: "lawyer",
    specialty: "Criminal Law",
    experience: 12,
    rating: 4.9,
    fees: "$300/hour",
    bio: "Experienced criminal defense attorney with a track record of successful cases.",
    phone: "+1 234 567 8901",
    address: "456 Law St, New York, NY",
    createdAt: new Date().toISOString(),
  },
];

// Authentication functions
export const authService = {
  login: (
    credentials: LoginCredentials,
  ): { success: boolean; user?: User; error?: string } => {
    const demoUser = DEMO_USERS.find(
      (u) => u.email === credentials.email && u.role === credentials.role,
    );

    if (demoUser && credentials.password === "demo123") {
      const token = `token_${demoUser.id}_${Date.now()}`;
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(demoUser));
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      return { success: true, user: demoUser };
    }

    return { success: false, error: "Invalid credentials" };
  },

  signup: (
    data: SignupData,
  ): { success: boolean; user?: User; error?: string } => {
    const existingUser = DEMO_USERS.find((u) => u.email === data.email);
    if (existingUser) {
      return { success: false, error: "User already exists" };
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role,
      phone: data.phone,
      specialty: data.specialty,
      experience: data.experience,
      fees: data.fees,
      createdAt: new Date().toISOString(),
    };

    const token = `token_${newUser.id}_${Date.now()}`;
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);

    return { success: true, user: newUser };
  },

  logout: (): void => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
  },
};

// Data management functions
export const dataService = {
  // Appointments
  getAppointments: (
    userId: string,
    role: "client" | "lawyer",
  ): Appointment[] => {
    const appointments = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.APPOINTMENTS) || "[]",
    );
    return appointments.filter((apt: Appointment) =>
      role === "client" ? apt.clientId === userId : apt.lawyerId === userId,
    );
  },

  createAppointment: (
    appointment: Omit<Appointment, "id" | "createdAt">,
  ): Appointment => {
    const appointments = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.APPOINTMENTS) || "[]",
    );
    const newAppointment: Appointment = {
      ...appointment,
      id: `apt_${Date.now()}`,
      createdAt: new Date().toISOString(),
      meetLink: `https://meet.google.com/meet_${Date.now()}`,
    };
    appointments.push(newAppointment);
    localStorage.setItem(
      STORAGE_KEYS.APPOINTMENTS,
      JSON.stringify(appointments),
    );
    return newAppointment;
  },

  updateAppointment: (id: string, updates: Partial<Appointment>): void => {
    const appointments = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.APPOINTMENTS) || "[]",
    );
    const index = appointments.findIndex((apt: Appointment) => apt.id === id);
    if (index !== -1) {
      appointments[index] = { ...appointments[index], ...updates };
      localStorage.setItem(
        STORAGE_KEYS.APPOINTMENTS,
        JSON.stringify(appointments),
      );
    }
  },

  // Cases
  getCases: (userId: string, role: "client" | "lawyer"): Case[] => {
    const cases = JSON.parse(localStorage.getItem(STORAGE_KEYS.CASES) || "[]");
    return cases.filter((caseItem: Case) =>
      role === "client"
        ? caseItem.clientId === userId
        : caseItem.lawyerId === userId,
    );
  },

  createCase: (
    caseData: Omit<
      Case,
      "id" | "createdAt" | "updatedAt" | "documents" | "tasks"
    >,
  ): Case => {
    const cases = JSON.parse(localStorage.getItem(STORAGE_KEYS.CASES) || "[]");
    const newCase: Case = {
      ...caseData,
      id: `case_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      documents: [],
      tasks: [],
    };
    cases.push(newCase);
    localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(cases));
    return newCase;
  },

  updateCase: (id: string, updates: Partial<Case>): void => {
    const cases = JSON.parse(localStorage.getItem(STORAGE_KEYS.CASES) || "[]");
    const index = cases.findIndex((caseItem: Case) => caseItem.id === id);
    if (index !== -1) {
      cases[index] = {
        ...cases[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(cases));
    }
  },

  // Tasks
  getTasks: (userId: string): Task[] => {
    const tasks = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || "[]");
    return tasks.filter((task: Task) => task.assignedTo === userId);
  },

  createTask: (task: Omit<Task, "id" | "createdAt">): Task => {
    const tasks = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || "[]");
    const newTask: Task = {
      ...task,
      id: `task_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    return newTask;
  },

  updateTask: (id: string, updates: Partial<Task>): void => {
    const tasks = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || "[]");
    const index = tasks.findIndex((task: Task) => task.id === id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    }
  },

  // Messages
  getMessages: (caseId: string): ChatMessage[] => {
    const messages = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.MESSAGES) || "[]",
    );
    return messages.filter((msg: ChatMessage) => msg.caseId === caseId);
  },

  sendMessage: (
    message: Omit<ChatMessage, "id" | "timestamp">,
  ): ChatMessage => {
    const messages = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.MESSAGES) || "[]",
    );
    const newMessage: ChatMessage = {
      ...message,
      id: `msg_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    messages.push(newMessage);
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    return newMessage;
  },

  // Notifications
  getNotifications: (userId: string): Notification[] => {
    const notifications = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || "[]",
    );
    return notifications.filter(
      (notif: Notification) => notif.userId === userId,
    );
  },

  createNotification: (
    notification: Omit<Notification, "id" | "createdAt">,
  ): Notification => {
    const notifications = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || "[]",
    );
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    notifications.push(newNotification);
    localStorage.setItem(
      STORAGE_KEYS.NOTIFICATIONS,
      JSON.stringify(notifications),
    );
    return newNotification;
  },

  markNotificationRead: (id: string): void => {
    const notifications = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || "[]",
    );
    const index = notifications.findIndex(
      (notif: Notification) => notif.id === id,
    );
    if (index !== -1) {
      notifications[index].isRead = true;
      localStorage.setItem(
        STORAGE_KEYS.NOTIFICATIONS,
        JSON.stringify(notifications),
      );
    }
  },
};

// Initialize demo data
export const initializeDemoData = () => {
  const currentUser = authService.getCurrentUser();
  if (!currentUser) return;

  // Initialize demo appointments
  const existingAppointments = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.APPOINTMENTS) || "[]",
  );
  if (existingAppointments.length === 0) {
    const demoAppointments: Appointment[] = [
      {
        id: "apt_1",
        clientId: "1",
        lawyerId: "2",
        clientName: "John Client",
        lawyerName: "Sarah Chen",
        date: new Date(Date.now() + 86400000).toISOString().split("T")[0], // tomorrow
        time: "10:00",
        duration: 60,
        status: "confirmed",
        meetLink: "https://meet.google.com/demo-meeting-1",
        notes: "Initial consultation for criminal case",
        caseType: "Criminal Law",
        createdAt: new Date().toISOString(),
      },
      {
        id: "apt_2",
        clientId: "1",
        lawyerId: "2",
        clientName: "John Client",
        lawyerName: "Sarah Chen",
        date: new Date(Date.now() - 86400000).toISOString().split("T")[0], // yesterday
        time: "14:00",
        duration: 45,
        status: "completed",
        meetLink: "https://meet.google.com/demo-meeting-2",
        notes: "Case review and strategy discussion",
        caseType: "Criminal Law",
        createdAt: new Date(Date.now() - 172800000).toISOString(),
      },
    ];
    localStorage.setItem(
      STORAGE_KEYS.APPOINTMENTS,
      JSON.stringify(demoAppointments),
    );
  }

  // Initialize demo cases
  const existingCases = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.CASES) || "[]",
  );
  if (existingCases.length === 0) {
    const demoCases: Case[] = [
      {
        id: "case_1",
        clientId: "1",
        lawyerId: "2",
        clientName: "John Client",
        lawyerName: "Sarah Chen",
        title: "Criminal Defense Case",
        description:
          "Defense against criminal charges related to financial fraud allegations.",
        type: "Criminal Law",
        status: "active",
        priority: "high",
        progress: 65,
        createdAt: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
        updatedAt: new Date().toISOString(),
        documents: [],
        tasks: [],
      },
    ];
    localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(demoCases));
  }

  // Initialize demo tasks
  const existingTasks = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.TASKS) || "[]",
  );
  if (existingTasks.length === 0) {
    const demoTasks: Task[] = [
      {
        id: "task_1",
        caseId: "case_1",
        title: "Upload Financial Documents",
        description:
          "Please upload all financial documents related to the case including bank statements and tax returns.",
        assignedTo: "1", // client
        assignedBy: "2", // lawyer
        dueDate: new Date(Date.now() + 604800000).toISOString(), // 1 week from now
        status: "pending",
        createdAt: new Date().toISOString(),
      },
      {
        id: "task_2",
        caseId: "case_1",
        title: "Prepare Case Summary",
        description: "Prepare comprehensive case summary for court filing.",
        assignedTo: "2", // lawyer
        assignedBy: "2", // lawyer
        dueDate: new Date(Date.now() + 259200000).toISOString(), // 3 days from now
        status: "pending",
        createdAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(demoTasks));
  }

  // Initialize demo messages
  const existingMessages = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.MESSAGES) || "[]",
  );
  if (existingMessages.length === 0) {
    const demoMessages: ChatMessage[] = [
      {
        id: "msg_1",
        caseId: "case_1",
        senderId: "2",
        senderName: "Sarah Chen",
        senderRole: "lawyer",
        message:
          "Hello John, I hope you're doing well. I've reviewed your case details and we have a strong defense strategy.",
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        isRead: true,
      },
      {
        id: "msg_2",
        caseId: "case_1",
        senderId: "1",
        senderName: "John Client",
        senderRole: "client",
        message:
          "Thank you Sarah. I'm feeling more confident about this. What documents do you need from me?",
        timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
        isRead: true,
      },
      {
        id: "msg_3",
        caseId: "case_1",
        senderId: "2",
        senderName: "Sarah Chen",
        senderRole: "lawyer",
        message:
          "I've assigned you a task to upload the financial documents. Please check your task list.",
        timestamp: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
        isRead: false,
      },
    ];
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(demoMessages));
  }

  // Initialize demo notifications
  const existingNotifications = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || "[]",
  );
  if (existingNotifications.length === 0) {
    const demoNotifications: Notification[] = [
      {
        id: "notif_1",
        userId: currentUser.id,
        title: "New Message",
        message: "You have a new message from Sarah Chen",
        type: "message",
        isRead: false,
        createdAt: new Date(Date.now() - 900000).toISOString(),
        link: "/chat/case_1",
      },
      {
        id: "notif_2",
        userId: currentUser.id,
        title: "Task Assigned",
        message: "New task: Upload Financial Documents",
        type: "task",
        isRead: false,
        createdAt: new Date(Date.now() - 1800000).toISOString(),
        link: "/tasks",
      },
      {
        id: "notif_3",
        userId: currentUser.id,
        title: "Appointment Confirmed",
        message: "Your appointment with Sarah Chen has been confirmed",
        type: "appointment",
        isRead: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        link: "/appointments",
      },
    ];
    localStorage.setItem(
      STORAGE_KEYS.NOTIFICATIONS,
      JSON.stringify(demoNotifications),
    );
  }
};
