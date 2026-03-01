// Intent: Configure test generation options and trigger the API call.
"use client"

import { useEffect, useMemo, useState } from 'react'
import { generateQuiz } from '@/lib/api'

function GenerateTestPanel({ materials, onQuestionsGenerated }) {
  const [title, setTitle] = useState('')
  const [questionCount, setQuestionCount] = useState('')
  const [difficultyDistribution, setDifficultyDistribution] = useState('')
  const [questionTypes, setQuestionTypes] = useState({
    multipleChoice: true,
    shortAnswer: true,
    trueFalse: false,
  })
  const [selectedMaterialIds, setSelectedMaterialIds] = useState([])
  const [generationError, setGenerationError] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const availableMaterialIds = useMemo(
    () => materials.map((material) => material.id),
    [materials]
  )

  useEffect(() => {
    setSelectedMaterialIds((current) => {
      const stillValid = current.filter((id) => availableMaterialIds.includes(id))
      return stillValid.length > 0 ? stillValid : availableMaterialIds
    })
  }, [availableMaterialIds])

  const handleTypeToggle = (key) => {
    setQuestionTypes((current) => ({ ...current, [key]: !current[key] }))
  }

  const handleMaterialToggle = (materialId) => {
    setSelectedMaterialIds((current) =>
      current.includes(materialId)
        ? current.filter((id) => id !== materialId)
        : [...current, materialId]
    )
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

    if (materials.length === 0) {
      setGenerationError('Generation failed: Upload at least one material first.')
      return
    }

    if (selectedMaterialIds.length === 0) {
      setGenerationError('Generation failed: Select at least one uploaded material.')
      return
    }

    const selectedMaterials = materials.filter((material) => selectedMaterialIds.includes(material.id))
    const primaryMaterialId = selectedMaterials[0]?.id
    const selectedQuestionTypes = Object.entries(questionTypes)
      .filter(([, enabled]) => Boolean(enabled))
      .map(([type]) => type)

    try {
      setIsGenerating(true)
      setGenerationError('')

      const payload = await generateQuiz(primaryMaterialId, {
        title,
        questionCount: parsedCount,
        questionTypes: selectedQuestionTypes,
        difficultyDistribution,
      })

      // Debug output to inspect exactly what the backend returned.
      if (typeof window !== 'undefined') {
        window.__lastQuizPayload = payload
      }
      console.log('generateQuiz payload:', payload)
      console.log('generateQuiz questions:', payload?.questions)
      console.log('generateQuiz questions JSON:', JSON.stringify(payload?.questions || [], null, 2))

      if (!Array.isArray(payload.questions) || payload.questions.length === 0) {
        setGenerationError('Generation failed: No questions were returned.')
        return
      }

      onQuestionsGenerated(payload.questions)
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
        <div className="field">
          <span className="label">Source materials</span>
          <div className="check-grid">
            {materials.length === 0 && <p className="muted">No uploaded materials yet.</p>}
            {materials.map((material) => {
              return (
                <label key={material.id} className="checkbox">
                  <input
                    type="checkbox"
                    checked={selectedMaterialIds.includes(material.id)}
                    onChange={() => handleMaterialToggle(material.id)}
                  />
                  <span>{material.title}</span>
                </label>
              )
            })}
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
