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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Scale, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { authService, type User, type SignupData } from "@/lib/auth";
import { specialties } from "@/lib/data";
import { toast } from "sonner";

interface SignupProps {
  onSignup: (user: User) => void;
}

const Signup = ({ onSignup }: SignupProps) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SignupData>({
    name: "",
    email: "",
    password: "",
    role: "client",
    phone: "",
    specialty: "",
    experience: 0,
    fees: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = authService.signup(formData);

      if (result.success && result.user) {
        onSignup(result.user);
        toast.success("Account created successfully!", {
          description: `Welcome to LegalConnect, ${result.user.name}!`,
        });

        // Navigate to appropriate dashboard
        const redirectPath =
          result.user.role === "client"
            ? "/client-dashboard"
            : "/lawyer-dashboard";
        navigate(redirectPath);
      } else {
        toast.error("Signup failed", {
          description: result.error || "Please try again",
        });
      }
    } catch (error) {
      toast.error("Signup failed", {
        description: "An unexpected error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "experience" ? parseInt(value) || 0 : value,
    }));
  };

  const handleRoleChange = (role: "client" | "lawyer") => {
    setFormData((prev) => ({
      ...prev,
      role,
      // Clear lawyer-specific fields when switching to client
      ...(role === "client" && {
        specialty: "",
        experience: 0,
        fees: "",
      }),
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

          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-400">
            Join our platform to connect with legal professionals
          </p>
        </div>

        {/* Signup Form */}
        <Card className="glass-card border-white/10">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-white">
              Sign Up
            </CardTitle>
            <CardDescription className="text-center text-gray-400">
              Choose your account type and fill in your details
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

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Common Fields */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>

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
                    <Label htmlFor="phone" className="text-white">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleInputChange}
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
                        placeholder="Create a password"
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
                </div>

                {/* Lawyer-specific Fields */}
                <TabsContent value="lawyer" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="specialty" className="text-white">
                      Legal Specialty
                    </Label>
                    <Select
                      value={formData.specialty}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, specialty: value }))
                      }
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select your specialty" />
                      </SelectTrigger>
                      <SelectContent>
                        {specialties.map((specialty) => (
                          <SelectItem key={specialty} value={specialty}>
                            {specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="experience" className="text-white">
                        Years of Experience
                      </Label>
                      <Input
                        id="experience"
                        name="experience"
                        type="number"
                        placeholder="0"
                        value={formData.experience}
                        onChange={handleInputChange}
                        min="0"
                        max="50"
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fees" className="text-white">
                        Hourly Rate
                      </Label>
                      <Input
                        id="fees"
                        name="fees"
                        type="text"
                        placeholder="$300/hour"
                        value={formData.fees}
                        onChange={handleInputChange}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                </TabsContent>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-400 hover:text-blue-300 font-medium"
                >
                  Sign in here
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

export default Signup;
