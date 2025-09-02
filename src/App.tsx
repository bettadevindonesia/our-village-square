import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Events from "./pages/Events";
import Announcements from "./pages/Announcements";
import CertificateGenerator from "./pages/CertificateGenerator";
import EventDetail from "./pages/EventDetail";
import AnnouncementDetail from "./pages/AnnouncementDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <div className="min-h-screen bg-background">
          <Navigation />
          <main>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/tentang" element={<About />} />
              <Route path="/kontak" element={<Contact />} />
              <Route path="/acara" element={<Events />} />
              <Route path="/acara/:slug" element={<EventDetail />} />
              <Route path="/pengumuman" element={<Announcements />} />
              <Route path="/pengumuman/:slug" element={<AnnouncementDetail />} />
              <Route path="/surat" element={<CertificateGenerator />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
