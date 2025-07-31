"use client";
import { useRef, useState, useCallback } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  serverTimestamp,
  increment,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import toast from "react-hot-toast";
import { useCameraScanner } from "../hooks/useCamera";

const ESP32_IP = "http://192.168.202.239"; // replace with your ESP32 IP

const QrScanner = () => {
  const videoRef = useRef<HTMLVideoElement>(null!);
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const isProcessingRef = useRef(false);

  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [thrashId, setThrashId] = useState("");

  const triggerServo = async (direction: "left" | "right") => {
    try {
      await fetch(`${ESP32_IP}/${direction}`);
    } catch (err) {
      console.error("ESP32 servo control failed:", err);
    }
  };

  const handleQR = useCallback(
    async (uid: string) => {
      if (!thrashId || isProcessingRef.current || uid === "CAMERA_ERROR") return;

      isProcessingRef.current = true;
      setIsPaused(true);
      setLoading(true);
      setLastScanned(uid);

      try {
        const productRef = doc(db, "products", uid);
        const productSnap = await getDoc(productRef);

        if (!productSnap.exists()) {
          toast.error("Invalid QR: Product not found.");
          await triggerServo("right");
          return;
        }

        await triggerServo("left");

        const productData = productSnap.data();
        if (productData.isScanned) {
          toast.error("QR already scanned.");
          return;
        }

        await updateDoc(productRef, { isScanned: true });

        await setDoc(doc(db, "history", `${Date.now()}-${uid}`), {
          timestamp: serverTimestamp(),
          code: uid,
          scannedBy: thrashId,
        });

        const idNumber = parseInt(thrashId);
        if (isNaN(idNumber)) {
          toast.error("Invalid Thrash ID.");
          return;
        }

        const userQuery = query(
          collection(db, "users"),
          where("ThrashID", "==", idNumber)
        );
        const querySnapshot = await getDocs(userQuery);

        if (querySnapshot.empty) {
          toast.error("No user found with this Thrash ID.");
          return;
        }

        const userDoc = querySnapshot.docs[0];
        await updateDoc(userDoc.ref, {
          bal: increment(1),
        });

        toast.success("QR processed & balance updated.");
      } catch (err) {
        console.error("QR scan error:", err);
        toast.error("Failed to process QR.");
      } finally {
        setLoading(false);
        setTimeout(() => {
          setIsPaused(false);
          isProcessingRef.current = false;
        }, 3000);
      }
    },
    [thrashId]
  );

  useCameraScanner({
    videoRef,
    canvasRef,
    onScan: handleQR,
    isPaused,
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white p-4">
      <div className="mb-4 w-full max-w-md">
        <label className="block text-sm mb-1 text-slate-300" htmlFor="thrashId">
          Enter Thrash ID
        </label>
        <input
          id="thrashId"
          type="number"
          value={thrashId}
          onChange={(e) => setThrashId(e.target.value)}
          placeholder="e.g. 12345"
          className="w-full px-4 py-2 bg-slate-800 text-white rounded-lg border border-cyan-500 focus:outline-none"
        />
      </div>

      <div className="relative w-full max-w-md aspect-[3/4] rounded-xl overflow-hidden shadow-lg">
        <video
          ref={videoRef}
          className="absolute w-full h-full object-cover"
          muted
          playsInline
        />
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="mt-6 text-center">
        <h3 className="text-lg font-semibold text-slate-200">
          {loading ? "Processing..." : "Scanning QR..."}
        </h3>

        {lastScanned && (
          <div className="mt-4 p-4 bg-slate-800 border border-cyan-500 rounded-xl max-w-md w-full">
            <p className="text-cyan-300 font-semibold">Last QR Code:</p>
            <p className="break-words text-white">{lastScanned}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QrScanner;
