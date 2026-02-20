"use client"

import { useRef, useState } from 'react'

function formatFileSize(bytes) {
  if (!bytes || bytes < 0) return '0 MB'
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFileTypeLabel(fileName) {
  const extension = fileName.split('.').pop()?.toUpperCase()
  return extension || 'FILE'
}

function buildMaterialFromFile(file) {
  return {
    id: `mat-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    title: file.name,
    type: getFileTypeLabel(file.name),
    size: formatFileSize(file.size),
    status: 'Parsing complete',
    uploaded: new Date().toLocaleString(),
  }
}

function UploadPanel({ materials }) {
  const [materialItems, setMaterialItems] = useState(materials)
  const [isDragging, setIsDragging] = useState(false)
  const [statusText, setStatusText] = useState('Drop a file or click Browse Files to upload.')
  const inputRef = useRef(null)

  const handleFiles = (files) => {
    const validFiles = Array.from(files || []).filter((file) => {
      const extension = file.name.split('.').pop()?.toLowerCase()
      return ['pdf', 'docx', 'txt'].includes(extension || '')
    })

    if (validFiles.length === 0) {
      setStatusText('No supported files found. Please upload PDF, DOCX, or TXT.')
      return
    }

    const newMaterials = validFiles.map(buildMaterialFromFile)
    setMaterialItems((current) => [...newMaterials, ...current])
    setStatusText(`Uploaded ${validFiles.length} ${validFiles.length === 1 ? 'file' : 'files'} successfully.`)
  }

  const handleBrowseClick = () => {
    inputRef.current?.click()
  }

  const handleInputChange = (event) => {
    handleFiles(event.target.files)
    event.target.value = ''
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragging(false)
    handleFiles(event.dataTransfer.files)
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (event) => {
    event.preventDefault()
    setIsDragging(false)
  }

  const fileCountLabel = `${materialItems.length} ${materialItems.length === 1 ? 'file' : 'files'}`

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>Upload Material</h2>
          <p className="muted">Supported types PDF, DOCX, TXT. Maximum 10MB.</p>
        </div>
        <button className="btn btn-primary" onClick={handleBrowseClick}>Upload Material</button>
      </div>
      <div className="upload-grid">
        <div className="upload-card">
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            multiple
            hidden
            onChange={handleInputChange}
          />
          <div
            className="upload-drop"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            style={{ borderStyle: isDragging ? 'solid' : 'dashed' }}
          >
            <p className="upload-title">Drop a file to begin</p>
            <p className="muted">PDF, DOCX, or TXT only</p>
            <button className="btn btn-outline" onClick={handleBrowseClick}>Browse Files</button>
          </div>
          <div className="upload-meta">
            <p className="label">Parsing status</p>
            <p className="status-text">{statusText}</p>
            <p className="muted">Recent uploads are added to Your materials automatically.</p>
          </div>
        </div>
        <div className="materials-list">
          <div className="list-header">
            <h3>Your materials</h3>
            <span className="muted">{fileCountLabel}</span>
          </div>
          {materialItems.map((material) => (
            <div key={material.id} className="material-row">
              <div>
                <p className="material-title">{material.title}</p>
                <p className="muted">{material.type} - {material.size} - {material.uploaded}</p>
              </div>
              <div className="status-stack">
                <span className={material.status === 'Parsing complete' ? 'status-pill success' : 'status-pill muted'}>
                  {material.status}
                </span>
                <button className="btn btn-outline small">View</button>
              </div>
            </div>
          ))}
          {materialItems.length === 0 && (
            <div className="empty-state">
              <p>No materials uploaded. Click Upload Material to add a file.</p>
              <button className="btn btn-primary" onClick={handleBrowseClick}>Upload Material</button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default UploadPanel
