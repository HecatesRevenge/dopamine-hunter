import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TaskTree from "./pages/TaskTree";
import Achievements from "./pages/Achievements";
import FishMinigame from "./pages/FishMinigame";
import NotFound from "./pages/NotFound";
import { FishOverlay } from "@/components/ui/fish-overlay";
import { useState } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [isFishOverlayOpen, setIsFishOverlayOpen] = useState(false);

  const handleGoldfishClick = () => {
    setIsFishOverlayOpen(true);
  };

  const handleCloseFishOverlay = () => {
    setIsFishOverlayOpen(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home onGoldfishClick={handleGoldfishClick} />} />
            <Route path="/task-tree" element={<TaskTree />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/minigame" element={<FishMinigame />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <FishOverlay isOpen={isFishOverlayOpen} onClose={handleCloseFishOverlay} />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
