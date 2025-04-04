"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from 'next/link';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  // Handle scroll event to change navbar style when scrolled
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogin = () => {
    router.push("/login");
  };
  
  const handleDashboard = () => {
    if (!session) {
      router.push("/login");
    } else {
      router.push("/Teacher");
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-gray-900 shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600">SchoolTime</span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className="px-3 py-2 text-white hover:text-blue-400 transition-colors">
              Home
            </Link>
            <button
              onClick={handleDashboard}
              className="px-3 py-2 text-white hover:text-blue-400 transition-colors"
            >
              Dashboard
            </button>
            {!session ? (
              <button
                onClick={handleLogin}
                className="ml-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Login
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  <span className="mr-2">{session.user.name}</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>

                {isOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl py-2 z-20 border border-gray-700">
                    <Link href="/Teacher" className="block px-4 py-2 text-white hover:bg-gray-700">
                      Dashboard
                    </Link>
                    <Link href="/profile" className="block px-4 py-2 text-white hover:bg-gray-700">
                      Profile
                    </Link>
                    <hr className="my-1 border-gray-700" />
                    <button
                      onClick={() => signOut()}
                      className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-900 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="block px-3 py-2 text-white hover:bg-gray-800 rounded-md">
              Home
            </Link>
            <button
              onClick={handleDashboard}
              className="w-full text-left block px-3 py-2 text-white hover:bg-gray-800 rounded-md"
            >
              Dashboard
            </button>
            {session ? (
              <>
                <Link href="/profile" className="block px-3 py-2 text-white hover:bg-gray-800 rounded-md">
                  Profile
                </Link>
                <button
                  onClick={() => signOut()}
                  className="w-full text-left block px-3 py-2 text-red-400 hover:bg-gray-800 rounded-md"
                >
                  Sign out
                </button>
              </>
            ) : (
              <button
                onClick={handleLogin}
                className="w-full text-left block px-3 py-2 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-md"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
