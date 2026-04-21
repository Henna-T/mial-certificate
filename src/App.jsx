import { useRef, useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import Header from './Header.jsx';
import { LevelMeter } from './levelMeter.jsx';
import { TagMeter } from './TagMeter.jsx';
import { FlowMeter } from './FlowMeter.jsx';
import { BTUMeter } from './BTUMeter.jsx';

const WATERMARK_LOGO = new URL('./images/Mlogo.jpeg', import.meta.url).href;
const LEFT_LOGO = new URL('./images/fullLogo.jpg', import.meta.url).href;
const RIGHT_LOGO = new URL('./images/iso.jpg', import.meta.url).href;

export default function App() {
  const [certificateData, setCertificateData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [meterType, setMeterType] = useState(null);
  const [levelMeterMode, setLevelMeterMode] = useState(null); // 'certificate' or 'tag'
  const canvasRef = useRef(null);

  const loadImage = (src) =>
    new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });

const drawCertificate = async () => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  const SCALE = 2;
  const W = 1123;
  const H = 794;

  canvas.width = W * SCALE;
  canvas.height = H * SCALE;
  canvas.style.width = W + 'px';
  canvas.style.height = H + 'px';

  ctx.scale(SCALE, SCALE);

  const [watermark, leftLogo, rightLogo] = await Promise.all([
    loadImage(WATERMARK_LOGO),
    loadImage(LEFT_LOGO),
    loadImage(RIGHT_LOGO),
  ]);

  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, W, H);

  if (watermark) {
    ctx.globalAlpha = 0.05;
    ctx.drawImage(watermark, W / 2 - 250, H / 2 - 250, 500, 550);
    ctx.globalAlpha = 1;
  }

  // 🎨 BEAUTIFUL DOUBLE BORDER
  ctx.strokeStyle = '#2e348e';
  ctx.lineWidth = 10;
  ctx.strokeRect(20, 20, W - 40, H - 40);

  ctx.lineWidth = 3;
  ctx.strokeRect(35, 35, W - 70, H - 70);

  // Decorative corner accents
  const corner = (x, y, flipX, flipY) => {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.moveTo(x, y);
    ctx.lineTo(x + 30 * flipX, y);
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + 30 * flipY);
    ctx.stroke();
  };

  corner(35, 35, 1, 1);
  corner(W - 35, 35, -1, 1);
  corner(35, H - 35, 1, -1);
  corner(W - 35, H - 35, -1, -1);

  // INNER BORDER
  ctx.lineWidth = 1.5;
  ctx.strokeRect(60, 60, W - 120, H - 120);

  // TITLES
  ctx.textAlign = 'center';
  ctx.fillStyle = '#000';

  ctx.font = 'bold 50px serif';
  ctx.fillText('LEVEL METER', W / 2, 105);

  ctx.font = 'bold 32px serif';
  ctx.fillText('CERTIFICATE OF CALIBRATION', W / 2, 155);

  if (leftLogo) ctx.drawImage(leftLogo, 65, 85, 230, 90);
  if (rightLogo) ctx.drawImage(rightLogo, W - 280, 60, 200, 150);

  ctx.font = 'bold 15px serif';
  ctx.fillText('CALIBRATION, INSTALLATION & CONFIGURATION DATA for', W / 2, 200);
  ctx.fillText(`LEVEL METER Model ${certificateData?.model || ''}`, W / 2, 225);
  ctx.fillText(`Serial No. ${certificateData?.serialNo || ''}`, W / 2, 250);

  ctx.textAlign = 'left';

  // CENTER SHIFT (fix alignment issue)
  const LEFT_X = 180;
  const RIGHT_X = 640;

  const drawField = (label, value, x, y) => {
    if (!value) return false;

    ctx.font = '14px serif';
    ctx.fillText(label, x, y);

    const w = ctx.measureText(label).width;

    ctx.font = 'bold 14px serif';
    ctx.fillText(`: ${value}`, x + w + 4, y);

    return true;
  };

  const drawSectionTitle = (title, x, y) => {
    ctx.font = 'bold 15px serif';
    ctx.fillText(title, x, y);

    ctx.beginPath();
    ctx.moveTo(x, y + 6);
    ctx.lineTo(x + ctx.measureText(title).width, y + 6);
    ctx.stroke();

    return true;
  };

  let leftY = 295;
  let rightY = 295;
  const lineHeight = 24;

  // LEFT SECTION
  drawSectionTitle('CONFIGURATION DATA', LEFT_X, leftY);
  leftY += 36;

  const configurationFields = [
    ['Application-Fluid', certificateData?.applicationFluid],
    ['Accuracy', certificateData?.accuracy],
    ['Protection', certificateData?.protectionRating],
    ['Measuring range', certificateData?.measuringRange],
    ['Set Range', certificateData?.setRange],
    ['Blind Spot', certificateData?.blindSpot],
    ['Display Type', certificateData?.displayType],
    ['Analog Output', certificateData?.analogOutput],
  ];

  configurationFields.forEach(([label, value]) => {
    if (drawField(label, value, LEFT_X, leftY)) leftY += lineHeight;
  });

  // ✅ Temperature (bold value)
  ctx.font = '14px serif';
  ctx.fillText('Temperature', LEFT_X, leftY);
  let w1 = ctx.measureText('Temperature').width;

  ctx.font = 'bold 14px serif';
  ctx.fillText(`: ${certificateData?.temperature || ''}`, LEFT_X + w1 + 4, leftY);

  leftY += lineHeight;

  // ✅ Power Supply on NEXT LINE
  ctx.font = '14px serif';
  ctx.fillText('Power Supply', LEFT_X, leftY);
  let w2 = ctx.measureText('Power Supply').width;

  ctx.font = 'bold 14px serif';
  ctx.fillText(`: ${certificateData?.powerSupply || ''}`, LEFT_X + w2 + 4, leftY);

  leftY += lineHeight + 10;

  // RIGHT SECTION
