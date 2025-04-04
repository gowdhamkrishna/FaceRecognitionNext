"use client";
import React, { useEffect, useState, useContext } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import GetData from "../components/getAttdata"
import { getprofileDetails, getSessionDataForToday, getAttendanceData } from "../server/server";
import { format } from "date-fns";
import Makesession from "../components/makesession";
import { AppContext } from "../context";

const Page = () => {
  const [profileinfo, setP] = useState();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [date, setDate] = useState();
  const [currenTime, setTime] = useState();
  const [sessionsMarked, setMarked] = useState(0);
  const [showSessionForm, setShowSessionForm] = useState(false);
  const { makesessionobj, setSessionobj } = useContext(AppContext);
  const [showDisplay, setDisplay] = useState(false);
  const [AttendanceData, setAttendanceData] = useState({});

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    const date = new Date();
    setDate(date.toLocaleDateString());
  }, [status, router, date]);
  
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (session?.user?.email) {
      getprofileDetails(session.user.email).then((data) => setP(data));
    }
  }, [session?.user?.email]);

  const handleUpdateProfile = () => {
    console.log("Updating profile...");
    alert("Profile update functionality can be added here.");
  };

  const sessionTimes = [
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 1:00 PM",
    "1:30 PM - 2:30 PM",
    "2:30 PM - 3:30 PM",
    "3:30 PM - 4:30 PM",
  ];

  const getData = async () => {
    setMarked(await getSessionDataForToday());
  };
  
  const handleCardClick = (index) => {
    getAttendanceData(index + 1).then((data) => {
      setAttendanceData(data);
      if (data) {
        setDisplay(true);
      }
    })
  }
  
  setInterval(() => {
    setTime(format(new Date(), "HH:mm:ss"));
  }, 1000);

  const handleCreateSessionClick = () => {
    setShowSessionForm(!showSessionForm);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 pt-20 px-4 sm:px-6 lg:px-8">
      {showDisplay && <GetData setDisplay={setDisplay} AttendanceData={AttendanceData} />}
      
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-gray-800 bg-opacity-60 backdrop-filter backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700 p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600">
                  Welcome, {session?.user?.name || "Teacher"}
                </span>
              </h1>
              <p className="text-gray-300">
                {date} • {currenTime}
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center">
              <div className="bg-gray-700 px-4 py-2 rounded-lg flex items-center mr-3">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                <span className="text-gray-200 text-sm">Active</span>
              </div>
              <button
                onClick={handleUpdateProfile}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Update Classes
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-700 bg-opacity-50 rounded-xl p-5 shadow-lg border border-gray-600">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                </svg>
                Classes Handled for CSE-A
              </h2>
              <div className="space-y-2">
                {Object.entries(profileinfo?.cseA || {}).map(
                  ([subject, isHandled]) =>
                    isHandled && (
                      <div key={subject} className="flex items-center p-2 bg-gray-800 bg-opacity-50 rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
                        <span className="text-gray-200">{subject}</span>
                      </div>
                    )
                )}
              </div>
            </div>
            
            <div className="bg-gray-700 bg-opacity-50 rounded-xl p-5 shadow-lg border border-gray-600">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                </svg>
                Classes Handled for CSE-B
              </h2>
              <div className="space-y-2">
                {Object.entries(profileinfo?.cseB || {}).map(
                  ([subject, isHandled]) =>
                    isHandled && (
                      <div key={subject} className="flex items-center p-2 bg-gray-800 bg-opacity-50 rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 mr-3"></div>
                        <span className="text-gray-200">{subject}</span>
                      </div>
                    )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Attendance Sessions</h2>
              <p className="text-blue-200">Manage today's attendance sessions</p>
            </div>
            
            <button
              onClick={handleCreateSessionClick}
              className="mt-4 md:mt-0 relative inline-flex items-center px-6 py-3 overflow-hidden text-lg font-medium text-white border-2 border-blue-400 rounded-full hover:text-blue-900 group"
            >
              <span className="absolute left-0 block w-full h-0 transition-all bg-blue-400 opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease"></span>
              <span className="absolute right-0 flex items-center justify-start w-10 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </span>
              <span className="relative">Create Session</span>
            </button>
          </div>
          
          {showSessionForm && (
            <div className="mb-8 bg-gray-800 bg-opacity-60 rounded-xl p-5 border border-blue-700 shadow-lg">
              <Makesession
                router={router}
                sessionsMarked={sessionsMarked}
                makesessionobj={makesessionobj}
                setSessionobj={setSessionobj}
                setShowSessionForm={setShowSessionForm}
              />
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sessionTimes.map((time, index) => (
              <div
                key={index}
                onClick={() => handleCardClick(index)}
                className={`rounded-xl overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl cursor-pointer ${
                  index < sessionsMarked 
                    ? "bg-gradient-to-br from-green-800 to-green-900 border border-green-700" 
                    : "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700"
                }`}
              >
                <div className="p-5">
                  <div className="flex items-center mb-3">
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                      index < sessionsMarked ? "bg-green-500" : "bg-gray-500"
                    }`}></div>
                    <div className="text-lg font-bold text-white">Session {index + 1}</div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-300">{time}</div>
                    
                    <div className={`px-2 py-1 rounded-full text-xs ${
                      index < sessionsMarked 
                        ? "bg-green-700 text-green-100" 
                        : "bg-gray-700 text-gray-300"
                    }`}>
                      {index < sessionsMarked ? "Completed" : "Pending"}
                    </div>
                  </div>
                  
                  {index < sessionsMarked && (
                    <div className="mt-3 text-xs text-green-300 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Click to view attendance details
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
