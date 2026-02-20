"use client"

import { useEffect, useRef, useState } from 'react'

function formatFileSize(bytes) {
  if (!bytes || bytes < 0) return '0 MB'
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFileTypeLabel(fileName) {
  const extension = fileName.split('.').pop()?.toUpperCase()
  return extension || 'FILE'
}

function extractTextFromFile(rawText) {
  const sanitized = String(rawText || '')
    .replace(/\u0000/g, '')
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  return sanitized.length >= 30 ? sanitized : ''
}

async function buildMaterialFromFile(file) {
  let parsedText = ''
  try {
    parsedText = extractTextFromFile(await file.text())
  } catch {
    parsedText = ''
  }

  return {
    id: `mat-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    title: file.name,
    type: getFileTypeLabel(file.name),
    size: formatFileSize(file.size),
    status: parsedText ? 'Parsing complete' : 'Text extraction unavailable',
    uploaded: new Date().toLocaleString(),
    objectUrl: URL.createObjectURL(file),
    parsedText,
  }
}

function isPreviewable(material) {
  return ['PDF', 'TXT'].includes(material.type)
}

function UploadPanel({ materials, onMaterialsChange }) {
  const [isDragging, setIsDragging] = useState(false)
  const [statusText, setStatusText] = useState('Drop a file or click Browse Files to upload.')
  const [previewMaterial, setPreviewMaterial] = useState(null)
  const inputRef = useRef(null)
  const createdObjectUrlsRef = useRef([])

  const handleFiles = async (files) => {
    const validFiles = Array.from(files || []).filter((file) => {
      const extension = file.name.split('.').pop()?.toLowerCase()
      return ['pdf', 'docx', 'txt'].includes(extension || '')
    })

    if (validFiles.length === 0) {
      setStatusText('No supported files found. Please upload PDF, DOCX, or TXT.')
      return
    }

    const newMaterials = await Promise.all(validFiles.map(buildMaterialFromFile))
    newMaterials.forEach((material) => {
      if (material.objectUrl) {
        createdObjectUrlsRef.current.push(material.objectUrl)
      }
    })
    const totalCount = materials.length + newMaterials.length
    const unavailableCount = newMaterials.filter((material) => !material.parsedText).length
    onMaterialsChange((current) => [...newMaterials, ...current])
    setStatusText(
      unavailableCount > 0
        ? `Current total: ${totalCount} files. Text extraction unavailable for ${unavailableCount} file(s).`
        : `Current total: ${totalCount} ${totalCount === 1 ? 'file' : 'files'} in Your materials.`
    )
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

  const handleViewMaterial = (material) => {
    if (!material.objectUrl) {
      setStatusText('This file cannot be previewed in the browser.')
      return
    }

    setPreviewMaterial(material)
  }

  const handleRemoveMaterial = (materialId) => {
    onMaterialsChange((current) => {
      const target = current.find((item) => item.id === materialId)
      if (target?.objectUrl) {
        URL.revokeObjectURL(target.objectUrl)
        createdObjectUrlsRef.current = createdObjectUrlsRef.current.filter((url) => url !== target.objectUrl)
      }

      const next = current.filter((item) => item.id !== materialId)
      const count = next.length
      setStatusText(`Current total: ${count} ${count === 1 ? 'file' : 'files'} in Your materials.`)
      return next
    })

    if (previewMaterial?.id === materialId) {
      setPreviewMaterial(null)
    }
  }

  const fileCountLabel = `${materials.length} ${materials.length === 1 ? 'file' : 'files'}`

  useEffect(() => {
    const objectUrls = createdObjectUrlsRef.current
    return () => {
      objectUrls.forEach((url) => {
        URL.revokeObjectURL(url)
      })
    }
  }, [])

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
          <div className="materials-scroll">
            {materials.map((material) => (
              <div key={material.id} className="material-row">
                <div>
                  <p className="material-title">{material.title}</p>
                  <p className="muted">{material.type} - {material.size} - {material.uploaded}</p>
                </div>
                <div className="status-stack">
                  <span className={material.status === 'Parsing complete' ? 'status-pill success' : 'status-pill muted'}>
                    {material.status}
                  </span>
                  <button
                    className="btn btn-outline small"
                    onClick={() => handleViewMaterial(material)}
                    disabled={!material.objectUrl}
                    title={material.objectUrl ? 'Open file' : 'Preview unavailable'}
                  >
                    View
                  </button>
                  <button
                    className="btn btn-outline small"
                    onClick={() => handleRemoveMaterial(material.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            {materials.length === 0 && (
              <div className="empty-state">
                <p>No materials uploaded. Click Upload Material to add a file.</p>
                <button className="btn btn-primary" onClick={handleBrowseClick}>Upload Material</button>
              </div>
            )}
          </div>
        </div>
      </div>
      {previewMaterial && (
        <div className="preview-modal-overlay" onClick={() => setPreviewMaterial(null)}>
          <div className="preview-modal" onClick={(event) => event.stopPropagation()}>
            <div className="preview-modal-header">
              <h3>{previewMaterial.title}</h3>
              <button className="btn btn-outline small" onClick={() => setPreviewMaterial(null)}>Close</button>
            </div>
            <div className="preview-modal-body">
              {isPreviewable(previewMaterial) ? (
                <iframe title={previewMaterial.title} src={previewMaterial.objectUrl} className="preview-frame" />
              ) : (
                <div className="empty-state">
                  <p>This file type cannot be previewed directly in the browser.</p>
                  <a className="btn btn-primary" href={previewMaterial.objectUrl} download={previewMaterial.title}>
                    Download File
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default UploadPanel
