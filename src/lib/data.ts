// Dummy data for the lawyer-client platform

export interface Lawyer {
  id: string;
  name: string;
  photo: string;
  specialty: string;
  experience: number;
  rating: number;
  location: string;
  bio: string;
  availability: string[];
  fees: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientPhoto: string;
  rating: number;
  review: string;
  lawyerName: string;
  caseType: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

export const lawyers: Lawyer[] = [
  {
    id: "1",
    name: "Sarah Chen",
    photo: "/api/placeholder/300/300",
    specialty: "Criminal Law",
    experience: 12,
    rating: 4.9,
    location: "New York, NY",
    bio: "Experienced criminal defense attorney with a track record of successful cases.",
    availability: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    fees: "$300/hour",
  },
  {
    id: "2",
    name: "Michael Rodriguez",
    photo: "/api/placeholder/300/300",
    specialty: "Civil Law",
    experience: 8,
    rating: 4.8,
    location: "Los Angeles, CA",
    bio: "Civil litigation specialist focusing on personal injury and contract disputes.",
    availability: ["Mon", "Wed", "Fri"],
    fees: "$250/hour",
  },
  {
    id: "3",
    name: "Emily Johnson",
    photo: "/api/placeholder/300/300",
    specialty: "Family Law",
    experience: 10,
    rating: 4.9,
    location: "Chicago, IL",
    bio: "Compassionate family law attorney helping clients through difficult transitions.",
    availability: ["Tue", "Thu", "Sat"],
    fees: "$275/hour",
  },
  {
    id: "4",
    name: "David Kumar",
    photo: "/api/placeholder/300/300",
    specialty: "Corporate Law",
    experience: 15,
    rating: 4.7,
    location: "San Francisco, CA",
    bio: "Corporate attorney specializing in business formation and intellectual property.",
    availability: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    fees: "$400/hour",
  },
  {
    id: "5",
    name: "Lisa Thompson",
    photo: "/api/placeholder/300/300",
    specialty: "Immigration Law",
    experience: 9,
    rating: 4.8,
    location: "Miami, FL",
    bio: "Immigration attorney helping individuals and families navigate complex legal processes.",
    availability: ["Mon", "Wed", "Thu", "Fri"],
    fees: "$200/hour",
  },
  {
    id: "6",
    name: "Robert Wilson",
    photo: "/api/placeholder/300/300",
    specialty: "Real Estate Law",
    experience: 11,
    rating: 4.6,
    location: "Austin, TX",
    bio: "Real estate attorney with expertise in property transactions and zoning law.",
    availability: ["Tue", "Wed", "Thu", "Fri"],
    fees: "$225/hour",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "1",
    clientName: "James Patterson",
    clientPhoto: "/api/placeholder/100/100",
    rating: 5,
    review:
      "Sarah Chen was incredible! She handled my case with professionalism and got me the best possible outcome. Highly recommended!",
    lawyerName: "Sarah Chen",
    caseType: "Criminal Defense",
  },
  {
    id: "2",
    clientName: "Maria Garcia",
    clientPhoto: "/api/placeholder/100/100",
    rating: 5,
    review:
      "Michael Rodriguez fought hard for my rights and secured a fair settlement. The communication was excellent throughout the process.",
    lawyerName: "Michael Rodriguez",
    caseType: "Personal Injury",
  },
  {
    id: "3",
    clientName: "John Smith",
    clientPhoto: "/api/placeholder/100/100",
    rating: 4,
    review:
      "Emily Johnson made our divorce process as smooth as possible. She's compassionate and knowledgeable.",
    lawyerName: "Emily Johnson",
    caseType: "Family Law",
  },
  {
    id: "4",
    clientName: "Priya Patel",
    clientPhoto: "/api/placeholder/100/100",
    rating: 5,
    review:
      "David Kumar helped us set up our startup legally. His expertise in corporate law is unmatched.",
    lawyerName: "David Kumar",
    caseType: "Corporate Law",
  },
  {
    id: "5",
    clientName: "Ahmed Hassan",
    clientPhoto: "/api/placeholder/100/100",
    rating: 5,
    review:
      "Lisa Thompson guided us through the immigration process with patience and expertise. We're now proud citizens!",
    lawyerName: "Lisa Thompson",
    caseType: "Immigration",
  },
  {
    id: "6",
    clientName: "Jennifer Lee",
    clientPhoto: "/api/placeholder/100/100",
    rating: 4,
    review:
      "Robert Wilson made our home purchase seamless. He caught issues we never would have noticed.",
    lawyerName: "Robert Wilson",
    caseType: "Real Estate",
  },
];

export const faqs: FAQ[] = [
  {
    id: "1",
    question: "How do I book an appointment with a lawyer?",
    answer:
      "Simply search for lawyers by specialty or location, view their profiles, and click 'Book Appointment'. You can select from their available time slots and receive instant confirmation.",
  },
  {
    id: "2",
    question: "Are consultations conducted online or in-person?",
    answer:
      "Both options are available! Most lawyers offer Google Meet consultations for convenience, while some also provide in-person meetings at their office locations.",
  },
  {
    id: "3",
    question: "How secure is my personal information?",
    answer:
      "We use industry-standard encryption to protect all your data. Your communications with lawyers are confidential and stored securely in compliance with legal privacy requirements.",
  },
  {
    id: "4",
    question: "Can I cancel or reschedule my appointment?",
    answer:
      "Yes, you can cancel or reschedule appointments up to 24 hours before the scheduled time through your client dashboard. Some lawyers may have different policies, which will be clearly stated.",
  },
  {
    id: "5",
    question: "How do I pay for legal services?",
    answer:
      "Payment methods vary by lawyer. Most accept credit cards, bank transfers, and some offer payment plans. Payment details and options are shown on each lawyer's profile.",
  },
  {
    id: "6",
    question: "What if I'm not satisfied with the service?",
    answer:
      "We have a satisfaction guarantee policy. If you're not satisfied with your consultation, please contact our support team within 48 hours for a resolution.",
  },
];

export const services: Service[] = [
  {
    id: "1",
    title: "Smart Lawyer Matching",
    description:
      "Find the perfect lawyer for your case using our intelligent matching system.",
    icon: "UserCheck",
    features: [
      "AI-powered recommendations",
      "Filter by specialty and location",
      "Read verified reviews and ratings",
      "Compare lawyer profiles side-by-side",
    ],
  },
  {
    id: "2",
    title: "Easy Appointment Booking",
    description:
      "Schedule consultations with just a few clicks using our streamlined booking system.",
    icon: "Calendar",
    features: [
      "Real-time availability",
      "Instant confirmation",
      "Automated reminders",
      "Google Meet integration",
    ],
  },
  {
    id: "3",
    title: "Case Management Dashboard",
    description:
      "Track your legal matters and communicate with your lawyer in one centralized place.",
    icon: "FileText",
    features: [
      "Document upload and sharing",
      "Case progress tracking",
      "Milestone notifications",
      "Secure messaging system",
    ],
  },
  {
    id: "4",
    title: "Secure Communication",
    description:
      "Communicate with your lawyer through our encrypted messaging and video platform.",
    icon: "MessageSquare",
    features: [
      "End-to-end encryption",
      "Real-time chat",
      "Video consultations",
      "File sharing capabilities",
    ],
  },
];

export const specialties = [
  "Criminal Law",
  "Civil Law",
  "Family Law",
  "Corporate Law",
  "Immigration Law",
  "Real Estate Law",
  "Personal Injury",
  "Employment Law",
  "Intellectual Property",
  "Tax Law",
  "Bankruptcy Law",
  "Environmental Law",
];

export const cities = [
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Houston, TX",
  "Phoenix, AZ",
  "Philadelphia, PA",
  "San Antonio, TX",
  "San Diego, CA",
  "Dallas, TX",
  "San Jose, CA",
  "Austin, TX",
  "Jacksonville, FL",
  "Fort Worth, TX",
  "Columbus, OH",
  "Charlotte, NC",
  "San Francisco, CA",
  "Indianapolis, IN",
  "Seattle, WA",
  "Denver, CO",
  "Washington, DC",
  "Boston, MA",
  "El Paso, TX",
  "Nashville, TN",
  "Detroit, MI",
  "Oklahoma City, OK",
  "Portland, OR",
  "Las Vegas, NV",
  "Memphis, TN",
  "Louisville, KY",
  "Baltimore, MD",
  "Milwaukee, WI",
  "Albuquerque, NM",
  "Tucson, AZ",
  "Fresno, CA",
  "Sacramento, CA",
  "Mesa, AZ",
  "Kansas City, MO",
  "Atlanta, GA",
  "Long Beach, CA",
  "Colorado Springs, CO",
  "Raleigh, NC",
  "Miami, FL",
  "Virginia Beach, VA",
  "Omaha, NE",
  "Oakland, CA",
  "Minneapolis, MN",
  "Tulsa, OK",
  "Arlington, TX",
  "Tampa, FL",
  "New Orleans, LA",
];
