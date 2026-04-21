import { useAuth } from "../context/AuthContext";
import { ArrowRight, Box } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50 text-center px-4 pt-16">
      
      <div className="max-w-3xl space-y-8">
        <div className="inline-flex items-center justify-center p-3 bg-white shadow-sm rounded-2xl mb-4 border border-gray-100">
          <Box className="text-gray-900 w-8 h-8" />
        </div>
        
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight sm:text-6xl">
          Modern Warehouse
          <span className="block text-gray-400 mt-2">Management Platform</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-lg text-gray-500">
          A seamless B2B space leasing platform built to connect space owners 
          with businesses quickly, safely, and securely.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          {!user ? (
            <>
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 transition"
              >
                Start free trial
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition"
              >
                Log in
              </Link>
            </>
          ) : (
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 transition"
            >
              Go to Dashboard <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default Home;