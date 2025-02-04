"use client";
import { useRef, useEffect } from "react";
import * as faceapi from "face-api.js";
import { ToastContainer } from "react-toastify";

const FaceRecog = ({ profile, setProfile,setTimer }) => {
 

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  let faceMatchers = [];
  let faceLabels = [];
  const confidenceThreshold = 0.35 ;

  const updateP = (label) => {
    setProfile((prevProfile) => {
      const updatedProfile = prevProfile.map((profile) =>
        profile.name === label ? { ...profile, present: true } : profile
      );
      console.log(updatedProfile);
      return updatedProfile;
    });
  };
  
  const initializeApp = async () => {
    try {
      console.log("Initializing app...");
      await loadVideo();
      await loadModels();
      await loadFaceMatchers();
      myFaceDetect();
    } catch (err) {
      console.error("Initialization Error:", err);
    }
  };

  const loadVideo = async () => {
    try {
      console.log("Accessing webcam...");
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;

      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play();
        const canvas = canvasRef.current;
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        console.log("Video dimensions set:", {
          width: canvas.width,
          height: canvas.height,
        });
      };
    } catch (err) {
      console.error("Error accessing webcam:", err);
      if (err.name === "NotAllowedError") {
        alert("Please allow webcam access to use this feature.");
      }
    }
  };

  const loadModels = async () => {
    try {
      console.log("Loading models...");
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      ]);
      console.log("Models loaded successfully");
    } catch (err) {
      console.error("Error loading models:", err);
    }
  };

  const loadFaceMatchers = async () => {
    try {
      console.log("Loading face matchers...");
      const response = await fetch("/faces.json");
      const facesData = await response.json();

      const matchersPromises = facesData.map(async (face) => {
        const image = await faceapi.fetchImage(face.image);
        const detections = await faceapi
          .detectAllFaces(image, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptors();

        if (detections.length === 0) {
          console.warn(`No face detected in ${face.label}'s image.`);
          return null;
        }

        faceLabels.push(face.label);
        return new faceapi.FaceMatcher(detections, 0.6);
      });

      const matchers = await Promise.all(matchersPromises);
      faceMatchers = matchers.filter((matcher) => matcher !== null);

      if (faceMatchers.length === 0) {
        console.warn("No face matchers were created. Check your faces.json.");
      } else {
        console.log("Face matchers loaded successfully:", faceLabels);
      }
    } catch (err) {
      console.error("Error loading face matchers:", err);
    }
  };

  const myFaceDetect = () => {
    const detectFace = async () => {
      if (
        !videoRef.current ||
        videoRef.current.videoWidth === 0 ||
        faceMatchers.length === 0
      ) {
        console.warn("Video or Face Matchers not ready yet. Retrying...");
        requestAnimationFrame(detectFace);
        return;
      }

      try {
        let detections = await faceapi
          .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions()
          .withFaceDescriptors();

        const displaySize = {
          width: videoRef.current.videoWidth,
          height: videoRef.current.videoHeight,
        };

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        faceapi.matchDimensions(canvas, displaySize);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        detections = faceapi.resizeResults(detections, displaySize);

        if (detections.length > 0 && faceMatchers.length > 0) {
          detections.forEach((detection) => {
            let bestMatch = null;
            let bestMatchIndex = -1;

            faceMatchers.forEach((matcher, matcherIndex) => {
              const match = matcher.findBestMatch(detection.descriptor);

              if (
                match.distance <= confidenceThreshold &&
                (!bestMatch || match.distance < bestMatch.distance)
              ) {
                bestMatch = match;
                bestMatchIndex = matcherIndex;
              }
            });

            const box = detection.detection.box;
            let label = "Unknown";

            if (bestMatch && bestMatchIndex !== -1) {
              label = faceLabels[bestMatchIndex];
              console.log(`Match found: ${label}, Distance: ${bestMatch.distance}`);
              updateP(label)
            } else {
              console.log("No match found with sufficient confidence for this face.");
            }

            faceapi.draw.drawDetections(canvas, detections);
            faceapi.draw.drawFaceLandmarks(canvas, detections);
            faceapi.draw.drawFaceExpressions(canvas, detections);

            const drawOptions = { label };
            const drawBox = new faceapi.draw.DrawBox(box, drawOptions);
            drawBox.draw(canvas);

            ctx.font = "24px Arial";
            ctx.fillStyle = "white";
            ctx.fillText(label, box.x, box.y - 10);
          });
        }

        requestAnimationFrame(detectFace);
      } catch (err) {
        console.error("Error detecting faces:", err);
      }
    };

    detectFace();
  };

  useEffect(() => {
    initializeApp();
  }, []);

  return (
    <div className="w-[50vw] h-[90vh] bg-[#3d3c3d]">
      <ToastContainer />

      <video
        ref={videoRef}
        autoPlay
        muted
        className="relative top-[0px] left-[0px] w-[50vw] h-[60vh] object-cover"
      />
      <canvas
        ref={canvasRef}
        className="absolute top-[23px] left-[0px] w-[50vw] h-[70vh] object-cover pointer-events-none"
      />
      <div className="w-[50vw] flex justify-center p-9" onClick={()=>{
        setTimer(0)
      }}>
        <button className="bg-red-950 text-red-400 border border-red-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group">
          <span className="bg-red-400 shadow-red-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
          End Session
        </button>
      </div>
    </div>
  );
};

export default FaceRecog;
