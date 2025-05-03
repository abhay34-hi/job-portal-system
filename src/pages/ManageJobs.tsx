
import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useJobs } from '@/contexts/JobContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Briefcase, Plus } from 'lucide-react';

const ManageJobs = () => {
  const { isAuthenticated, userRole, currentUser } = useAuth();
  const { getEmployerJobs } = useJobs();
  const navigate = useNavigate();
  const { toast } = useToast();

  const employerJobs = getEmployerJobs();

  useEffect(() => {
    // Restrict access to employers only
    if (!isAuthenticated) {
      toast({
        title: "Access denied",
        description: "Please login to access this page",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    if (userRole !== 'employer') {
      toast({
        title: "Access denied",
        description: "This section is for employers only",
        variant: "destructive",
      });
      navigate('/');
      return;
    }
  }, [isAuthenticated, userRole, navigate, toast]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-navy">Manage Jobs</h1>
        <Button onClick={() => navigate('/post-job')} className="bg-teal hover:bg-teal/90">
          <Plus size={16} className="mr-2" /> Post New Job
        </Button>
      </div>

      {employerJobs.length === 0 ? (
        <Card className="text-center py-12">
          <CardHeader>
            <div className="mx-auto bg-gray-100 rounded-full h-20 w-20 flex items-center justify-center mb-4">
              <Briefcase size={32} className="text-gray-500" />
            </div>
            <CardTitle className="text-xl">No jobs posted yet</CardTitle>
            <CardDescription>
              Start by posting your first job listing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/post-job')} 
              className="mt-4 bg-teal hover:bg-teal/90"
            >
              Post Your First Job
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {employerJobs.map(job => (
            <Card key={job.id} className="overflow-hidden">
              <div className="md:flex">
                <div className="p-6 flex-grow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-navy">{job.title}</h3>
                      <p className="text-gray-600">{job.location}</p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <Badge variant="outline" className="mr-2">
                        {job.type || 'Full-time'}
                      </Badge>
                      <Badge variant="secondary">
                        Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {job.description}
                    </p>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    {job.requirements.slice(0, 3).map((req, idx) => (
                      <Badge key={idx} variant="outline" className="bg-gray-100">
                        {req}
                      </Badge>
                    ))}
                    {job.requirements.length > 3 && (
                      <Badge variant="outline" className="bg-gray-100">
                        +{job.requirements.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 flex flex-row md:flex-col justify-between items-center md:justify-center md:space-y-4 md:border-l">
                  <div className="text-center">
                    <p className="text-sm font-medium">Applications</p>
                    <p className="text-2xl font-bold text-navy">0</p>
                  </div>
                  
                  <Link to={`/jobs/${job.id}`}>
                    <Button variant="outline">View Details</Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageJobs;
