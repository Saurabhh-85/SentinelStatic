import React, { useState, useRef } from 'react';
import axios from 'axios';
import { 
  Upload, 
  Shield, 
  FileText, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Search, 
  Code, 
  Database,
  Hash,
  Globe,
  Network,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = '/api';

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      handleAnalyze(selectedFile);
    }
  };

  const handleAnalyze = async (selectedFile) => {
    setLoading(true);
    setError(null);
    setResults(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(`${API_BASE_URL}/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to analyze file. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header style={{ textAlign: 'center', marginBottom: '60px' }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}
        >
          <div className="glass" style={{ padding: '12px', borderRadius: '50%', color: 'var(--color-primary)' }}>
            <Shield size={40} />
          </div>
        </motion.div>
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ fontSize: '3.5rem', marginBottom: '8px', background: 'linear-gradient(to right, #fff, var(--text-muted))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          SentinelStatic
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}
        >
          Advanced Malware Static Analysis Engine
        </motion.p>
      </header>

      <main>
        {!results && !loading && (
          <motion.div 
            className="glass glow-card"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            style={{ 
              padding: '60px', 
              textAlign: 'center', 
              cursor: 'pointer',
              border: `2px dashed ${file ? 'var(--color-primary)' : 'var(--glass-border)'}`,
              background: file ? 'rgba(59, 130, 246, 0.05)' : 'var(--glass-bg)'
            }}
            onClick={() => fileInputRef.current.click()}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              style={{ display: 'none' }} 
            />
            <Upload size={64} style={{ color: 'var(--color-primary)', marginBottom: '24px', opacity: 0.8 }} />
            <h2>{file ? file.name : 'Drop your binary here'}</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
              Upload PE files, Scripts, or any suspicious binary for deep static inspection
            </p>
          </motion.div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: '100px' }}>
            <Loader2 className="animate-spin" size={64} style={{ color: 'var(--color-primary)', margin: '0 auto 24px' }} />
            <h2 style={{ letterSpacing: '2px' }}>DECRYPTING BINARY...</h2>
            <p style={{ color: 'var(--text-muted)' }}>Running heuristics, entropy checks, and YARA signatures</p>
          </div>
        )}

        {error && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="glass" 
            style={{ padding: '24px', borderColor: 'var(--color-danger)', borderStyle: 'dashed', color: 'var(--color-danger)', textAlign: 'center' }}
          >
            <AlertTriangle style={{ marginBottom: '12px' }} size={48} />
            <p>{error}</p>
            <button className="btn-primary" style={{ margin: '20px auto 0' }} onClick={() => setError(null)}>Try Again</button>
          </motion.div>
        )}

        <AnimatePresence>
          {results && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid"
            >
              <div className="grid grid-cols-2">
                {/* Risk Score Card */}
                <div className="glass glow-card" style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Activity size={20} color="var(--color-primary)" />
                      Risk Assessment
                    </h3>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '20px', 
                      background: results.risk_assessment.level === 'HIGH RISK' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                      color: results.risk_assessment.level === 'HIGH RISK' ? 'var(--color-danger)' : 'var(--color-success)',
                      fontWeight: 'bold',
                      fontSize: '0.8rem'
                    }}>
                      {results.risk_assessment.level}
                    </span>
                  </div>
                  
                  <div style={{ textAlign: 'center', margin: '40px 0' }}>
                    <span style={{ fontSize: '4.5rem', fontWeight: '800', lineHeight: 1 }}>{results.risk_assessment.score}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '1.5rem', marginLeft: '4px' }}>/100</span>
                    <div style={{ 
                      width: '100%', 
                      height: '8px', 
                      background: 'rgba(255,255,255,0.05)', 
                      borderRadius: '4px', 
                      marginTop: '24px',
                      overflow: 'hidden'
                    }}>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${results.risk_assessment.score}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        style={{ 
                          height: '100%', 
                          background: `linear-gradient(to right, #3b82f6, ${results.risk_assessment.score > 60 ? '#ef4444' : '#3b82f6'})`
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* File Details */}
                <div className="glass" style={{ padding: '32px' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                    <FileText size={20} color="var(--color-primary)" />
                    File Metadata
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="file-info-row">
                      <span className="label">Filename</span>
                      <span className="value">{results.filename}</span>
                    </div>
                    <div className="file-info-row">
                      <span className="label">SHA-256</span>
                      <code className="value" style={{ fontSize: '0.75rem', color: 'var(--color-primary)' }}>{results.hashes.sha256}</code>
                    </div>
                    {results.pe_analysis.entry_point && (
                      <div className="file-info-row">
                        <span className="label">Entry Point</span>
                        <code className="value">{results.pe_analysis.entry_point}</code>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Indicators & Findings */}
              <div className="grid grid-cols-2">
                <div className="glass" style={{ padding: '32px' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                    <Activity size={20} color="var(--color-danger)" />
                    Malware Indicators
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    {results.indicators.is_packed && (
                      <div className="badge danger">UPX PACKED</div>
                    )}
                    {results.indicators.suspicious_apis.map(api => (
                      <div key={api} className="badge warning">API: {api}</div>
                    ))}
                    {results.yara_results.map((y, i) => (
                      <div key={i} className="badge danger">YARA: {y.rule}</div>
                    ))}
                    {!results.indicators.is_packed && results.indicators.suspicious_apis.length === 0 && results.yara_results.length === 0 && (
                      <p style={{ color: 'var(--text-muted)' }}>No critical indicators found.</p>
                    )}
                  </div>
                </div>

                <div className="glass" style={{ padding: '32px' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                    <Globe size={20} color="var(--color-primary)" />
                    Network Artifacts
                  </h3>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {results.indicators.urls_found.map(url => (
                      <li key={url} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        <Globe size={14} /> {url}
                      </li>
                    ))}
                    {results.indicators.ips_found.map(ip => (
                      <li key={ip} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        <Network size={14} /> {ip}
                      </li>
                    ))}
                    {results.indicators.urls_found.length === 0 && results.indicators.ips_found.length === 0 && (
                      <p style={{ color: 'var(--text-muted)' }}>No network artifacts detected.</p>
                    )}
                  </ul>
                </div>
              </div>

              <button className="btn-primary" style={{ margin: '20px auto 40px' }} onClick={() => setResults(null)}>
                Analyze Another File
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <style>{`
        .file-info-row {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid var(--glass-border);
          padding-bottom: 8px;
        }
        .label { color: var(--text-muted); font-size: 0.9rem; }
        .value { color: var(--text-main); font-weight: 500; word-break: break-all; text-align: right; }
        .badge {
          padding: 6px 14px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .badge.danger { background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); }
        .badge.warning { background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3); }
        .animate-spin { animation: spin 2s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default App;
