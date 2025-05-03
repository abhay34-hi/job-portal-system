
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useJobs } from '@/contexts/JobContext';

const EmployerProfile = () => {
  const { isAuthenticated, userRole, currentUser, updateUserProfile } = useAuth();
  const { getEmployerJobs } = useJobs();
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [company, setCompany] = useState(currentUser?.company || '');
  const [companyDescription, setCompanyDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
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
    
    // Populate fields with currentUser data
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setCompany(currentUser.company || '');
    }
  }, [isAuthenticated, userRole, currentUser, navigate, toast]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Update profile
      updateUserProfile({
        name,
        email,
        company
      });
      
      setTimeout(() => {
        setIsSaving(false);
        toast({
          title: "Profile updated",
          description: "Your company profile has been updated successfully",
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
      <h1 className="text-3xl font-bold text-navy mb-6">Company Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>
                  Update your company details and information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input
                    id="company-name"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Your company name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact-name">Contact Person</Label>
                  <Input
                    id="contact-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contact person name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@company.com"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website">Company Website (Optional)</Label>
                  <Input
                    id="website"
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://yourcompany.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company-description">Company Description (Optional)</Label>
                  <Textarea
                    id="company-description"
                    value={companyDescription}
                    onChange={(e) => setCompanyDescription(e.target.value)}
                    placeholder="Tell candidates about your company mission, values, and culture..."
                    className="min-h-[150px]"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit"
                  disabled={isSaving}
                  className="w-full md:w-auto bg-navy hover:bg-navy/90"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Account Type</p>
                <p className="font-medium">Employer</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="font-medium">April 2025</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Active Job Listings</p>
                <p className="font-medium">{employerJobs.length} Jobs</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Total Applications</p>
                <p className="font-medium">0 Applications</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => navigate('/manage-jobs')}>
                Manage Job Listings
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                If you need assistance with your job postings or have questions about your account,
                our support team is here to help.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployerProfile;
