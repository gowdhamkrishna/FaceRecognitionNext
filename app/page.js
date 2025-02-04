"use client";
import React from "react";

const Page = () => {
  return (
    <div className="containermain">
      <div className="flex flex-col items-center space-y-6 mt-20">
        <div className="flex items-center space-x-6">
          <div className="my-loader">
            <div className="rubiks-cube">
              {/* Faces of the Rubik's Cube */}
              {['front', 'back', 'left', 'right', 'top', 'bottom'].map((face) => (
                <div key={face} className={`face ${face}`}>
                  {Array(9).fill().map((_, idx) => (
                    <div
                      key={idx}
                      className="cube"
                      style={{ background: getColorByIndex(idx) }}
                    ></div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <h1 className="font-semibold text-5xl text-blue-800">SchoolTime</h1>
        </div>
        <div className="container noselect mt-20">
          <div className="canvas">
            {/* Trackers */}
            {Array(9).fill().map((_, idx) => (
              <div key={idx} className={`tracker tr-${idx + 1}`}></div>
            ))}
            {/* Card */}
            <div id="card">
              <div className="card-content">
                <div className="card-glare"></div>
                <div className="cyber-lines">
                  <span></span><span></span><span></span><span></span>
                </div>
                <p id="prompt">ATTENDANCE SYSTEM</p>
                <div className="title">404<br />UNFOUND</div>
                <div className="glowing-elements">
                  <div className="glow-1"></div>
                  <div className="glow-2"></div>
                  <div className="glow-3"></div>
                </div>
                <div className="subtitle">
                  <span>Face Recognition</span>
                </div>
                <div className="card-particles">
                  <span></span><span></span><span></span>
                  <span></span><span></span><span></span>
                </div>
                <div className="corner-elements">
                  <span></span><span></span><span></span><span></span>
                </div>
                <div className="scan-line"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get the color based on the index of the cube
const getColorByIndex = (idx) => {
  const colors = [
    "#ff3d00", "#ffeb3b", "#4caf50", "#2196f3", "#ffffff"
  ];
  return colors[idx % colors.length];
};

export default Page;
