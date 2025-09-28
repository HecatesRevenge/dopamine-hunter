import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

interface FooterProps {
  onNavigate?: (pageId: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="glass-card m-4 p-6 mt-8">
      <div className="flex items-center justify-center">
        <Button
          variant="ghost"
          className="nav-item"
          onClick={() => onNavigate?.("about")}
        >
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-3">
            <Info className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-medium">About us</span>
        </Button>
      </div>
    </footer>
  );
}