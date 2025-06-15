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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Briefcase,
  MessageSquare,
  FileText,
  Calendar,
  Plus,
  Search,
  ArrowLeft,
  Scale,
  Edit,
  Trash2,
  Users,
  Clock,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import {
  authService,
  dataService,
  type User,
  type Case,
  type Task,
} from "@/lib/auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const Cases = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [cases, setCases] = useState<Case[]>([]);
  const [filteredCases, setFilteredCases] = useState<Case[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newCase, setNewCase] = useState({
    title: "",
    description: "",
    type: "",
    priority: "medium" as "low" | "medium" | "high",
    clientName: "",
    lawyerName: "",
  });

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setUser(currentUser);
    loadCases(currentUser);
  }, [navigate]);

  useEffect(() => {
    filterCases();
  }, [cases, searchQuery, statusFilter]);

  const loadCases = (currentUser: User) => {
    try {
      const userCases = dataService.getCases(currentUser.id, currentUser.role);
      setCases(userCases);
    } catch (error) {
      toast.error("Failed to load cases");
    } finally {
      setLoading(false);
    }
  };

  const filterCases = () => {
    let filtered = cases;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (caseItem) =>
          caseItem.title.toLowerCase().includes(query) ||
          caseItem.type.toLowerCase().includes(query) ||
          caseItem.clientName.toLowerCase().includes(query) ||
          caseItem.lawyerName.toLowerCase().includes(query),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (caseItem) => caseItem.status === statusFilter,
      );
    }

    setFilteredCases(filtered);
  };

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    const caseData = {
      ...newCase,
      clientId: user.role === "client" ? user.id : "1", // Default client ID for lawyer
      lawyerId: user.role === "lawyer" ? user.id : "2", // Default lawyer ID for client
      clientName:
        user.role === "client" ? user.name : newCase.clientName || "John Doe",
      lawyerName:
        user.role === "lawyer" ? user.name : newCase.lawyerName || "Sarah Chen",
      status: "active" as const,
      progress: 10,
    };

    const createdCase = dataService.createCase(caseData);
    setCases((prev) => [createdCase, ...prev]);

    setNewCase({
      title: "",
      description: "",
      type: "",
      priority: "medium",
      clientName: "",
      lawyerName: "",
    });
    setIsCreateDialogOpen(false);

    toast.success("Case created successfully");
  };

  const updateCaseProgress = (caseId: string, progress: number) => {
    dataService.updateCase(caseId, { progress });
    setCases((prev) =>
      prev.map((caseItem) =>
        caseItem.id === caseId ? { ...caseItem, progress } : caseItem,
      ),
    );
    toast.success("Case progress updated");
  };

  const getActiveCases = () => {
    return filteredCases.filter((c) => c.status === "active");
  };

  const getPendingCases = () => {
    return filteredCases.filter((c) => c.status === "pending");
  };

  const getClosedCases = () => {
    return filteredCases.filter((c) => c.status === "closed");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "closed":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const renderCaseCard = (caseItem: Case) => {
    const otherPartyName =
      user?.role === "client" ? caseItem.lawyerName : caseItem.clientName;

    return (
      <Card
        key={caseItem.id}
        className="glass-card border-white/10 hover:border-white/20 transition-all duration-300"
      >
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-white text-lg mb-2">
                {caseItem.title}
              </CardTitle>
              <CardDescription className="text-gray-400 mb-3">
                {caseItem.description}
              </CardDescription>
              <div className="flex items-center space-x-2 mb-2">
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  {caseItem.type}
                </Badge>
                <Badge className={getPriorityColor(caseItem.priority)}>
                  {caseItem.priority} priority
                </Badge>
                <Badge className={getStatusColor(caseItem.status)}>
                  {caseItem.status}
                </Badge>
              </div>
            </div>
            <div className="flex space-x-2 ml-4">
              <Button size="sm" variant="ghost">
                <Edit className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-4">
            {/* Case Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Progress</span>
                <span className="text-sm text-white">{caseItem.progress}%</span>
              </div>
              <Progress value={caseItem.progress} className="h-2" />
            </div>

            {/* Case Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">
                  {user?.role === "client" ? "Lawyer" : "Client"}:
                </span>
                <p className="text-white font-medium">{otherPartyName}</p>
              </div>
              <div>
                <span className="text-gray-400">Created:</span>
                <p className="text-white">
                  {new Date(caseItem.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="text-gray-400">Last Updated:</span>
                <p className="text-white">
                  {new Date(caseItem.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="text-gray-400">Documents:</span>
                <p className="text-white">{caseItem.documents.length}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex space-x-2">
                <Link to={`/chat/${caseItem.id}`}>
                  <Button size="sm" variant="outline" className="h-8">
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Chat
                  </Button>
                </Link>
                <Link to={`/documents/${caseItem.id}`}>
                  <Button size="sm" variant="outline" className="h-8">
                    <FileText className="w-3 h-3 mr-1" />
                    Documents
                  </Button>
                </Link>
                <Link to="/tasks">
                  <Button size="sm" variant="outline" className="h-8">
                    <Clock className="w-3 h-3 mr-1" />
                    Tasks
                  </Button>
                </Link>
              </div>

              {user?.role === "lawyer" && (
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      updateCaseProgress(
                        caseItem.id,
                        Math.min(caseItem.progress + 10, 100),
                      )
                    }
                  >
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Update
                  </Button>
                </div>
              )}
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
          <p className="text-slate-300">Loading cases...</p>
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

            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  New Case
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-white/10 max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    Create New Case
                  </DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Add a new legal case to your portfolio
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateCase} className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-white">
                      Case Title
                    </Label>
                    <Input
                      id="title"
                      value={newCase.title}
                      onChange={(e) =>
                        setNewCase((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      placeholder="Enter case title"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="type" className="text-white">
                      Case Type
                    </Label>
                    <select
                      id="type"
                      value={newCase.type}
                      onChange={(e) =>
                        setNewCase((prev) => ({
                          ...prev,
                          type: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 rounded-md bg-white/10 border border-white/20 text-white"
                      required
                    >
                      <option value="">Select case type</option>
                      <option value="Criminal Law">Criminal Law</option>
                      <option value="Civil Law">Civil Law</option>
                      <option value="Family Law">Family Law</option>
                      <option value="Corporate Law">Corporate Law</option>
                      <option value="Immigration Law">Immigration Law</option>
                      <option value="Real Estate Law">Real Estate Law</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="priority" className="text-white">
                      Priority
                    </Label>
                    <select
                      id="priority"
                      value={newCase.priority}
                      onChange={(e) =>
                        setNewCase((prev) => ({
                          ...prev,
                          priority: e.target.value as "low" | "medium" | "high",
                        }))
                      }
                      className="w-full px-3 py-2 rounded-md bg-white/10 border border-white/20 text-white"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-white">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={newCase.description}
                      onChange={(e) =>
                        setNewCase((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Enter case description"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setIsCreateDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Create Case
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Cases</h1>
          <p className="text-gray-400">
            Manage your legal cases and track their progress
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
                    placeholder="Search by title, type, client, lawyer..."
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
                  <option value="active" className="text-black">
                    Active
                  </option>
                  <option value="pending" className="text-black">
                    Pending
                  </option>
                  <option value="closed" className="text-black">
                    Closed
                  </option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Case Tabs */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/5 mb-8">
            <TabsTrigger
              value="active"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Active ({getActiveCases().length})
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Pending ({getPendingCases().length})
            </TabsTrigger>
            <TabsTrigger
              value="closed"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Closed ({getClosedCases().length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            {getActiveCases().length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {getActiveCases().map(renderCaseCard)}
              </div>
            ) : (
              <Card className="glass-card border-white/10">
                <CardContent className="text-center py-12">
                  <Briefcase className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No Active Cases
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Create your first case to get started
                  </p>
                  <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Case
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-6">
            {getPendingCases().length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {getPendingCases().map(renderCaseCard)}
              </div>
            ) : (
              <Card className="glass-card border-white/10">
                <CardContent className="text-center py-12">
                  <AlertCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No Pending Cases
                  </h3>
                  <p className="text-gray-400">
                    All cases have been reviewed and are active or closed
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="closed" className="space-y-6">
            {getClosedCases().length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {getClosedCases().map(renderCaseCard)}
              </div>
            ) : (
              <Card className="glass-card border-white/10">
                <CardContent className="text-center py-12">
                  <Briefcase className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No Closed Cases
                  </h3>
                  <p className="text-gray-400">
                    Completed cases will appear here
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
              <div className="text-2xl font-bold text-green-400 mb-2">
                {getActiveCases().length}
              </div>
              <div className="text-sm text-gray-400">Active Cases</div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-2">
                {getPendingCases().length}
              </div>
              <div className="text-sm text-gray-400">Pending Cases</div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-400 mb-2">
                {getClosedCases().length}
              </div>
              <div className="text-sm text-gray-400">Closed Cases</div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-400 mb-2">
                {Math.round(
                  filteredCases.reduce((acc, c) => acc + c.progress, 0) /
                    filteredCases.length || 0,
                )}
                %
              </div>
              <div className="text-sm text-gray-400">Avg. Progress</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cases;
