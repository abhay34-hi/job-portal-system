
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Briefcase, User } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'jobseeker' | 'employer'>('jobseeker');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Demo credentials
      const demoCredentials = {
        employer: { email: 'employer@example.com', password: 'password' },
        jobseeker: { email: 'jobseeker@example.com', password: 'password' }
      };

      // If the demo credentials are used, automatically fill them in
      const demoLogin = userType === 'employer' ? 
        email === demoCredentials.employer.email :
        email === demoCredentials.jobseeker.email;

      if (demoLogin) {
        const success = await login(
          email, 
          password, 
          userType
        );

        if (success) {
          toast({
            title: "Login successful",
            description: `Welcome back!`,
          });
          
          navigate(userType === 'employer' ? '/manage-jobs' : '/find-jobs');
          return;
        }
      }

      // Regular login
      const success = await login(email, password, userType);
      
      if (success) {
        toast({
          title: "Login successful",
          description: `Welcome back!`,
        });
        
        navigate(userType === 'employer' ? '/manage-jobs' : '/find-jobs');
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-lightgray py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-navy">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Sign in to your account to continue</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Choose your account type to login
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
                    <div className="flex items-center justify-between">
                      <label htmlFor="jobseeker-password" className="text-sm font-medium">
                        Password
                      </label>
                      <Link to="/forgot-password" className="text-xs text-teal hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="jobseeker-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-teal hover:bg-teal/90"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                  
                  <div className="text-xs text-gray-500 text-center mt-2">
                    Demo credentials: jobseeker@example.com / password
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="employer">
                <form onSubmit={handleSubmit} className="space-y-4">
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
                    <div className="flex items-center justify-between">
                      <label htmlFor="employer-password" className="text-sm font-medium">
                        Password
                      </label>
                      <Link to="/forgot-password" className="text-xs text-teal hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="employer-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-navy hover:bg-navy/90"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                  
                  <div className="text-xs text-gray-500 text-center mt-2">
                    Demo credentials: employer@example.com / password
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center">
              Don't have an account?{" "}
              <Link to="/register" className="text-teal font-medium hover:underline">
                Create account
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
