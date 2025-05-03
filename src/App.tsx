
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { JobProvider } from "./contexts/JobContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FindJobs from "./pages/FindJobs";
import JobDetail from "./pages/JobDetail";
import Applications from "./pages/Applications";
import Profile from "./pages/Profile";
import PostJob from "./pages/PostJob";
import ManageJobs from "./pages/ManageJobs";
import EmployerProfile from "./pages/EmployerProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <JobProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/find-jobs" element={<FindJobs />} />
                  <Route path="/jobs/:id" element={<JobDetail />} />
                  <Route path="/applications" element={<Applications />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/post-job" element={<PostJob />} />
                  <Route path="/manage-jobs" element={<ManageJobs />} />
                  <Route path="/employer-profile" element={<EmployerProfile />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </JobProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
