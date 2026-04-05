 
import { useRef, useState } from "react";

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [capturedImgs, setCapturedImgs] = useState<string[]>([]);
  const [faceIndex, setFaceIndex] = useState(0);
  const faces = ["Top", "Left", "Right", "Down", "Front", "Back"];

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const captureImage = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageDataUrl = canvas.toDataURL("image/png");

    setCapturedImgs((prev) => [...prev, imageDataUrl]);

    if (faceIndex < 5) setFaceIndex(faceIndex + 1);
    else alert("All 6 faces captured!");
  };

  return (
    <div>
      <video ref={videoRef} width={400} height={300} autoPlay />
      <div style={{ margin: "10px 0" }}>
        <button onClick={startCamera}>Start Camera</button>
        <button onClick={captureImage}>Capture {faces[faceIndex]} Face</button>
      </div>

      {capturedImgs.length > 0 && (
        <div>
          <h3>Captured Images:</h3>
          {capturedImgs.map((img, idx) => (
            <div key={idx} style={{ margin: "5px 0" }}>
              <strong>{faces[idx]} Face</strong>
              <br />
              <img src={img} alt={`Captured Cube ${faces[idx]}`} width={200} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
