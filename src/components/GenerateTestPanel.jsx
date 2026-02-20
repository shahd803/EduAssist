function GenerateTestPanel() {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>Generate Test</h2>
          <p className="muted">Configure question types and difficulty.</p>
        </div>
        <span className="status-pill danger">Generation failed: Temporary AI error. Click Retry to attempt again.</span>
      </div>
      <div className="form-grid">
        <label className="field">
          <span className="label">Title</span>
          <input type="text" defaultValue="Untitled Test" />
        </label>
        <label className="field">
          <span className="label">Number of questions</span>
          <input type="number" min="1" max="100" step="1" defaultValue="10" />
        </label>
        <div className="field">
          <span className="label">Question types</span>
          <div className="check-row">
            <label className="checkbox">
              <input type="checkbox" defaultChecked />
              <span>Multiple-choice</span>
            </label>
            <label className="checkbox">
              <input type="checkbox" defaultChecked />
              <span>Short-answer</span>
            </label>
            <label className="checkbox">
              <input type="checkbox" />
              <span>True/False</span>
            </label>
          </div>
        </div>
        <label className="field">
          <span className="label">Difficulty distribution</span>
          <select defaultValue="Even">
            <option>Even</option>
            <option>More Easy</option>
            <option>More Hard</option>
          </select>
        </label>
        <div className="field">
          <span className="label">Source paragraphs</span>
          <div className="check-grid">
            <label className="checkbox">
              <input type="checkbox" defaultChecked />
              <span>Paragraph 1</span>
            </label>
            <label className="checkbox">
              <input type="checkbox" defaultChecked />
              <span>Paragraph 2</span>
            </label>
            <label className="checkbox">
              <input type="checkbox" defaultChecked />
              <span>Paragraph 3</span>
            </label>
          </div>
        </div>
        <div className="form-actions">
          <button className="btn btn-primary">Generate</button>
          <button className="btn btn-outline">Cancel</button>
          <button className="btn btn-outline">Retry</button>
        </div>
      </div>
    </section>
  )
}

export default GenerateTestPanel
