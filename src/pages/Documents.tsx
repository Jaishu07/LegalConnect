import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
  FileText,
  Upload,
  Download,
  Search,
  ArrowLeft,
  Scale,
  Plus,
  Folder,
  File,
  Image,
  FileX,
  Trash2,
  Eye,
  Share,
  MoreVertical,
} from "lucide-react";
import {
  authService,
  dataService,
  type User,
  type Case,
  type Document,
} from "@/lib/auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const Documents = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [cases, setCases] = useState<Case[]>([]);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const documentFolders = [
    { id: "all", name: "All Documents", icon: FileText },
    { id: "evidence", name: "Evidence", icon: FileText },
    { id: "contracts", name: "Contracts", icon: File },
    { id: "correspondence", name: "Correspondence", icon: FileText },
    { id: "court-filings", name: "Court Filings", icon: Scale },
    { id: "legal-research", name: "Legal Research", icon: FileText },
    { id: "client-documents", name: "Client Documents", icon: Folder },
  ];

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
        loadCaseDocuments(caseId);
      }
    } else if (cases.length > 0 && !caseId) {
      // Auto-select first case if no case is specified
      const firstCase = cases[0];
      setSelectedCase(firstCase);
      loadCaseDocuments(firstCase.id);
      navigate(`/documents/${firstCase.id}`, { replace: true });
    }
  }, [caseId, cases, navigate]);

  useEffect(() => {
    filterDocuments();
  }, [documents, searchQuery, selectedFolder]);

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

  const loadCaseDocuments = (currentCaseId: string) => {
    // Mock documents for demonstration
    const mockDocuments: Document[] = [
      {
        id: "doc_1",
        caseId: currentCaseId,
        name: "Case_Summary.pdf",
        type: "application/pdf",
        size: 1024000,
        uploadedBy: user?.id || "1",
        uploadedAt: new Date(Date.now() - 86400000).toISOString(),
        url: "/mock/documents/case_summary.pdf",
        folder: "court-filings",
      },
      {
        id: "doc_2",
        caseId: currentCaseId,
        name: "Evidence_Photos.zip",
        type: "application/zip",
        size: 5120000,
        uploadedBy: user?.id || "1",
        uploadedAt: new Date(Date.now() - 172800000).toISOString(),
        url: "/mock/documents/evidence_photos.zip",
        folder: "evidence",
      },
      {
        id: "doc_3",
        caseId: currentCaseId,
        name: "Client_Statement.docx",
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        size: 256000,
        uploadedBy: user?.id || "1",
        uploadedAt: new Date(Date.now() - 259200000).toISOString(),
        url: "/mock/documents/client_statement.docx",
        folder: "client-documents",
      },
      {
        id: "doc_4",
        caseId: currentCaseId,
        name: "Legal_Precedent_Research.pdf",
        type: "application/pdf",
        size: 2048000,
        uploadedBy: "2", // lawyer
        uploadedAt: new Date(Date.now() - 345600000).toISOString(),
        url: "/mock/documents/legal_research.pdf",
        folder: "legal-research",
      },
      {
        id: "doc_5",
        caseId: currentCaseId,
        name: "Contract_Agreement.pdf",
        type: "application/pdf",
        size: 512000,
        uploadedBy: "2", // lawyer
        uploadedAt: new Date(Date.now() - 432000000).toISOString(),
        url: "/mock/documents/contract.pdf",
        folder: "contracts",
      },
    ];

    setDocuments(mockDocuments);
  };

  const filterDocuments = () => {
    let filtered = documents;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((doc) =>
        doc.name.toLowerCase().includes(query),
      );
    }

    if (selectedFolder !== "all") {
      filtered = filtered.filter((doc) => doc.folder === selectedFolder);
    }

    setFilteredDocuments(filtered);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (!selectedCase || !user) return;

    files.forEach((file) => {
      const mockDocument: Document = {
        id: `doc_${Date.now()}_${Math.random()}`,
        caseId: selectedCase.id,
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedBy: user.id,
        uploadedAt: new Date().toISOString(),
        url: URL.createObjectURL(file),
        folder: "client-documents",
      };

      setDocuments((prev) => [mockDocument, ...prev]);
    });

    toast.success(`${files.length} file(s) uploaded successfully`);
    setIsUploadDialogOpen(false);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDownload = (document: Document) => {
    // In a real app, this would download the actual file
    const link = window.document.createElement("a");
    link.href = document.url;
    link.download = document.name;
    link.click();
    toast.success("Download started");
  };

  const handleDelete = (documentId: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
    toast.success("Document deleted");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes("image")) return <Image className="w-8 h-8" />;
    if (type.includes("pdf")) return <FileText className="w-8 h-8" />;
    if (type.includes("word")) return <FileText className="w-8 h-8" />;
    if (type.includes("zip")) return <Folder className="w-8 h-8" />;
    return <File className="w-8 h-8" />;
  };

  const getDocumentsByFolder = (folderId: string) => {
    if (folderId === "all") return filteredDocuments;
    return filteredDocuments.filter((doc) => doc.folder === folderId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading documents...</p>
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
              open={isUploadDialogOpen}
              onOpenChange={setIsUploadDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Files
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-white/10">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    Upload Documents
                  </DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Add documents to {selectedCase?.title}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="file-upload" className="text-white">
                      Select Files
                    </Label>
                    <input
                      ref={fileInputRef}
                      id="file-upload"
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="w-full px-3 py-2 mt-2 bg-white/10 border border-white/20 rounded-md text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                      accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.zip"
                    />
                  </div>
                  <div className="text-sm text-gray-400">
                    Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG, ZIP
                    <br />
                    Maximum file size: 10MB per file
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar - Cases */}
        <div className="w-80 border-r border-white/10 bg-black/20 flex flex-col">
          <div className="p-4 border-b border-white/10">
            <h2 className="font-semibold text-white mb-2">Cases</h2>
            <p className="text-sm text-gray-400">
              Select a case to view documents
            </p>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-2">
              {cases.length > 0 ? (
                cases.map((caseItem) => (
                  <Link
                    key={caseItem.id}
                    to={`/documents/${caseItem.id}`}
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
                          {caseItem.type}
                        </p>
                        <div className="flex items-center space-x-2">
                          <FileText className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-500">
                            {getDocumentsByFolder("all").length} docs
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No cases available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Document Area */}
        <div className="flex-1 flex flex-col">
          {selectedCase ? (
            <>
              {/* Document Header */}
              <div className="p-4 border-b border-white/10 bg-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-lg font-semibold text-white">
                      {selectedCase.title} - Documents
                    </h1>
                    <p className="text-sm text-gray-400">
                      {filteredDocuments.length} documents
                    </p>
                  </div>

                  {/* Search */}
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search documents..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-64 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-1">
                {/* Folder Sidebar */}
                <div className="w-64 border-r border-white/10 bg-black/10 p-4">
                  <h3 className="text-sm font-semibold text-white mb-3">
                    Folders
                  </h3>
                  <div className="space-y-1">
                    {documentFolders.map((folder) => {
                      const Icon = folder.icon;
                      const count = getDocumentsByFolder(folder.id).length;

                      return (
                        <button
                          key={folder.id}
                          onClick={() => setSelectedFolder(folder.id)}
                          className={cn(
                            "w-full flex items-center justify-between p-2 rounded-lg text-sm transition-colors",
                            selectedFolder === folder.id
                              ? "bg-blue-600/20 text-blue-400"
                              : "text-gray-300 hover:bg-white/5",
                          )}
                        >
                          <div className="flex items-center space-x-2">
                            <Icon className="w-4 h-4" />
                            <span>{folder.name}</span>
                          </div>
                          <Badge
                            variant="secondary"
                            className="text-xs bg-white/10"
                          >
                            {count}
                          </Badge>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Documents Grid */}
                <div className="flex-1 p-6 overflow-y-auto">
                  {filteredDocuments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {filteredDocuments.map((document) => (
                        <Card
                          key={document.id}
                          className="glass-card border-white/10 hover:border-white/20 transition-all duration-300 group"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="text-gray-400">
                                {getFileIcon(document.type)}
                              </div>
                              <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreVertical className="w-4 h-4 text-gray-400" />
                              </button>
                            </div>

                            <h4 className="font-medium text-white text-sm mb-2 truncate">
                              {document.name}
                            </h4>

                            <div className="space-y-1 text-xs text-gray-400 mb-3">
                              <div>{formatFileSize(document.size)}</div>
                              <div>
                                Uploaded{" "}
                                {new Date(
                                  document.uploadedAt,
                                ).toLocaleDateString()}
                              </div>
                              <div>
                                By{" "}
                                {document.uploadedBy === user?.id
                                  ? "You"
                                  : document.uploadedBy === "2"
                                    ? selectedCase.lawyerName
                                    : selectedCase.clientName}
                              </div>
                            </div>

                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 h-8 text-xs"
                                onClick={() => handleDownload(document)}
                              >
                                <Download className="w-3 h-3 mr-1" />
                                Download
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                onClick={() => handleDelete(document.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-center">
                        <FileX className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">
                          No Documents Found
                        </h3>
                        <p className="text-gray-400 mb-6">
                          {searchQuery
                            ? "No documents match your search"
                            : selectedFolder === "all"
                              ? "No documents uploaded yet"
                              : `No documents in ${
                                  documentFolders.find(
                                    (f) => f.id === selectedFolder,
                                  )?.name
                                }`}
                        </p>
                        <Button
                          onClick={() => setIsUploadDialogOpen(true)}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Documents
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">
                  Select a Case
                </h2>
                <p className="text-gray-400">
                  Choose a case from the sidebar to view its documents
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Documents;
