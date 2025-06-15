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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Save,
  ArrowLeft,
  Scale,
  Camera,
  Bell,
  Shield,
  Eye,
  Lock,
  Star,
  Award,
  DollarSign,
  Briefcase,
} from "lucide-react";
import { authService, type User as UserType } from "@/lib/auth";
import { specialties } from "@/lib/data";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
    specialty: "",
    experience: 0,
    fees: "",
  });
  const [notifications, setNotifications] = useState({
    emailAppointments: true,
    emailMessages: true,
    emailTasks: true,
    pushNotifications: true,
    smsReminders: false,
  });
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showContact: true,
    showRating: true,
    allowDirectMessages: true,
  });

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setUser(currentUser);
    setProfileData({
      name: currentUser.name,
      email: currentUser.email,
      phone: currentUser.phone || "",
      address: currentUser.address || "",
      bio: currentUser.bio || "",
      specialty: currentUser.specialty || "",
      experience: currentUser.experience || 0,
      fees: currentUser.fees || "",
    });
    setLoading(false);
  }, [navigate]);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // In a real app, you'd make an API call here
      const updatedUser = { ...user, ...profileData } as UserType;
      localStorage.setItem("legal_platform_user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationUpdate = (key: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
    toast.success("Notification preferences updated");
  };

  const handlePrivacyUpdate = (key: string, value: boolean) => {
    setPrivacy((prev) => ({ ...prev, [key]: value }));
    toast.success("Privacy settings updated");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: name === "experience" ? parseInt(value) || 0 : value,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading profile...</p>
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

            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-gray-400" />
              <span className="text-white font-medium">{user?.name}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-400">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="glass-card border-white/10">
              <CardContent className="p-6 text-center">
                <div className="relative mb-4">
                  <Avatar className="w-24 h-24 mx-auto border-4 border-white/20">
                    <AvatarImage src={user?.photo} alt={user?.name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl">
                      {user?.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2 w-8 h-8 rounded-full p-0"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>

                <h3 className="text-lg font-semibold text-white mb-1">
                  {user?.name}
                </h3>
                <p className="text-blue-400 text-sm mb-4 capitalize">
                  {user?.role}
                </p>

                {user?.role === "lawyer" && (
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Specialty:</span>
                      <span className="text-white">{user.specialty}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Experience:</span>
                      <span className="text-white">{user.experience}y</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Rating:</span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="text-white">{user.rating}</span>
                      </div>
                    </div>
                  </div>
                )}

                <Separator className="my-4 bg-white/10" />

                <div className="text-xs text-gray-400">
                  <p>Member since</p>
                  <p className="text-white">
                    {new Date(user?.createdAt || "").toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white/5 mb-8">
                <TabsTrigger
                  value="profile"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  Profile
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  Notifications
                </TabsTrigger>
                <TabsTrigger
                  value="privacy"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  Privacy & Security
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Personal Information
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Update your personal details and contact information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name" className="text-white">
                            Full Name
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            value={profileData.name}
                            onChange={handleInputChange}
                            className="bg-white/10 border-white/20 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-white">
                            Email
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={profileData.email}
                            onChange={handleInputChange}
                            className="bg-white/10 border-white/20 text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone" className="text-white">
                            Phone Number
                          </Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={profileData.phone}
                            onChange={handleInputChange}
                            className="bg-white/10 border-white/20 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="address" className="text-white">
                            Address
                          </Label>
                          <Input
                            id="address"
                            name="address"
                            value={profileData.address}
                            onChange={handleInputChange}
                            className="bg-white/10 border-white/20 text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="bio" className="text-white">
                          Bio
                        </Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          value={profileData.bio}
                          onChange={handleInputChange}
                          rows={3}
                          className="bg-white/10 border-white/20 text-white"
                          placeholder="Tell us about yourself..."
                        />
                      </div>

                      {user?.role === "lawyer" && (
                        <>
                          <Separator className="bg-white/10" />
                          <h3 className="text-lg font-semibold text-white">
                            Professional Details
                          </h3>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Label htmlFor="specialty" className="text-white">
                                Specialty
                              </Label>
                              <Select
                                value={profileData.specialty}
                                onValueChange={(value) =>
                                  setProfileData((prev) => ({
                                    ...prev,
                                    specialty: value,
                                  }))
                                }
                              >
                                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                  <SelectValue placeholder="Select specialty" />
                                </SelectTrigger>
                                <SelectContent>
                                  {specialties.map((specialty) => (
                                    <SelectItem
                                      key={specialty}
                                      value={specialty}
                                    >
                                      {specialty}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label
                                htmlFor="experience"
                                className="text-white"
                              >
                                Years of Experience
                              </Label>
                              <Input
                                id="experience"
                                name="experience"
                                type="number"
                                value={profileData.experience}
                                onChange={handleInputChange}
                                className="bg-white/10 border-white/20 text-white"
                                min="0"
                                max="50"
                              />
                            </div>
                            <div>
                              <Label htmlFor="fees" className="text-white">
                                Hourly Rate
                              </Label>
                              <Input
                                id="fees"
                                name="fees"
                                value={profileData.fees}
                                onChange={handleInputChange}
                                className="bg-white/10 border-white/20 text-white"
                                placeholder="$300/hour"
                              />
                            </div>
                          </div>
                        </>
                      )}

                      <div className="flex justify-end pt-4">
                        <Button
                          type="submit"
                          disabled={saving}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          {saving ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6">
                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Notification Preferences
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Choose how you want to be notified about updates
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-white">
                            Email Notifications
                          </Label>
                          <p className="text-sm text-gray-400">
                            Receive notifications via email
                          </p>
                        </div>
                      </div>

                      <div className="pl-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-white">Appointments</Label>
                            <p className="text-sm text-gray-400">
                              New appointment requests and confirmations
                            </p>
                          </div>
                          <Switch
                            checked={notifications.emailAppointments}
                            onCheckedChange={(checked) =>
                              handleNotificationUpdate(
                                "emailAppointments",
                                checked,
                              )
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-white">Messages</Label>
                            <p className="text-sm text-gray-400">
                              New messages from clients or lawyers
                            </p>
                          </div>
                          <Switch
                            checked={notifications.emailMessages}
                            onCheckedChange={(checked) =>
                              handleNotificationUpdate("emailMessages", checked)
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-white">Tasks</Label>
                            <p className="text-sm text-gray-400">
                              Task assignments and updates
                            </p>
                          </div>
                          <Switch
                            checked={notifications.emailTasks}
                            onCheckedChange={(checked) =>
                              handleNotificationUpdate("emailTasks", checked)
                            }
                          />
                        </div>
                      </div>

                      <Separator className="bg-white/10" />

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-white">
                            Push Notifications
                          </Label>
                          <p className="text-sm text-gray-400">
                            Instant notifications in your browser
                          </p>
                        </div>
                        <Switch
                          checked={notifications.pushNotifications}
                          onCheckedChange={(checked) =>
                            handleNotificationUpdate(
                              "pushNotifications",
                              checked,
                            )
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-white">SMS Reminders</Label>
                          <p className="text-sm text-gray-400">
                            Text message reminders for appointments
                          </p>
                        </div>
                        <Switch
                          checked={notifications.smsReminders}
                          onCheckedChange={(checked) =>
                            handleNotificationUpdate("smsReminders", checked)
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Privacy Tab */}
              <TabsContent value="privacy" className="space-y-6">
                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Privacy Settings
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Control your profile visibility and data sharing
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-white">
                            Profile Visibility
                          </Label>
                          <p className="text-sm text-gray-400">
                            Make your profile visible to other users
                          </p>
                        </div>
                        <Switch
                          checked={privacy.profileVisible}
                          onCheckedChange={(checked) =>
                            handlePrivacyUpdate("profileVisible", checked)
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-white">
                            Show Contact Info
                          </Label>
                          <p className="text-sm text-gray-400">
                            Display phone and email in your public profile
                          </p>
                        </div>
                        <Switch
                          checked={privacy.showContact}
                          onCheckedChange={(checked) =>
                            handlePrivacyUpdate("showContact", checked)
                          }
                        />
                      </div>

                      {user?.role === "lawyer" && (
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-white">Show Rating</Label>
                            <p className="text-sm text-gray-400">
                              Display your rating and reviews publicly
                            </p>
                          </div>
                          <Switch
                            checked={privacy.showRating}
                            onCheckedChange={(checked) =>
                              handlePrivacyUpdate("showRating", checked)
                            }
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-white">
                            Allow Direct Messages
                          </Label>
                          <p className="text-sm text-gray-400">
                            Let other users send you direct messages
                          </p>
                        </div>
                        <Switch
                          checked={privacy.allowDirectMessages}
                          onCheckedChange={(checked) =>
                            handlePrivacyUpdate("allowDirectMessages", checked)
                          }
                        />
                      </div>
                    </div>

                    <Separator className="bg-white/10" />

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">
                        Account Security
                      </h3>

                      <div className="space-y-3">
                        <Button
                          variant="outline"
                          className="w-full justify-start glass-button border-white/20"
                        >
                          <Lock className="w-4 h-4 mr-2" />
                          Change Password
                        </Button>

                        <Button
                          variant="outline"
                          className="w-full justify-start glass-button border-white/20"
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          Two-Factor Authentication
                        </Button>

                        <Button
                          variant="outline"
                          className="w-full justify-start glass-button border-white/20"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Download My Data
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
