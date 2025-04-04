"use client";
import React, { useState, useEffect, useContext } from "react";
import FaceRecog from "../components/faceRecog";
import { getStudentDetails } from "../server/server";
import { storeData } from "../server/server";
import { AppContext } from "../context";
import Loader from "../components/loader";

const Page = () => {
  const { makesessionobj } = useContext(AppContext);
  const [profile, setProfile] = useState([]);
  const [timer, setTimer] = useState(1000); // Default timer is 10 seconds
  const [active, setActive] = useState(true);
  const [absentees, setAbsentees] = useState([]);
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    if (!makesessionobj?.sessionNo) {
      setLoading(true);
    } else {
      setLoading(false);
      localStorage.setItem("makesessionobj", JSON.stringify(makesessionobj)); // Store makesessionobj in localStorage
    }


    const storedProfile = false;
    const storedTimer = false;
    const storedSession = false; // Retrieve stored makesessionobj

    // Reset timer and profile if there's no previous session data
    if (storedTimer && Number(storedTimer) > 0) {
      setTimer(Number(storedTimer)); // Set to the previously saved timer if it exists
    } else {
      setTimer(1000);
    }

    if (storedProfile) {
      setProfile(JSON.parse(storedProfile)); // Load previously saved profile
    } else {
      getStudentDetails(makesessionobj).then((data) => {
        setProfile(data);
        localStorage.setItem("profile", JSON.stringify(data)); 
      });
    }

    if (storedSession) {
     
    }

  }, [makesessionobj]);

  // Save updated profile, timer, and makesessionobj to localStorage
  useEffect(() => {
    if (active) {
      localStorage.setItem("profile", JSON.stringify(profile));
      localStorage.setItem("timer", JSON.stringify(timer));
      if (makesessionobj) {
        localStorage.setItem("makesessionobj", JSON.stringify(makesessionobj)); // Persist makesessionobj
      }
    }
  }, [profile, timer, active, makesessionobj]);

  // Handle Timer Countdown
  useEffect(() => {
    if (active && timer > 0) {
      const timerInterval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timerInterval);
    } else if (active && timer <= 0) {
      setActive(false);
      setAbsentees(profile.filter((student) => !student.present));
      storeData(profile, makesessionobj); // Save session data
      localStorage.removeItem("timer"); // Clear timer from storage
      localStorage.removeItem("profile"); // Clear profile from storage
      localStorage.removeItem("makesessionobj"); // Clear makesessionobj from localStorage
    }
  }, [timer, active, profile, makesessionobj]);

  // Update Attendance
  const updateAttendance = (rollno) => {
    const updatedProfile = profile.map((data) =>
      data.rollno === rollno ? { ...data, present: true } : data
    );
    setProfile(updatedProfile);
  };

  // Format time to display in minutes and seconds
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <Loader />;
  }

  if (!profile.length && active) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <span className="text-xl font-semibold text-white">Loading student data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {active && (
        <FaceRecog setProfile={setProfile} profile={profile} setTimer={setTimer} makesessionobj={makesessionobj} />
      )}

      <div className="w-full lg:w-[50vw] p-6 overflow-y-auto">
        <div className="bg-gray-800 bg-opacity-60 backdrop-filter backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-white">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600">
                Student Attendance
              </span>
            </h2>
            
            {active ? (
              <div className="mt-6 flex flex-col items-center">
                <div className="text-xl font-medium text-gray-300 mb-2">Time Remaining</div>
                <div className="bg-gray-900 rounded-full w-28 h-28 flex items-center justify-center relative">
                  <svg className="absolute top-0 left-0 w-28 h-28">
                    <circle
                      className="text-gray-700"
                      strokeWidth="6"
                      stroke="currentColor"
                      fill="transparent"
                      r="40"
                      cx="56"
                      cy="56"
                    />
                    <circle
                      className="text-blue-500"
                      strokeWidth="6"
                      strokeDasharray={250}
                      strokeDashoffset={250 * (1 - timer / 1000)}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="40"
                      cx="56"
                      cy="56"
                    />
                  </svg>
                  <span className="text-3xl font-bold text-white">{formatTime(timer)}</span>
                </div>
                <p className="text-gray-400 mt-2">Seconds</p>
              </div>
            ) : (
              <div className="flex items-center justify-center mt-4">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-lg font-semibold bg-blue-900 text-blue-100">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Session Completed
                </span>
              </div>
            )}
          </div>
          
          {!active && (
            <div className="mb-8 p-4 bg-gray-900 bg-opacity-70 rounded-xl shadow-lg border border-gray-700">
              <div className="flex items-center mb-2">
                <svg className="w-6 h-6 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h3 className="text-xl font-bold text-white">Session Summary</h3>
              </div>
              <div className="flex flex-wrap gap-3 mt-3">
                <div className="bg-gray-800 rounded-lg p-3 flex-1 min-w-[100px] border border-gray-700">
                  <div className="text-gray-400 text-sm">Total Students</div>
                  <div className="text-2xl font-bold text-white mt-1">{profile.length}</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3 flex-1 min-w-[100px] border border-gray-700">
                  <div className="text-gray-400 text-sm">Present</div>
                  <div className="text-2xl font-bold text-green-500 mt-1">
                    {profile.filter(s => s.present).length}
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3 flex-1 min-w-[100px] border border-gray-700">
                  <div className="text-gray-400 text-sm">Absent</div>
                  <div className="text-2xl font-bold text-red-500 mt-1">{absentees.length}</div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {profile.map((data) => (
            <div
              key={data.rollno}
              className={`rounded-xl overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl ${
                data.present ? "bg-gradient-to-br from-green-900 to-green-800" : "bg-gradient-to-br from-red-900 to-red-800"
              }`}
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xl font-bold text-white">{data.name}</div>
                  <div className={`px-2 py-1 rounded-full text-xs ${
                    data.present ? "bg-green-500 text-green-100" : "bg-red-500 text-red-100"
                  }`}>
                    {data.present ? "Present" : "Absent"}
                  </div>
                </div>
                
                <div className="flex items-center mb-3">
                  <svg className="w-5 h-5 text-gray-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path>
                  </svg>
                  <div className="text-sm text-gray-300">{data.rollno}</div>
                </div>

                {active && (
                  <button
                    onClick={() => updateAttendance(data.rollno)}
                    className={`w-full py-2 rounded-lg text-white font-medium transition-all duration-150 ${
                      data.present 
                        ? "bg-green-700 hover:bg-green-600" 
                        : "bg-red-700 hover:bg-red-600"
                    }`}
                  >
                    {data.present ? "✓ Marked Present" : "Mark as Present"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {!active && absentees.length > 0 && (
          <div className="mt-8 p-6 bg-gray-800 bg-opacity-70 rounded-xl shadow-xl border border-gray-700">
            <h3 className="text-xl font-bold text-white flex items-center mb-4">
              <svg className="w-6 h-6 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
              Absentees
            </h3>
            <div className="space-y-2">
              {absentees.map((student) => (
                <div key={student.rollno} className="p-3 bg-red-900 bg-opacity-40 rounded-lg flex justify-between items-center">
                  <div>
                    <div className="text-white font-medium">{student.name}</div>
                    <div className="text-red-300 text-sm">{student.rollno}</div>
                  </div>
                  <span className="bg-red-800 text-red-200 px-3 py-1 rounded-full text-xs">Absent</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {!active && absentees.length === 0 && (
          <div className="mt-8 p-6 bg-green-900 bg-opacity-20 rounded-xl shadow-xl border border-green-800 text-center">
            <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 className="text-xl font-bold text-white mb-2">Perfect Attendance!</h3>
            <p className="text-green-300">All students are present today. Great job!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
