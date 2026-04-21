export function BTUMeter({ onBack }) {
  return (
    <div className="step-container">
      <div className="step-header">
        <p>BTU Meter Configuration</p>
      </div>

      <div className="development-message">
        <div className="development-content">
          <h2>⚙️ Development in Progress</h2>
          <p>BTU Meter functionality is currently under development.</p>
          <p>Stay tuned for updates!</p>
        </div>
      </div>

      <div className="step-actions">
        <button type="button" className="secondary" onClick={onBack}>
          Back
        </button>
      </div>
    </div>
  );
}
