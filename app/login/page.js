"use client"
import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const App = () => {
  const router = useRouter();
  const { data: session } = useSession();
  
  if (session) {
    router.push('/');
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex justify-center items-center p-4">
      <div className="max-w-4xl w-full bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700 flex flex-col md:flex-row">
        {/* Left section - Login form */}
        <div className="w-full md:w-1/2 p-6 md:p-10">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
              SchoolTime
            </h1>
            <p className="text-gray-400 mt-2">Attendance Made Simple</p>
          </div>
          
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
            
            <div className="space-y-4">
              <button 
                onClick={() => signIn("google")} 
                className="w-full py-3 rounded-lg border border-gray-600 hover:border-blue-500 bg-gray-800 hover:bg-gray-700 transition-all duration-300 flex items-center justify-center group"
              >
                <div className="bg-white p-1.5 rounded-full mr-3">
                  <svg className="w-4 h-4" viewBox="0 0 533.5 544.3">
                    <path d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z" fill="#4285f4" />
                    <path d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z" fill="#34a853" />
                    <path d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z" fill="#fbbc04" />
                    <path d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z" fill="#ea4335" />
                  </svg>
                </div>
                <span className="text-white group-hover:text-blue-400 transition-colors duration-300">Continue with Google</span>
              </button>
              
              <button 
                onClick={() => signIn("github")} 
                className="w-full py-3 rounded-lg border border-gray-600 hover:border-blue-500 bg-gray-800 hover:bg-gray-700 transition-all duration-300 flex items-center justify-center group"
              >
                <div className="bg-white p-1.5 rounded-full mr-3">
                  <svg className="w-4 h-4" viewBox="0 0 32 32">
                    <path fillRule="evenodd" fill="#000" d="M16 4C9.371 4 4 9.371 4 16c0 5.3 3.438 9.8 8.207 11.387.602.11.82-.258.82-.578 0-.286-.011-1.04-.015-2.04-3.34.723-4.043-1.609-4.043-1.609-.547-1.387-1.332-1.758-1.332-1.758-1.09-.742.082-.726.082-.726 1.203.086 1.836 1.234 1.836 1.234 1.07 1.836 2.808 1.305 3.492 1 .11-.777.422-1.305.762-1.605-2.664-.301-5.465-1.332-5.465-5.93 0-1.313.469-2.383 1.234-3.223-.121-.3-.535-1.523.117-3.175 0 0 1.008-.32 3.301 1.23A11.487 11.487 0 0116 9.805c1.02.004 2.047.136 3.004.402 2.293-1.55 3.297-1.23 3.297-1.23.656 1.652.246 2.875.12 3.175.77.84 1.231 1.91 1.231 3.223 0 4.61-2.804 5.621-5.476 5.922.43.367.812 1.101.812 2.219 0 1.605-.011 2.898-.011 3.293 0 .32.214.695.824.578C24.566 25.797 28 21.3 28 16c0-6.629-5.371-12-12-12z" />
                  </svg>
                </div>
                <span className="text-white group-hover:text-blue-400 transition-colors duration-300">Continue with GitHub</span>
              </button>
            </div>
            
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-400">Or continue with email</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <Link href="/createAccount" className="block w-full">
                <button className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <path d="M20 8v6M23 11h-6" />
                  </svg>
                  <span>Create Account</span>
                </button>
              </Link>
              
              <p className="text-xs text-gray-400 text-center mt-6">
                By signing in, you agree to our 
                <a href="#" className="text-blue-400 hover:text-blue-300 mx-1">Terms of Service</a>
                and
                <a href="#" className="text-blue-400 hover:text-blue-300 mx-1">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
        
        {/* Right section - Illustration */}
        <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-blue-900 to-indigo-900 p-10">
          <div className="h-full flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold">Welcome to SchoolTime</h3>
              <p className="mt-2 text-blue-200">The smart attendance system powered by face recognition</p>
            </div>
            
            <div className="relative h-64">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-blue-200 opacity-50">
                  <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
                  <circle cx="12" cy="12" r="4"></circle>
                  <path d="M16.5 7.5a4 4 0 0 0-6.5 3"></path>
                  <path d="M7.5 16.5a4 4 0 0 0 6.5-3"></path>
                </svg>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-blue-200 opacity-75">
                &copy; {new Date().getFullYear()} SchoolTime • All rights reserved
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
