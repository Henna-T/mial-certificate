export function FlowMeter({ onBack }) {
  return (
    <div className="step-container">
      <div className="step-header">
        <p>Flow Meter Configuration</p>
      </div>

      <div className="development-message">
        <div className="development-content">
          <h2>⚙️ Development in Progress</h2>
          <p>Flow Meter functionality is currently under development.</p>
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
