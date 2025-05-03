
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useJobs } from '@/contexts/JobContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Check } from 'lucide-react';

const PostJob = () => {
  const { isAuthenticated, userRole, currentUser } = useAuth();
  const { addJob } = useJobs();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('Full-time');
  const [salary, setSalary] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Parse requirements from text to array
      const requirementsList = requirements
        .split('\n')
        .map(req => req.trim())
        .filter(req => req !== '');

      if (requirementsList.length === 0) {
        toast({
          title: "Missing requirements",
          description: "Please add at least one requirement",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Add job
      addJob({
        title,
        company: currentUser?.company || 'Company Name',
        location,
        description,
        requirements: requirementsList,
        type,
        salary
      });

      // Reset form and show success message
      setIsSuccess(true);
      
      setTimeout(() => {
        setTitle('');
        setLocation('');
        setType('Full-time');
        setSalary('');
        setDescription('');
        setRequirements('');
        setIsSubmitting(false);
        setIsSuccess(false);
        
        toast({
          title: "Job posted successfully",
          description: "Your job listing is now live",
        });
        
        navigate('/manage-jobs');
      }, 2000);
    } catch (error) {
      toast({
        title: "Error posting job",
        description: "There was a problem posting your job",
        variant: "destructive",
      });
      console.error("Error posting job:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-navy mb-6">Post a New Job</h1>

      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription>
            Fill in the information below to create your job listing.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="job-title" className="text-sm font-medium">
                Job Title *
              </label>
              <Input
                id="job-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Frontend Developer"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="job-location" className="text-sm font-medium">
                  Location *
                </label>
                <Input
                  id="job-location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Remote, New York, NY"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="job-type" className="text-sm font-medium">
                  Job Type *
                </label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                    <SelectItem value="Temporary">Temporary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="job-salary" className="text-sm font-medium">
                Salary Range (Optional)
              </label>
              <Input
                id="job-salary"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="e.g. $50,000 - $70,000 per year"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="job-description" className="text-sm font-medium">
                Job Description *
              </label>
              <Textarea
                id="job-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a detailed description of the role, responsibilities, and ideal candidate..."
                className="min-h-[150px]"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="job-requirements" className="text-sm font-medium">
                Requirements *
              </label>
              <Textarea
                id="job-requirements"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="Enter each requirement on a new line, e.g.:
3+ years experience with JavaScript
Bachelor's degree in Computer Science
Strong communication skills"
                className="min-h-[150px]"
                required
              />
              <p className="text-xs text-gray-500">Enter each requirement on a new line</p>
            </div>
          </CardContent>

          <CardFooter>
            <div className="w-full flex flex-col md:flex-row gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/manage-jobs')}
                className="md:flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isSuccess}
                className={`md:flex-1 ${isSuccess ? 'bg-green-600 hover:bg-green-700' : 'bg-navy hover:bg-navy/90'}`}
              >
                {isSubmitting ? (
                  "Posting Job..."
                ) : isSuccess ? (
                  <span className="flex items-center">
                    <Check className="mr-2" size={16} /> Job Posted
                  </span>
                ) : (
                  "Post Job"
                )}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default PostJob;
