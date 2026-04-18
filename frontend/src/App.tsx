import { useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import './App.css';

const API = 'http://localhost:8000';

export default function App() {
  const [apiKey, setApiKey] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [indexed, setIndexed] = useState(false);
  const [chunkCount, setChunkCount] = useState(0);
  const [docCount, setDocCount] = useState(0);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [sources, setSources] = useState<string[]>([]);
  const [showSources, setShowSources] = useState(false);
  const [err, setErr] = useState('');
  const [uploading, setUploading] = useState(false);
  const [asking, setAsking] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'text/plain': ['.txt'] },
    onDrop: (accepted) => setFiles(accepted),
  });

  const uploadDocs = async () => {
    if (!files.length) return;
    setUploading(true);
    setErr('');
    try {
      const fd = new FormData();
      files.forEach(f => fd.append('files', f));
      const res = await axios.post(`${API}/upload`, fd);
      if (res.data.status === 'ok') {
        setIndexed(true);
        setChunkCount(res.data.chunks);
        setDocCount(files.length);
      } else {
        setErr(res.data.message);
      }
    } catch (e) {
      setErr('Could not reach backend. Make sure the FastAPI server is running on port 8000.');
    }
    setUploading(false);
  };

  const askQuestion = async () => {
    if (!question || !apiKey) return;
    setAsking(true);
    setErr('');
    setAnswer('');
    setSources([]);
    try {
      const fd = new FormData();
      fd.append('question', question);
      fd.append('apiKey', apiKey);
      const res = await axios.post(`${API}/ask`, fd);
      if (res.data.status === 'ok') {
        setAnswer(res.data.answer);
        setSources(res.data.sources);
      } else {
        setErr(res.data.message);
      }
    } catch (e) {
      setErr('Could not reach backend. Make sure the FastAPI server is running on port 8000.');
    }
    setAsking(false);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0a0a0a', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

      {/* Sidebar */}
      <div style={{ width: 220, background: '#0f0f0f', borderRight: '1px solid #1c1c1c', display: 'flex', flexDirection: 'column', padding: '20px 16px', gap: 20, flexShrink: 0 }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, background: '#ff6b00', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="white">
              <path d="M2 2h5v5H2zm7 0h5v5H9zm0 7h5v5H9zM2 9h5v5H2z"/>
            </svg>
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#f0f0f0' }}>DevOps KB</span>
        </div>

        {/* API Key — top of sidebar */}
        <div style={{ borderBottom: '1px solid #1c1c1c', paddingBottom: 16 }}>
          <div style={{ fontSize: 10, color: '#888', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Groq API Key</div>
          <input
            type="password"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder="gsk_..."
            style={{ width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 6, padding: '6px 10px', color: '#f0f0f0', fontSize: 12, outline: 'none', fontFamily: 'monospace' }}
          />
          {!apiKey && <div style={{ fontSize: 11, color: '#ff6b00', marginTop: 6, fontWeight: 500 }}>↑ Required to ask questions</div>}
        </div>

        {/* Nav */}
        <div>
          <div style={{ fontSize: 10, color: '#888', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Workspace</div>
          {[
            { label: 'Knowledge Base', active: true },
            { label: 'Upload History', active: false },
            { label: 'Query Logs', active: false },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: 6, background: item.active ? '#1a1a1a' : 'transparent', color: item.active ? '#f0f0f0' : '#555', fontSize: 12, marginBottom: 2, cursor: 'pointer' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: item.active ? '#ff6b00' : '#2a2a2a' }} />
              {item.label}
            </div>
          ))}
        </div>

        <div>
          <div style={{ fontSize: 10, color: '#888', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Stack</div>
          {['Groq · LLaMA 3.3', 'ChromaDB', 'RAG Pipeline'].map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: 6, color: '#444', fontSize: 12, marginBottom: 2 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1e1e1e' }} />
              {item}
            </div>
          ))}
        </div>

        {/* Bottom credit */}
        <div style={{ marginTop: 'auto', borderTop: '1px solid #1c1c1c', paddingTop: 16 }}>
          <div style={{ fontSize: 11, color: '#ff6b00', fontWeight: 500 }}>Built by Ninad Chemburkar</div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Topbar */}
        <div style={{ height: 48, borderBottom: '1px solid #1c1c1c', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', flexShrink: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#f0f0f0' }}>Knowledge Base</span>
          <span style={{ fontSize: 10, background: indexed ? '#0a1f0a' : '#1a1a1a', border: `1px solid ${indexed ? '#1a3a1a' : '#2a2a2a'}`, color: indexed ? '#4a9e4a' : '#888', padding: '3px 10px', borderRadius: 20 }}>
            {indexed ? `${docCount} doc${docCount > 1 ? 's' : ''} indexed` : 'no docs indexed'}
          </span>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: 24, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16, scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}>

          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {[
              { label: 'Documents', val: docCount, sub: 'runbooks loaded' },
              { label: 'Chunks', val: chunkCount, sub: 'indexed & ready' },
              { label: 'Model', val: 'LLaMA 3.3', sub: 'via Groq · free' },
            ].map(s => (
              <div key={s.label} style={{ background: '#111', border: '1px solid #1c1c1c', borderRadius: 8, padding: '14px 16px' }}>
                <div style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{s.label}</div>
                <div style={{ fontSize: s.label === 'Model' ? 13 : 22, fontWeight: 600, color: '#f0f0f0' }}>{s.val}</div>
                <div style={{ fontSize: 10, color: '#666', marginTop: 2 }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Upload card */}
          <div style={{ background: '#111', border: '1px solid #1c1c1c', borderRadius: 8, padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 500, color: '#666', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Upload Runbooks</span>
              {indexed && <span style={{ fontSize: 10, background: '#0a1f0a', border: '1px solid #1a3a1a', color: '#4a9e4a', padding: '2px 8px', borderRadius: 20 }}>indexed</span>}
            </div>

            <div {...getRootProps()} style={{ border: `1px dashed ${isDragActive ? '#ff6b00' : '#2a2a2a'}`, borderRadius: 6, padding: 20, textAlign: 'center', cursor: 'pointer', background: isDragActive ? '#1a0f00' : 'transparent', transition: 'all 0.15s' }}>
              <input {...getInputProps()} />
              <div style={{ fontSize: 12, color: '#777', marginBottom: 10 }}>Drag and drop .txt runbooks here</div>
              <button style={{ background: '#ff6b00', color: 'white', border: 'none', borderRadius: 6, padding: '6px 14px', fontSize: 11, fontWeight: 500, cursor: 'pointer' }}>Browse files</button>
            </div>

            {files.length > 0 && (
              <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {files.map(f => (
                  <div key={f.name} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 20, padding: '3px 10px', fontSize: 11, color: '#888' }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#ff6b00' }} />
                    {f.name} · {(f.size / 1024).toFixed(1)}kb
                  </div>
                ))}
              </div>
            )}

            {files.length > 0 && !indexed && (
              <button onClick={uploadDocs} disabled={uploading} style={{ marginTop: 12, background: '#ff6b00', color: 'white', border: 'none', borderRadius: 6, padding: '8px 18px', fontSize: 12, fontWeight: 500, cursor: 'pointer', opacity: uploading ? 0.6 : 1 }}>
                {uploading ? 'Indexing...' : 'Index Documents'}
              </button>
            )}
          </div>

          {/* Ask card */}
          {indexed && (
            <div style={{ background: '#111', border: '1px solid #1c1c1c', borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: '#666', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Ask a Question</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && askQuestion()}
                  placeholder="How do I fix a CrashLoopBackOff?"
                  style={{ flex: 1, background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 6, padding: '8px 12px', color: '#f0f0f0', fontSize: 13, outline: 'none' }}
                />
                <button onClick={askQuestion} disabled={asking || !apiKey} style={{ background: '#ff6b00', color: 'white', border: 'none', borderRadius: 6, padding: '8px 18px', fontSize: 12, fontWeight: 500, cursor: 'pointer', opacity: (!apiKey || asking) ? 0.5 : 1 }}>
                  {asking ? '...' : 'Ask'}
                </button>
              </div>
              {!apiKey && <div style={{ fontSize: 11, color: '#444', marginTop: 6 }}>Add your Groq API key in the sidebar to continue.</div>}
            </div>
          )}

          {/* Error */}
          {err && (
            <div style={{ background: '#1f0a0a', border: '1px solid #3d1a1a', borderRadius: 8, padding: '12px 16px', fontSize: 12, color: '#f44336', borderLeft: '3px solid #f44336' }}>
              {err}
            </div>
          )}

          {/* Answer */}
          {answer && (
            <div style={{ background: '#111', border: '1px solid #1c1c1c', borderLeft: '3px solid #ff6b00', borderRadius: '0 8px 8px 0', padding: 16 }}>
              <div style={{ fontSize: 10, color: '#ff6b00', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Answer</div>
              <div style={{ fontSize: 13, color: '#ccc', lineHeight: 1.8 }}>{answer}</div>
              <div style={{ marginTop: 12 }}>
                <button onClick={() => setShowSources(!showSources)} style={{ background: 'transparent', border: '1px solid #2a2a2a', borderRadius: 6, padding: '4px 12px', fontSize: 11, color: '#555', cursor: 'pointer' }}>
                  {showSources ? 'Hide' : 'Show'} sources ({sources.length})
                </button>
              </div>
              {showSources && (
                <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {sources.map((s, i) => (
                    <div key={i} style={{ background: '#1a1a1a', border: '1px solid #222', borderRadius: 6, padding: '8px 12px', fontSize: 11, color: '#aaa', lineHeight: 1.6 }}>
                      <div style={{ color: '#ff6b00', fontSize: 10, marginBottom: 4 }}>chunk {i + 1}</div>
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}