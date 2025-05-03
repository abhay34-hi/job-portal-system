
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-navy text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Employ Your Future</h3>
            <p className="text-sm opacity-75">
              Connecting talented professionals with their dream careers.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">For Job Seekers</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/find-jobs" className="hover:text-lightblue transition-colors">Browse Jobs</Link></li>
              <li><Link to="/register" className="hover:text-lightblue transition-colors">Create Account</Link></li>
              <li><Link to="/profile" className="hover:text-lightblue transition-colors">Upload Resume</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">For Employers</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/post-job" className="hover:text-lightblue transition-colors">Post a Job</Link></li>
              <li><Link to="/register" className="hover:text-lightblue transition-colors">Create Company Account</Link></li>
              <li><Link to="/manage-jobs" className="hover:text-lightblue transition-colors">Manage Job Postings</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>Email: manjunathabahy123@gmail.com.</li>
              <li>Phone: (555) 123-4567</li>
              <li>Address: 123 presidency colny bangalore, inter City</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm opacity-75">© 2025 Employ Your Future. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/privacy" className="text-sm hover:text-lightblue transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-sm hover:text-lightblue transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
