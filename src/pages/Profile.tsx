
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Check } from 'lucide-react';

const Profile = () => {
  const { isAuthenticated, userRole, currentUser, updateUserProfile } = useAuth();
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [hasResume, setHasResume] = useState(!!currentUser?.hasResume);
  const [isSaving, setIsSaving] = useState(false);
  
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
    
    // Populate fields with currentUser data
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setHasResume(!!currentUser.hasResume);
    }
  }, [isAuthenticated, userRole, currentUser, navigate, toast]);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setResumeFile(file);
    if (file) {
      setHasResume(true);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Update profile
      updateUserProfile({
        name,
        email,
        hasResume: hasResume || !!resumeFile
      });
      
      setTimeout(() => {
        setIsSaving(false);
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully",
        });
      }, 1000);
    } catch (error) {
      toast({
        title: "Error updating profile",
        description: "There was a problem updating your profile",
        variant: "destructive",
      });
      console.error("Profile update error:", error);
      setIsSaving(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-navy mb-6">My Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal information and resume
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="resume">Resume</Label>
                  <div className="flex flex-col gap-2">
                    {hasResume && (
                      <div className="flex items-center text-sm text-green-600 mb-2">
                        <Check className="mr-1 h-4 w-4" /> You have a resume on file
                      </div>
                    )}
                    <Input
                      id="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                    />
                    <p className="text-xs text-gray-500">
                      Upload a new resume to replace your current one. Supported formats: PDF, DOC, DOCX.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit"
                  disabled={isSaving}
                  className="w-full md:w-auto bg-teal hover:bg-teal/90"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Account Type</p>
                <p className="font-medium">Job Seeker</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="font-medium">April 2025</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Applications</p>
                <p className="font-medium">0 Applications</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => navigate('/applications')}>
                View Applications
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
