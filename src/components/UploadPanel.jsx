"use client" //client side vs server side implementation

import { useEffect, useRef, useState } from 'react'
import { uploadMaterial } from '@/lib/api'

function formatFileSize(bytes) {
  if (!bytes || bytes < 0) return '0 MB'
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFileTypeLabel(fileName) {
  const extension = fileName.split('.').pop()?.toUpperCase()
  return extension || 'FILE'
}

async function buildMaterialFromFile(file) {
  const uploadResponse = await uploadMaterial(file, file.name)

  return {
    id: uploadResponse.materialId,
    title: uploadResponse.title || file.name,
    type: uploadResponse.type || getFileTypeLabel(file.name),
    size: formatFileSize(file.size),
    status: 'Uploaded',
    uploaded: new Date().toLocaleString(),
    objectUrl: URL.createObjectURL(file),
    fileUrl: uploadResponse.fileUrl || null,
  }
}

function isPreviewable(material) {
  return ['PDF'].includes(material.type)
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
      return ['pdf'].includes(extension || '')
    })

    if (validFiles.length === 0) {
      setStatusText('No supported files found. Please upload PDF only.')
      return
    }

    try {
      const newMaterials = await Promise.all(validFiles.map(buildMaterialFromFile))
      newMaterials.forEach((material) => {
        if (material.objectUrl) {
          createdObjectUrlsRef.current.push(material.objectUrl)
        }
      })
      const totalCount = materials.length + newMaterials.length
      onMaterialsChange((current) => [...newMaterials, ...current])
      setStatusText(`Current total: ${totalCount} ${totalCount === 1 ? 'file' : 'files'} in Your materials.`)
    } catch (error) {
      setStatusText(`Upload failed: ${error.message}`)
    }
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
    const nextCount = Math.max(0, materials.length - 1)
    onMaterialsChange((current) => {
      const target = current.find((item) => item.id === materialId)
      if (target?.objectUrl) {
        URL.revokeObjectURL(target.objectUrl)
        createdObjectUrlsRef.current = createdObjectUrlsRef.current.filter((url) => url !== target.objectUrl)
      }

      return current.filter((item) => item.id !== materialId)
    })
    setStatusText(`Current total: ${nextCount} ${nextCount === 1 ? 'file' : 'files'} in Your materials.`)

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
          <p className="muted">Supported type PDF. Maximum 10MB.</p>
        </div>
      </div>
      <div className="upload-grid">
        <div className="upload-card">
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
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
            <p className="muted">PDF only</p>
            <button className="btn btn-outline" onClick={handleBrowseClick}>Browse Files</button>
          </div>
          <div className="upload-meta">
            <p className="label">Upload status</p>
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
                  <span className={material.status === 'Uploaded' ? 'status-pill success' : 'status-pill muted'}>
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
              </div>
            )}
          </div>
          <button className="btn btn-primary full" onClick={handleBrowseClick}>Upload Material</button>
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
