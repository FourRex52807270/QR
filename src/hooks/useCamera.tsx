import { useEffect, useRef } from "react";
import jsQR from "jsqr";

export function useCameraScanner({
  videoRef,
  canvasRef,
  onScan,
  isPaused,
}: {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onScan: (data: string) => void;
  isPaused: boolean;
}) {
  const animationRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let cancelled = false;

    const startCamera = async () => {
      if (streamRef.current) return; // ✅ Prevent multiple requests

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          animationRef.current = requestAnimationFrame(scanLoop);
        }
      } catch (error) {
        console.error("Camera error:", error);
        onScan("CAMERA_ERROR"); // special signal for toast
      }
    };

    const scanLoop = () => {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (!canvas || !video || !video.videoWidth) return;

      const ctx = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      const qr = imageData && jsQR(imageData.data, imageData.width, imageData.height);

      if (qr?.data && !isPaused) {
        onScan(qr.data);
      }

      if (!cancelled) {
        animationRef.current = requestAnimationFrame(scanLoop);
      }
    };

    startCamera();

    return () => {
      cancelled = true;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, [videoRef, canvasRef, onScan, isPaused]);
}
