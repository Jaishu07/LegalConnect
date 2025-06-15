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
  MapPin,
  TrendingUp,
  Users,
  Briefcase,
  Plus,
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

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.role !== "client") {
      navigate("/login");
      return;
    }

    setUser(currentUser);
    loadDashboardData(currentUser.id);
  }, [navigate]);

  const loadDashboardData = (userId: string) => {
    try {
      const userAppointments = dataService.getAppointments(userId, "client");
      const userCases = dataService.getCases(userId, "client");
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

  const getActiveCases = () => {
    return cases.filter((c) => c.status === "active").slice(0, 3);
  };

  const getPendingTasks = () => {
    return tasks.filter((task) => task.status === "pending").slice(0, 3);
  };

  const getUnreadNotifications = () => {
    return notifications.filter((notif) => !notif.isRead).slice(0, 5);
  };

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
              <span className="text-gray-300">Client Dashboard</span>
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
            Here's an overview of your legal matters and upcoming appointments.
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
                    Pending Tasks
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {tasks.filter((t) => t.status === "pending").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">
                    Upcoming Meetings
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {getUpcomingAppointments().length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">
                    Unread Messages
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {
                      getUnreadNotifications().filter(
                        (n) => n.type === "message",
                      ).length
                    }
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Appointments */}
            <Card className="glass-card border-white/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-white">
                    Upcoming Appointments
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Your scheduled meetings with lawyers
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
                              {appointment.lawyerName}
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
                    <Link to="/">
                      <Button className="mt-4">
                        <Plus className="w-4 h-4 mr-2" />
                        Book Appointment
                      </Button>
                    </Link>
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
                    {getActiveCases().map((case_) => (
                      <div key={case_.id} className="p-4 bg-white/5 rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-white">
                              {case_.title}
                            </h4>
                            <p className="text-sm text-gray-400">
                              {case_.type}
                            </p>
                            <p className="text-sm text-gray-500">
                              with {case_.lawyerName}
                            </p>
                          </div>
                          <Badge
                            className={cn(
                              "text-xs",
                              case_.priority === "high"
                                ? "bg-red-500/20 text-red-400 border-red-500/30"
                                : case_.priority === "medium"
                                  ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                  : "bg-green-500/20 text-green-400 border-green-500/30",
                            )}
                          >
                            {case_.priority} priority
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Progress</span>
                            <span className="text-white">
                              {case_.progress}%
                            </span>
                          </div>
                          <Progress value={case_.progress} className="h-2" />
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <p className="text-xs text-gray-500">
                            Updated{" "}
                            {new Date(case_.updatedAt).toLocaleDateString()}
                          </p>
                          <div className="flex space-x-2">
                            <Link to={`/chat/${case_.id}`}>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 text-xs"
                              >
                                <MessageSquare className="w-3 h-3 mr-1" />
                                Chat
                              </Button>
                            </Link>
                            <Link to={`/documents/${case_.id}`}>
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

            {/* Pending Tasks */}
            <Card className="glass-card border-white/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-white">Pending Tasks</CardTitle>
                  <CardDescription className="text-gray-400">
                    Tasks assigned to you by your lawyers
                  </CardDescription>
                </div>
                <Link to="/tasks">
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
                {getPendingTasks().length > 0 ? (
                  <div className="space-y-3">
                    {getPendingTasks().map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                            <AlertCircle className="w-4 h-4 text-orange-400" />
                          </div>
                          <div>
                            <p className="font-medium text-white text-sm">
                              {task.title}
                            </p>
                            <p className="text-xs text-gray-400">
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs"
                        >
                          Mark Complete
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">No pending tasks</p>
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
                <Link to="/" className="block">
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    Find Lawyers
                  </Button>
                </Link>
                <Link to="/appointments" className="block">
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    My Appointments
                  </Button>
                </Link>
                <Link to="/cases" className="block">
                  <Button className="w-full justify-start" variant="outline">
                    <Briefcase className="w-4 h-4 mr-2" />
                    My Cases
                  </Button>
                </Link>
                <Link to="/chat" className="block">
                  <Button className="w-full justify-start" variant="outline">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Messages
                  </Button>
                </Link>
                <Link to="/documents" className="block">
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Documents
                  </Button>
                </Link>
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
                <CardTitle className="text-white">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <Phone className="w-4 h-4" />
                  <span>1-800-LEGAL-01</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <Mail className="w-4 h-4" />
                  <span>support@legalconnect.com</span>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
