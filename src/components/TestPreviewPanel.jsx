// Intent: Preview, edit, and keep generated questions before export.
"use client"

import { useState } from 'react'
import { refineQuestion, refineQuiz } from '@/lib/api'

const extractRefinedQuestion = (payload, questionId) => {
  if (!payload || typeof payload !== 'object') {
    return null
  }

  if (Array.isArray(payload?.questions)) {
    return (
      payload.questions.find((candidate) => {
        const candidateId = candidate?.questionId ?? candidate?.id ?? null
        return String(candidateId) === String(questionId)
      }) ||
      payload.questions[0] ||
      null
    )
  }

  if (payload.question && typeof payload.question === 'object') {
    return payload.question
  }

  if (payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) {
    return payload.data
  }

  return payload
}

function TestPreviewPanel({
  questions,
  keptQuestionIds,
  onToggleKeep,
  onQuestionUpdate,
  onQuestionsRegenerated,
}) {
  const [validationErrors, setValidationErrors] = useState({})
  const [savedState, setSavedState] = useState({})
  const [editingQuestionIds, setEditingQuestionIds] = useState({})
  const [refineError, setRefineError] = useState('')
  const [isRefiningQuiz, setIsRefiningQuiz] = useState(false)
  const [refiningQuestionIds, setRefiningQuestionIds] = useState({})
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

  const handleRefine = async (question) => {
    const questionKey = getQuestionKey(question)
    const backendQuestionId = question?.questionId

    if (!backendQuestionId) {
      setRefineError('Refine failed: This question is missing a backend question ID.')
      return
    }

    try {
      setRefiningQuestionIds((current) => ({ ...current, [questionKey]: true }))
      setRefineError('')

      const payload = await refineQuestion(backendQuestionId)
      const refinedQuestion = extractRefinedQuestion(payload, backendQuestionId)

      if (!refinedQuestion || typeof refinedQuestion !== 'object') {
        setRefineError('Refine failed: No refined question was returned.')
        return
      }

      if (onQuestionUpdate) {
        onQuestionUpdate({
          ...question,
          ...refinedQuestion,
          questionId:
            refinedQuestion.questionId ??
            refinedQuestion.id ??
            question.questionId,
          _clientKey: questionKey,
          source: refinedQuestion.source || 'AI Refined',
        })
      }

      setValidationErrors((current) => ({ ...current, [questionKey]: '' }))
      setSavedState((current) => ({ ...current, [questionKey]: 'refined' }))
    } catch (error) {
      setRefineError(`Refine failed: ${error.message}`)
    } finally {
      setRefiningQuestionIds((current) => ({ ...current, [questionKey]: false }))
    }
  }

  const handleRegenerateSelected = async () => {
    if (questionCount === 0) {
      setRefineError('Regeneration failed: No generated questions available.')
      return
    }

    try {
      setIsRefiningQuiz(true)
      setRefineError('')

      const payload = await refineQuiz()

      if (!Array.isArray(payload?.questions) || payload.questions.length === 0) {
        setRefineError('Regeneration failed: No refined questions were returned.')
        return
      }

      if (onQuestionsRegenerated) {
        onQuestionsRegenerated({
          quizId: payload.quizId || null,
          questions: payload.questions,
        })
      }

      setSavedState({})
      setValidationErrors({})
      setEditingQuestionIds({})
    } catch (error) {
      setRefineError(`Regeneration failed: ${error.message}`)
    } finally {
      setIsRefiningQuiz(false)
    }
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
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleRegenerateSelected}
            disabled={isRefiningQuiz}
          >
            {isRefiningQuiz ? 'Regenerating...' : 'Regenerate Selected'}
          </button>
        </div>
      </div>
      {refineError && <p className="status-pill danger">{refineError}</p>}
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
          const isRefiningQuestion = Boolean(refiningQuestionIds[questionKey])
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
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => handleRefine(question)}
                  disabled={isRefiningQuestion}
                >
                  {isRefiningQuestion ? 'Refining...' : 'Refine'}
                </button>
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
                  {savedState[questionKey] && (
                    <span className="status-pill success">
                      {savedState[questionKey] === 'refined' ? 'Refined' : 'Changes saved'}
                    </span>
                  )}
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
