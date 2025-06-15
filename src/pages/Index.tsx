import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  Star,
  MapPin,
  Clock,
  Shield,
  Users,
  MessageSquare,
  Calendar,
  FileText,
  UserCheck,
  ChevronRight,
  Phone,
  Mail,
  ArrowRight,
  Award,
  Briefcase,
  Scale,
  Gavel,
  Heart,
  Building,
  Globe,
  Home,
  Banknote,
  TreePine,
  Zap,
  CheckCircle,
} from "lucide-react";
import {
  lawyers,
  testimonials,
  faqs,
  services,
  specialties,
  cities,
} from "@/lib/data";
import { cn } from "@/lib/utils";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    // Scroll animation observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 },
    );

    const elements = document.querySelectorAll(".scroll-fade");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const filteredLawyers = lawyers.filter((lawyer) => {
    const matchesQuery =
      lawyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lawyer.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty =
      !selectedSpecialty || lawyer.specialty === selectedSpecialty;
    const matchesCity = !selectedCity || lawyer.location === selectedCity;
    return matchesQuery && matchesSpecialty && matchesCity;
  });

  const getSpecialtyIcon = (specialty: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      "Criminal Law": <Gavel className="w-5 h-5" />,
      "Civil Law": <Scale className="w-5 h-5" />,
      "Family Law": <Heart className="w-5 h-5" />,
      "Corporate Law": <Building className="w-5 h-5" />,
      "Immigration Law": <Globe className="w-5 h-5" />,
      "Real Estate Law": <Home className="w-5 h-5" />,
    };
    return iconMap[specialty] || <Briefcase className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">
              LegalConnect
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#services"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Services
            </a>
            <a
              href="#lawyers"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Find Lawyers
            </a>
            <a
              href="#testimonials"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Reviews
            </a>
            <a
              href="#faq"
              className="text-gray-300 hover:text-white transition-colors"
            >
              FAQ
            </a>
            <a
              href="#contact"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Contact
            </a>
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
      </nav>

      {/* Hero Section */}
      <section className="hero-gradient pt-24 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div
            className={cn(
              "text-center max-w-4xl mx-auto transition-all duration-1000",
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10",
            )}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Find Trusted <span className="gradient-text">Lawyers</span> Easily
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Connect with experienced legal professionals for all your legal
              needs. Book consultations, manage cases, and get expert advice -
              all in one platform.
            </p>

            {/* Search Bar */}
            <div className="glass-card p-8 rounded-2xl max-w-4xl mx-auto mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search lawyers or case type..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>

                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="px-3 py-2 rounded-md bg-white/10 border border-white/20 text-white"
                >
                  <option value="">All Specialties</option>
                  {specialties.map((specialty) => (
                    <option
                      key={specialty}
                      value={specialty}
                      className="text-black"
                    >
                      {specialty}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="px-3 py-2 rounded-md bg-white/10 border border-white/20 text-white"
                >
                  <option value="">All Cities</option>
                  {cities.slice(0, 20).map((city) => (
                    <option key={city} value={city} className="text-black">
                      {city}
                    </option>
                  ))}
                </select>

                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  Search Lawyers
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
                >
                  Get Started as Client
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/signup">
                <Button
                  size="lg"
                  variant="outline"
                  className="glass-button text-white border-white/20 px-8 py-3"
                >
                  Join as Lawyer
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full floating-animation"></div>
        <div
          className="absolute top-40 right-20 w-32 h-32 bg-purple-500/10 rounded-full floating-animation"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/4 w-16 h-16 bg-green-500/10 rounded-full floating-animation"
          style={{ animationDelay: "1s" }}
        ></div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 scroll-fade">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose <span className="gradient-text">LegalConnect</span>?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              We're revolutionizing how clients connect with legal professionals
              through cutting-edge technology and seamless user experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => {
              const IconComponent =
                {
                  UserCheck,
                  Calendar,
                  FileText,
                  MessageSquare,
                }[service.icon] || UserCheck;

              return (
                <Card
                  key={service.id}
                  className="glass-card border-white/10 hover:border-white/20 transition-all duration-300 group scroll-fade"
                >
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-8 h-8 text-blue-400" />
                    </div>
                    <CardTitle className="text-xl font-bold text-white">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-center text-sm text-gray-300"
                        >
                          <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Lawyers Section */}
      <section
        id="lawyers"
        className="py-20 bg-gradient-to-br from-black/20 to-gray-900/20"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 scroll-fade">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Meet Our <span className="gradient-text">Top Lawyers</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Connect with highly-rated legal professionals who specialize in
              your area of need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredLawyers.slice(0, 6).map((lawyer) => (
              <Card
                key={lawyer.id}
                className="glass-card border-white/10 hover:border-white/20 transition-all duration-300 group overflow-hidden scroll-fade"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-16 h-16 border-2 border-white/20">
                      <AvatarImage src={lawyer.photo} alt={lawyer.name} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {lawyer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1">
                        {lawyer.name}
                      </h3>
                      <div className="flex items-center space-x-2 mb-2">
                        {getSpecialtyIcon(lawyer.specialty)}
                        <span className="text-blue-400 font-medium">
                          {lawyer.specialty}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span>{lawyer.rating}</span>
                        </div>
                        <div className="flex items-center">
                          <Award className="w-4 h-4 mr-1" />
                          <span>{lawyer.experience}y exp</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                    {lawyer.bio}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-400">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{lawyer.location}</span>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-green-500/20 text-green-400 border-green-500/30"
                    >
                      Available
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-white">
                      {lawyer.fees}
                    </span>
                    <Link to={`/lawyer/${lawyer.id}`}>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      >
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              variant="outline"
              className="glass-button text-white border-white/20"
            >
              View All Lawyers
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 scroll-fade">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              What Our <span className="gradient-text">Clients Say</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Real experiences from real clients who found success through our
              platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card
                key={testimonial.id}
                className="glass-card border-white/10 hover:border-white/20 transition-all duration-300 scroll-fade"
              >
                <CardHeader>
                  <div className="flex items-center space-x-4 mb-4">
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
                    <div>
                      <h4 className="font-bold text-white">
                        {testimonial.clientName}
                      </h4>
                      <p className="text-sm text-gray-400">
                        {testimonial.caseType}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 mb-4">
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
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">"{testimonial.review}"</p>
                  <p className="text-sm text-blue-400">
                    — Worked with {testimonial.lawyerName}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        id="faq"
        className="py-20 bg-gradient-to-br from-black/20 to-gray-900/20"
      >
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16 scroll-fade">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <p className="text-xl text-gray-400">
              Got questions? We've got answers to help you get started.
            </p>
          </div>

          <Accordion
            type="single"
            collapsible
            className="space-y-4 scroll-fade"
          >
            {faqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="glass-card border-white/10 rounded-lg px-6"
              >
                <AccordionTrigger className="text-white hover:text-blue-400 text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-4">
          <div className="glass-card rounded-3xl p-12 max-w-4xl mx-auto text-center scroll-fade">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Find Your{" "}
              <span className="gradient-text">Perfect Lawyer</span>?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied clients who found their legal solution
              through LegalConnect. Start your journey today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
              >
                Get Started Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="glass-button text-white border-white/20 px-8 py-3"
              >
                Schedule a Demo
              </Button>
            </div>

            <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>1-800-LEGAL-01</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>support@legalconnect.com</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Scale className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text">
                  LegalConnect
                </span>
              </div>
              <p className="text-gray-400 mb-4">
                Connecting clients with trusted legal professionals for a better
                justice system.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                  <span className="text-xs">f</span>
                </div>
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                  <span className="text-xs">t</span>
                </div>
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                  <span className="text-xs">in</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">For Clients</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Find Lawyers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Book Consultation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Case Management
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Legal Resources
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">For Lawyers</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Join Platform
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Manage Practice
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Client Tools
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Analytics
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="my-8 bg-white/10" />

          <div className="flex flex-col md:flex-row items-center justify-between text-gray-400">
            <p>&copy; 2024 LegalConnect. All rights reserved.</p>
            <p className="mt-2 md:mt-0">
              Made with ❤️ for a better legal system
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
