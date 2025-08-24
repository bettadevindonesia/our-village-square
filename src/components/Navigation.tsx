import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Users, Phone, Calendar, Bell, FileText } from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { href: "/", label: "Beranda", icon: Home },
    { href: "/about", label: "Tentang", icon: Users },
    { href: "/events", label: "Acara", icon: Calendar },
    { href: "/announcements", label: "Pengumuman", icon: Bell },
    { href: "/contact", label: "Kontak", icon: Phone },
    // { href: "/letter", label: "Buat Surat", icon: FileText },
    { href: "/certificate", label: "Buat Surat", icon: FileText },
  ];

  return (
    <nav className="bg-card border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-hero rounded-full flex items-center justify-center">
              <Home className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Portal Desa Dermolo</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link key={item.href} to={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className="flex items-center space-x-2 transition-smooth"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Mobile menu - simplified for now */}
        <div className="md:hidden pb-4">
          <div className="flex flex-wrap gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link key={item.href} to={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <Icon className="w-3 h-3" />
                    <span className="text-xs">{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;