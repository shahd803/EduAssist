"use client"

import { useState } from 'react'
import { jsPDF } from 'jspdf'

function ExportPanel({ questions, keptQuestionIds }) {
  const [exportError, setExportError] = useState('')
  const [isExporting, setIsExporting] = useState(false)
  const selectedKeepIds = Array.isArray(keptQuestionIds) ? keptQuestionIds : []
  const keptCount = Array.isArray(questions)
    ? questions.filter((question) => selectedKeepIds.includes(question.id)).length
    : 0

  const handleDownload = () => {
    if (!Array.isArray(questions) || questions.length === 0) {
      setExportError('Export failed: No generated questions to export yet.')
      return
    }

    const keptQuestions = questions.filter((question) => selectedKeepIds.includes(question.id))
    if (keptQuestions.length === 0) {
      setExportError('Export failed: Select Keep on at least one question before exporting.')
      return
    }

    try {
      setIsExporting(true)
      setExportError('')

      const doc = new jsPDF({ unit: 'pt', format: 'a4' })
      const pageHeight = doc.internal.pageSize.getHeight()
      const maxWidth = 535
      const startX = 40
      const bottomMargin = 50
      let y = 44

      const addPageIfNeeded = (neededSpace = 18) => {
        if (y + neededSpace > pageHeight - bottomMargin) {
          doc.addPage()
          y = 44
        }
      }

      const writeWrapped = (text, size = 12, lineGap = 16, indent = 0) => {
        doc.setFontSize(size)
        const lines = doc.splitTextToSize(String(text || ''), maxWidth - indent)
        lines.forEach((line) => {
          addPageIfNeeded(lineGap)
          doc.text(line, startX + indent, y)
          y += lineGap
        })
      }

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(18)
      doc.text('Generated Test', startX, y)
      y += 24
      doc.setFont('helvetica', 'normal')
      writeWrapped(`${keptQuestions.length} kept questions`, 11, 16)
      y += 8

      keptQuestions.forEach((question, index) => {
        addPageIfNeeded(56)
        doc.setFont('helvetica', 'bold')
        writeWrapped(`Q${index + 1} - ${question.type} - ${question.difficulty}`, 11, 16)
        doc.setFont('helvetica', 'normal')
        writeWrapped(question.prompt, 12, 18)

        if (Array.isArray(question.choices) && question.choices.length > 0) {
          question.choices.forEach((choice, choiceIndex) => {
            const choicePrefix = `${String.fromCharCode(65 + choiceIndex)}. `
            writeWrapped(`${choicePrefix}${choice}`, 11, 16, 12)
          })
        }

        doc.setTextColor(71, 85, 105)
        writeWrapped(`Source: ${question.source || 'Uploaded material'}`, 10, 14)
        doc.setTextColor(15, 23, 42)
        y += 8
      })

      doc.save('eduassist-generated-test.pdf')
    } catch (error) {
      setExportError(`Export failed: ${error.message}`)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <section className="panel export-panel">
      <div>
        <h2>Export</h2>
        <p className="muted">Download PDF with questions and answer key.</p>
      </div>
      <div className="export-actions">
        <button className="btn btn-primary" onClick={handleDownload} disabled={isExporting || keptCount === 0}>
          {isExporting ? 'Exporting...' : 'Download PDF'}
        </button>
      </div>
      {keptCount === 0 && (
        <div className="export-error">
          <p>Select at least one question to enable PDF export.</p>
        </div>
      )}
      {exportError && (
        <div className="export-error">
          <p>{exportError}</p>
        </div>
      )}
    </section>
  )
}

export default ExportPanel
