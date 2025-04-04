"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { saveProfiles } from "../server/server";
import Link from "next/link";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex justify-center items-center p-4">
      <div className="max-w-4xl w-full bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
        <div className="p-8">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
              Teacher Registration
            </h1>
            <p className="text-gray-400 mt-2">Create your account to manage attendance</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div className="form-group">
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={Form.Name}
                  onChange={(e) => handleChange(e, "Name")}
                  placeholder="Enter your name"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>

              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="Email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  id="Email"
                  type="email"
                  value={Form.Email}
                  onChange={(e) => handleChange(e, "Email")}
                  placeholder="Enter your email"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
            </div>

            {/* Age Field */}
            <div className="form-group">
              <label htmlFor="Age" className="block text-sm font-medium text-gray-300 mb-1">
                Age
              </label>
              <input
                id="Age"
                type="number"
                value={Form.Age}
                onChange={(e) => handleChange(e, "Age")}
                placeholder="Enter your age"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                required
              />
            </div>

            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-xl px-6 py-4 mt-8 mb-6">
              <h2 className="text-lg font-semibold text-white text-center">Subjects You Handle</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CSE A Section */}
              <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                <div className="form-group mb-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <div className="relative">
                      <input 
                        type="checkbox"
                        onChange={() => handleCheckToggle("cseA")}
                        checked={Check.cseA}
                        className="sr-only"
                      />
                      <div className={`block w-10 h-6 rounded-full transition ${Check.cseA ? 'bg-blue-500' : 'bg-gray-600'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${Check.cseA ? 'translate-x-4' : ''}`}></div>
                    </div>
                    <span className="text-base font-medium text-white">CSE A</span>
                  </label>
                </div>

                {/* CSE A Subjects */}
                {Check.cseA && (
                  <div className="pl-4 border-l-2 border-blue-600 space-y-3 mb-4 mt-6">
                    {["Physics", "Chemistry", "Math"].map((subject) => (
                      <label key={subject} className="flex items-center space-x-3 cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={Form.cseA[subject]}
                            onChange={() => handleNestedCheckboxChange("cseA", subject)}
                            className="opacity-0 absolute h-6 w-6" 
                          />
                          <div className={`border-2 rounded-md border-gray-500 w-6 h-6 flex flex-shrink-0 justify-center items-center ${
                            Form.cseA[subject] ? 'bg-blue-600 border-blue-600' : ''
                          }`}>
                            {Form.cseA[subject] && (
                              <svg className="fill-current w-3 h-3 text-white pointer-events-none" viewBox="0 0 20 20">
                                <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <span className="text-gray-300">{subject}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* CSE B Section */}
              <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                <div className="form-group mb-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <div className="relative">
                      <input 
                        type="checkbox"
                        onChange={() => handleCheckToggle("cseB")}
                        checked={Check.cseB}
                        className="sr-only"
                      />
                      <div className={`block w-10 h-6 rounded-full transition ${Check.cseB ? 'bg-indigo-600' : 'bg-gray-600'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${Check.cseB ? 'translate-x-4' : ''}`}></div>
                    </div>
                    <span className="text-base font-medium text-white">CSE B</span>
                  </label>
                </div>

                {/* CSE B Subjects */}
                {Check.cseB && (
                  <div className="pl-4 border-l-2 border-indigo-600 space-y-3 mb-4 mt-6">
                    {["Physics", "Chemistry", "Math"].map((subject) => (
                      <label key={subject} className="flex items-center space-x-3 cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={Form.cseB[subject]}
                            onChange={() => handleNestedCheckboxChange("cseB", subject)}
                            className="opacity-0 absolute h-6 w-6" 
                          />
                          <div className={`border-2 rounded-md border-gray-500 w-6 h-6 flex flex-shrink-0 justify-center items-center ${
                            Form.cseB[subject] ? 'bg-indigo-600 border-indigo-600' : ''
                          }`}>
                            {Form.cseB[subject] && (
                              <svg className="fill-current w-3 h-3 text-white pointer-events-none" viewBox="0 0 20 20">
                                <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <span className="text-gray-300">{subject}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-8 flex items-center justify-between">
              <Link href="/login">
                <button 
                  type="button" 
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors duration-300"
                >
                  Back to Login
                </button>
              </Link>
              
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormComponent;
