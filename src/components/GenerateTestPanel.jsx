"use client"

import { useState } from 'react'

function GenerateTestPanel() {
  const [title, setTitle] = useState('')
  const [questionCount, setQuestionCount] = useState('')
  const [difficultyDistribution, setDifficultyDistribution] = useState('')
  const [sourceText, setSourceText] = useState('')
  const [questionTypes, setQuestionTypes] = useState({
    multipleChoice: true,
    shortAnswer: true,
    trueFalse: false,
  })
  const [generationError, setGenerationError] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleTypeToggle = (key) => {
    setQuestionTypes((current) => ({ ...current, [key]: !current[key] }))
  }

  const handleGenerate = async () => {
    const parsedCount = Number(questionCount)
    const hasTypeSelected = Object.values(questionTypes).some(Boolean)

    if (!title.trim()) {
      setGenerationError('Generation failed: Please enter a test title.')
      return
    }

    if (!Number.isInteger(parsedCount) || parsedCount < 1 || parsedCount > 100) {
      setGenerationError('Generation failed: Number of questions must be between 1 and 100.')
      return
    }

    if (!hasTypeSelected) {
      setGenerationError('Generation failed: Select at least one question type.')
      return
    }

    if (!sourceText.trim()) {
      setGenerationError('Generation failed: Provide source text to generate from.')
      return
    }

    try {
      setIsGenerating(true)
      setGenerationError('')

      const response = await fetch('/api/generate-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          questionCount: parsedCount,
          questionTypes,
          difficultyDistribution,
          sourceText,
        }),
      })

      const payload = await response.json()
      if (!response.ok) {
        setGenerationError(payload.error || 'Generation failed. Please try again.')
        return
      }

      if (!Array.isArray(payload.questions) || payload.questions.length === 0) {
        setGenerationError('Generation failed: No questions were returned.')
        return
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('eduassist:questions-generated', {
            detail: { questions: payload.questions },
          })
        )
      }
    } catch (error) {
      setGenerationError(`Generation failed: ${error.message}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRetry = () => {
    setGenerationError('')
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>Generate Test</h2>
          <p className="muted">Configure question types and difficulty.</p>
        </div>
        {generationError && <span className="status-pill danger">{generationError}</span>}
      </div>
      <div className="form-grid">
        <label className="field">
          <span className="label">Title</span>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Enter test title"
          />
        </label>
        <label className="field">
          <span className="label">Number of questions</span>
          <input
            type="number"
            min="1"
            max="100"
            step="1"
            value={questionCount}
            onChange={(event) => setQuestionCount(event.target.value)}
            placeholder="e.g. 20"
          />
        </label>
        <div className="field">
          <span className="label">Question types</span>
          <div className="check-row">
            <label className="checkbox">
              <input
                type="checkbox"
                checked={questionTypes.multipleChoice}
                onChange={() => handleTypeToggle('multipleChoice')}
              />
              <span>Multiple-choice</span>
            </label>
            <label className="checkbox">
              <input
                type="checkbox"
                checked={questionTypes.shortAnswer}
                onChange={() => handleTypeToggle('shortAnswer')}
              />
              <span>Short-answer</span>
            </label>
            <label className="checkbox">
              <input
                type="checkbox"
                checked={questionTypes.trueFalse}
                onChange={() => handleTypeToggle('trueFalse')}
              />
              <span>True/False</span>
            </label>
          </div>
        </div>
        <label className="field">
          <span className="label">Difficulty distribution</span>
          <select value={difficultyDistribution} onChange={(event) => setDifficultyDistribution(event.target.value)}>
            <option value="" disabled>Select difficulty mix</option>
            <option>Even</option>
            <option>More Easy</option>
            <option>More Hard</option>
          </select>
        </label>
        <label className="field">
          <span className="label">Source text</span>
          <textarea
            rows="5"
            value={sourceText}
            onChange={(event) => setSourceText(event.target.value)}
            placeholder="Paste the material text to generate questions from"
          />
        </label>
        <div className="field">
          <span className="label">Source paragraphs</span>
          <div className="check-grid">
            <label className="checkbox">
              <input type="checkbox" />
              <span>Paragraph 1</span>
            </label>
            <label className="checkbox">
              <input type="checkbox" />
              <span>Paragraph 2</span>
            </label>
            <label className="checkbox">
              <input type="checkbox" />
              <span>Paragraph 3</span>
            </label>
          </div>
        </div>
        <div className="form-actions">
          <button className="btn btn-primary" onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? 'Generating...' : 'Generate'}
          </button>
          <button className="btn btn-outline">Cancel</button>
          <button className="btn btn-outline" onClick={handleRetry} disabled={isGenerating}>Retry</button>
        </div>
      </div>
    </section>
  )
}

export default GenerateTestPanel
