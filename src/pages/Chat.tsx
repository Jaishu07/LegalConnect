import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  Paperclip,
  ArrowLeft,
  Scale,
  Users,
  MessageSquare,
  FileText,
  Download,
  Clock,
  Check,
  CheckCheck,
} from "lucide-react";
import {
  authService,
  dataService,
  type User,
  type ChatMessage,
  type Case,
  type Document,
} from "@/lib/auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const Chat = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setUser(currentUser);
    loadUserCases(currentUser);
  }, [navigate]);

  useEffect(() => {
    if (caseId && cases.length > 0) {
      const foundCase = cases.find((c) => c.id === caseId);
      if (foundCase) {
        setSelectedCase(foundCase);
        loadMessages(caseId);
      }
    } else if (cases.length > 0 && !caseId) {
      // Auto-select first case if no case is specified
      const firstCase = cases[0];
      setSelectedCase(firstCase);
      loadMessages(firstCase.id);
      navigate(`/chat/${firstCase.id}`, { replace: true });
    }
  }, [caseId, cases, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadUserCases = (currentUser: User) => {
    try {
      const userCases = dataService.getCases(currentUser.id, currentUser.role);
      setCases(userCases);
    } catch (error) {
      toast.error("Failed to load cases");
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = (currentCaseId: string) => {
    try {
      const caseMessages = dataService.getMessages(currentCaseId);
      setMessages(caseMessages);

      // Mark messages as read
      caseMessages.forEach((msg) => {
        if (!msg.isRead && msg.senderId !== user?.id) {
          // In a real app, you'd update the message read status here
        }
      });
    } catch (error) {
      toast.error("Failed to load messages");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !selectedCase || !user) return;

    const message = dataService.sendMessage({
      caseId: selectedCase.id,
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role,
      message: newMessage.trim(),
      isRead: false,
    });

    setMessages((prev) => [...prev, message]);
    setNewMessage("");

    // Simulate other party typing (in real app, this would be via WebSocket)
    if (user.role === "client") {
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const autoReply = dataService.sendMessage({
            caseId: selectedCase.id,
            senderId: "2", // lawyer
            senderName: selectedCase.lawyerName,
            senderRole: "lawyer",
            message:
              "Thank you for your message. I'll review this and get back to you soon.",
            isRead: false,
          });
          setMessages((prev) => [...prev, autoReply]);
        }, 2000);
      }, 1000);
    }

    toast.success("Message sent");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedCase || !user) return;

    // Simulate file upload
    const mockDocument: Document = {
      id: `doc_${Date.now()}`,
      caseId: selectedCase.id,
      name: file.name,
      type: file.type,
      size: file.size,
      uploadedBy: user.id,
      uploadedAt: new Date().toISOString(),
      url: URL.createObjectURL(file),
      folder: "Chat Attachments",
    };

    const message = dataService.sendMessage({
      caseId: selectedCase.id,
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role,
      message: `Shared a file: ${file.name}`,
      isRead: false,
      attachments: [mockDocument],
    });

    setMessages((prev) => [...prev, message]);
    toast.success("File uploaded and shared");

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();

    if (isToday) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const getOtherPartyInfo = () => {
    if (!selectedCase || !user) return null;

    return user.role === "client"
      ? { name: selectedCase.lawyerName, role: "lawyer" }
      : { name: selectedCase.clientName, role: "client" };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading chat...</p>
        </div>
      </div>
    );
  }

  const otherParty = getOtherPartyInfo();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
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

            {selectedCase && otherParty && (
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-600 text-white text-sm">
                    {otherParty.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-white">
                    {otherParty.name}
                  </p>
                  <p className="text-xs text-gray-400 capitalize">
                    {otherParty.role}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex w-full pt-20">
        {/* Sidebar - Cases List */}
        <div className="w-80 border-r border-white/10 bg-black/20 flex flex-col">
          <div className="p-4 border-b border-white/10">
            <h2 className="font-semibold text-white mb-2">Cases</h2>
            <p className="text-sm text-gray-400">
              Select a case to start messaging
            </p>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2">
              {cases.length > 0 ? (
                cases.map((caseItem) => {
                  const caseMessages = dataService.getMessages(caseItem.id);
                  const lastMessage = caseMessages[caseMessages.length - 1];
                  const unreadCount = caseMessages.filter(
                    (msg) => !msg.isRead && msg.senderId !== user?.id,
                  ).length;

                  return (
                    <Link
                      key={caseItem.id}
                      to={`/chat/${caseItem.id}`}
                      className={cn(
                        "block p-3 rounded-lg mb-2 transition-colors",
                        selectedCase?.id === caseItem.id
                          ? "bg-blue-600/20 border border-blue-500/30"
                          : "hover:bg-white/5",
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-white text-sm truncate">
                            {caseItem.title}
                          </h3>
                          <p className="text-xs text-gray-400 mb-1">
                            {user?.role === "client"
                              ? caseItem.lawyerName
                              : caseItem.clientName}
                          </p>
                          {lastMessage && (
                            <p className="text-xs text-gray-500 truncate">
                              {lastMessage.message}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          {lastMessage && (
                            <span className="text-xs text-gray-500">
                              {formatMessageTime(lastMessage.timestamp)}
                            </span>
                          )}
                          {unreadCount > 0 && (
                            <Badge className="bg-blue-600 text-white text-xs h-4 min-w-[16px] p-1">
                              {unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No cases available</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedCase ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-white/10 bg-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-lg font-semibold text-white">
                      {selectedCase.title}
                    </h1>
                    <p className="text-sm text-gray-400">
                      {selectedCase.type} - {selectedCase.status}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link to={`/documents/${selectedCase.id}`}>
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        Documents
                      </Button>
                    </Link>
                    <Badge
                      className={cn(
                        selectedCase.priority === "high"
                          ? "bg-red-500/20 text-red-400 border-red-500/30"
                          : selectedCase.priority === "medium"
                            ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                            : "bg-green-500/20 text-green-400 border-green-500/30",
                      )}
                    >
                      {selectedCase.priority} priority
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.length > 0 ? (
                    messages.map((message) => {
                      const isOwn = message.senderId === user?.id;

                      return (
                        <div
                          key={message.id}
                          className={cn(
                            "flex items-start space-x-3",
                            isOwn ? "flex-row-reverse space-x-reverse" : "",
                          )}
                        >
                          <Avatar className="w-8 h-8">
                            <AvatarFallback
                              className={cn(
                                "text-white text-sm",
                                isOwn
                                  ? "bg-gradient-to-br from-blue-500 to-purple-600"
                                  : "bg-gradient-to-br from-green-500 to-blue-600",
                              )}
                            >
                              {message.senderName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>

                          <div
                            className={cn(
                              "flex-1 max-w-md",
                              isOwn ? "text-right" : "",
                            )}
                          >
                            <div
                              className={cn(
                                "inline-block p-3 rounded-lg",
                                isOwn
                                  ? "bg-blue-600 text-white"
                                  : "bg-white/10 text-gray-100",
                              )}
                            >
                              <p className="text-sm">{message.message}</p>

                              {message.attachments &&
                                message.attachments.length > 0 && (
                                  <div className="mt-2 space-y-2">
                                    {message.attachments.map((doc) => (
                                      <div
                                        key={doc.id}
                                        className="flex items-center space-x-2 p-2 bg-black/20 rounded border"
                                      >
                                        <FileText className="w-4 h-4" />
                                        <span className="text-xs truncate flex-1">
                                          {doc.name}
                                        </span>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="h-6 w-6 p-0"
                                          asChild
                                        >
                                          <a
                                            href={doc.url}
                                            download={doc.name}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            <Download className="w-3 h-3" />
                                          </a>
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                            </div>

                            <div
                              className={cn(
                                "flex items-center mt-1 text-xs text-gray-500",
                                isOwn ? "justify-end" : "",
                              )}
                            >
                              <span>
                                {formatMessageTime(message.timestamp)}
                              </span>
                              {isOwn && (
                                <div className="ml-2">
                                  {message.isRead ? (
                                    <CheckCheck className="w-3 h-3 text-blue-400" />
                                  ) : (
                                    <Check className="w-3 h-3" />
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquare className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">No messages yet</p>
                      <p className="text-sm text-gray-500">
                        Start the conversation by sending a message below
                      </p>
                    </div>
                  )}

                  {isTyping && (
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-600 text-white text-sm">
                          {otherParty?.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-white/10 text-gray-100 p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-100"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-200"></div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t border-white/10 bg-white/5">
                <form
                  onSubmit={handleSendMessage}
                  className="flex items-end space-x-2"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  />

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-shrink-0"
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>

                  <div className="flex-1">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 resize-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="flex-shrink-0 bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">
                  Select a Case
                </h2>
                <p className="text-gray-400">
                  Choose a case from the sidebar to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
