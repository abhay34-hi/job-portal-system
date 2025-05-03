
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useJobs } from '@/contexts/JobContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import JobCard from '@/components/JobCard';
import { Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FindJobs = () => {
  const { isAuthenticated, userRole } = useAuth();
  const { jobs, userApplications } = useJobs();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState(jobs);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Restrict access to job seekers only
    if (!isAuthenticated) {
      toast({
        title: "Access denied",
        description: "Please login to access this page",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    if (userRole !== 'jobseeker') {
      toast({
        title: "Access denied",
        description: "This section is for job seekers only",
        variant: "destructive",
      });
      navigate('/');
      return;
    }
  }, [isAuthenticated, userRole, navigate, toast]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredJobs(jobs);
    } else {
      const term = searchTerm.toLowerCase();
      const results = jobs.filter(job => 
        job.title.toLowerCase().includes(term) || 
        job.company.toLowerCase().includes(term) || 
        job.description.toLowerCase().includes(term) ||
        job.location.toLowerCase().includes(term) ||
        job.requirements.some(req => req.toLowerCase().includes(term))
      );
      setFilteredJobs(results);
    }
  }, [searchTerm, jobs]);

  const appliedJobIds = userApplications.map(app => app.jobId);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-navy mb-6">Find Jobs</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search jobs by title, company, or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setSearchTerm('')} variant="outline" className="md:w-auto">
          Clear
        </Button>
      </div>
      
      {filteredJobs.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No jobs found</h3>
          <p className="text-gray-500">Try adjusting your search terms</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map(job => (
            <JobCard 
              key={job.id} 
              job={job} 
              applied={appliedJobIds.includes(job.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FindJobs;
