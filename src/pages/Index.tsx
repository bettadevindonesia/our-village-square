import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Calendar, Bell, Users, Phone, FileText, MapPin } from "lucide-react";
import villageHero from "@/assets/village-hero.jpg";

const Index = () => {
  const quickLinks = [
    {
      icon: Calendar,
      title: "Upcoming Events",
      description: "View community events and activities",
      href: "/events",
      color: "text-village-blue"
    },
    {
      icon: Bell,
      title: "Announcements",
      description: "Stay updated with village news",
      href: "/announcements",
      color: "text-village-green"
    },
    {
      icon: Users,
      title: "About Our Village",
      description: "Learn about our community",
      href: "/about",
      color: "text-village-amber"
    },
    {
      icon: Phone,
      title: "Contact Us",
      description: "Get in touch with village office",
      href: "/contact",
      color: "text-primary"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 lg:h-[500px] overflow-hidden">
        <img 
          src={villageHero} 
          alt="Beautiful village landscape with traditional buildings and rolling hills"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl text-white">
              <h1 className="text-4xl lg:text-6xl font-bold mb-4 animate-fade-in">
                Welcome to Our Village
              </h1>
              <p className="text-lg lg:text-xl mb-8 animate-slide-up">
                A thriving community dedicated to preserving our heritage while embracing the future. 
                Stay connected with everything happening in our beautiful village.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/events">
                  <Button size="lg" className="w-full sm:w-auto">
                    <Calendar className="w-5 h-5 mr-2" />
                    View Events
                  </Button>
                </Link>
                <Link to="/letter">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    <FileText className="w-5 h-5 mr-2" />
                    Create Letter
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Village Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Quick access to essential village information and services. Everything you need to stay connected with our community.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.href} to={link.href}>
                  <Card className="h-full hover:shadow-medium transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                    <CardHeader className="text-center">
                      <div className="mx-auto w-12 h-12 rounded-lg bg-gradient-card flex items-center justify-center mb-4">
                        <Icon className={`w-6 h-6 ${link.color}`} />
                      </div>
                      <CardTitle className="text-lg">{link.title}</CardTitle>
                      <CardDescription>{link.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Village Info Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Living in Our Community</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Our village combines the charm of traditional living with modern conveniences. 
                We're proud of our close-knit community, beautiful natural surroundings, and 
                commitment to sustainable development.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-village-blue" />
                  <span>Located in the heart of beautiful countryside</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-village-green" />
                  <span>Population of friendly, engaged residents</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-village-amber" />
                  <span>Rich calendar of community events year-round</span>
                </div>
              </div>
              <div className="mt-8">
                <Link to="/about">
                  <Button variant="outline" size="lg">
                    Learn More About Us
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="lg:text-center">
              <Card className="p-8 bg-gradient-card">
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-2">Quick Contact</h3>
                    <p className="text-muted-foreground">Need assistance? We're here to help.</p>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Village Office:</span>
                      <span>(555) 123-4567</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Emergency:</span>
                      <span>(555) 911-0000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Email:</span>
                      <span>office@village.gov</span>
                    </div>
                  </div>
                  <Link to="/contact" className="block">
                    <Button className="w-full">
                      <Phone className="w-4 h-4 mr-2" />
                      Contact Us
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;