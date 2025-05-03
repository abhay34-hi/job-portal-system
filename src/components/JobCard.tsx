
import React from 'react';
import { Link } from 'react-router-dom';
import { Job } from '@/contexts/JobContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface JobCardProps {
  job: Job;
  applied?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ job, applied }) => {
  return (
    <Card className="job-card-transition">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-semibold text-navy">{job.title}</CardTitle>
            <CardDescription className="text-base font-medium">{job.company}</CardDescription>
          </div>
          <Badge variant={applied ? "secondary" : "outline"}>
            {applied ? "Applied" : job.type || "Full-time"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm">
            <span className="font-medium">Location:</span>
            <span className="ml-2 text-gray-600">{job.location}</span>
          </div>
          {job.salary && (
            <div className="flex items-center text-sm">
              <span className="font-medium">Salary:</span>
              <span className="ml-2 text-gray-600">{job.salary}</span>
            </div>
          )}
          <div className="flex items-center text-sm">
            <span className="font-medium">Posted:</span>
            <span className="ml-2 text-gray-600">
              {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">
          {job.description}
        </p>
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
      </CardContent>
      <CardFooter>
        <Link to={`/jobs/${job.id}`} className="w-full">
          <Button className="w-full bg-navy hover:bg-navy/80">
            {applied ? "View Application" : "View Details"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default JobCard;
