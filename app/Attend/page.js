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
  const [timer, setTimer] = useState(10); // Default timer is 10 seconds
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
      setTimer(10);
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

  if (loading) {
    return <Loader />;
  }

  if (!profile.length && active) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-xl font-semibold text-white">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row w-full h-full bg-gradient-to-b AttentanceContainer ">
      {active && (
        <FaceRecog setProfile={setProfile} profile={profile} setTimer={setTimer} makesessionobj={makesessionobj} />
      )}

      <div className="w-full lg:w-[50vw] AttentanceContainer p-8 overflow-y-auto rounded-lg shadow-xl">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-semibold text-white">Student Attendance</h2>
          {active ? (
            <p className="text-xl text-white mt-4">
              Time remaining: <span className="font-bold">{timer}s</span>
            </p>
          ) : (
            <p className="text-xl text-white mt-4 font-bold">Session is Over</p>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  xl:grid-cols-4 gap-8">
          {profile.map((data) => (
            <div
              key={data.rollno}
              className="bg-white  rounded-lg shadow-lg p-6 flex flex-col items-center space-y-4 hover:scale-105 transform transition-all duration-300 ease-in-out"
            >
              <div className="text-xl font-medium ">{data.name}</div>
              <div className="text-sm text-gray-600 mb-4">{data.rollno}</div>
              <div className="flex space-x-4">
                <button
                  onClick={() => updateAttendance(data.rollno)}
                  className={`${
                    data.present ? "bg-green-500" : "bg-red-600"
                  } text-white font-semibold py-2 px-6 rounded-md transition-all duration-300 ease-in-out hover:bg-opacity-90 focus:outline-none`}
                >
                  {data.present ? "Present" : "Absent"}
                </button>
              </div>
            </div>
          ))}
        </div>
        {!active && (
          <div className="mt-6 p-4 bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-white mb-4">Absentees:</h3>
            <ul className="text-white">
              {absentees.length > 0 ? (
                absentees.map((student) => (
                  <li key={student.rollno}>
                    {student.name} - {student.rollno}
                  </li>
                ))
              ) : (
                <li>No absentees!</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
