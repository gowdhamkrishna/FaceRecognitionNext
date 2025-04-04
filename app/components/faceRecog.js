"use client";
import { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FaceRecog = ({ profile, setProfile, setTimer }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceMatchersLoaded, setFaceMatchersLoaded] = useState(false);
  // Store face recognition rates for better accuracy
  const [recognitionHistory, setRecognitionHistory] = useState({});
  
  let faceMatchers = [];
  let faceLabels = [];
  // Lower confidence threshold for initial detection, will use recognition consistency for actual marking
  const confidenceThreshold = 0.45;
  
  // Track recognized faces to prevent duplicate notifications
  const recognizedFaces = useRef(new Set());
  // Number of consecutive detections needed before marking attendance
  const REQUIRED_DETECTIONS = 5;

  const updateP = (label) => {
    if (!recognizedFaces.current.has(label)) {
      recognizedFaces.current.add(label);
      setProfile((prevProfile) => {
        const updatedProfile = prevProfile.map((profile) =>
          profile.name === label ? { ...profile, present: true } : profile
        );
        toast.success(`${label} marked as present!`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          className: "bg-gradient-to-r from-green-500 to-green-700 rounded-lg shadow-lg"
        });
        return updatedProfile;
      });
    }
  };
  
  const initializeApp = async () => {
    try {
      console.log("Initializing app...");
      setIsLoading(true);
      await loadModels();
      await loadVideo();
      await loadFaceMatchers();
      myFaceDetect();
      setIsLoading(false);
    } catch (err) {
      console.error("Initialization Error:", err);
      toast.error("Failed to initialize face recognition. Please refresh the page.", {
        theme: "dark",
        className: "bg-gradient-to-r from-red-500 to-red-700 rounded-lg shadow-lg"
      });
      setIsLoading(false);
    }
  };

  const loadVideo = async () => {
    try {
      console.log("Accessing webcam...");
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        return new Promise((resolve) => {
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            if (canvasRef.current) {
              canvasRef.current.width = videoRef.current.videoWidth;
              canvasRef.current.height = videoRef.current.videoHeight;

              console.log("Video dimensions set:", {
                width: canvasRef.current.width,
                height: canvasRef.current.height,
              });
            }
            resolve();
          };
        });
      }
    } catch (err) {
      console.error("Error accessing webcam:", err);
      if (err.name === "NotAllowedError") {
        toast.error("Please allow webcam access to use this feature.", {
          theme: "dark",
          className: "bg-gradient-to-r from-red-500 to-red-700 rounded-lg shadow-lg"
        });
      } else {
        toast.error("Failed to access webcam. Please check your camera.", {
          theme: "dark",
          className: "bg-gradient-to-r from-red-500 to-red-700 rounded-lg shadow-lg"
        });
      }
      throw err;
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
        faceapi.nets.ssdMobilenetv1.loadFromUri("/models"), // Add SSD model for more robust detection
      ]);
      console.log("Models loaded successfully");
      setModelsLoaded(true);
      toast.success("Face recognition models loaded successfully", {
        theme: "dark",
        className: "bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-lg"
      });
    } catch (err) {
      console.error("Error loading models:", err);
      toast.error("Failed to load face recognition models. Check your network connection.", {
        theme: "dark",
        className: "bg-gradient-to-r from-red-500 to-red-700 rounded-lg shadow-lg"
      });
      throw err;
    }
  };

  // Function to check if two face descriptors are similar
  const isSimilarDescriptor = (desc1, desc2, threshold = 0.5) => {
    if (!desc1 || !desc2) return false;
    
    // Calculate Euclidean distance
    return faceapi.euclideanDistance(desc1, desc2) <= threshold;
  };
  
  // Store multiple descriptors per person for better accuracy
  const labelDescriptors = useRef({});

  const loadFaceMatchers = async () => {
    try {
      console.log("Loading face matchers...");
      const response = await fetch("/faces.json");
      if (!response.ok) {
        throw new Error(`Failed to fetch faces.json: ${response.status} ${response.statusText}`);
      }
      
      const facesData = await response.json();
      if (!Array.isArray(facesData) || facesData.length === 0) {
        throw new Error("Invalid faces data: Expected non-empty array");
      }

      console.log(`Loaded ${facesData.length} face entries from faces.json`);
      
      // Initialize recognition history for each face
      const initialHistory = {};
      facesData.forEach(face => {
        initialHistory[face.label] = {
          totalDetections: 0,
          consecutiveDetections: 0,
          lastDetectedAt: 0
        };
      });
      setRecognitionHistory(initialHistory);
      
      const matchersPromises = facesData.map(async (face) => {
        if (!face.image || !face.label) {
          console.warn("Invalid face entry:", face);
          return null;
        }
        
        try {
          const image = await faceapi.fetchImage(face.image);
          
          // Try with both detectors for better results
          let detections;
          
          // First with SSD MobileNet
          detections = await faceapi
            .detectSingleFace(image, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
            .withFaceLandmarks()
            .withFaceDescriptor();
          
          // Fallback to TinyFaceDetector if SSD fails
          if (!detections) {
            detections = await faceapi
              .detectSingleFace(image, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.5 }))
              .withFaceLandmarks()
              .withFaceDescriptor();
          }

          if (!detections) {
            console.warn(`No face detected in ${face.label}'s image. Please check image quality.`);
            toast.warning(`Could not detect face in ${face.label}'s image. Please update reference image.`, {
              theme: "dark",
              className: "bg-gradient-to-r from-yellow-500 to-yellow-700 rounded-lg shadow-lg"
            });
            return null;
          }
          
          // Store descriptor for this label
          if (!labelDescriptors.current[face.label]) {
            labelDescriptors.current[face.label] = [];
          }
          labelDescriptors.current[face.label].push(detections.descriptor);

          faceLabels.push(face.label);
          // Use tighter distance threshold for more accurate matching
          return new faceapi.FaceMatcher([detections], 0.4);
        } catch (err) {
          console.error(`Error processing ${face.label}'s image:`, err);
          toast.error(`Failed to process ${face.label}'s image. Please check image format.`, {
            theme: "dark",
            className: "bg-gradient-to-r from-red-500 to-red-700 rounded-lg shadow-lg"
          });
          return null;
        }
      });

      const matchers = await Promise.all(matchersPromises);
      faceMatchers = matchers.filter((matcher) => matcher !== null);

      if (faceMatchers.length === 0) {
        toast.error("No face references could be loaded. Please check your database.", {
          theme: "dark",
          className: "bg-gradient-to-r from-red-500 to-red-700 rounded-lg shadow-lg"
        });
        console.warn("No face matchers were created. Check your faces.json.");
      } else {
        console.log("Face matchers loaded successfully:", faceLabels);
        setFaceMatchersLoaded(true);
        toast.success(`Loaded ${faceMatchers.length} face references successfully`, {
          theme: "dark",
          className: "bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-lg"
        });
      }
    } catch (err) {
      console.error("Error loading face matchers:", err);
      toast.error("Failed to load face data. Please check your database.", {
        theme: "dark",
        className: "bg-gradient-to-r from-red-500 to-red-700 rounded-lg shadow-lg"
      });
      throw err;
    }
  };

  const verifyConsistentRecognition = (label, distance) => {
    if (!label || label === "Unknown") return false;
    
    setRecognitionHistory(prev => {
      const now = Date.now();
      const history = prev[label] || { totalDetections: 0, consecutiveDetections: 0, lastDetectedAt: 0 };
      
      // Check if this is a consecutive detection (within 2 seconds)
      const isConsecutive = now - history.lastDetectedAt < 2000;
      
      const updatedHistory = {
        ...prev,
        [label]: {
          totalDetections: history.totalDetections + 1,
          // Reset consecutive count if it's been more than 2 seconds
          consecutiveDetections: isConsecutive ? history.consecutiveDetections + 1 : 1,
          lastDetectedAt: now
        }
      };
      
      // If we have enough consecutive detections, mark as present
      if (updatedHistory[label].consecutiveDetections >= REQUIRED_DETECTIONS) {
        updateP(label);
      }
      
      return updatedHistory;
    });
    
    return false;
  };

  const myFaceDetect = () => {
    const detectFace = async () => {
      if (
        !videoRef.current ||
        videoRef.current.paused ||
        videoRef.current.ended ||
        !videoRef.current.videoWidth ||
        faceMatchers.length === 0
      ) {
        console.warn("Video or Face Matchers not ready yet. Retrying...");
        requestAnimationFrame(detectFace);
        return;
      }

      try {
        // Try to use both detectors for better results
        let detections;
        try {
          // First try with SSD MobileNet (more accurate but slower)
          detections = await faceapi
            .detectAllFaces(videoRef.current, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
            .withFaceLandmarks()
            .withFaceDescriptors();
            
          // If no faces found with SSD, try TinyFaceDetector as fallback
          if (detections.length === 0) {
            detections = await faceapi
              .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.5 }))
              .withFaceLandmarks()
              .withFaceDescriptors();
          }
        } catch (error) {
          console.error("Error in primary detector, falling back:", error);
          detections = await faceapi
            .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptors();
        }

        const displaySize = {
          width: videoRef.current.videoWidth,
          height: videoRef.current.videoHeight,
        };

        if (!canvasRef.current) {
          requestAnimationFrame(detectFace);
          return;
        }
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          requestAnimationFrame(detectFace);
          return;
        }

        faceapi.matchDimensions(canvas, displaySize);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        detections = faceapi.resizeResults(detections, displaySize);

        if (detections.length > 0 && faceMatchers.length > 0) {
          detections.forEach((detection) => {
            // Use descriptor-based matching for more accurate results
            let bestLabel = "Unknown";
            let bestDistance = 1.0;
            let confidenceScore = 0;
            
            // First check with standard face matchers
            for (let i = 0; i < faceLabels.length; i++) {
              const label = faceLabels[i];
              const matcher = faceMatchers[i];
              
              if (matcher) {
                const match = matcher.findBestMatch(detection.descriptor);
                if (match.distance < bestDistance) {
                  bestDistance = match.distance;
                  bestLabel = match.label !== "unknown" ? label : "Unknown";
                }
              }
            }
            
            // Then check against our stored descriptors for better accuracy
            Object.entries(labelDescriptors.current).forEach(([label, descriptors]) => {
              if (descriptors && descriptors.length > 0) {
                // Calculate average similarity against all descriptors for this label
                let totalSimilarity = 0;
                let matchCount = 0;
                
                descriptors.forEach(desc => {
                  const distance = faceapi.euclideanDistance(detection.descriptor, desc);
                  if (distance < confidenceThreshold) {
                    totalSimilarity += (1 - distance); // Convert distance to similarity (0-1)
                    matchCount++;
                  }
                });
                
                // Calculate average similarity if we have matches
                if (matchCount > 0) {
                  const avgSimilarity = totalSimilarity / matchCount;
                  if (avgSimilarity > confidenceScore) {
                    confidenceScore = avgSimilarity;
                    bestLabel = label;
                    bestDistance = 1 - avgSimilarity;
                  }
                }
              }
            });
            
            // Verify and track consistent recognitions
            verifyConsistentRecognition(bestLabel, bestDistance);
            
            const box = detection.detection.box;
            let boxColor = bestLabel !== "Unknown" ? "#22c55e" : "#ef4444"; // Green or red
            let boxGlow = bestLabel !== "Unknown" ? "0 0 10px rgba(34, 197, 94, 0.7)" : "0 0 10px rgba(239, 68, 68, 0.7)";
            
            // Only show as recognized if below threshold
            if (bestDistance > confidenceThreshold) {
              bestLabel = "Unknown";
              boxColor = "#ef4444"; // Red
              boxGlow = "0 0 10px rgba(239, 68, 68, 0.7)";
            }

            if (bestLabel !== "Unknown") {
              console.log(`Match found: ${bestLabel}, Distance: ${bestDistance.toFixed(2)}, Confidence: ${(1-bestDistance).toFixed(2)}`);
            }

            // Add a subtle glow effect to the bounding box
            ctx.shadowColor = boxColor;
            ctx.shadowBlur = 15;
            
            // Draw detection box with more modern styling
            ctx.strokeStyle = boxColor;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.roundRect(box.x, box.y, box.width, box.height, 8); // Rounded corners
            ctx.stroke();
            
            // Reset shadow for text
            ctx.shadowBlur = 0;
            
            // Draw label background
            ctx.fillStyle = boxColor;
            const labelText = `${bestLabel} (${Math.round((1-bestDistance) * 100)}%)`;
            const textWidth = ctx.measureText(labelText).width + 10;
            const textHeight = 30;
            
            // Rounded rectangle for label background
            ctx.beginPath();
            ctx.roundRect(
              box.x, 
              box.y - textHeight - 5, 
              textWidth,
              textHeight,
              [8, 8, 0, 0] // Round only top corners
            );
            ctx.fill();
            
            // Draw label text
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 16px Arial";
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.fillText(
              labelText,
              box.x + 5,
              box.y - textHeight/2 - 5
            );
          });
        }

        requestAnimationFrame(detectFace);
      } catch (err) {
        console.error("Error detecting faces:", err);
        requestAnimationFrame(detectFace);
      }
    };

    detectFace();
  };

  useEffect(() => {
    initializeApp();
    
    // Cleanup function
    return () => {
      // Stop video stream when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="w-full lg:w-[50vw] min-h-[90vh] bg-gradient-to-b from-gray-900 to-gray-800 relative flex flex-col">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black bg-opacity-80 backdrop-blur-sm">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-white text-xl font-semibold">
            Loading Face Recognition System
          </div>
          <div className="text-gray-300 text-sm mt-2">
            Please wait while we initialize the components...
          </div>
        </div>
      )}

      <div className="relative w-full h-[60vh] overflow-hidden rounded-lg shadow-2xl border border-gray-700 m-4">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
        
        {/* Overlay with camera frame design */}
        <div className="absolute inset-0 pointer-events-none border-2 border-blue-500 rounded-lg z-10">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-500 rounded-tl-lg"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-500 rounded-tr-lg"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-500 rounded-bl-lg"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-500 rounded-br-lg"></div>
        </div>
        
        {/* Status indicator */}
        <div className="absolute top-4 left-4 flex items-center bg-black bg-opacity-50 rounded-full px-3 py-1 space-x-2">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full ${modelsLoaded ? 'bg-green-500' : 'bg-red-500'} mr-2 animate-pulse`}></div>
            <span className="text-white text-xs">Models</span>
          </div>
          <div className="w-px h-4 bg-gray-500"></div>
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full ${faceMatchersLoaded ? 'bg-green-500' : 'bg-red-500'} mr-2 animate-pulse`}></div>
            <span className="text-white text-xs">Face Data</span>
          </div>
        </div>

        {/* Camera flash effect */}
        <div className="absolute inset-0 bg-white opacity-0 pointer-events-none flash-effect"></div>
      </div>
      
      <div className="flex-grow flex flex-col items-center justify-center p-4 gap-6">
        <div className="w-full max-w-sm bg-gray-800 rounded-lg shadow-xl p-6 text-center">
          <h3 className="text-xl font-bold text-white mb-4">Recognition Status</h3>
          <div className="flex justify-between mb-2">
            <span className="text-gray-300">Models Loaded:</span>
            <span className={`font-medium ${modelsLoaded ? 'text-green-400' : 'text-red-400'}`}>
              {modelsLoaded ? 'Active' : 'Loading...'}
            </span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-gray-300">Face References:</span>
            <span className={`font-medium ${faceMatchersLoaded ? 'text-green-400' : 'text-red-400'}`}>
              {faceMatchersLoaded ? `${faceLabels.length} Loaded` : 'Not Ready'}
            </span>
          </div>
          <div className="w-full bg-gray-700 h-1 rounded-full mb-4">
            <div className="bg-blue-500 h-1 rounded-full transition-all duration-500" 
                style={{ width: `${(modelsLoaded && faceMatchersLoaded) ? 100 : modelsLoaded ? 50 : 25}%` }}></div>
          </div>
        </div>
        
        <button 
          onClick={() => setTimer(0)}
          className="relative inline-flex items-center px-8 py-3 overflow-hidden text-lg font-medium text-red-300 border-2 border-red-500 rounded-full hover:text-white group"
        >
          <span className="absolute left-0 block w-full h-0 transition-all bg-gradient-to-r from-red-600 to-red-500 opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease"></span>
          <span className="absolute right-0 flex items-center justify-start w-10 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </span>
          <span className="relative">End Session</span>
        </button>
      </div>
      
      {/* Add custom CSS for flash effect */}
      <style jsx>{`
        .flash-effect {
          animation: none;
        }
        
        @keyframes flash {
          0% { opacity: 0; }
          10% { opacity: 0.8; }
          100% { opacity: 0; }
        }
        
        /* Add rounded rect support for older browsers */
        if (!CanvasRenderingContext2D.prototype.roundRect) {
          CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
            if (typeof radius === 'number') {
              radius = {tl: radius, tr: radius, br: radius, bl: radius};
            } else {
              radius = {
                tl: radius[0] || 0,
                tr: radius[1] || 0,
                br: radius[2] || 0,
                bl: radius[3] || 0
              };
            }
            this.moveTo(x + radius.tl, y);
            this.lineTo(x + width - radius.tr, y);
            this.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
            this.lineTo(x + width, y + height - radius.br);
            this.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
            this.lineTo(x + radius.bl, y + height);
            this.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
            this.lineTo(x, y + radius.tl);
            this.quadraticCurveTo(x, y, x + radius.tl, y);
            this.closePath();
            return this;
          };
        }
      `}</style>
    </div>
  );
};

export default FaceRecog;
