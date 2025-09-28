import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, Home, Target, Trophy, Gamepad2, Palette, Info } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { QuickAccessDrawer } from "./quick-access-drawer";
import goldfishLogo from "@/assets/goldfish-logo.png";

const navigationItems = [
  { id: "profile", label: "Profile", icon: User, color: "bg-streak" },
  { id: "home", label: "Home", icon: Home, color: "bg-ocean" },
  { id: "pathways", label: "Pathway/Tasks", icon: Target, color: "bg-success" },
  { id: "achievements", label: "Achievements", icon: Trophy, color: "bg-energy" },
  { id: "minigame", label: "Fish Minigame", icon: Gamepad2, color: "bg-accent" },
  { id: "appearance", label: "Appearance", icon: Palette, color: "bg-streak" },
  { id: "about", label: "About us", icon: Info, color: "bg-muted" },
];

interface NavigationProps {
  currentPage?: string;
  onNavigate?: (pageId: string) => void;
}

export function Navigation({ currentPage = "home", onNavigate }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigate = (pageId: string) => {
    onNavigate?.(pageId);
    setIsOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 glass-card m-4 p-4">
      <div className="flex items-center justify-between">
        {/* Logo, Menu & Title */}
        <div className="flex items-center gap-3">
          <img 
            src={goldfishLogo} 
            alt="Goldfish Logo" 
            className="w-12 h-12 animate-float cursor-pointer transition-transform hover:scale-110"
            onClick={() => handleNavigate("minigame")}
          />
          
          {/* Mobile Menu Button (moved here) */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-background/95 backdrop-blur-md">
            <div className="flex flex-col gap-4 mt-8">
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={`nav-item justify-start h-14 ${currentPage === item.id ? 'active' : ''}`}
                  onClick={() => handleNavigate(item.id)}
                >
                  <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center mr-4`}>
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-medium">{item.label}</span>
                </Button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
          
          <h1 className="text-xl font-poppins font-bold bg-ocean bg-clip-text text-transparent">
            TaskQuest
          </h1>
          <QuickAccessDrawer />
        </div>

        {/* Desktop Navigation & Theme Toggle */}
        <div className="hidden md:flex items-center gap-2">
          {["pathways", "achievements", "minigame"].map((item) => {
            const navItem = navigationItems.find(nav => nav.id === item);
            if (!navItem) return null;
            
            return (
              <Button
                key={item}
                variant="ghost"
                className={`nav-item ${currentPage === item ? 'active' : ''}`}
                onClick={() => handleNavigate(item)}
              >
                <navItem.icon className="w-4 h-4 mr-2" />
                {navItem.label}
              </Button>
            );
          })}
          <ThemeToggle />
        </div>

        {/* Mobile Theme Toggle Only */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
        </div>

        {/* User Profile Button (Desktop) */}
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:flex w-12 h-12 rounded-full bg-muted hover:bg-muted/80"
          onClick={() => handleNavigate("profile")}
        >
          <User className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}