import { useState, useRef, useEffect } from 'react';
import { jsPDF } from 'jspdf';

const initialTagData = {
  meterTag: '',
  model: '',
  serialNo: '',
  measuringRange: '',
  outputs: '',
  baudRate: '',
  modulusAddress: '',
  calibratedBy: '',
  date: '',
};

const TAG_LOGO = new URL('./images/fullLogo.jpg', import.meta.url).href;

export function TagMeter({ onBack, onGenerate }) {
  const [tagData, setTagData] = useState(initialTagData);
  const [showModal, setShowModal] = useState(false);
  const canvasRef = useRef(null);

  const handleChange = (field) => (event) => {
    setTagData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const loadImage = (src) =>
    new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });

  const drawTag = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    const SCALE = 2;
    const W = 450;
    const H = 280;

    canvas.width = W * SCALE;
    canvas.height = H * SCALE;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';

    ctx.scale(SCALE, SCALE);

    const logo = await loadImage(TAG_LOGO);

    // BACKGROUND
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, W, H);

    // DO NOT REMOVE TAG BOX
    const doNotRemoveX = W - 40;
    const doNotRemoveY = 10;
    const doNotRemoveWidth = 35;
    const doNotRemoveHeight = H - 20;

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(doNotRemoveX, doNotRemoveY, doNotRemoveWidth, doNotRemoveHeight);

    ctx.save();
    ctx.translate(doNotRemoveX + doNotRemoveWidth / 2, doNotRemoveY + doNotRemoveHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#000';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('DO NOT REMOVE TAG', 0, 3);
    ctx.restore();

    // CONTENT AREA
    const contentLeft = 15;
    const contentTop = 15;
    let currentY = contentTop;
    const lineHeight = 18;
    currentY += 25;

    // METER TAG
    ctx.fillStyle = '#000';
    ctx.font = 'bold 13px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`METER TAG: ${tagData.meterTag}`, contentLeft, currentY);
    currentY += lineHeight + 3;

    // MODEL and S/N
    ctx.font = '12px Arial';
    ctx.fillText(`MODEL: ${tagData.model}`, contentLeft, currentY);
    ctx.fillText(`S/N: ${tagData.serialNo}`, contentLeft + 140, currentY);
    currentY += lineHeight + 8;

    // LOGO
    const logoX = W - 160;
    const logoY = contentTop;
    if (logo) {
      ctx.drawImage(logo, logoX, logoY, 90, 45);
    }

    // WEBSITE
    ctx.fillStyle = '#0066cc';
    ctx.font = '8px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('www.mialinstruments.com', logoX + 50, logoY + 60);

    currentY += 10;

    // MEASURING RANGE
    ctx.fillStyle = '#000';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`MEASURING RANGE: ${tagData.measuringRange}`, contentLeft, currentY);
    currentY += lineHeight;

    // OUTPUTS
    ctx.fillText(`OUTPUTS: ${tagData.outputs}`, contentLeft, currentY);
    currentY += lineHeight;

    // BAUD RATE
    ctx.fillText(`BAUD RATE: ${tagData.baudRate}`, contentLeft, currentY);
    currentY += lineHeight;

    // MODBUS ADDRESS
    ctx.fillText(`MODBUS ADDRESS: ${tagData.modulusAddress}`, contentLeft, currentY);
    currentY += lineHeight + 8;

    currentY += 10;

    // CALIBRATED BY
    ctx.font = '12px Arial';
    ctx.fillText(`CALIBRATED BY: ${tagData.calibratedBy}`, contentLeft, currentY);
    currentY += lineHeight;

    // DATE
    ctx.fillText(`DATE: ${tagData.date}`, contentLeft, currentY);
    currentY += lineHeight + 5;

    // COMPANY NAME (CENTERED)
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('MIAL INSTRUMENTS PVT.LTD. INDIA', W / 2, currentY);
  };

  useEffect(() => {
    if (showModal) {
      drawTag();
    }
  }, [showModal, tagData]);

  const downloadPDF = async () => {
    await drawTag();

    const canvas = canvasRef.current;
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [150, 90],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, 150, 90);
    pdf.save(`Tag_${tagData.serialNo || 'file'}.pdf`);
  };

  return (
    <div className="step-container">
      <div className="step-header">
        <p>Enter the meter tag information</p>
      </div>

      <form className="step-form">
        <div className="form-section">
          <h4>TAG INFORMATION</h4>
          <div className="form-grid">
            <label className="field-group">
              <span>Meter Tag</span>
              <input type="text" value={tagData.meterTag} placeholder="Enter Meter Tag" onChange={handleChange('meterTag')} />
            </label>

            <label className="field-group">
              <span>Model</span>
              <input type="text" value={tagData.model} placeholder="Enter Model" onChange={handleChange('model')} />
            </label>

            <label className="field-group">
              <span>Serial No</span>
              <input type="text" value={tagData.serialNo} placeholder="Enter Serial Number" onChange={handleChange('serialNo')} />
            </label>

            <label className="field-group">
              <span>Measuring Range</span>
              <input type="text" value={tagData.measuringRange} placeholder="e.g. 0-4m" onChange={handleChange('measuringRange')} />
            </label>

            <label className="field-group">
              <span>Outputs</span>
              <input type="text" value={tagData.outputs} placeholder="e.g. 4-20mA + MODBUS" onChange={handleChange('outputs')} />
            </label>

            <label className="field-group">
              <span>Baud Rate</span>
              <input type="text" value={tagData.baudRate} placeholder="e.g. 9600" onChange={handleChange('baudRate')} />
            </label>

            <label className="field-group">
              <span>Modbus Address</span>
              <input type="text" value={tagData.modulusAddress} placeholder="e.g. 01" onChange={handleChange('modulusAddress')} />
            </label>

            <label className="field-group">
              <span>Calibrated By</span>
              <input type="text" value={tagData.calibratedBy} placeholder="Enter Name" onChange={handleChange('calibratedBy')} />
            </label>

            <label className="field-group">
              <span>Date</span>
              <input type="text" value={tagData.date} placeholder="DD/MM/YYYY" onChange={handleChange('date')} />
            </label>
          </div>
        </div>

        <div className="step-actions">
          <button type="button" className="secondary" onClick={onBack}>Back</button>
          <button type="button" className="primary" onClick={() => setShowModal(true)}>
            Preview Tag
          </button>
        </div>
      </form>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Tag Preview</h3>
            <canvas ref={canvasRef}></canvas>

            <div className="modal-actions">
              <button className="primary" onClick={downloadPDF}>Download Tag</button>
              <button className="secondary" onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}