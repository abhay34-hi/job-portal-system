
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Briefcase, User } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [userType, setUserType] = useState<'jobseeker' | 'employer'>('jobseeker');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please check your passwords and try again",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const userData = {
        name,
        email,
        role: userType,
      };
      
      if (userType === 'employer') {
        Object.assign(userData, { company: companyName });
      }
      
      const success = await register(userData, password);
      
      if (success) {
        toast({
          title: "Registration successful",
          description: "Your account has been created successfully",
        });
        
        navigate(userType === 'employer' ? '/post-job' : '/profile');
      } else {
        toast({
          title: "Registration failed",
          description: "There was a problem creating your account",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Registration error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-lightgray py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-navy">Create Account</h1>
          <p className="text-gray-600 mt-2">Sign up to start your journey with us</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-center">Sign Up</CardTitle>
            <CardDescription className="text-center">
              Choose your account type to register
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="jobseeker" onValueChange={(v) => setUserType(v as 'jobseeker' | 'employer')}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="jobseeker" className="flex items-center justify-center">
                  <User size={16} className="mr-2" />
                  Job Seeker
                </TabsTrigger>
                <TabsTrigger value="employer" className="flex items-center justify-center">
                  <Briefcase size={16} className="mr-2" />
                  Employer
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="jobseeker">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="jobseeker-name" className="text-sm font-medium">
                      Full Name
                    </label>
                    <Input
                      id="jobseeker-name"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="jobseeker-email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="jobseeker-email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="jobseeker-password" className="text-sm font-medium">
                      Password
                    </label>
                    <Input
                      id="jobseeker-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="jobseeker-confirm-password" className="text-sm font-medium">
                      Confirm Password
                    </label>
                    <Input
                      id="jobseeker-confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-teal hover:bg-teal/90"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="employer">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="employer-name" className="text-sm font-medium">
                      Full Name
                    </label>
                    <Input
                      id="employer-name"
                      placeholder="Jane Smith"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="company-name" className="text-sm font-medium">
                      Company Name
                    </label>
                    <Input
                      id="company-name"
                      placeholder="Acme Inc."
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="employer-email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="employer-email"
                      type="email"
                      placeholder="company@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="employer-password" className="text-sm font-medium">
                      Password
                    </label>
                    <Input
                      id="employer-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="employer-confirm-password" className="text-sm font-medium">
                      Confirm Password
                    </label>
                    <Input
                      id="employer-confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-navy hover:bg-navy/90"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-teal font-medium hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