const boxWidth = 400;

ctx.lineWidth = .5;
ctx.strokeStyle = '#000';
ctx.strokeRect(RIGHT_X, rightY, boxWidth, 28);

ctx.font = 'bold 13px serif';
ctx.fillText(
  `Communication Interface Protocol - ${certificateData?.communicationProtocol || ''}`,
  RIGHT_X + 6,
  rightY + 18
);

rightY += 50;

// 🔹 Address / Baud / Parity (below protocol)
ctx.font = '13px serif';
ctx.fillText(
  `Address: ${certificateData?.address || ''}   Baud Rate: ${certificateData?.baudRate || ''}   Parity: ${certificateData?.parity || ''}`,
  RIGHT_X,
  rightY
);

rightY += 35;

// 🔹 GAP before title (adjust this for spacing)
rightY += 20;

// 🔹 NOW draw title BELOW
drawSectionTitle('LEVEL METER INFORMATION', RIGHT_X, rightY);
rightY += 36;


  const rightFields = [
    ['Model', certificateData?.model],
    ['Serial No', certificateData?.serialNo],
    ['Measuring Technology', certificateData?.measuringTechnology],
  ];

  rightFields.forEach(([label, value]) => {
    if (drawField(label, value, RIGHT_X, rightY)) rightY += lineHeight;
  });

  // SIGNATURE
  const signatureY = 600;

  ctx.textAlign = 'center';
  ctx.font = '14px serif';
  ctx.fillText('Calibrated By: _______________________', W / 2 - 150, signatureY);

  ctx.font = '12px serif';
  ctx.fillText('JERIN ZACHARIA', W / 2 - 110, signatureY + 18);

  ctx.font = '14px serif';
  ctx.fillText(`Date: ${new Date().toLocaleDateString('en-GB')}`, W / 2 + 150, signatureY);

  // FOOTER
const footerY = 640;

// 🔹 Reduced width & centered
const footerWidth = W - 400; // reduce width (adjust if needed)
const footerX = (W - footerWidth) / 2;

// 🔹 OUTER BORDER
ctx.strokeStyle = '#000000';
ctx.lineWidth = 2;
ctx.strokeRect(footerX, footerY, footerWidth, 70);

