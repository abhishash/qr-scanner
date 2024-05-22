// app/page.js
"use client"; // Mark this page as a client component

import { useState } from 'react';
import dynamic from 'next/dynamic';

const QrCodeScanner = dynamic(() => import('./components/QrCodeScanner'), { ssr: false });

export default function Home() {
  const [scanResult, setScanResult] = useState(null);

  const handleScanSuccess = (decodedText: any) => {
    setScanResult(decodedText);
  };

  const handleScanFailure = (errorMessage: any) => {
    console.error(`QR Code Scan Error: ${errorMessage}`);
  };

  return (
    <div>
      <h1>QR Code Scanner</h1>
      <QrCodeScanner onScanSuccess={handleScanSuccess} onScanFailure={handleScanFailure} />
      {scanResult && <p>Scan Result: {scanResult}</p>}
    </div>
  );
}
