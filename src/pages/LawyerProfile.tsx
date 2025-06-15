import React, { useState, useEffect } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  MapPin,
  Calendar,
  Award,
  Phone,
  Mail,
  ArrowLeft,
  Scale,
  Briefcase,
  Clock,
  DollarSign,
  CheckCircle,
  Users,
  BookOpen,
  MessageSquare,
  Video,
} from "lucide-react";
import { lawyers, testimonials, type Lawyer } from "@/lib/data";
import { authService } from "@/lib/auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const LawyerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lawyer, setLawyer] = useState<Lawyer | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  useEffect(() => {
    const foundLawyer = lawyers.find((l) => l.id === id);
    if (foundLawyer) {
      setLawyer(foundLawyer);
    }
    setLoading(false);
  }, [id]);

  const handleBookAppointment = () => {
    const user = authService.getCurrentUser();
    if (!user) {
      toast.error("Please login to book an appointment");
      navigate("/login");
      return;
    }

    if (user.role !== "client") {
      toast.error("Only clients can book appointments");
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast.error("Please select a date and time");
      return;
    }

    navigate(`/book-appointment/${id}`, {
      state: { date: selectedDate, time: selectedTime },
    });
  };

  const getAvailableTimeSlots = () => {
    return ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];
  };

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

  const getLawyerTestimonials = () => {
    return testimonials.filter((t) => t.lawyerName === lawyer?.name);
  };

  const getSpecialtyIcon = (specialty: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      "Criminal Law": <Scale className="w-5 h-5" />,
      "Civil Law": <Briefcase className="w-5 h-5" />,
      "Family Law": <Users className="w-5 h-5" />,
      "Corporate Law": <Award className="w-5 h-5" />,
      "Immigration Law": <MapPin className="w-5 h-5" />,
      "Real Estate Law": <CheckCircle className="w-5 h-5" />,
    };
    return iconMap[specialty] || <Briefcase className="w-5 h-5" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading lawyer profile...</p>
        </div>
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Lawyer Not Found
          </h2>
          <p className="text-gray-400 mb-6">
            The lawyer profile you're looking for doesn't exist.
          </p>
          <Link to="/">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const lawyerTestimonials = getLawyerTestimonials();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="glass border-b border-white/10 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center text-gray-300 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Search
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

            <div className="flex items-center space-x-3">
              <Link to="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-300 hover:text-white"
                >
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="glass-button text-white">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Header */}
            <Card className="glass-card border-white/10">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-6">
                  <Avatar className="w-32 h-32 border-4 border-white/20">
                    <AvatarImage src={lawyer.photo} alt={lawyer.name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl">
                      {lawyer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-white mb-2">
                      {lawyer.name}
                    </h1>

                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center space-x-2">
                        {getSpecialtyIcon(lawyer.specialty)}
                        <span className="text-lg text-blue-400 font-medium">
                          {lawyer.specialty}
                        </span>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        Available
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="flex items-center space-x-2">
                        <Star className="w-5 h-5 text-yellow-400" />
                        <span className="text-white font-semibold">
                          {lawyer.rating}
                        </span>
                        <span className="text-gray-400">Rating</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Award className="w-5 h-5 text-blue-400" />
                        <span className="text-white font-semibold">
                          {lawyer.experience}y
                        </span>
                        <span className="text-gray-400">Experience</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-5 h-5 text-green-400" />
                        <span className="text-white font-semibold">
                          {lawyer.fees}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mb-6">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">{lawyer.location}</span>
                    </div>

                    <p className="text-gray-300 leading-relaxed">
                      {lawyer.bio}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white/5">
                <TabsTrigger
                  value="about"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  About
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  Reviews ({lawyerTestimonials.length})
                </TabsTrigger>
                <TabsTrigger
                  value="availability"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  Availability
                </TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="mt-6">
                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Professional Background
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">
                        Specialization
                      </h3>
                      <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg">
                        {getSpecialtyIcon(lawyer.specialty)}
                        <div>
                          <p className="font-medium text-white">
                            {lawyer.specialty}
                          </p>
                          <p className="text-sm text-gray-400">
                            Primary area of practice
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">
                        Experience
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-white/5 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Award className="w-5 h-5 text-blue-400" />
                            <span className="font-medium text-white">
                              Years of Practice
                            </span>
                          </div>
                          <p className="text-2xl font-bold text-blue-400">
                            {lawyer.experience}
                          </p>
                          <p className="text-sm text-gray-400">
                            Years in {lawyer.specialty}
                          </p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Users className="w-5 h-5 text-green-400" />
                            <span className="font-medium text-white">
                              Client Satisfaction
                            </span>
                          </div>
                          <p className="text-2xl font-bold text-green-400">
                            {lawyer.rating}/5
                          </p>
                          <p className="text-sm text-gray-400">
                            Average rating
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">
                        Services Offered
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          "Legal Consultation",
                          "Case Representation",
                          "Document Review",
                          "Legal Advice",
                          "Court Proceedings",
                          "Settlement Negotiations",
                        ].map((service) => (
                          <div
                            key={service}
                            className="flex items-center space-x-2"
                          >
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-gray-300">{service}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-4">
                  {lawyerTestimonials.length > 0 ? (
                    lawyerTestimonials.map((testimonial) => (
                      <Card
                        key={testimonial.id}
                        className="glass-card border-white/10"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <Avatar>
                              <AvatarImage
                                src={testimonial.clientPhoto}
                                alt={testimonial.clientName}
                              />
                              <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-600 text-white">
                                {testimonial.clientName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-white">
                                  {testimonial.clientName}
                                </h4>
                                <div className="flex items-center space-x-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={cn(
                                        "w-4 h-4",
                                        i < testimonial.rating
                                          ? "text-yellow-400 fill-current"
                                          : "text-gray-600",
                                      )}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm text-blue-400 mb-2">
                                {testimonial.caseType}
                              </p>
                              <p className="text-gray-300">
                                "{testimonial.review}"
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card className="glass-card border-white/10">
                      <CardContent className="text-center py-8">
                        <MessageSquare className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-white mb-2">
                          No Reviews Yet
                        </h3>
                        <p className="text-gray-400">
                          Be the first to leave a review for this lawyer
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="availability" className="mt-6">
                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Schedule Consultation
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Select your preferred date and time
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">
                        Available Dates
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {getNextAvailableDates()
                          .slice(0, 8)
                          .map((date) => (
                            <Button
                              key={date}
                              variant={
                                selectedDate === date ? "default" : "outline"
                              }
                              className={cn(
                                "h-12 text-sm",
                                selectedDate === date
                                  ? "bg-blue-600 hover:bg-blue-700"
                                  : "bg-white/5 border-white/20 hover:bg-white/10",
                              )}
                              onClick={() => setSelectedDate(date)}
                            >
                              {new Date(date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </Button>
                          ))}
                      </div>
                    </div>

                    {selectedDate && (
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">
                          Available Times
                        </h3>
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                          {getAvailableTimeSlots().map((time) => (
                            <Button
                              key={time}
                              variant={
                                selectedTime === time ? "default" : "outline"
                              }
                              className={cn(
                                "h-10 text-sm",
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

                    {selectedDate && selectedTime && (
                      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Calendar className="w-5 h-5 text-blue-400" />
                          <span className="font-medium text-white">
                            Selected Appointment
                          </span>
                        </div>
                        <p className="text-gray-300">
                          {new Date(selectedDate).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}{" "}
                          at {selectedTime}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Book Consultation</CardTitle>
                <CardDescription className="text-gray-400">
                  Schedule a meeting with {lawyer.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    {lawyer.fees}
                  </div>
                  <div className="text-sm text-gray-400">Consultation Fee</div>
                </div>

                <Button
                  onClick={handleBookAppointment}
                  disabled={!selectedDate || !selectedTime}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Appointment
                </Button>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Message
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Video className="w-4 h-4 mr-1" />
                    Video Call
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white">
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">
                    {lawyer.name.toLowerCase().replace(" ", ".")}@lawfirm.com
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <span className="text-gray-300">{lawyer.location}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Facts */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Quick Facts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Response Time</span>
                  <span className="text-white">Within 2 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Languages</span>
                  <span className="text-white">English, Spanish</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Bar Admission</span>
                  <span className="text-white">New York State</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Cases Won</span>
                  <span className="text-white">95%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawyerProfile;
