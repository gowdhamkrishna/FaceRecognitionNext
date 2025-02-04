"use client";
import React, { useEffect, useState, useContext } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import GetData from "../components/getAttdata"
import { getprofileDetails, getSessionDataForToday,getAttendanceData } from "../server/server";
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
  const [ showDisplay, setDisplay ] = useState(false);
  const [AttendanceData,setAttendanceData] = useState({});

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
   getAttendanceData(index+1).then((data)=>{setAttendanceData(data);
    if(data){
      setDisplay(true);
    }
   }
  )

 }
  setInterval(() => {
    setTime(format(new Date(), "HH:mm:ss"));
  }, 1000);


  const handleCreateSessionClick = () => {
    setShowSessionForm(!showSessionForm);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {showDisplay && <GetData setDisplay={setDisplay} AttendanceData={AttendanceData}/>}
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Welcome, {session?.user?.name || "User"}!
        </h1>
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Classes Handled for cseA:
          </h2>
          <ol className="list-disc list-inside">
            {Object.entries(profileinfo?.cseA || {}).map(
              ([subject, isHandled]) =>
                isHandled && (
                  <li key={subject} className="text-gray-600">
                    {subject}
                  </li>
                )
            )}
          </ol>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Classes Handled for cseB:
          </h2>
          <ol className="list-disc list-inside">
            {Object.entries(profileinfo?.cseB || {}).map(
              ([subject, isHandled]) =>
                isHandled && (
                  <li key={subject} className="text-gray-600">
                    {subject}
                  </li>
                )
            )}
          </ol>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleUpdateProfile}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Update Classes
          </button>
        </div>
      </div>

      <div className="w-[100vw] gap-6 bg-blue-600 flex items-center flex-col p-3">
        <p className="font-bold text-ellipsis text-[36px] text-white">
          Attendance Sessions {date} time {currenTime}
        </p>
        <button
          onClick={handleCreateSessionClick} // Toggle session form visibility
          className="animated-button"
        >
          <svg
            viewBox="0 0 24 24"
            className="arr-2"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
          </svg>
          <span className="text">Create Session</span>
          <span className="circle"></span>
          <svg
            viewBox="0 0 24 24"
            className="arr-1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
          </svg>
        </button>
        {showSessionForm && (
          <Makesession
            router={router}
            sessionsMarked={sessionsMarked}
            makesessionobj={makesessionobj}
            setSessionobj={setSessionobj}
            setShowSessionForm={setShowSessionForm}
          />
        )}{" "}
        {/* Render the Makesession component if showSessionForm is true */}
        <div className="cards">
          {sessionTimes.map((time, index) => (
            <div
              className="container flex items-center justify-center"
              onClick={() => {
                handleCardClick(index)
                
              }}
              key={index}
            >
              <div
                className={`box ${
                  index < sessionsMarked ? "bg-red-500" : "bg-gray-300"
                } p-4 rounded-lg transition-all duration-300`}
                style={{
                  backgroundColor:
                    index < sessionsMarked
                      ? "rgba(255, 0, 0, 0.3)"
                      : "transparent",
                  backdropFilter: "blur(5px)",
                }}
              >
                <div>
                  <strong>
                    Session {index + 1}: {time}
                  </strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
