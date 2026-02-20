function TestPreviewPanel({ questions }) {
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
                <button className="btn btn-ghost">Regenerate</button>
                <button className="btn btn-ghost">Mark Correct</button>
              </div>
            </div>
            {question.choices && (
              <ul className="choice-list">
                {question.choices.map((choice) => (
                  <li key={choice}>{choice}</li>
                ))}
              </ul>
            )}
            <div className="edit-form">
              <label className="field">
                <span className="label">Prompt</span>
                <textarea rows="3" defaultValue={question.prompt} />
              </label>
              {question.choices && (
                <div className="choice-editor">
                  <span className="label">Choices</span>
                  <div className="choice-grid">
                    {question.choices.map((choice) => (
                      <label key={choice} className="choice-item">
                        <input type="radio" name={`${question.id}-choice`} defaultChecked={choice === 'ATP'} />
                        <input type="text" defaultValue={choice} />
                      </label>
                    ))}
                  </div>
                  <button className="btn btn-outline small">Add choice</button>
                </div>
              )}
              <div className="inline-actions">
                <button className="btn btn-primary">Save Changes</button>
                <button className="btn btn-outline">Cancel</button>
                <span className="status-pill success">Changes saved</span>
              </div>
              <p className="status-pill danger">Validation error: Multiple-choice questions require at least two choices and one marked correct.</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default TestPreviewPanel
