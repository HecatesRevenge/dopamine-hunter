import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TaskTree from "./pages/TaskTree";
import Achievements from "./pages/Achievements";
import NotFound from "./pages/NotFound";
import { FishOverlay } from "@/components/ui/fish-overlay";
import { useState } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [isFishOverlayOpen, setIsFishOverlayOpen] = useState(false);

  const handleGoldfishClick = () => {
    setIsFishOverlayOpen(prev => !prev);
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
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>

        {/* Fish Overlay - rendered at app level for full screen coverage */}
        <FishOverlay
          isOpen={isFishOverlayOpen}
          onClose={() => setIsFishOverlayOpen(false)}
        />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
