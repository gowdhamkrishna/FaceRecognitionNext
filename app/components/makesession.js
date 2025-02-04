import React, { useState, useEffect } from "react";

const Makesession = ({ makesessionobj, setSessionobj ,router,sessionsMarked,setShowSessionForm}) => {
  const [classType, setClassType] = useState(makesessionobj.classType || "cseA");
  const [sessionTime, setSessionTime] = useState(makesessionobj.sessionTime || "5 minutes");
  const [subject, setSubject] = useState(makesessionobj.subject || "Physics");
  if(sessionsMarked+1===8){
    alert("You have reached the maximum number of sessions for today.");
    setShowSessionForm(false)

  }

  useEffect(() => {
    if (makesessionobj.classType) setClassType(makesessionobj.classType);
    if (makesessionobj.sessionTime) setSessionTime(makesessionobj.sessionTime);
    if (makesessionobj.subject) setSubject(makesessionobj.subject);
  }, [makesessionobj]);

  // Convert sessionTime string to milliseconds
  const convertTimeToMilliseconds = (time) => {
    if (!time) return 0; // Handle empty input
  
    const match = time.match(/\d+/); 
    if (!match) return 0;
  
    const timeInMinutes = parseInt(match[0], 10);
    return timeInMinutes * 60000; 
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert the session time to milliseconds
    const sessionTimeInMillis = convertTimeToMilliseconds(sessionTime);

    // Prepare the session data with sessionNo incremented
    const sessionData = {
      classType,
      sessionTime: sessionTimeInMillis, // Store in milliseconds
      subject,
      sessionNo: sessionsMarked + 1, 
    };

    setSessionobj(sessionData);
    router.push('/Attend');
    // alert(`Session Created: ${classType} - ${subject} - ${sessionTime}`);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto mt-8">
      <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">
        Create a Session
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Class Type Selection */}
        <div className="flex justify-between">
          <label className="text-lg font-medium text-gray-700">Class Type:</label>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setClassType("cseA")}
              className={`px-4 py-2 rounded-md text-white font-semibold ${classType === "cseA" ? "bg-blue-600" : "bg-gray-300"}`}
            >
              CSE A
            </button>
            <button
              type="button"
              onClick={() => setClassType("cseB")}
              className={`px-4 py-2 rounded-md text-white font-semibold ${classType === "cseB" ? "bg-blue-600" : "bg-gray-300"}`}
            >
              CSE B
            </button>
          </div>
        </div>

        {/* Session Time Selection */}
        <div className="flex justify-between">
          <label className="text-lg font-medium text-gray-700">Session Time:</label>
          <select
            value={sessionTime}
            onChange={(e) => setSessionTime(e.target.value)}
            className="border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="5 minutes">5 minutes</option>
            <option value="10 minutes">10 minutes</option>
            <option value="15 minutes">15 minutes</option>
          </select>
        </div>

        {/* Subject Selection */}
        <div className="flex justify-between">
          <label className="text-lg font-medium text-gray-700">Subject:</label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Maths">Maths</option>
          </select>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white text-lg font-semibold rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create Session
          </button>
        </div>
      </form>
    </div>
  );
};

export default Makesession;
