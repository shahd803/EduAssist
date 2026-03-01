// Intent: Preview, edit, and keep generated questions before export.
"use client"

import { useState } from 'react'

function TestPreviewPanel({ questions, keptQuestionIds, onToggleKeep, onQuestionUpdate }) {
  const [validationErrors, setValidationErrors] = useState({})
  const [savedState, setSavedState] = useState({})
  const [editingQuestionIds, setEditingQuestionIds] = useState({})
  const questionCount = questions.length
  const getQuestionKey = (question) => question._clientKey || question.id

  const handleToggleEdit = (questionKey) => {
    setEditingQuestionIds((current) => ({
      ...current,
      [questionKey]: !current[questionKey],
    }))
  }

  const handleSave = (event, question) => {
    event.preventDefault()
    const questionKey = getQuestionKey(question)
    const formData = new FormData(event.currentTarget)
    const nextPrompt = String(formData.get(`${questionKey}-prompt`) || '').trim()
    const hasChoices = Array.isArray(question.choices) && question.choices.length > 0

    if (hasChoices) {
      const choiceValues = formData
        .getAll(`${questionKey}-choice-text`)
        .map((value) => String(value).trim())
        .filter(Boolean)
      const selectedCorrect = formData.get(`${questionKey}-choice`)

      if (choiceValues.length < 2 || !selectedCorrect) {
        setValidationErrors((current) => ({
          ...current,
          [questionKey]: 'Validation error: Multiple-choice questions require at least two choices and one marked correct.',
        }))
        setSavedState((current) => ({ ...current, [questionKey]: false }))
        return
      }

      if (onQuestionUpdate) {
        onQuestionUpdate({
          ...question,
          prompt: nextPrompt || question.prompt,
          choices: choiceValues,
          correctChoice: selectedCorrect,
        })
      }
    } else if (onQuestionUpdate) {
      onQuestionUpdate({
        ...question,
        prompt: nextPrompt || question.prompt,
      })
    }

    setValidationErrors((current) => ({ ...current, [questionKey]: '' }))
    setSavedState((current) => ({ ...current, [questionKey]: true }))
    setEditingQuestionIds((current) => ({ ...current, [questionKey]: false }))
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>Test Preview</h2>
          <p className="muted">
            {questionCount > 0 ? `${questionCount} questions ready for review` : 'No generated questions yet'}
          </p>
        </div>
        <div className="button-stack">
          <button className="btn btn-outline">Edit Options</button>
          <button className="btn btn-primary">Regenerate Selected</button>
        </div>
      </div>
      <div className="question-list">
        {questionCount === 0 && (
          <div className="empty-state">
            <p>No questions generated yet. Use Generate Test to create your first set.</p>
          </div>
        )}
        {questions.map((question, questionIndex) => {
          const questionKey = getQuestionKey(question) || `question-${questionIndex}`
          const isKept = keptQuestionIds.includes(questionKey)
          const isEditing = Boolean(editingQuestionIds[questionKey])
          const selectedChoice = question.correctChoice
          const hasChoices = Array.isArray(question.choices) && question.choices.length > 0
          const sourceLabel = question.source || 'AI Generated'
          const difficultyLabel = question.difficulty || 'Not set'
          return (
          <article key={questionKey} className="question-card">
            <div className="question-head">
              <div>
                <p className="label">{question.type || (hasChoices ? 'Multiple-choice' : 'Short-answer')}</p>
                <h3>{question.prompt}</h3>
                <p className="muted">{sourceLabel} - Difficulty: {difficultyLabel}</p>
              </div>
              <div className="button-stack question-actions">
                <button type="button" className="btn btn-ghost" onClick={() => handleToggleEdit(questionKey)}>
                  {isEditing ? 'Close Edit' : 'Edit'}
                </button>
                <button type="button" className="btn btn-ghost">Refine</button>
                <button
                  type="button"
                  className={`btn ${isKept ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => onToggleKeep(questionKey)}
                >
                  {isKept ? 'Kept' : 'Keep'}
                </button>
              </div>
            </div>
            {hasChoices && (
              <ul className="choice-list">
                {question.choices.map((choice, choiceIndex) => (
                  <li key={`${questionKey}-choice-${choiceIndex}`} className={selectedChoice === choice ? 'is-correct' : ''}>
                    <label className="checkbox">
                      <input
                        type="radio"
                        name={`${questionKey}-correct`}
                        value={choice}
                        checked={question.correctChoice === choice}
                        onChange={() => {
                          if (onQuestionUpdate) {
                            onQuestionUpdate({ ...question, correctChoice: choice })
                          }
                        }}
                      />
                      <span>{choice}</span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
            {hasChoices && selectedChoice && (
              <span className="status-pill success">Correct answer set</span>
            )}
            {isEditing && (
              <form className="edit-form" onSubmit={(event) => handleSave(event, question)}>
                <label className="field">
                  <span className="label">Prompt</span>
                  <textarea
                    name={`${questionKey}-prompt`}
                    rows="3"
                    placeholder="Edit question prompt"
                    defaultValue={question.prompt}
                  />
                </label>
                {hasChoices && (
                  <div className="choice-editor">
                    <span className="label">Choices</span>
                    <div className="choice-grid">
                      {question.choices.map((choice, choiceIndex) => (
                        <label key={`${questionKey}-editor-choice-${choiceIndex}`} className="choice-item">
                          <input
                            type="radio"
                            name={`${questionKey}-choice`}
                            value={choice}
                            defaultChecked={question.correctChoice === choice}
                          />
                          <input
                            type="text"
                            name={`${questionKey}-choice-text`}
                            placeholder="Enter choice text"
                            defaultValue={choice}
                          />
                        </label>
                      ))}
                    </div>
                    <button type="button" className="btn btn-outline small">Add choice</button>
                  </div>
                )}
                <div className="inline-actions">
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                  <button type="button" className="btn btn-outline" onClick={() => handleToggleEdit(questionKey)}>
                    Cancel
                  </button>
                  {savedState[questionKey] && <span className="status-pill success">Changes saved</span>}
                </div>
                {validationErrors[questionKey] && (
                  <p className="status-pill danger">{validationErrors[questionKey]}</p>
                )}
              </form>
            )}
          </article>
        )})}
      </div>
    </section>
  )
}

export default TestPreviewPanel
