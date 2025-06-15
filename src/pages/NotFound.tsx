import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Scale, Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
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

      <div className="text-center relative z-10 max-w-md mx-auto px-4">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Scale className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-bold gradient-text">LegalConnect</span>
        </div>

        {/* 404 Number */}
        <div className="text-8xl md:text-9xl font-bold gradient-text mb-4 leading-none">
          404
        </div>

        {/* Error Message */}
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-400 mb-8 leading-relaxed">
          Sorry, we couldn't find the page you're looking for. The page might
          have been moved, deleted, or you might have typed the wrong URL.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3">
              <Home className="w-4 h-4 mr-2" />
              Go to Homepage
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="glass-button text-white border-white/20 px-6 py-3"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Help Links */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-sm text-gray-500 mb-4">Need help? Try these:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              to="/"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Find Lawyers
            </Link>
            <Link
              to="/login"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Sign Up
            </Link>
            <a
              href="mailto:support@legalconnect.com"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
