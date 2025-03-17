import React, { use, useEffect } from 'react'
import Navbar from './components/Navbar'
import {Routes,Route, Navigate} from 'react-router-dom'
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import SettingPage from './pages/SettingPage';
import ProfilePage from './pages/ProfilePage';
import useAuth from './store/useAuth';
import { ShieldEllipsis } from "lucide-react";
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from './store/useThemeStore';




const App = () => {
  const{checkAuth,authUser,isCheckingAuth} = useAuth();
 const {theme} = useThemeStore();

  useEffect(() => {
    checkAuth();
  } ,[checkAuth]);
  


  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        <ShieldEllipsis 
          size={48} 
          className="animate opacity-80 transition-all duration-500" 
        />
        <span className="mt-2 text-lg font-medium animate-pulse">
          Authenticating...
        </span>
      </div>
    );
  }
  
  return (
    <div data-theme = {theme}>
      
      <Navbar/>
{/* in all we are checking if the user is authenticated or not so if he is it will show to content else will ask to login */}
      <Routes>
        <Route path="/" element={authUser ? <HomePage/>:<Navigate to ="/login"/>} />
        <Route path="/signup" element={!authUser ? <SignupPage/>:<Navigate to ="/"/>} />
        <Route path="/login" element={!authUser ?<LoginPage/>:<Navigate to ="/"/>} />
        <Route path="/setting" element={ authUser ? <SettingPage/> :<Navigate to ="/login"/>} />
        <Route path="/profile" element={authUser ?<ProfilePage/> :<Navigate to ="/login"/>} />
      </Routes>

      <Toaster/>
    
    </div>
  )
}

export default App
