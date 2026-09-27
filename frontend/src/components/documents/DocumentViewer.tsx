import React from 'react';
import { DocumentItem } from '../../types';
import { FileText, X, Download, Clock, ShieldCheck } from 'lucide-react';

interface DocumentViewerProps {
  document: DocumentItem | null;
  onClose: () => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  onClose
}) => {
  if (!document) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fade-in">
      <div className="petrol-card w-full max-w-2xl p-6 space-y-4 shadow-2xl border-brand-blue/50 flex flex-col max-h-[85vh]">
        <div className="flex items-start justify-between pb-3 border-b border-[#1C2A3A]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-brand-blue/20 border border-brand-blue/40 flex items-center justify-center text-brand-cyan">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-mono text-sm font-bold text-slate-100">
                {document.filename}
              </h3>
              <p className="text-[11px] font-mono text-slate-400">
                {document.document_type} • Well: <span className="text-brand-sky">{document.well_id || 'Regional'}</span> • {document.file_size_kb} KB
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Badge */}
        <div className="flex items-center justify-between bg-[#0A121D] px-3 py-2 rounded border border-[#1C2A3A] text-xs font-mono">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>OCR EXTRACTION COMPLETED & RAG INDEXED</span>
          </div>
          <span className="text-slate-400">{new Date(document.upload_date).toLocaleDateString()}</span>
        </div>

        {/* Extracted Document Content */}
        <div className="flex-1 overflow-y-auto bg-[#07111F] p-4 rounded border border-[#1C2A3A] font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
          {document.extracted_text || 'No extracted text available for this document.'}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-semibold"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
