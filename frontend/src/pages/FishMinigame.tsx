import React from "react";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Coins } from "lucide-react";

// Import background image, gif, and tank border
import seaBackground from "@/assets/images/seabackground.png";
import fishyGif from "@/assets/fishminigame/fishy.gif";
import tankBorder from "@/assets/fishminigame/tank.png";

const FishMinigame: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = (pageId: string) => {
    if (pageId === "home") {
      navigate("/");
    } else if (pageId === "task-tree") {
      navigate("/task-tree");
    } else if (pageId === "achievements") {
      navigate("/achievements");
    } else if (pageId === "minigame") {
      navigate("/minigame");
    }
  };

  return (
    <div
      className="min-h-screen text-foreground relative flex flex-col"
      style={{
        backgroundImage: `url(${seaBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        filter: 'brightness(0.94)'
      }}
    >
      {/* Dark theme overlay */}
      <div className="absolute inset-0 bg-black/53 dark:bg-black/63"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navigation currentPage="minigame" onNavigate={handleNavigate} />

        <main className="pt-32 px-4 flex-1 flex items-center justify-center">
          <div className="max-w-4xl mx-auto text-center">
            {/* Status Bar */}
            <div className="flex justify-end mb-1">
              <div className="glass-card px-4 py-2 flex items-center gap-4">
                {/* Currency Counter */}
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium">7</span>
                </div>

                {/* Shop Icon */}
                <button className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Fish Tank Container */}
            <div className="relative inline-block p-4">
              {/* Fish Animation */}
              <img
                src={fishyGif}
                alt="Fish Minigame Animation"
                className="max-w-full h-auto"
                style={{
                  maxHeight: '57vh',
                  objectFit: 'contain',
                  paddingTop: '12px',
                  paddingBottom: '4px',
                  paddingLeft: '12px',
                  paddingRight: '12px'
                }}
              />

              {/* Tank Border Overlay */}
              <img
                src={tankBorder}
                alt="Fish Tank Border"
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{
                  objectFit: 'contain'
                }}
              />
            </div>
          </div>
        </main>

        <Footer onNavigate={handleNavigate} />
      </div>
    </div>
  );
};

export default FishMinigame;