// 🔹 INNER BORDER (double border effect)
ctx.lineWidth = 1;
ctx.strokeRect(footerX + 4, footerY + 4, footerWidth - 10, 77 - 16);

// 🔹 TEXT
ctx.textAlign = 'center';

ctx.font = 'bold 14px serif';
ctx.fillText(
  'MIAL INSTRUMENTS PVT. LTD. certifies that this Level meter',
  W / 2,
  footerY + 25
);
ctx.fillText(
  'was calibrated against a primary standards accurate to within ±0.5%.',
  W / 2,
  footerY + 45
);

// 🔹 ADDRESS (slightly below box)
ctx.font = 'italic bold 11px serif';
ctx.fillText(
  '856/6 GIDC Makarpura, Vadodara- 390010 Gujarat, India Tel (+91) 9913449547/9913449548',
  W / 2,
  footerY + 90
);
};

  // ✅ AUTO DRAW AFTER MODAL OPENS
  useEffect(() => {
    if (showModal && certificateData && canvasRef.current) {
      drawCertificate();
    }
  }, [showModal, certificateData]);

  // 📄 DOWNLOAD PDF
  const downloadPDF = async () => {
    await drawCertificate();

    const canvas = canvasRef.current;
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);

    pdf.save(`Certificate_${certificateData?.serialNo || 'file'}.pdf`);
  };

  // ✅ FIXED HANDLER
  const handleGenerate = (data) => {
    setCertificateData(data);
    setShowModal(true);
  };

  return (
    <div className="app-shell">
      <Header />

      {meterType === null ? (
        <div className="meter-selector-container">
          <div className="meter-selector">
            <h2>Select Meter Type</h2>
            <p>Choose the type of meter certificate you want to generate:</p>
            <div className="meter-options">
              <button
                className="meter-option"
                onClick={() => setMeterType('levelMeter')}
              >
                <span className="meter-icon">📏</span>
                <span className="meter-name">Level Meter</span>
              </button>
              <button
                className="meter-option"
                onClick={() => setMeterType('flowMeter')}
              >
                <span className="meter-icon">🌊</span>
                <span className="meter-name">Flow Meter</span>
              </button>
              <button
                className="meter-option"
                onClick={() => setMeterType('btuMeter')}
              >
                <span className="meter-icon">🔥</span>
                <span className="meter-name">BTU Meter</span>
              </button>
            </div>
          </div>
        </div>
      ) : meterType === 'levelMeter' && levelMeterMode === null ? (
        <div className="meter-selector-container">
          <div className="meter-selector">
            <h2>Level Meter Options</h2>
            <p>What would you like to generate?</p>
            <div className="meter-options">
              <button
                className="meter-option"
                onClick={() => setLevelMeterMode('certificate')}
              >
                <span className="meter-icon">📜</span>
                <span className="meter-name">Generate Certificate</span>
              </button>
              <button
                className="meter-option"
                onClick={() => setLevelMeterMode('tag')}
              >
                <span className="meter-icon">🏷️</span>
                <span className="meter-name">Generate Tag</span>
              </button>
            </div>
            <button 
              className="secondary" 
              onClick={() => setMeterType(null)}
              style={{ marginTop: '20px' }}
            >
              Back
            </button>
          </div>
        </div>
      ) : (
        <>
          {meterType === 'levelMeter' && levelMeterMode === 'certificate' && (
            <LevelMeter
              onBack={() => {
                setLevelMeterMode(null);
              }}
              onGenerate={handleGenerate}
            />
          )}
          {meterType === 'levelMeter' && levelMeterMode === 'tag' && (
            <TagMeter
              onBack={() => {
                setLevelMeterMode(null);
              }}
              onGenerate={handleGenerate}
            />
          )}
          {meterType === 'flowMeter' && (
            <FlowMeter onBack={() => setMeterType(null)} />
          )}
          {meterType === 'btuMeter' && (
            <BTUMeter onBack={() => setMeterType(null)} />
          )}
        </>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Certificate Preview</h3>

            <canvas ref={canvasRef}></canvas>

            <div className="modal-actions">
              <button className="primary" onClick={downloadPDF}>
                Download Certificate
              </button>
              <button className="secondary" onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}