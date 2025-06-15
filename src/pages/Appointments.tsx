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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Calendar,
  Video,
  Clock,
  MapPin,
  Phone,
  Mail,
  Plus,
  Search,
  Filter,
  ArrowLeft,
  Scale,
  Check,
  X,
  Edit,
  Trash2,
} from "lucide-react";
import {
  authService,
  dataService,
  type User,
  type Appointment,
} from "@/lib/auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const Appointments = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<
    Appointment[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setUser(currentUser);
    loadAppointments(currentUser);
  }, [navigate]);

  useEffect(() => {
    filterAppointments();
  }, [appointments, searchQuery, statusFilter]);

  const loadAppointments = (currentUser: User) => {
    try {
      const userAppointments = dataService.getAppointments(
        currentUser.id,
        currentUser.role,
      );
      setAppointments(userAppointments);
    } catch (error) {
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = appointments;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (apt) =>
          apt.clientName.toLowerCase().includes(query) ||
          apt.lawyerName.toLowerCase().includes(query) ||
          apt.caseType.toLowerCase().includes(query),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((apt) => apt.status === statusFilter);
    }

    setFilteredAppointments(filtered);
  };

  const handleAppointmentAction = (
    appointmentId: string,
    action: "accept" | "reject" | "cancel",
  ) => {
    let status: "confirmed" | "cancelled";

    switch (action) {
      case "accept":
        status = "confirmed";
        break;
      case "reject":
      case "cancel":
        status = "cancelled";
        break;
    }

    dataService.updateAppointment(appointmentId, { status });

    setAppointments((prev) =>
      prev.map((apt) => (apt.id === appointmentId ? { ...apt, status } : apt)),
    );

    toast.success(
      `Appointment ${action === "accept" ? "confirmed" : "cancelled"}`,
    );
  };

  const getUpcomingAppointments = () => {
    const now = new Date();
    return filteredAppointments.filter(
      (apt) => new Date(`${apt.date}T${apt.time}`) > now,
    );
  };

  const getPastAppointments = () => {
    const now = new Date();
    return filteredAppointments.filter(
      (apt) => new Date(`${apt.date}T${apt.time}`) <= now,
    );
  };

  const getPendingAppointments = () => {
    return filteredAppointments.filter((apt) => apt.status === "pending");
  };

  const formatAppointmentDate = (date: string, time: string) => {
    const appointmentDate = new Date(`${date}T${time}`);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (appointmentDate.toDateString() === today.toDateString()) {
      return `Today at ${appointmentDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (appointmentDate.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow at ${appointmentDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else {
      return `${appointmentDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })} at ${appointmentDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "completed":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const renderAppointmentCard = (appointment: Appointment) => {
    const isUpcoming =
      new Date(`${appointment.date}T${appointment.time}`) > new Date();
    const otherPartyName =
      user?.role === "client" ? appointment.lawyerName : appointment.clientName;

    return (
      <Card
        key={appointment.id}
        className="glass-card border-white/10 hover:border-white/20 transition-all duration-300"
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-4">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {otherPartyName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-white">{otherPartyName}</h3>
                <p className="text-sm text-gray-400">{appointment.caseType}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-300">
                    {formatAppointmentDate(appointment.date, appointment.time)}
                  </span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-300">
                    {appointment.duration} minutes
                  </span>
                </div>
              </div>
            </div>
            <Badge className={getStatusColor(appointment.status)}>
              {appointment.status}
            </Badge>
          </div>

          {appointment.notes && (
            <div className="mb-4 p-3 bg-white/5 rounded-lg">
              <p className="text-sm text-gray-300">{appointment.notes}</p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {appointment.meetLink && isUpcoming && (
                <Button size="sm" asChild>
                  <a
                    href={appointment.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Video className="w-4 h-4 mr-1" />
                    Join Meeting
                  </a>
                </Button>
              )}

              {user?.role === "lawyer" && appointment.status === "pending" && (
                <div className="flex space-x-2">
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
              )}

              {isUpcoming && appointment.status === "confirmed" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    handleAppointmentAction(appointment.id, "cancel")
                  }
                >
                  Cancel
                </Button>
              )}
            </div>

            <div className="flex space-x-2">
              <Button size="sm" variant="ghost">
                <Edit className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading appointments...</p>
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
              <Link
                to={
                  user?.role === "client"
                    ? "/client-dashboard"
                    : "/lawyer-dashboard"
                }
                className="flex items-center text-gray-300 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
              <Separator orientation="vertical" className="h-6 bg-white/20" />
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Scale className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text">
                  LegalConnect
                </span>
              </div>
            </div>

            {user?.role === "client" && (
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Book Appointment
              </Button>
            )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Appointments</h1>
          <p className="text-gray-400">
            Manage your scheduled meetings and consultations
          </p>
        </div>

        {/* Filters */}
        <Card className="glass-card border-white/10 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <Label htmlFor="search" className="text-white mb-2 block">
                  Search
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by name, case type..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="md:w-48">
                <Label htmlFor="status" className="text-white mb-2 block">
                  Status
                </Label>
                <select
                  id="status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-white/10 border border-white/20 text-white"
                >
                  <option value="all" className="text-black">
                    All Statuses
                  </option>
                  <option value="pending" className="text-black">
                    Pending
                  </option>
                  <option value="confirmed" className="text-black">
                    Confirmed
                  </option>
                  <option value="completed" className="text-black">
                    Completed
                  </option>
                  <option value="cancelled" className="text-black">
                    Cancelled
                  </option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointment Tabs */}
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/5 mb-8">
            <TabsTrigger
              value="upcoming"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Upcoming ({getUpcomingAppointments().length})
            </TabsTrigger>
            {user?.role === "lawyer" && (
              <TabsTrigger
                value="pending"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Pending ({getPendingAppointments().length})
              </TabsTrigger>
            )}
            <TabsTrigger
              value="past"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Past ({getPastAppointments().length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-6">
            {getUpcomingAppointments().length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {getUpcomingAppointments().map(renderAppointmentCard)}
              </div>
            ) : (
              <Card className="glass-card border-white/10">
                <CardContent className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No Upcoming Appointments
                  </h3>
                  <p className="text-gray-400 mb-6">
                    {user?.role === "client"
                      ? "Book your first appointment with a lawyer"
                      : "No upcoming meetings scheduled"}
                  </p>
                  {user?.role === "client" && (
                    <Link to="/">
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Book Appointment
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {user?.role === "lawyer" && (
            <TabsContent value="pending" className="space-y-6">
              {getPendingAppointments().length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {getPendingAppointments().map(renderAppointmentCard)}
                </div>
              ) : (
                <Card className="glass-card border-white/10">
                  <CardContent className="text-center py-12">
                    <Clock className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      No Pending Requests
                    </h3>
                    <p className="text-gray-400">
                      All appointment requests have been reviewed
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          )}

          <TabsContent value="past" className="space-y-6">
            {getPastAppointments().length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {getPastAppointments().map(renderAppointmentCard)}
              </div>
            ) : (
              <Card className="glass-card border-white/10">
                <CardContent className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No Past Appointments
                  </h3>
                  <p className="text-gray-400">
                    Your appointment history will appear here
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <Card className="glass-card border-white/10">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-400 mb-2">
                {getUpcomingAppointments().length}
              </div>
              <div className="text-sm text-gray-400">Upcoming</div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-2">
                {getPendingAppointments().length}
              </div>
              <div className="text-sm text-gray-400">Pending</div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-400 mb-2">
                {
                  filteredAppointments.filter((a) => a.status === "completed")
                    .length
                }
              </div>
              <div className="text-sm text-gray-400">Completed</div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-red-400 mb-2">
                {
                  filteredAppointments.filter((a) => a.status === "cancelled")
                    .length
                }
              </div>
              <div className="text-sm text-gray-400">Cancelled</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
