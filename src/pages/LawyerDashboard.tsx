import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Calendar,
  MessageSquare,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Video,
  Bell,
  User,
  LogOut,
  Scale,
  Phone,
  Mail,
  TrendingUp,
  Users,
  Briefcase,
  DollarSign,
  Star,
  Plus,
  Check,
  X,
} from "lucide-react";
import {
  authService,
  dataService,
  type User,
  type Appointment,
  type Case,
  type Task,
  type Notification,
} from "@/lib/auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const LawyerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.role !== "lawyer") {
      navigate("/login");
      return;
    }

    setUser(currentUser);
    loadDashboardData(currentUser.id);
  }, [navigate]);

  const loadDashboardData = (userId: string) => {
    try {
      const userAppointments = dataService.getAppointments(userId, "lawyer");
      const userCases = dataService.getCases(userId, "lawyer");
      const userTasks = dataService.getTasks(userId);
      const userNotifications = dataService.getNotifications(userId);

      setAppointments(userAppointments);
      setCases(userCases);
      setTasks(userTasks);
      setNotifications(userNotifications);
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleAppointmentAction = (
    appointmentId: string,
    action: "accept" | "reject",
  ) => {
    const status = action === "accept" ? "confirmed" : "cancelled";
    dataService.updateAppointment(appointmentId, { status });

    setAppointments((prev) =>
      prev.map((apt) => (apt.id === appointmentId ? { ...apt, status } : apt)),
    );

    toast.success(
      `Appointment ${action === "accept" ? "accepted" : "rejected"}`,
    );
  };

  const markNotificationRead = (notificationId: string) => {
    dataService.markNotificationRead(notificationId);
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif,
      ),
    );
  };

  const getUpcomingAppointments = () => {
    const now = new Date();
    return appointments
      .filter(
        (apt) =>
          new Date(`${apt.date}T${apt.time}`) > now &&
          apt.status === "confirmed",
      )
      .sort(
        (a, b) =>
          new Date(`${a.date}T${a.time}`).getTime() -
          new Date(`${b.date}T${b.time}`).getTime(),
      )
      .slice(0, 3);
  };

  const getPendingAppointments = () => {
    return appointments.filter((apt) => apt.status === "pending").slice(0, 3);
  };

  const getActiveCases = () => {
    return cases.filter((c) => c.status === "active").slice(0, 3);
  };

  const getUnreadNotifications = () => {
    return notifications.filter((notif) => !notif.isRead).slice(0, 5);
  };

  // Analytics data
  const monthlyData = [
    { month: "Jan", appointments: 12, revenue: 3600 },
    { month: "Feb", appointments: 15, revenue: 4500 },
    { month: "Mar", appointments: 18, revenue: 5400 },
    { month: "Apr", appointments: 22, revenue: 6600 },
    { month: "May", appointments: 20, revenue: 6000 },
    { month: "Jun", appointments: 25, revenue: 7500 },
  ];

  const caseTypeData = [
    { name: "Criminal Law", value: 35, color: "#3B82F6" },
    { name: "Civil Law", value: 25, color: "#10B981" },
    { name: "Family Law", value: 20, color: "#F59E0B" },
    { name: "Corporate Law", value: 20, color: "#8B5CF6" },
  ];

  const caseStatusData = [
    {
      status: "Active",
      count: cases.filter((c) => c.status === "active").length,
    },
    {
      status: "Pending",
      count: cases.filter((c) => c.status === "pending").length,
    },
    {
      status: "Closed",
      count: cases.filter((c) => c.status === "closed").length,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="glass border-b border-white/10 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Scale className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text">
                  LegalConnect
                </span>
              </Link>
              <Separator orientation="vertical" className="h-6 bg-white/20" />
              <span className="text-gray-300">Lawyer Dashboard</span>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                {getUnreadNotifications().length > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                    {getUnreadNotifications().length}
                  </span>
                )}
              </Button>

              <Link to="/profile">
                <Button variant="ghost" size="sm">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
              </Link>

              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-400">
            Manage your practice and connect with clients efficiently.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">
                    Active Cases
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {cases.filter((c) => c.status === "active").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">
                    Pending Requests
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {appointments.filter((a) => a.status === "pending").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">
                    This Month
                  </p>
                  <p className="text-2xl font-bold text-white">
                    ${monthlyData[monthlyData.length - 1]?.revenue || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Rating</p>
                  <p className="text-2xl font-bold text-white">
                    {user?.rating || "4.9"}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Analytics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Revenue */}
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">
                    Monthly Performance
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Appointments and revenue over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#3B82F6"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Case Types */}
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">
                    Case Distribution
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Cases by legal specialty
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={caseTypeData}
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        dataKey="value"
                      >
                        {caseTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {caseTypeData.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center text-sm"
                      >
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-gray-300">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pending Appointment Requests */}
            <Card className="glass-card border-white/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-white">
                    Pending Appointment Requests
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Review and respond to client requests
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                {getPendingAppointments().length > 0 ? (
                  <div className="space-y-4">
                    {getPendingAppointments().map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                              {appointment.clientName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-white">
                              {appointment.clientName}
                            </p>
                            <p className="text-sm text-gray-400">
                              {appointment.caseType}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(appointment.date).toLocaleDateString()}{" "}
                              at {appointment.time}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() =>
                              handleAppointmentAction(appointment.id, "accept")
                            }
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              handleAppointmentAction(appointment.id, "reject")
                            }
                          >
                            <X className="w-4 h-4 mr-1" />
                            Decline
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">No pending requests</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Appointments */}
            <Card className="glass-card border-white/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-white">
                    Upcoming Appointments
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Your confirmed meetings with clients
                  </CardDescription>
                </div>
                <Link to="/appointments">
                  <Button
                    variant="outline"
                    size="sm"
                    className="glass-button border-white/20"
                  >
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {getUpcomingAppointments().length > 0 ? (
                  <div className="space-y-4">
                    {getUpcomingAppointments().map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-blue-400" />
                          </div>
                          <div>
                            <p className="font-medium text-white">
                              {appointment.clientName}
                            </p>
                            <p className="text-sm text-gray-400">
                              {appointment.caseType}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(appointment.date).toLocaleDateString()}{" "}
                              at {appointment.time}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            {appointment.status}
                          </Badge>
                          {appointment.meetLink && (
                            <Button size="sm" asChild>
                              <a
                                href={appointment.meetLink}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Video className="w-4 h-4 mr-1" />
                                Join
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">No upcoming appointments</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Active Cases */}
            <Card className="glass-card border-white/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-white">Active Cases</CardTitle>
                  <CardDescription className="text-gray-400">
                    Your ongoing legal matters
                  </CardDescription>
                </div>
                <Link to="/cases">
                  <Button
                    variant="outline"
                    size="sm"
                    className="glass-button border-white/20"
                  >
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {getActiveCases().length > 0 ? (
                  <div className="space-y-4">
                    {getActiveCases().map((caseItem) => (
                      <div
                        key={caseItem.id}
                        className="p-4 bg-white/5 rounded-lg"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-white">
                              {caseItem.title}
                            </h4>
                            <p className="text-sm text-gray-400">
                              {caseItem.type}
                            </p>
                            <p className="text-sm text-gray-500">
                              Client: {caseItem.clientName}
                            </p>
                          </div>
                          <Badge
                            className={cn(
                              "text-xs",
                              caseItem.priority === "high"
                                ? "bg-red-500/20 text-red-400 border-red-500/30"
                                : caseItem.priority === "medium"
                                  ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                  : "bg-green-500/20 text-green-400 border-green-500/30",
                            )}
                          >
                            {caseItem.priority} priority
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Progress</span>
                            <span className="text-white">
                              {caseItem.progress}%
                            </span>
                          </div>
                          <Progress value={caseItem.progress} className="h-2" />
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <p className="text-xs text-gray-500">
                            Updated{" "}
                            {new Date(caseItem.updatedAt).toLocaleDateString()}
                          </p>
                          <div className="flex space-x-2">
                            <Link to={`/chat/${caseItem.id}`}>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 text-xs"
                              >
                                <MessageSquare className="w-3 h-3 mr-1" />
                                Chat
                              </Button>
                            </Link>
                            <Link to={`/documents/${caseItem.id}`}>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 text-xs"
                              >
                                <FileText className="w-3 h-3 mr-1" />
                                Docs
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Briefcase className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">No active cases</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/appointments" className="block">
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Manage Calendar
                  </Button>
                </Link>
                <Link to="/cases" className="block">
                  <Button className="w-full justify-start" variant="outline">
                    <Briefcase className="w-4 h-4 mr-2" />
                    View All Cases
                  </Button>
                </Link>
                <Link to="/chat" className="block">
                  <Button className="w-full justify-start" variant="outline">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Client Messages
                  </Button>
                </Link>
                <Link to="/documents" className="block">
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Document Library
                  </Button>
                </Link>
                <Link to="/tasks" className="block">
                  <Button className="w-full justify-start" variant="outline">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Task Management
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Case Status Overview */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Case Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={caseStatusData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="status" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="count" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recent Notifications */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white">
                  Recent Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                {getUnreadNotifications().length > 0 ? (
                  <div className="space-y-3">
                    {getUnreadNotifications().map((notification) => (
                      <div
                        key={notification.id}
                        className="p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
                        onClick={() => markNotificationRead(notification.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <p className="text-sm font-medium text-white">
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-400">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(
                                notification.createdAt,
                              ).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Bell className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">
                      No new notifications
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Your Practice</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <Phone className="w-4 h-4" />
                  <span>{user?.phone || "Add phone number"}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <Mail className="w-4 h-4" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <TrendingUp className="w-4 h-4" />
                  <span>{user?.specialty}</span>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawyerDashboard;
