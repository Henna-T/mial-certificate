import { useState } from 'react';

const initialFormData = {
  model: '',
  serialNo: '',
  measuringTechnology: '',
  applicationFluid: '',
  accuracy: '',
  protectionRating: '',
  measuringRange: '',
  setRange: '',
  blindSpot: '',
  displayType: '',
  analogOutput: '',
  temperature: '',
  powerSupply: '',
  communicationProtocol: '',
  address: '',
  baudRate: '',
  parity: '',
};

export function LevelMeter({ onBack, onGenerate }) {
  const [formData, setFormData] = useState(initialFormData);
  const [currentSection, setCurrentSection] = useState(0);

  const sections = [
    {
      title: 'CONFIGURATION DATA',
      fields: ['applicationFluid', 'accuracy', 'protectionRating', 'measuringRange', 'setRange', 'blindSpot', 'displayType', 'analogOutput', 'temperature', 'powerSupply', 'communicationProtocol', 'address', 'baudRate', 'parity']
    },
    {
      title: 'LEVEL METER INFORMATION',
      fields: ['model', 'serialNo', 'measuringTechnology']
    }
  ];

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  // All fields are optional, so no validation needed
  const isValid = true;

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentSection > 0) {
      setCurrentSection((prev) => prev - 1);
    } else {
      onBack();
    }
  };

  const currentSectionData = sections[currentSection];

  return (
    <div className="step-container">
      <div className="step-header">
        <p>Enter the level meter device information</p>
        <div className="progress-indicator">
          <div className="progress-steps">
            {sections.map((section, index) => (
              <div key={index} className="progress-wrapper">
                <div className={`progress-circle ${index <= currentSection ? 'active' : ''} ${index < currentSection ? 'completed' : ''}`}>
                  {index + 1}
                </div>
                {index < sections.length - 1 && (
                  <div className={`progress-line ${index < currentSection ? 'completed' : ''}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="step-form">
        <div className="form-section">
          <h4>{currentSectionData.title}</h4>
          <div className="form-grid">
            {currentSectionData.fields.map(field => {
              const fieldLabels = {
                model: 'Model',
                serialNo: 'Serial No',
                measuringTechnology: 'Measuring Technology',
                applicationFluid: 'Application-Fluid',
                accuracy: 'Accuracy',
                protectionRating: 'Protection',
                measuringRange: 'Measuring range',
                setRange: 'Set Range',
                blindSpot: 'Blind Spot',
                displayType: 'Display Type',
                analogOutput: 'Analog Output',
                temperature: 'Temperature',
                powerSupply: 'Power Supply',
                communicationProtocol: 'Communication Interface Protocol',
                address: 'Address',
                baudRate: 'Baud Rate',
                parity: 'Parity'
              };

              const fieldPlaceholders = {
                model: 'e.g., MULR',
                serialNo: 'e.g., MUL0302260007',
                measuringTechnology: 'e.g., Ultrasonic',
                applicationFluid: 'e.g., Diesel',
                accuracy: 'e.g., ± 0.5%',
                protectionRating: 'e.g., IP65',
                measuringRange: 'e.g., 0 - 4 m',
                setRange: 'e.g., 4 m',
                blindSpot: 'e.g., 0.4 m',
                displayType: 'e.g., Integral',
                analogOutput: 'e.g., 4-20 mA',
                temperature: 'e.g., Transmitter -20° to  60° C and Probe -20° to 80° C',
                powerSupply: 'e.g., 24 VDC',
                communicationProtocol: 'e.g., Modbus RS 485',
                address: 'e.g., 01',
                baudRate: 'e.g., 9600',
                parity: 'e.g., None'
              };

              return (
                <label key={field} className="field-group">
                  <span>{fieldLabels[field]}</span>
                  <input
                    type="text"
                    value={formData[field]}
                    onChange={handleChange(field)}
                    placeholder={fieldPlaceholders[field]}
                  />
                </label>
              );
            })}
          </div>
        </div>

        <div className="step-actions">
          <button type="button" className="secondary" onClick={handleBack}>
            Back
          </button>
          {currentSection < sections.length - 1 ? (
            <button type="button" className="primary" onClick={handleNext}>
              Next
            </button>
          ) : (
            <button type="button" className="primary" onClick={() => onGenerate(formData)}>
              Generate Certificate
            </button>
          )}
        </div>
      </form>
    </div>
  );
}