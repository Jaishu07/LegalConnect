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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Search,
  ArrowLeft,
  Scale,
  Calendar,
  User,
  FileText,
  Trash2,
  Edit,
  Flag,
} from "lucide-react";
import {
  authService,
  dataService,
  type User,
  type Task,
  type Case,
} from "@/lib/auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const Tasks = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    caseId: "",
    assignedTo: "",
    dueDate: "",
  });

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setUser(currentUser);
    loadData(currentUser);
  }, [navigate]);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchQuery, statusFilter]);

  const loadData = (currentUser: User) => {
    try {
      const userTasks = dataService.getTasks(currentUser.id);
      const userCases = dataService.getCases(currentUser.id, currentUser.role);

      // For lawyers, also get tasks they assigned
      if (currentUser.role === "lawyer") {
        // In a real app, you'd have a separate method for this
        const allTasks = JSON.parse(
          localStorage.getItem("legal_platform_tasks") || "[]",
        );
        const lawyerTasks = allTasks.filter(
          (task: Task) => task.assignedBy === currentUser.id,
        );
        setTasks([...userTasks, ...lawyerTasks]);
      } else {
        setTasks(userTasks);
      }

      setCases(userCases);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    let filtered = tasks;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

    setFilteredTasks(filtered);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !newTask.caseId) return;

    const selectedCase = cases.find((c) => c.id === newTask.caseId);
    if (!selectedCase) return;

    const taskData = {
      ...newTask,
      assignedBy: user.id,
      assignedTo:
        user.role === "lawyer" ? selectedCase.clientId : selectedCase.lawyerId,
      status: "pending" as const,
    };

    const createdTask = dataService.createTask(taskData);
    setTasks((prev) => [createdTask, ...prev]);

    setNewTask({
      title: "",
      description: "",
      caseId: "",
      assignedTo: "",
      dueDate: "",
    });
    setIsCreateDialogOpen(false);

    toast.success("Task created successfully");
  };

  const handleTaskStatusChange = (
    taskId: string,
    status: "pending" | "completed",
  ) => {
    dataService.updateTask(taskId, { status });
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, status } : task)),
    );

    toast.success(
      status === "completed" ? "Task marked as completed" : "Task reopened",
    );
  };

  const handleDeleteTask = (taskId: string) => {
    // In a real app, you'd have a delete method
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    toast.success("Task deleted");
  };

  const getPendingTasks = () => {
    return filteredTasks.filter((task) => task.status === "pending");
  };

  const getCompletedTasks = () => {
    return filteredTasks.filter((task) => task.status === "completed");
  };

  const getOverdueTasks = () => {
    const now = new Date();
    return filteredTasks.filter(
      (task) => task.status === "pending" && new Date(task.dueDate) < now,
    );
  };

  const getTasksByAssignment = () => {
    if (!user) return { assigned: [], created: [] };

    const assigned = filteredTasks.filter(
      (task) => task.assignedTo === user.id,
    );
    const created = filteredTasks.filter((task) => task.assignedBy === user.id);

    return { assigned, created };
  };

  const getDaysUntilDue = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getPriorityColor = (dueDate: string, status: string) => {
    if (status === "completed") return "text-green-400";

    const daysUntil = getDaysUntilDue(dueDate);
    if (daysUntil < 0) return "text-red-400"; // Overdue
    if (daysUntil <= 2) return "text-orange-400"; // Due soon
    return "text-gray-400"; // Normal
  };

  const renderTaskCard = (task: Task) => {
    const relatedCase = cases.find((c) => c.id === task.caseId);
    const isAssignedToMe = task.assignedTo === user?.id;
    const isCreatedByMe = task.assignedBy === user?.id;
    const daysUntil = getDaysUntilDue(task.dueDate);

    return (
      <Card
        key={task.id}
        className="glass-card border-white/10 hover:border-white/20 transition-all duration-300"
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-white text-lg">
                  {task.title}
                </h3>
                <div className="flex items-center space-x-2 ml-4">
                  <Badge
                    className={cn(
                      task.status === "completed"
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
                    )}
                  >
                    {task.status}
                  </Badge>
                  {daysUntil < 0 && task.status === "pending" && (
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                      Overdue
                    </Badge>
                  )}
                </div>
              </div>

              <p className="text-gray-300 mb-3">{task.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400">Case:</span>
                  <span className="text-white">{relatedCase?.title}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400">
                    {isAssignedToMe ? "Assigned by" : "Assigned to"}:
                  </span>
                  <span className="text-white">
                    {isAssignedToMe
                      ? relatedCase?.lawyerName || "Lawyer"
                      : relatedCase?.clientName || "Client"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400">Due:</span>
                  <span className={getPriorityColor(task.dueDate, task.status)}>
                    {new Date(task.dueDate).toLocaleDateString()}
                    {daysUntil >= 0 && task.status === "pending" && (
                      <span className="ml-1">
                        ({daysUntil === 0 ? "Today" : `${daysUntil} days`})
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400">Created:</span>
                  <span className="text-white">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex space-x-2">
              {isAssignedToMe && task.status === "pending" && (
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleTaskStatusChange(task.id, "completed")}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Mark Complete
                </Button>
              )}

              {isAssignedToMe && task.status === "completed" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleTaskStatusChange(task.id, "pending")}
                >
                  <Clock className="w-4 h-4 mr-1" />
                  Reopen
                </Button>
              )}

              <Link to={`/chat/${task.caseId}`}>
                <Button size="sm" variant="outline">
                  <FileText className="w-4 h-4 mr-1" />
                  View Case
                </Button>
              </Link>
            </div>

            <div className="flex space-x-2">
              {isCreatedByMe && (
                <>
                  <Button size="sm" variant="ghost">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
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
          <p className="text-slate-300">Loading tasks...</p>
        </div>
      </div>
    );
  }

  const { assigned, created } = getTasksByAssignment();

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

            {user?.role === "lawyer" && (
              <Dialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-card border-white/10 max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-white">
                      Create New Task
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Assign a task to a client
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateTask} className="space-y-4">
                    <div>
                      <Label htmlFor="title" className="text-white">
                        Task Title
                      </Label>
                      <Input
                        id="title"
                        value={newTask.title}
                        onChange={(e) =>
                          setNewTask((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        placeholder="Enter task title"
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="case" className="text-white">
                        Related Case
                      </Label>
                      <select
                        id="case"
                        value={newTask.caseId}
                        onChange={(e) =>
                          setNewTask((prev) => ({
                            ...prev,
                            caseId: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 rounded-md bg-white/10 border border-white/20 text-white"
                        required
                      >
                        <option value="">Select case</option>
                        {cases.map((caseItem) => (
                          <option key={caseItem.id} value={caseItem.id}>
                            {caseItem.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="dueDate" className="text-white">
                        Due Date
                      </Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) =>
                          setNewTask((prev) => ({
                            ...prev,
                            dueDate: e.target.value,
                          }))
                        }
                        className="bg-white/10 border-white/20 text-white"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-white">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        value={newTask.description}
                        onChange={(e) =>
                          setNewTask((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Enter task description"
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
                        Create Task
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Tasks</h1>
          <p className="text-gray-400">
            Manage and track your legal tasks and assignments
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
                    placeholder="Search tasks..."
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
                    All Tasks
                  </option>
                  <option value="pending" className="text-black">
                    Pending
                  </option>
                  <option value="completed" className="text-black">
                    Completed
                  </option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Task Tabs */}
        <Tabs defaultValue="assigned" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/5 mb-8">
            <TabsTrigger
              value="assigned"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Assigned to Me ({assigned.length})
            </TabsTrigger>
            {user?.role === "lawyer" && (
              <TabsTrigger
                value="created"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Created by Me ({created.length})
              </TabsTrigger>
            )}
            <TabsTrigger
              value="pending"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Pending ({getPendingTasks().length})
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Completed ({getCompletedTasks().length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assigned" className="space-y-6">
            {assigned.length > 0 ? (
              <div className="space-y-4">{assigned.map(renderTaskCard)}</div>
            ) : (
              <Card className="glass-card border-white/10">
                <CardContent className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No Tasks Assigned
                  </h3>
                  <p className="text-gray-400">
                    No tasks have been assigned to you yet
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {user?.role === "lawyer" && (
            <TabsContent value="created" className="space-y-6">
              {created.length > 0 ? (
                <div className="space-y-4">{created.map(renderTaskCard)}</div>
              ) : (
                <Card className="glass-card border-white/10">
                  <CardContent className="text-center py-12">
                    <Plus className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      No Tasks Created
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Create your first task for a client
                    </p>
                    <Button
                      onClick={() => setIsCreateDialogOpen(true)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Task
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          )}

          <TabsContent value="pending" className="space-y-6">
            {getPendingTasks().length > 0 ? (
              <div className="space-y-4">
                {getPendingTasks().map(renderTaskCard)}
              </div>
            ) : (
              <Card className="glass-card border-white/10">
                <CardContent className="text-center py-12">
                  <Clock className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No Pending Tasks
                  </h3>
                  <p className="text-gray-400">All tasks have been completed</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            {getCompletedTasks().length > 0 ? (
              <div className="space-y-4">
                {getCompletedTasks().map(renderTaskCard)}
              </div>
            ) : (
              <Card className="glass-card border-white/10">
                <CardContent className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No Completed Tasks
                  </h3>
                  <p className="text-gray-400">
                    Completed tasks will appear here
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
              <div className="text-2xl font-bold text-yellow-400 mb-2">
                {getPendingTasks().length}
              </div>
              <div className="text-sm text-gray-400">Pending Tasks</div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-400 mb-2">
                {getCompletedTasks().length}
              </div>
              <div className="text-sm text-gray-400">Completed Tasks</div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-red-400 mb-2">
                {getOverdueTasks().length}
              </div>
              <div className="text-sm text-gray-400">Overdue Tasks</div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-400 mb-2">
                {assigned.length}
              </div>
              <div className="text-sm text-gray-400">Assigned to You</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
