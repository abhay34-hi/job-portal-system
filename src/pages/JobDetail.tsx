
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useJobs, Job } from '@/contexts/JobContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Check } from 'lucide-react';

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { jobs, getJobById, applyToJob, hasApplied } = useJobs();
  const { isAuthenticated, userRole, currentUser, updateUserProfile } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [isApplied, setIsApplied] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!id) return;

    const jobData = getJobById(id);
    if (jobData) {
      setJob(jobData);
      setIsApplied(hasApplied(id));
    } else {
      navigate('/find-jobs');
      toast({
        title: "Job not found",
        description: "The job you're looking for doesn't exist",
        variant: "destructive",
      });
    }
  }, [id, getJobById, hasApplied, navigate, toast]);

  const handleApply = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (userRole !== 'jobseeker') {
      toast({
        title: "Access denied",
        description: "Only job seekers can apply for jobs",
        variant: "destructive",
      });
      return;
    }

    // Check if user has a resume
    if (!currentUser?.hasResume) {
      setShowDialog(true);
      return;
    }

    // If user has a resume, they can apply directly
    submitApplication();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setResumeFile(file);
  };

  const submitApplication = () => {
    if (!job) return;

    try {
      // In a real app, we would upload the file to a server
      // Here, we just simulate the upload
      const resumeUrl = resumeFile 
        ? URL.createObjectURL(resumeFile) 
        : "https://example.com/resume.pdf";

      // Update user profile if they just uploaded a resume
      if (resumeFile && currentUser) {
        updateUserProfile({ hasResume: true });
      }

      // Submit the application
      applyToJob(job.id, resumeUrl, coverLetter);
      
      setIsApplied(true);
      setShowDialog(false);
      setShowSuccessDialog(true);
      
    } catch (error) {
      toast({
        title: "Application failed",
        description: "There was an error submitting your application",
        variant: "destructive",
      });
      console.error("Application error:", error);
    }
  };

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Loading job details...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="outline" 
        onClick={() => navigate('/find-jobs')} 
        className="mb-6"
      >
        Back to Jobs
      </Button>
      
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-navy">{job.title}</CardTitle>
              <CardDescription className="text-lg">{job.company}</CardDescription>
            </div>
            <Badge variant="outline" className="w-fit">{job.type || 'Full-time'}</Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-1">Location</h3>
              <p className="text-gray-600">{job.location}</p>
            </div>
            
            {job.salary && (
              <div>
                <h3 className="font-medium mb-1">Salary</h3>
                <p className="text-gray-600">{job.salary}</p>
              </div>
            )}
            
            <div>
              <h3 className="font-medium mb-1">Posted</h3>
              <p className="text-gray-600">
                {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Job Description</h3>
            <p className="text-gray-600 whitespace-pre-line">{job.description}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Requirements</h3>
            <ul className="list-disc pl-5 space-y-1">
              {job.requirements.map((req, idx) => (
                <li key={idx} className="text-gray-600">{req}</li>
              ))}
            </ul>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end">
          {isAuthenticated && userRole === 'jobseeker' ? (
            isApplied ? (
              <Button disabled className="bg-green-600 hover:bg-green-700">
                <Check className="mr-2 h-4 w-4" /> Applied
              </Button>
            ) : (
              <Button onClick={handleApply} className="bg-teal hover:bg-teal/90">
                Apply Now
              </Button>
            )
          ) : (
            userRole !== 'jobseeker' && isAuthenticated ? (
              <Button disabled variant="outline">
                Employers cannot apply for jobs
              </Button>
            ) : (
              <Button onClick={() => navigate('/login')} className="bg-navy hover:bg-navy/90">
                Sign in to Apply
              </Button>
            )
          )}
        </CardFooter>
      </Card>
      
      {/* Resume Upload Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Resume</DialogTitle>
            <DialogDescription>
              You need to upload your resume before applying for this job.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="resume" className="text-sm font-medium">
                Resume (PDF or Word)
              </label>
              <Input
                id="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="cover-letter" className="text-sm font-medium">
                Cover Letter (Optional)
              </label>
              <Textarea
                id="cover-letter"
                placeholder="Tell the employer why you're a great fit..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={submitApplication} 
              disabled={!resumeFile}
              className="bg-teal hover:bg-teal/90"
            >
              Submit Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Application Submitted!</DialogTitle>
            <DialogDescription>
              Your application for {job.title} at {job.company} has been successfully submitted.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-6">
            <div className="rounded-full bg-green-100 p-3">
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={() => {
                setShowSuccessDialog(false);
                navigate('/applications');
              }}
              className="w-full bg-teal hover:bg-teal/90"
            >
              View My Applications
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobDetail;
