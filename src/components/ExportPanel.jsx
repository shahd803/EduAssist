"use client"

import { useState } from 'react'

function ExportPanel() {
  const [exportError, setExportError] = useState('')

  const handleDownload = () => {
    const failed = Math.random() < 0.35
    if (failed) {
      setExportError('Export failed: Unable to generate PDF. Please try again.')
      return
    }

    setExportError('')
  }

  return (
    <section className="panel export-panel">
      <div>
        <h2>Export</h2>
        <p className="muted">Download PDF with questions and answer key.</p>
      </div>
      <div className="export-actions">
        <button className="btn btn-primary" onClick={handleDownload}>Download PDF</button>
        {exportError && <button className="btn btn-outline" onClick={handleDownload}>Retry</button>}
      </div>
      {exportError && (
        <div className="export-error">
          <p>{exportError}</p>
        </div>
      )}
    </section>
  )
}

export default ExportPanel
