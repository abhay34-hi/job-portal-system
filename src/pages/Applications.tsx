
import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useJobs } from '@/contexts/JobContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const Applications = () => {
  const { isAuthenticated, userRole } = useAuth();
  const { userApplications, getJobById } = useJobs();
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-navy mb-6">My Applications</h1>

      {userApplications.length === 0 ? (
        <Card className="text-center py-12">
          <CardHeader>
            <CardTitle className="text-xl">No applications yet</CardTitle>
            <CardDescription>
              Start applying for jobs to see your applications here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/find-jobs')} 
              className="mt-4 bg-teal hover:bg-teal/90"
            >
              Find Jobs
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {userApplications.map(application => {
            const job = getJobById(application.jobId);
            if (!job) return null;
            
            return (
              <Card key={application.id}>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div>
                      <CardTitle className="text-xl font-semibold text-navy">{job.title}</CardTitle>
                      <CardDescription className="text-base">{job.company} • {job.location}</CardDescription>
                    </div>
                    <Badge className="w-fit mt-2 md:mt-0">
                      {application.status === 'submitted' ? 'Application Submitted' : application.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Applied:</p>
                      <p>{formatDistanceToNow(new Date(application.createdAt), { addSuffix: true })}</p>
                    </div>
                    
                    {application.coverLetter && (
                      <div>
                        <p className="text-sm text-gray-500">Cover Letter:</p>
                        <p className="text-gray-600 line-clamp-3">{application.coverLetter}</p>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.slice(0, 3).map((req, idx) => (
                        <Badge key={idx} variant="outline" className="bg-gray-100">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to={`/jobs/${job.id}`} className="w-full">
                    <Button variant="outline" className="w-full">
                      View Job Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Applications;
