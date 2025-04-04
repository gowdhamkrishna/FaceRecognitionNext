"use client";
import React from "react";
import Link from "next/link";

const Page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-24">
          <div className="lg:w-1/2">
            <h1 className="text-5xl font-bold leading-tight mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600">
                SchoolTime
              </span>
            </h1>
            <h2 className="text-4xl font-bold text-white mb-6">
              Smart Attendance System with Face Recognition
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Eliminate manual attendance tracking with our advanced facial recognition technology. Accurate, secure, and effortless.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/Attend" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors duration-300">
                Start Attendance
              </Link>
              <Link href="/createAccount" className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors duration-300">
                Create Account
              </Link>
            </div>
          </div>
          
          <div className="lg:w-1/2 relative">
            {/* Interactive 3D element */}
            <div className="w-full aspect-square max-w-md mx-auto">
              <div className="my-loader">
                <div className="rubiks-cube">
                  {/* Faces of the Rubik's Cube */}
                  {['front', 'back', 'left', 'right', 'top', 'bottom'].map((face) => (
                    <div key={face} className={`face ${face}`}>
                      {Array(9).fill().map((_, idx) => (
                        <div
                          key={idx}
                          className="cube"
                          style={{ background: getColorByIndex(idx) }}
                        ></div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-14 h-14 rounded-full bg-blue-900 flex items-center justify-center mb-6">
                  <span className="text-blue-300 text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Cyberpunk Card */}
        <div className="container noselect mb-20 max-w-md mx-auto">
          <div className="canvas">
            {/* Trackers */}
            {Array(9).fill().map((_, idx) => (
              <div key={idx} className={`tracker tr-${idx + 1}`}></div>
            ))}
            {/* Card */}
            <div id="card">
              <div className="card-content">
                <div className="card-glare"></div>
                <div className="cyber-lines">
                  <span></span><span></span><span></span><span></span>
                </div>
                <p id="prompt">ATTENDANCE SYSTEM</p>
                <div className="title">SMART<br />TRACKING</div>
                <div className="glowing-elements">
                  <div className="glow-1"></div>
                  <div className="glow-2"></div>
                  <div className="glow-3"></div>
                </div>
                <div className="subtitle">
                  <span>Face Recognition</span>
                </div>
                <div className="card-particles">
                  <span></span><span></span><span></span>
                  <span></span><span></span><span></span>
                </div>
                <div className="corner-elements">
                  <span></span><span></span><span></span><span></span>
                </div>
                <div className="scan-line"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="text-center max-w-3xl mx-auto mb-20 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-10 shadow-2xl border border-blue-700">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Modernize Your Attendance System?</h2>
          <p className="text-lg text-blue-100 mb-8">
            Join thousands of educational institutions already using SchoolTime to save time and increase accuracy.
          </p>
          <Link href="/login" className="inline-flex items-center px-8 py-3 text-lg font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Get Started Now
            <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Features for the landing page
const features = [
  {
    icon: "👤",
    title: "Facial Recognition",
    description: "Advanced AI algorithms accurately identify students in real-time, even with varied lighting conditions."
  },
  {
    icon: "⚡",
    title: "Instant Tracking",
    description: "Mark attendance in seconds rather than minutes, saving valuable teaching and learning time."
  },
  {
    icon: "📊",
    title: "Data Analytics",
    description: "Generate insightful reports on attendance patterns, helping identify at-risk students early."
  },
  {
    icon: "🔐",
    title: "Secure System",
    description: "Biometric data is encrypted and securely stored, ensuring student privacy and data protection."
  },
  {
    icon: "📱",
    title: "Mobile Friendly",
    description: "Access the system from any device with a camera and internet connection."
  },
  {
    icon: "🔄",
    title: "Easy Integration",
    description: "Seamlessly integrates with existing school management and LMS systems."
  }
];

// Helper function to get the color based on the index of the cube
const getColorByIndex = (idx) => {
  const colors = [
    "#3182ce", // blue-600
    "#4f46e5", // indigo-600
    "#2563eb", // blue-600
    "#6366f1", // indigo-500
    "#ffffff"  // white
  ];
  return colors[idx % colors.length];
};

export default Page;
