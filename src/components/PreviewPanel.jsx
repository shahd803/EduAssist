function PreviewPanel({ previewParagraphs }) {
  return (
    <section className="panel two-column">
      <div className="column-primary">
        <div className="panel-header">
          <div>
            <h2>Parsed Preview</h2>
            <p className="muted">World History Unit 3.pdf</p>
          </div>
          <button className="btn btn-primary">Generate Test</button>
        </div>
        <div className="preview-list">
          {previewParagraphs.map((text, index) => (
            <div key={text} className="preview-item">
              <div className="preview-head">
                <p className="label">Paragraph {index + 1}</p>
                <label className="checkbox">
                  <input type="checkbox" defaultChecked />
                  <span>Use this as source</span>
                </label>
              </div>
              <p>{text}</p>
            </div>
          ))}
          <div className="empty-state subtle">
            <p>No parsable text found in this document. Try a different file.</p>
            <button className="btn btn-primary">Upload Another File</button>
          </div>
        </div>
      </div>
      <aside className="column-secondary">
        <div className="info-card">
          <h3>Material Details</h3>
          <div className="detail-row">
            <span className="label">File type</span>
            <span>PDF</span>
          </div>
          <div className="detail-row">
            <span className="label">Language</span>
            <span>English</span>
          </div>
          <div className="detail-row">
            <span className="label">Uploaded</span>
            <span>February 19, 2026</span>
          </div>
          <div className="detail-row">
            <span className="label">Parsed Preview</span>
            <span>3 paragraphs shown</span>
          </div>
          <button className="btn btn-outline full">Delete Material</button>
        </div>
        <div className="info-card">
          <h3>Recent Tests</h3>
          <ul className="compact-list">
            <li>
              <p>Unit 3 Warmup</p>
              <span>10 questions • Edited today</span>
            </li>
            <li>
              <p>Photosynthesis Check</p>
              <span>5 questions • Draft</span>
            </li>
          </ul>
        </div>
      </aside>
    </section>
  )
}

export default PreviewPanel