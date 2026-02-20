"use client"

import { useState } from 'react'

function TestPreviewPanel({ questions }) {
  const [validationErrors, setValidationErrors] = useState({})
  const [savedState, setSavedState] = useState({})

  const handleSave = (event, question) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    if (question.choices) {
      const choiceValues = formData
        .getAll(`${question.id}-choice-text`)
        .map((value) => String(value).trim())
        .filter(Boolean)
      const selectedCorrect = formData.get(`${question.id}-choice`)

      if (choiceValues.length < 2 || !selectedCorrect) {
        setValidationErrors((current) => ({
          ...current,
          [question.id]: 'Validation error: Multiple-choice questions require at least two choices and one marked correct.',
        }))
        setSavedState((current) => ({ ...current, [question.id]: false }))
        return
      }
    }

    setValidationErrors((current) => ({ ...current, [question.id]: '' }))
    setSavedState((current) => ({ ...current, [question.id]: true }))
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>Test Preview</h2>
          <p className="muted">10 questions • Updated moments ago</p>
        </div>
        <div className="button-stack">
          <button className="btn btn-outline">Edit Options</button>
          <button className="btn btn-primary">Regenerate Selected</button>
        </div>
      </div>
      <div className="question-list">
        {questions.map((question) => (
          <article key={question.id} className="question-card">
            <div className="question-head">
              <div>
                <p className="label">{question.type}</p>
                <h3>{question.prompt}</h3>
                <p className="muted">{question.source} • Difficulty: {question.difficulty}</p>
              </div>
              <div className="button-stack question-actions">
                <button className="btn btn-ghost">Edit</button>
                <button className="btn btn-ghost">Refine</button>
                <button className="btn btn-ghost">Keep</button>
              </div>
            </div>
            {question.choices && (
              <ul className="choice-list">
                {question.choices.map((choice) => (
                  <li key={choice}>{choice}</li>
                ))}
              </ul>
            )}
            <form className="edit-form" onSubmit={(event) => handleSave(event, question)}>
              <label className="field">
                <span className="label">Prompt</span>
                <textarea rows="3" placeholder="Edit question prompt" />
              </label>
              {question.choices && (
                <div className="choice-editor">
                  <span className="label">Choices</span>
                  <div className="choice-grid">
                    {question.choices.map((choice) => (
                      <label key={choice} className="choice-item">
                        <input
                          type="radio"
                          name={`${question.id}-choice`}
                          value={choice}
                        />
                        <input type="text" name={`${question.id}-choice-text`} placeholder="Enter choice text" />
                      </label>
                    ))}
                  </div>
                  <button type="button" className="btn btn-outline small">Add choice</button>
                </div>
              )}
              <div className="inline-actions">
                <button type="submit" className="btn btn-primary">Save Changes</button>
                <button type="button" className="btn btn-outline">Cancel</button>
                {savedState[question.id] && <span className="status-pill success">Changes saved</span>}
              </div>
              {validationErrors[question.id] && (
                <p className="status-pill danger">{validationErrors[question.id]}</p>
              )}
            </form>
          </article>
        ))}
      </div>
    </section>
  )
}

export default TestPreviewPanel
