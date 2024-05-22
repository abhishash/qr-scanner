"use client"; // This ensures the component runs on the client side

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeResult } from 'html5-qrcode';

interface QrCodeScannerProps {
  onScanSuccess: (decodedText: string, decodedResult: Html5QrcodeResult) => void;
  onScanFailure: (errorMessage: string) => void;
}

const QrCodeScanner: React.FC<QrCodeScannerProps> = ({ onScanSuccess, onScanFailure }) => {
  const qrCodeRegionId = "reader";
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const startScanning = () => {
    const html5QrCode = new Html5Qrcode(qrCodeRegionId);
    html5QrCodeRef.current = html5QrCode;

    const qrCodeSuccessCallback = (decodedText: string, decodedResult: Html5QrcodeResult) => {
      if (onScanSuccess) {
        onScanSuccess(decodedText, decodedResult);
      }
    };

    const qrCodeErrorCallback = (errorMessage: string) => {
      if (onScanFailure) {
        onScanFailure(errorMessage);
      }
    };

    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    html5QrCode.start(
      { facingMode: "environment" },
      config,
      qrCodeSuccessCallback,
      qrCodeErrorCallback
    ).then(() => {
      setIsScanning(true);
    }).catch((err) => {
      console.error(`Unable to start scanning: ${err}`);
    });
  };

  const stopScanning = () => {
    if (html5QrCodeRef.current) {
      html5QrCodeRef.current.stop().then(() => {
        setIsScanning(false);
        html5QrCodeRef.current = null;
      }).catch((err) => {
        console.error("Failed to stop scanning.", err);
      });
    }
  };

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch((err) => {
          console.error("Failed to stop scanning on unmount.", err);
        });
      }
    };
  }, []);

  return (
    <div>
      <div id={qrCodeRegionId} style={{ width: "500px", height: "500px" }}></div>
      <button onClick={isScanning ? stopScanning : startScanning}>
        {isScanning ? "Stop Scanning" : "Start Scanning"}
      </button>
    </div>
  );
};

export default QrCodeScanner;
