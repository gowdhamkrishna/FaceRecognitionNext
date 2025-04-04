"use client"
import React, { useEffect } from "react";
import Loader from "./loader";

const GetData = ({ setDisplay, AttendanceData }) => {
  useEffect(() => {
    console.log(AttendanceData);
  }, [AttendanceData])

  // Calculate attendance stats
  const totalStudents = AttendanceData.students?.length || 0;
  const presentStudents = AttendanceData.students?.filter(student => student.present).length || 0;
  const attendancePercentage = totalStudents > 0 ? Math.round((presentStudents / totalStudents) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="w-full max-w-4xl bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700 animate-fadeIn">
        <div className="flex justify-between items-center bg-gradient-to-r from-blue-900 to-indigo-900 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">Session Details</h2>
          <button
            onClick={() => setDisplay(false)}
            className="group relative w-10 h-10 rounded-full flex items-center justify-center border-2 border-gray-400 hover:border-red-500 transition-colors duration-300 focus:outline-none"
            aria-label="Close"
          >
            <svg className="w-6 h-6 text-white group-hover:text-red-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            <span className="absolute w-full h-full rounded-full bg-red-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
          </button>
        </div>
        
        <div className="p-6">
          {!AttendanceData ? (
            <Loader />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                  <div className="text-gray-400 text-sm mb-1">Session Info</div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <h3 className="text-xl font-bold text-white">{AttendanceData.subject}</h3>
                  </div>
                  <div className="mt-2 text-gray-300">
                    Session #{AttendanceData.sessionNo} • {AttendanceData.classType}
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                  <div className="text-gray-400 text-sm mb-1">Time Details</div>
                  <div className="text-xl font-bold text-white">
                    {Math.round(AttendanceData.sessionTime / 60000)} minutes
                  </div>
                  <div className="mt-2 text-gray-300 text-sm">
                    {new Date(AttendanceData.timestamp).toLocaleString()}
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                  <div className="text-gray-400 text-sm mb-1">Attendance Rate</div>
                  <div className="flex items-center">
                    <div className="text-xl font-bold text-white">{attendancePercentage}%</div>
                    <div className="ml-auto rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold" 
                         style={{ 
                           backgroundColor: `rgba(${attendancePercentage < 50 ? '239, 68, 68' : attendancePercentage < 75 ? '234, 179, 8' : '34, 197, 94'}, 0.2)`,
                           color: attendancePercentage < 50 ? '#f87171' : attendancePercentage < 75 ? '#facc15' : '#4ade80'
                         }}>
                      {presentStudents}/{totalStudents}
                    </div>
                  </div>
                  <div className="mt-2 w-full bg-gray-700 rounded-full h-2.5">
                    <div className="h-2.5 rounded-full" 
                         style={{ 
                           width: `${attendancePercentage}%`,
                           backgroundColor: attendancePercentage < 50 ? '#ef4444' : attendancePercentage < 75 ? '#eab308' : '#22c55e'
                         }}></div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
                <div className="bg-gray-900 px-6 py-3 border-b border-gray-700">
                  <h3 className="text-lg font-bold text-white">Student Attendance</h3>
                </div>
                
                <div className="p-2 max-h-[50vh] overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-gray-900 text-xs text-gray-300 uppercase sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left rounded-l-lg">Roll No</th>
                        <th className="px-4 py-2 text-left">Student Name</th>
                        <th className="px-4 py-2 text-center rounded-r-lg">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {AttendanceData.students?.map((student) => (
                        <tr key={student.rollno} className="hover:bg-gray-700 transition-colors duration-150">
                          <td className="px-4 py-3 text-left text-gray-300">
                            {student.rollno}
                          </td>
                          <td className="px-4 py-3 text-left text-white font-medium">
                            {student.name}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              student.present 
                                ? "bg-green-900 text-green-300" 
                                : "bg-red-900 text-red-300"
                            }`}>
                              {student.present ? "Present" : "Absent"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default GetData;