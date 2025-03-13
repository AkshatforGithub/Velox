
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { cn } from "../lib/utils.js";
import useAuth from '../store/useAuth.js';
import { LoaderCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const LampContainer = ({ children, className }) => {
  return (
    <div className={cn("relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 w-full rounded-md z-0", className)}>
      <div className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0 ">
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          viewport={{ once: true }}
          style={{ backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))` }}
          className="absolute inset-auto right-1/2 h-56 w-[30rem] bg-gradient-conic from-cyan-500 via-transparent to-transparent text-white"
        >
        </motion.div>
      </div>
      <div className="relative z-50 flex -translate-y-80 flex-col items-center px-5">
        {children}
      </div>
    </div>
  );
};

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ fullname: '', email: '', password: '' });

  const { isSigningUp, signup } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.fullname.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!formData.password.trim()) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters long");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email address");
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password)) 
      return toast.error("Password must contain an uppercase letter, a lowercase letter, a number, and a special character");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if(success===true) signup(formData);
  };

  return (
    <LampContainer>
      <motion.h1
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
        viewport={{ once: true }}
        className="mt-4 max-w-full text-center text-lg text-slate-300"
      >
      </motion.h1>
      
      <div className="w-full max-w-full p-6 bg-slate-900 rounded-lg shadow-lg mt-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              className="w-full p-2 rounded bg-slate-800 text-white border border-slate-700"
              required
            />
          </div>
          
          <div>
            <label className="block text-slate-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 rounded bg-slate-800 text-white border border-slate-700"
              required
            />
          </div>
          
          <div>
            <label className="block text-slate-300 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 rounded bg-slate-800 text-white border border-slate-700"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>   

          <button
            type="submit"
            className="w-full p-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition" 
            disabled={isSigningUp} 
          >
            {isSigningUp ? ( 
              <>
                <LoaderCircle size={20} className="inline-block animate-spin" /> Loading...
              </>
            ) : 'Create an Account'}
          </button>
        </form>
        
        <div className='text-center'>
          <p className="mt-4">
            Already have an account? {" "}
            <a href="/login" className="text-cyan-500 hover:underline">Login</a>
          </p>
        </div>
      </div>
    </LampContainer>
  );
};

export default SignupPage;
