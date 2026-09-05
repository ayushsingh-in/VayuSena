import React from 'react';
import { Database, FileCode, ExternalLink } from 'lucide-react';

export default function FooterCard({ onOpenApiDocs }) {
  return (
    <footer className="footer-card">
      <div className="footer-left">
        <div className="api-icon-badge">
          <Database size={15} />
        </div>
        <div className="footer-text">
          Built as an <strong>open API</strong> — documented OpenAPI endpoints for cross-state integration (CPCB, DPCC, PPCB, HSPCB).
        </div>
      </div>

      <div className="footer-actions">
        <span className="api-endpoint-tag">OpenAPI 3.1</span>
        <button 
          className="btn-api-docs" 
          onClick={onOpenApiDocs}
          title="Inspect API contracts and Swagger specs"
        >
          <FileCode size={13} color="#0284c7" />
          <span>View API Docs</span>
          <ExternalLink size={11} color="#64748b" />
        </button>
      </div>
    </footer>
  );
}
