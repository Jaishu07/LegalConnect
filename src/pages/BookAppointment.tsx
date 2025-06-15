import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
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
import {
  Calendar,
  Clock,
  Video,
  Star,
  MapPin,
  Award,
  ArrowLeft,
  Scale,
  User,
  DollarSign,
  CheckCircle,
} from "lucide-react";
import { lawyers, type Lawyer } from "@/lib/data";
import { authService, dataService } from "@/lib/auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const BookAppointment = () => {
  const { lawyerId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [lawyer, setLawyer] = useState<Lawyer | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [appointmentData, setAppointmentData] = useState({
    caseType: "",
    duration: 60,
    notes: "",
    meetingType: "video" as "video" | "phone" | "in-person",
  });
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user || user.role !== "client") {
      toast.error("Please login as a client to book appointments");
      navigate("/login");
      return;
    }

    const foundLawyer = lawyers.find((l) => l.id === lawyerId);
    if (foundLawyer) {
      setLawyer(foundLawyer);
    }

    // Pre-populate from navigation state if available
    if (location.state?.date) {
      setSelectedDate(location.state.date);
    }
    if (location.state?.time) {
      setSelectedTime(location.state.time);
    }

    setLoading(false);
  }, [lawyerId, location.state, navigate]);

  const getNextAvailableDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      // Skip weekends for demonstration
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date.toISOString().split("T")[0]);
      }
    }

    return dates;
  };

  const getAvailableTimeSlots = () => {
    return ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setBooking(true);

    try {
      const user = authService.getCurrentUser();
      if (!user || !lawyer) {
        throw new Error("User or lawyer not found");
      }

      if (!selectedDate || !selectedTime) {
        throw new Error("Please select a date and time");
      }

      if (!appointmentData.caseType) {
        throw new Error("Please specify the case type");
      }

      const appointment = dataService.createAppointment({
        clientId: user.id,
        lawyerId: lawyer.id,
        clientName: user.name,
        lawyerName: lawyer.name,
        date: selectedDate,
        time: selectedTime,
        duration: appointmentData.duration,
        status: "pending",
        notes: appointmentData.notes,
        caseType: appointmentData.caseType,
      });

      toast.success("Appointment request sent successfully!", {
        description: "The lawyer will review and confirm your appointment.",
      });

      // Navigate to client dashboard
      navigate("/client-dashboard");
    } catch (error) {
      toast.error("Failed to book appointment", {
        description:
          error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setBooking(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setAppointmentData((prev) => ({
      ...prev,
      [name]: name === "duration" ? parseInt(value) || 60 : value,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading booking form...</p>
        </div>
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Lawyer Not Found
          </h2>
          <p className="text-gray-400 mb-6">
            The lawyer you're trying to book is not available.
          </p>
          <Button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Find Another Lawyer
          </Button>
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
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="text-gray-300 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
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
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lawyer Info Sidebar */}
          <div className="lg:col-span-1">
            <Card className="glass-card border-white/10 sticky top-24">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <Avatar className="w-20 h-20 mx-auto mb-4 border-4 border-white/20">
                    <AvatarImage src={lawyer.photo} alt={lawyer.name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg">
                      {lawyer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <h2 className="text-xl font-bold text-white mb-2">
                    {lawyer.name}
                  </h2>
                  <p className="text-blue-400 font-medium">
                    {lawyer.specialty}
                  </p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-gray-400">Rating</span>
                    </div>
                    <span className="text-white font-semibold">
                      {lawyer.rating}/5
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-400">Experience</span>
                    </div>
                    <span className="text-white font-semibold">
                      {lawyer.experience} years
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-green-400" />
                      <span className="text-gray-400">Location</span>
                    </div>
                    <span className="text-white font-semibold text-right">
                      {lawyer.location}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-green-400" />
                      <span className="text-gray-400">Rate</span>
                    </div>
                    <span className="text-white font-semibold">
                      {lawyer.fees}
                    </span>
                  </div>
                </div>

                <Separator className="my-4 bg-white/10" />

                <div>
                  <h3 className="text-sm font-semibold text-white mb-2">Bio</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {lawyer.bio}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-2xl">
                  Book Appointment
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Schedule a consultation with {lawyer.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBooking} className="space-y-6">
                  {/* Date Selection */}
                  <div>
                    <Label className="text-white text-lg mb-4 block">
                      Select Date
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {getNextAvailableDates()
                        .slice(0, 8)
                        .map((date) => (
                          <Button
                            key={date}
                            type="button"
                            variant={
                              selectedDate === date ? "default" : "outline"
                            }
                            className={cn(
                              "h-16 flex flex-col",
                              selectedDate === date
                                ? "bg-blue-600 hover:bg-blue-700"
                                : "bg-white/5 border-white/20 hover:bg-white/10",
                            )}
                            onClick={() => setSelectedDate(date)}
                          >
                            <span className="text-sm font-medium">
                              {new Date(date).toLocaleDateString("en-US", {
                                weekday: "short",
                              })}
                            </span>
                            <span className="text-xs">
                              {new Date(date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </Button>
                        ))}
                    </div>
                  </div>

                  {/* Time Selection */}
                  {selectedDate && (
                    <div>
                      <Label className="text-white text-lg mb-4 block">
                        Select Time
                      </Label>
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                        {getAvailableTimeSlots().map((time) => (
                          <Button
                            key={time}
                            type="button"
                            variant={
                              selectedTime === time ? "default" : "outline"
                            }
                            className={cn(
                              "h-12",
                              selectedTime === time
                                ? "bg-blue-600 hover:bg-blue-700"
                                : "bg-white/5 border-white/20 hover:bg-white/10",
                            )}
                            onClick={() => setSelectedTime(time)}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator className="bg-white/10" />

                  {/* Appointment Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">
                      Appointment Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="caseType" className="text-white">
                          Case Type *
                        </Label>
                        <select
                          id="caseType"
                          name="caseType"
                          value={appointmentData.caseType}
                          onChange={(e) =>
                            setAppointmentData((prev) => ({
                              ...prev,
                              caseType: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 mt-2 rounded-md bg-white/10 border border-white/20 text-white"
                          required
                        >
                          <option value="">Select case type</option>
                          <option value="Criminal Law">Criminal Law</option>
                          <option value="Civil Law">Civil Law</option>
                          <option value="Family Law">Family Law</option>
                          <option value="Corporate Law">Corporate Law</option>
                          <option value="Immigration Law">
                            Immigration Law
                          </option>
                          <option value="Real Estate Law">
                            Real Estate Law
                          </option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="duration" className="text-white">
                          Duration (minutes)
                        </Label>
                        <select
                          id="duration"
                          name="duration"
                          value={appointmentData.duration}
                          onChange={(e) =>
                            setAppointmentData((prev) => ({
                              ...prev,
                              duration: parseInt(e.target.value),
                            }))
                          }
                          className="w-full px-3 py-2 mt-2 rounded-md bg-white/10 border border-white/20 text-white"
                        >
                          <option value={30}>30 minutes</option>
                          <option value={60}>60 minutes</option>
                          <option value={90}>90 minutes</option>
                          <option value={120}>120 minutes</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="meetingType" className="text-white">
                        Meeting Type
                      </Label>
                      <div className="grid grid-cols-3 gap-3 mt-2">
                        {[
                          { value: "video", label: "Video Call", icon: Video },
                          { value: "phone", label: "Phone Call", icon: Clock },
                          {
                            value: "in-person",
                            label: "In Person",
                            icon: MapPin,
                          },
                        ].map(({ value, label, icon: Icon }) => (
                          <Button
                            key={value}
                            type="button"
                            variant={
                              appointmentData.meetingType === value
                                ? "default"
                                : "outline"
                            }
                            className={cn(
                              "h-16 flex flex-col",
                              appointmentData.meetingType === value
                                ? "bg-blue-600 hover:bg-blue-700"
                                : "bg-white/5 border-white/20 hover:bg-white/10",
                            )}
                            onClick={() =>
                              setAppointmentData((prev) => ({
                                ...prev,
                                meetingType: value as
                                  | "video"
                                  | "phone"
                                  | "in-person",
                              }))
                            }
                          >
                            <Icon className="w-5 h-5 mb-1" />
                            <span className="text-xs">{label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="notes" className="text-white">
                        Additional Notes (Optional)
                      </Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        value={appointmentData.notes}
                        onChange={handleInputChange}
                        placeholder="Describe your legal issue or any specific requirements..."
                        className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        rows={4}
                      />
                    </div>
                  </div>

                  {/* Summary */}
                  {selectedDate && selectedTime && (
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <h3 className="text-lg font-semibold text-white mb-3">
                        Appointment Summary
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Lawyer:</span>
                          <span className="text-white">{lawyer.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Date:</span>
                          <span className="text-white">
                            {new Date(selectedDate).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Time:</span>
                          <span className="text-white">{selectedTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Duration:</span>
                          <span className="text-white">
                            {appointmentData.duration} minutes
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Fee:</span>
                          <span className="text-white">{lawyer.fees}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => navigate(-1)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={
                        !selectedDate ||
                        !selectedTime ||
                        !appointmentData.caseType ||
                        booking
                      }
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {booking ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Booking...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Book Appointment
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
