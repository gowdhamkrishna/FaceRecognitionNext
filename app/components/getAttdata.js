"use client"
import React,{useEffect} from "react";
import Loader from "./loader";

const GetData = ({ setDisplay ,AttendanceData}) => {
  

useEffect(() => {
console.log(AttendanceData);

}, [AttendanceData])


  return (

    <div className="left-[25%] w-[50vw] h-[90vh]  flex flex-col absolute z-10 rounded-lg p-4">
      <nav className="w-full flex justify-end bg-gray-700 p-2">
        <button
          onClick={() => setDisplay(false)}
          className="border-2 border-black group hover:border-green-500 w-12 h-12 duration-500 overflow-hidden relative"
          type="button"
        >
          <p className="text-3xl flex items-center justify-center text-black duration-500 relative z-10 group-hover:scale-0">
            ×
          </p>
          <span className="absolute w-full h-full bg-green-500 rotate-45 group-hover:top-9 duration-500 top-12 left-0"></span>
          <span className="absolute w-full h-full bg-green-500 rotate-45 top-0 group-hover:left-9 duration-500 left-12"></span>
          <span className="absolute w-full h-full bg-green-500 rotate-45 top-0 group-hover:right-9 duration-500 right-12"></span>
          <span className="absolute w-full h-full bg-green-500 rotate-45 group-hover:bottom-9 duration-500 bottom-12 right-0"></span>
        </button>
      </nav>
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold">Session {AttendanceData.sessionNo} - {AttendanceData.subject}</h2>
        <p>Class Type: {AttendanceData.classType}</p>
        <p>Session Time: {AttendanceData.sessionTime / 60000} min</p>
        <p>Timestamp: {new Date(AttendanceData.timestamp).toLocaleString()}</p>
        <h3 className="mt-4 font-semibold">Students:</h3>
        <ul className="mt-2">
          {AttendanceData.students.map((student) => (
            <li key={student.rollno} className="border-b py-2 flex justify-between">
              <span>{student.rollno}. {student.name}</span>
              <span className={student.present ? "text-green-600" : "text-red-600"}>{student.present ? "Present" : "Absent"}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GetData;