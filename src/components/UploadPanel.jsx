function UploadPanel({ materials }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>Upload Material</h2>
          <p className="muted">Supported types PDF, DOCX, TXT. Maximum 10MB.</p>
        </div>
        <button className="btn btn-primary">Upload Material</button>
      </div>
      <div className="upload-grid">
        <div className="upload-card">
          <div className="upload-drop">
            <p className="upload-title">Drop a file to begin</p>
            <p className="muted">PDF, DOCX, or TXT only</p>
            <button className="btn btn-outline">Browse Files</button>
          </div>
          <div className="upload-meta">
            <p className="label">Parsing status</p>
            <p className="status-text">Parsing...</p>
            <p className="muted">Parsing failed: Unable to extract text from this file. Please upload a different format or retry.</p>
          </div>
        </div>
        <div className="materials-list">
          <div className="list-header">
            <h3>Your materials</h3>
            <span className="muted">2 files</span>
          </div>
          {materials.map((material) => (
            <div key={material.id} className="material-row">
              <div>
                <p className="material-title">{material.title}</p>
                <p className="muted">{material.type} • {material.size} • {material.uploaded}</p>
              </div>
              <div className="status-stack">
                <span className={material.status === 'Parsing complete' ? 'status-pill success' : 'status-pill muted'}>
                  {material.status}
                </span>
                <button className="btn btn-outline small">Open</button>
              </div>
            </div>
          ))}
          <div className="empty-state">
            <p>No materials uploaded. Click Upload Material to add a file.</p>
            <button className="btn btn-primary">Upload Material</button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default UploadPanel