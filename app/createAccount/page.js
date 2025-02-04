"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { saveProfiles } from "../server/server";

const FormComponent = () => {
  const router = useRouter();
  const [Check, setCheck] = useState({
    cseA: false,
    cseB: false,
  });

  useEffect(() => {
    console.log("CSE A Checked:", Check.cseA);
    console.log("CSE B Checked:", Check.cseB);
  }, [Check]);

  const [Form, setForm] = useState({
    Name: "",
    Age: "",
    Email: "",
    cseA: {
      Math: false,
      Physics: false,
      Chemistry: false,
    },
    cseB: {
      Math: false,
      Physics: false,
      Chemistry: false,
    },
  });

  // Handle input change
  const handleChange = (e, id) => {
    setForm((prevForm) => ({
      ...prevForm,
      [id]: e.target.value,
    }));
  };

  // Handle checkbox changes for nested fields
  const handleNestedCheckboxChange = (classGroup, subject) => {
    setForm((prevForm) => ({
      ...prevForm,
      [classGroup]: {
        ...prevForm[classGroup],
        [subject]: !prevForm[classGroup][subject],
      },
    }));
  };

  // Handle checkbox toggle for CSE groups
  const handleCheckToggle = (group) => {
    setCheck((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data submitted:", Form);
    await saveProfiles(Form);
    router.push('/login');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center text-indigo-600">Submit Your Profile</h1>
      <form onSubmit={handleSubmit}>
        {/* Name Field */}
        <div className="form-group mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name:
          </label>
          <input
            id="name"
            type="text"
            value={Form.Name}
            onChange={(e) => handleChange(e, "Name")}
            placeholder="Enter your name"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Email Field */}
        <div className="form-group mb-4">
          <label htmlFor="Email" className="block text-sm font-medium text-gray-700">
            Email:
          </label>
          <input
            id="Email"
            type="email"
            value={Form.Email}
            onChange={(e) => handleChange(e, "Email")}
            placeholder="Enter your email"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Age Field */}
        <div className="form-group mb-4">
          <label htmlFor="Age" className="block text-sm font-medium text-gray-700">
            Age:
          </label>
          <input
            id="Age"
            type="number"
            value={Form.Age}
            onChange={(e) => handleChange(e, "Age")}
            placeholder="Enter your age"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <h2 className="p-4 bg-gray-300 text-center text-lg font-medium text-gray-700">Enter Subjects You Handle</h2>

        {/* CSE A Toggle */}
        <div className="form-group mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              onChange={() => handleCheckToggle("cseA")}
              checked={Check.cseA}
              className="form-checkbox text-blue-500"
            />
            <span className="text-sm font-medium">CSE A</span>
          </label>
        </div>

        {/* CSE A Subjects */}
        {Check.cseA && (
          <ul className="mb-4 space-y-2 p-4">
            {["Physics", "Chemistry", "Math"].map((subject) => (
              <li key={subject} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={Form.cseA[subject]}
                  onChange={() => handleNestedCheckboxChange("cseA", subject)}
                  className="form-checkbox text-blue-500"
                />
                <span className="text-sm">{subject}</span>
              </li>
            ))}
          </ul>
        )}

        {/* CSE B Toggle */}
        <div className="form-group mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              onChange={() => handleCheckToggle("cseB")}
              checked={Check.cseB}
              className="form-checkbox text-green-500"
            />
            <span className="text-sm font-medium">CSE B</span>
          </label>
        </div>

        {/* CSE B Subjects */}
        {Check.cseB && (
          <ul className="mb-4 space-y-2 p-4">
            {["Physics", "Chemistry", "Math"].map((subject) => (
              <li key={subject} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={Form.cseB[subject]}
                  onChange={() => handleNestedCheckboxChange("cseB", subject)}
                  className="form-checkbox text-green-500"
                />
                <span className="text-sm">{subject}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Submit Button */}
        <div className="mt-4 flex justify-center">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-all duration-300"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormComponent;
