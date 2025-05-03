
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  employerId: string;
  createdAt: string;
  salary?: string;
  type?: string; // Full-time, Part-time, Contract, etc.
}

export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  resumeUrl: string;
  coverLetter?: string;
  status: 'submitted' | 'reviewed' | 'interviewed' | 'rejected' | 'accepted';
  createdAt: string;
}

interface JobContextType {
  jobs: Job[];
  userApplications: JobApplication[];
  addJob: (jobData: Omit<Job, 'id' | 'employerId' | 'createdAt'>) => void;
  applyToJob: (jobId: string, resumeUrl: string, coverLetter?: string) => void;
  getUserApplications: () => JobApplication[];
  getEmployerJobs: () => Job[];
  getJobById: (id: string) => Job | undefined;
  hasApplied: (jobId: string) => boolean;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};

export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);

  // Load jobs from localStorage on init
  useEffect(() => {
    const storedJobs = localStorage.getItem('jobs');
    if (storedJobs) {
      setJobs(JSON.parse(storedJobs));
    } else {
      // Add some mock jobs initially
      const initialJobs: Job[] = [
        {
          id: '1',
          title: 'Frontend Developer',
          company: 'Tech Corp',
          location: 'Remote',
          description: 'We are looking for a Frontend Developer proficient in React, TypeScript and modern CSS.',
          requirements: ['3+ years React experience', 'TypeScript', 'CSS/Tailwind', 'Responsive design'],
          employerId: 'emp1',
          createdAt: new Date().toISOString(),
          salary: '$80,000 - $120,000',
          type: 'Full-time'
        },
        {
          id: '2',
          title: 'Backend Developer',
          company: 'DevCo',
          location: 'San Francisco, CA',
          description: 'Backend developer with Node.js expertise needed for our growing team.',
          requirements: ['Node.js', 'Express', 'MongoDB', 'API design'],
          employerId: 'emp2',
          createdAt: new Date().toISOString(),
          salary: '$90,000 - $130,000',
          type: 'Full-time'
        },
        {
          id: '3',
          title: 'UX Designer',
          company: 'Creative Agency',
          location: 'New York, NY',
          description: 'Creative UX designer with a portfolio of successful projects.',
          requirements: ['Figma', 'User research', 'Prototyping', 'Design systems'],
          employerId: 'emp3',
          createdAt: new Date().toISOString(),
          salary: '$75,000 - $110,000',
          type: 'Full-time'
        }
      ];
      setJobs(initialJobs);
      localStorage.setItem('jobs', JSON.stringify(initialJobs));
    }

    const storedApplications = localStorage.getItem('applications');
    if (storedApplications) {
      setApplications(JSON.parse(storedApplications));
    }
  }, []);

  const addJob = (jobData: Omit<Job, 'id' | 'employerId' | 'createdAt'>) => {
    if (!currentUser) return;
    
    const newJob: Job = {
      ...jobData,
      id: `job-${Date.now()}`,
      employerId: currentUser.id,
      createdAt: new Date().toISOString()
    };
    
    const updatedJobs = [...jobs, newJob];
    setJobs(updatedJobs);
    localStorage.setItem('jobs', JSON.stringify(updatedJobs));
  };

  const applyToJob = (jobId: string, resumeUrl: string, coverLetter?: string) => {
    if (!currentUser) return;
    
    const newApplication: JobApplication = {
      id: `app-${Date.now()}`,
      jobId,
      userId: currentUser.id,
      resumeUrl,
      coverLetter,
      status: 'submitted',
      createdAt: new Date().toISOString()
    };
    
    const updatedApplications = [...applications, newApplication];
    setApplications(updatedApplications);
    localStorage.setItem('applications', JSON.stringify(updatedApplications));
  };

  const getUserApplications = () => {
    if (!currentUser) return [];
    return applications.filter(app => app.userId === currentUser.id);
  };

  const getEmployerJobs = () => {
    if (!currentUser || currentUser.role !== 'employer') return [];
    return jobs.filter(job => job.employerId === currentUser.id);
  };

  const getJobById = (id: string) => {
    return jobs.find(job => job.id === id);
  };

  const hasApplied = (jobId: string) => {
    if (!currentUser) return false;
    return applications.some(app => app.jobId === jobId && app.userId === currentUser.id);
  };

  const value = {
    jobs,
    userApplications: getUserApplications(),
    addJob,
    applyToJob,
    getUserApplications,
    getEmployerJobs,
    getJobById,
    hasApplied
  };

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
};
