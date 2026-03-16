'use client'

import { useState } from 'react'

export default function Home() {
  const [input, setInput] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    setLoading(true)
    setError('')
    setStatus('')

    try {
      const res = await fetch('/api/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to capture')
      }

      setStatus(`✓ Captured: ${data.name}`)
      setInput('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <div className="container">
        <h1>Resources Capture</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste a link or text..."
            disabled={loading}
            autoFocus
          />
          <button type="submit" disabled={loading || !input.trim()}>
            {loading ? 'Processing...' : 'Process'}
          </button>
        </form>
        {status && <p className="success">{status}</p>}
        {error && <p className="error">{error}</p>}
        <p className="hint">
          Examples:<br/>
          • https://example.com<br/>
          • https://example.com check this out<br/>
          • just some text
        </p>
      </div>

      <style jsx>{`
        main {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          background: #f5f5f5;
        }
        .container {
          width: 100%;
          max-width: 400px;
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        h1 {
          margin: 0 0 1.5rem;
          font-size: 1.5rem;
          color: #333;
          text-align: center;
        }
        input {
          width: 100%;
          padding: 12px 16px;
          font-size: 1rem;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          margin-bottom: 1rem;
          box-sizing: border-box;
          transition: border-color 0.2s;
        }
        input:focus {
          outline: none;
          border-color: #667eea;
        }
        button {
          width: 100%;
          padding: 12px;
          font-size: 1rem;
          font-weight: 600;
          color: white;
          background: #667eea;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s;
        }
        button:hover:not(:disabled) {
          background: #5a6fd6;
        }
        button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        .success {
          margin: 1rem 0 0;
          padding: 0.75rem;
          background: #d4edda;
          color: #155724;
          border-radius: 6px;
          text-align: center;
        }
        .error {
          margin: 1rem 0 0;
          padding: 0.75rem;
          background: #f8d7da;
          color: #721c24;
          border-radius: 6px;
          text-align: center;
        }
        .hint {
          margin: 1.5rem 0 0;
          font-size: 0.75rem;
          color: #888;
          text-align: center;
          line-height: 1.6;
        }
      `}</style>
    </main>
  )
}
