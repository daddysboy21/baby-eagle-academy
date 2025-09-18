import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Users, Trophy, Target, Heart, Award, Star, MapPin, Menu, X, Newspaper, UserCheck, Camera, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import heroImage from "@/assets/hero-football.jpg";
import BEFALogo from "@/assets/eagle.png"
import PlayerApplicationForm from "@/components/forms/PlayerApplicationForm";
import PartnerApplicationForm from "@/components/forms/PartnerApplicationForm";
import FanMemberForm from "@/components/forms/FanMemberForm";

const AcademyProfile = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight - 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          scrolled
            ? "bg-white/1 backdrop-blur-sm shadow-sm"
            : "bg-transparent backdrop-blur-sm shadow-sm"
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className={`font-bold text-xl transition-colors duration-300 ${
                scrolled ? "text-primary" : "text-white"
              }`}
            >
              <img className="h-14" src={BEFALogo} alt="Baby Eagle Logo" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/players"
                className={`transition-colors flex items-center gap-2 ${
                  scrolled
                    ? "text-foreground hover:text-primary"
                    : "text-white hover:text-secondary"
                }`}
              >
                <Users className="w-4 h-4" />
                Players
              </Link>
              <Link
                to="/staff"
                className={`transition-colors flex items-center gap-2 ${
                  scrolled
                    ? "text-foreground hover:text-primary"
                    : "text-white hover:text-secondary"
                }`}
              >
                <UserCheck className="w-4 h-4" />
                Staff
              </Link>
              <Link
                to="/news"
                className={`transition-colors flex items-center gap-2 ${
                  scrolled
                    ? "text-foreground hover:text-primary"
                    : "text-white hover:text-secondary"
                }`}
              >
                <Newspaper className="w-4 h-4" />
                News
              </Link>
              <Link
                to="/gallery"
                className={`transition-colors flex items-center gap-2 ${
                  scrolled
                    ? "text-foreground hover:text-primary"
                    : "text-white hover:text-secondary"
                }`}
              >
                <Camera className="w-4 h-4" />
                Gallery
              </Link>
              
              {user && (
                <Link
                  to="/manage"
                  className={`transition-colors flex items-center gap-2 ${
                    scrolled
                      ? "text-foreground hover:text-primary"
                      : "text-white hover:text-secondary"
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  Manage
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X
                  className={`w-6 h-6 ${
                    scrolled ? "text-primary" : "text-white"
                  }`}
                />
              ) : (
                <Menu
                  className={`w-6 h-6 ${
                    scrolled ? "text-primary" : "text-white"
                  }`}
                />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col space-y-4">
                <Link
                  to="/players"
                  className={`transition-colors flex items-center gap-2 ${
                    scrolled
                      ? "text-foreground hover:text-primary"
                      : "text-white hover:text-secondary"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Users className="w-4 h-4" />
                  Players
                </Link>
                <Link
                  to="/staff"
                  className={`transition-colors flex items-center gap-2 ${
                    scrolled
                      ? "text-foreground hover:text-primary"
                      : "text-white hover:text-secondary"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <UserCheck className="w-4 h-4" />
                  Staff
                </Link>
                <Link
                  to="/news"
                  className={`transition-colors flex items-center gap-2 ${
                    scrolled
                      ? "text-foreground hover:text-primary"
                      : "text-white hover:text-secondary"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Newspaper className="w-4 h-4" />
                  News
                </Link>
                <Link
                  to="/gallery"
                  className={`transition-colors flex items-center gap-2 ${
                    scrolled
                      ? "text-foreground hover:text-primary"
                      : "text-white hover:text-secondary"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Camera className="w-4 h-4" />
                  Gallery
              </Link>
              
              {user && (
                <Link
                  to="/manage"
                  className={`transition-colors flex items-center gap-2 ${
                    scrolled
                      ? "text-foreground hover:text-primary"
                      : "text-white hover:text-secondary"
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  Manage
                </Link>
              )}
            </div>
            </div>
          )}
        </div>
      </nav>

      {/* Header Section */}
      <header className="relative bg-gradient-hero text-primary-foreground overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-black/20"></div>
        <img
          src={heroImage}
          alt="Baby Eagle Football Academy players in action"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
        />
        <div className="relative container mx-auto px-6 py-16 w-full">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            <div className="flex-1">
              <div className="mb-6">
                <h1 className="text-5xl lg:text-7xl font-bold mb-4 tracking-tight">
                  BABY EAGLE
                </h1>
                <h2 className="text-3xl lg:text-4xl font-semibold mb-2">
                  FOOTBALL ACADEMY
                </h2>
                <p className="text-xl lg:text-2xl font-medium opacity-90">
                  "Building Champions On & Off the Pitch"
                </p>
              </div>
              <div className="bg-secondary text-secondary-foreground px-6 py-4 rounded-lg shadow-glow inline-block">
                <p className="text-lg lg:text-xl font-bold">
                  "Say No to Drugs, Yes to Education & Football"
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-white/1 to-white/1 backdrop-blur-sm border border-white/50 shadow-sm p-6 rounded-2xl">
              <div className="space-y-3 text-sm lg:text-base">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>babyeaglefootball231@gmail.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+231779137667 | +231881111888 | +231776043008</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>Jamaica Road Community, Liberia</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Our History Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-primary">Our History</h2>
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-brand">
              <CardContent className="p-8">
                <p className="text-lg leading-relaxed mb-6">
                  Baby Eagle Football Academy was founded on <strong>October 8, 2018</strong>, by Abdullah L. Bility and Foday Sanoe from the Jamaica Road community. The name "Baby Eagle" comes from the nickname of one founder.
                </p>
                <p className="text-lg leading-relaxed">
                  Both founders later traveled abroad, leaving leadership to <strong>Kafumba Kenneh in 2021</strong>. Under his presidency, the academy was restructured to include not only football training but also mentorship, education, counseling, and drug prevention programs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-primary">Who We Are</h2>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xl leading-relaxed text-muted-foreground">
              We are a community-driven sports academy in Liberia, dedicated to nurturing young football talents while promoting education, discipline, and social responsibility. Our purpose is to inspire hope, fight drug abuse, and guide youth toward becoming the next generation of leaders.
            </p>
          </div>
        </div>
      </section>

      {/* Mission, Vision & Values */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-primary">Mission, Vision & Values</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="shadow-brand">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Target className="w-6 h-6" />
                  Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>To develop young athletes holistically through football training, education, character-building, and life skills.</p>
              </CardContent>
            </Card>

            <Card className="shadow-brand">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Star className="w-6 h-6" />
                  Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>To become Liberia's leading football academy, producing exceptional players and responsible citizens with both local and international impact.</p>
              </CardContent>
            </Card>

            <Card className="shadow-brand">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Heart className="w-6 h-6" />
                  Core Values
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="secondary">Discipline</Badge>
                  <Badge variant="secondary">Education</Badge>
                  <Badge variant="secondary">Integrity</Badge>
                  <Badge variant="secondary">Teamwork</Badge>
                  <Badge variant="secondary">Community Impact</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Programs & Training */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-primary">Programs & Training</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="shadow-brand">
              <CardHeader>
                <CardTitle className="text-primary">Football Development</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Structured training for U12, U13, U15. Focus on skills, tactics, fitness, and competition experience.</p>
                <div className="flex gap-2 flex-wrap">
                  <Badge>U12</Badge>
                  <Badge>U13</Badge>
                  <Badge>U15</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-brand">
              <CardHeader>
                <CardTitle className="text-primary">Academic Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Partnerships with schools to ensure players excel academically. Tuition support for selected students.</p>
              </CardContent>
            </Card>

            <Card className="shadow-brand">
              <CardHeader>
                <CardTitle className="text-primary">Mentorship & Life Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Workshops on leadership, discipline, career guidance, and drug awareness campaigns.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Achievements & Impact */}
      <section className="py-16 bg-gradient-accent text-accent-foreground">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Achievements & Impact</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="bg-primary text-primary-foreground shadow-brand">
              <CardContent className="p-6 text-center">
                <Trophy className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">MASS League</h3>
                <p>Competed successfully</p>
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground shadow-brand">
              <CardContent className="p-6 text-center">
                <Award className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Third Division</h3>
                <p>Promoted in 2025</p>
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground shadow-brand">
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">11 Students</h3>
                <p>Tuition support provided</p>
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground shadow-brand">
              <CardContent className="p-6 text-center">
                <Heart className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Hundreds</h3>
                <p>Youth impacted</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* For Different Audiences */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-primary">For Our Community</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <Card className="shadow-brand">
              <CardHeader>
                <CardTitle className="text-primary">For Players</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Structured training to sharpen skills, build discipline, and chase dreams.</p>
              </CardContent>
            </Card>

            <Card className="shadow-brand">
              <CardHeader>
                <CardTitle className="text-primary">For Parents</CardTitle>
              </CardHeader>
              <CardContent>
                <p>A safe, supportive environment balancing football and education.</p>
              </CardContent>
            </Card>

            <Card className="shadow-brand">
              <CardHeader>
                <CardTitle className="text-primary">For Partners & Sponsors</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Opportunities for branding, scholarships, and direct youth impact.</p>
              </CardContent>
            </Card>

            <Card className="shadow-brand">
              <CardHeader>
                <CardTitle className="text-primary">For Fans & Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">Membership program with:</p>
                  <ul className="text-sm space-y-1 list-disc pl-4">
                    <li>Official BEFA membership card</li>
                    <li>Match & event updates</li>
                    <li>Program invitations</li>
                    <li>Voice in academy growth</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Join the Baby Eagle Family Section */}
      <section className="py-16 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-8">Join the Baby Eagle Family</h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto">
            Ready to be part of something bigger? Join us in building champions on and off the pitch.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <PlayerApplicationForm />
            <PartnerApplicationForm />
            <FanMemberForm />
          </div>

          <div className="bg-primary-dark/50 backdrop-blur-sm p-8 rounded-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                <Mail className="w-5 h-5" />
                <span>babyeaglefootball231@gmail.com</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Phone className="w-5 h-5" />
                <span>+231779137667 | +231881111888 | +231776043008</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Users className="w-5 h-5" />
                <span>Baby Eagle Academy (BEFA)</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <MapPin className="w-5 h-5" />
                <span>Jamaica Road Community, Liberia</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AcademyProfile;