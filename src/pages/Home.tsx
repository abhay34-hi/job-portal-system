
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight, Briefcase, Building, User } from 'lucide-react';

const Home = () => {
  const { isAuthenticated, userRole } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      title: "Easy Job Posting",
      description: "Post job listings quickly and reach qualified candidates immediately.",
      icon: Building
    },
    {
      title: "Smart Job Matching",
      description: "Our system matches job seekers with positions that fit their skills and experience.",
      icon: User
    },
    {
      title: "Streamlined Applications",
      description: "Apply with just a few clicks once your profile and resume are set up.",
      icon: Briefcase
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-navy text-white py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Dream Job or Perfect Candidate</h1>
              <p className="text-lg mb-8 opacity-90">
                Connecting talented professionals with great companies. Start your journey today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  userRole === 'jobseeker' ? (
                    <Button 
                      onClick={() => navigate('/find-jobs')} 
                      className="bg-teal hover:bg-teal/90 text-white px-8 py-6"
                    >
                      Find Jobs <ArrowRight size={18} className="ml-2" />
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => navigate('/post-job')} 
                      className="bg-teal hover:bg-teal/90 text-white px-8 py-6"
                    >
                      Post a Job <ArrowRight size={18} className="ml-2" />
                    </Button>
                  )
                ) : (
                  <>
                    <Button 
                      onClick={() => navigate('/register')} 
                      className="bg-teal hover:bg-teal/90 text-white px-8 py-6"
                    >
                      Create Account <ArrowRight size={18} className="ml-2" />
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/login')} 
                      className="border-white text-white hover:bg-white/10 px-8 py-6"
                    >
                      Sign In
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1573496130407-57329f01f769?w=800&auto=format&fit=crop&q=80" 
                alt="Job seeker" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-navy mb-12">Why Choose Employ Your Future</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-lightgray p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-teal/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <feature.icon size={24} className="text-teal" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-navy">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-lightblue/20">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold text-navy mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Whether you're looking for your next career move or searching for top talent, we've got you covered.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register?role=jobseeker">
              <Button className="bg-navy hover:bg-navy/90 px-8 py-6">
                <User size={18} className="mr-2" /> Job Seeker
              </Button>
            </Link>
            
            <Link to="/register?role=employer">
              <Button className="bg-teal hover:bg-teal/90 px-8 py-6">
                <Building size={18} className="mr-2" /> Employer
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
