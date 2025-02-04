"use client";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession ,signIn,signOut } from "next-auth/react";

const Navbar = () => {
  const [state,setState]=useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const handleClick = () => {
    router.push("/login");
  };
  const handleDash=()=>
    {
      if(!session){
        router.push("/login");
      }
      else{
        router.push("/Teacher");
      }
    }
  return (
    <div className="bg-gray-100 p-4 flex justify-between items-center border border-gray-100">
      <p className="text-lg font-semibold text-gray-700">404 </p>
      <ol className="list-none p-0 flex ">
        <li className="mx-2 p-2 bg-gray-200 rounded hover:cursor-pointer border border-black hover:bg-gray-300 transition-colors " onClick={()=>{
          router.push("/");
        }}>
          Home
        </li>
        <li className="mx-2 p-2 hover:cursor-pointer bg-gray-200 rounded border border-black hover:bg-gray-300 transition-colors" onClick={handleDash}>
          Dashboard
        </li>

        {!session ? (
          <button
            type="button"
            onClick={handleClick}
            className="text bg-gradient-to-r  from-red-700 via-gray-400-500 to-red-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Login
          </button>
        ) : (
          <>
            <button
              id="dropdownDefaultButton"
              data-dropdown-toggle="dropdown"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              type="button"
              onClick={()=>{setState(!state)}}
            >
              {session.user.name}
              <svg
                className="w-2.5 h-2.5 ms-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>

            <div

              id="dropdown"
              className={`z-10 ${!state?'hidden':''} absolute bg-white divide-y right-4 top-[60px] divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}
            >
              <ul
                className="py-2 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdownDefaultButton"
              >
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Settings
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Earnings
                  </a>
                </li>
                <li onClick={()=>{signOut()}}>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Sign out
                  </a>
                </li>
              </ul>
            </div>
          </>
        )}
      </ol>
    </div>
  );
};

export default Navbar;
