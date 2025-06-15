import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scale, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { authService, type User, type LoginCredentials } from "@/lib/auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<LoginCredentials>({
    email: "",
    password: "",
    role: "client",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = authService.login(formData);

      if (result.success && result.user) {
        onLogin(result.user);
        toast.success("Login successful!", {
          description: `Welcome back, ${result.user.name}!`,
        });

        // Navigate to appropriate dashboard
        const redirectPath =
          result.user.role === "client"
            ? "/client-dashboard"
            : "/lawyer-dashboard";
        navigate(redirectPath);
      } else {
        toast.error("Login failed", {
          description: result.error || "Please check your credentials",
        });
      }
    } catch (error) {
      toast.error("Login failed", {
        description: "An unexpected error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRoleChange = (role: "client" | "lawyer") => {
    setFormData((prev) => ({
      ...prev,
      role,
      // Set demo credentials based on role
      email: role === "client" ? "client@demo.com" : "lawyer@demo.com",
      password: "demo123",
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full floating-animation"></div>
        <div
          className="absolute top-40 right-20 w-32 h-32 bg-purple-500/10 rounded-full floating-animation"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/4 w-16 h-16 bg-green-500/10 rounded-full floating-animation"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-gray-300 hover:text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">
              LegalConnect
            </span>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to your account to continue</p>
        </div>

        {/* Login Form */}
        <Card className="glass-card border-white/10">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-white">
              Sign In
            </CardTitle>
            <CardDescription className="text-center text-gray-400">
              Choose your account type and enter your credentials
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs
              value={formData.role}
              onValueChange={(value) =>
                handleRoleChange(value as "client" | "lawyer")
              }
            >
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/5">
                <TabsTrigger
                  value="client"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  Client
                </TabsTrigger>
                <TabsTrigger
                  value="lawyer"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  Lawyer
                </TabsTrigger>
              </TabsList>

              <TabsContent value="client" className="space-y-4 mt-0">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
                  <p className="text-sm text-blue-300">
                    <strong>Demo Client Account:</strong>
                    <br />
                    Email: client@demo.com
                    <br />
                    Password: demo123
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="lawyer" className="space-y-4 mt-0">
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 mb-4">
                  <p className="text-sm text-purple-300">
                    <strong>Demo Lawyer Account:</strong>
                    <br />
                    Email: lawyer@demo.com
                    <br />
                    Password: demo123
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-blue-400 hover:text-blue-300 font-medium"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2024 LegalConnect. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
