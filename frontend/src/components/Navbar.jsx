import { Link, useLocation } from "react-router-dom";
import useAuth from "../store/useAuth.js";
import { LogOut, Settings, User } from "lucide-react";
import image from "../assets/logo.png";

const Navbar = () => {
  const { logout, authUser } = useAuth();
  const location = useLocation();


  const hideNavbarPaths = ["/signup"];

  if (hideNavbarPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className=" rounded-lg flex items-center justify-center">
                <img src={image} alt="logo" className="w-18 h-15" />
              </div>
              <h1 className="w-18  text-lg font-bold">Velox</h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link to={"/setting"} className="btn btn-sm gap-2 transition-colors">
              <Settings className="w-6 h-6" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link to={"/profile"} className="btn btn-sm gap-2">
                  <User className="size-7" />
                  <span className=" hidden sm:inline">Profile</span>
                </Link>

                <button className="flex gap-2 items-center" onClick={logout}>
                  <LogOut className="size-8" />
                  <span className="cursor-pointer hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
