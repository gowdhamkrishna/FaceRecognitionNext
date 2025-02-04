"use server";
import Teacher from "../../public/models/mongoose/users";
import connectToDatabase from "@/connect";
import Session from "../../public/models/mongoose/cseA";
export const saveProfiles = async (data) => {
  await connectToDatabase();
  const res = new Teacher(data);
  await res.save();
};
export const getStudentDetails = async (details) => {
  console.log(details);
  let data = await fetch(
    `http://localhost:3000/models/${details.classType}.json`
  );
  data = await data.json();
  return data;
};
export const storeData = async (data, SessionData) => {
  await connectToDatabase();
  console.log(SessionData);

  const session = new Session({
    students: data,
    sessionNo: SessionData.sessionNo,
    classType: SessionData.classType,
    sessionTime: SessionData.sessionTime,
    subject: SessionData.subject,
  });
  await session.save();
};

export const getprofileDetails = async (email) => {
  console.log(email);

  await connectToDatabase();
  const user = await Teacher.findOne({ Email: email });
  if (!user) {
    throw new Error("User not found");
  }

  let obj = user.toObject();
  obj._id = obj._id.toString();

  return obj;
};
export const getAttendanceData = async (sessionNo) => {
  try {
    await connectToDatabase(); // Ensure DB connection if needed

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const session = await Session.findOne(
      {
        sessionNo: sessionNo,
        timestamp: { $gte: startOfDay, $lte: endOfDay },
      }
    ).lean(); // Improves performance

    if (!session) return null; // Handle missing session gracefully

    return {
      ...session,
      _id: session._id.toString(),
      students: session.students.map(student => ({
        ...student,
        _id: student._id.toString(),
      })),
    };
  } catch (error) {
    console.error("Error fetching attendance data:", error);
    return null; 
  }
};

export const getSessionDataForToday = async () => {
  await connectToDatabase();

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  let sessionCount = 0;

  for (let sessionNo = 1; sessionNo <= 7; sessionNo++) {
    const session = await Session.findOne({
      sessionNo: sessionNo,
      timestamp: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    if (session) {
      sessionCount++;
    } else {
      break;
    }
  }

  console.log(`Sessions marked today: ${sessionCount}`);
  return sessionCount;
};
