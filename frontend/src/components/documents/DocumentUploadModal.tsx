import React, { useState } from 'react';
import { Upload, X, FileText, CheckCircle2, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import { DocumentItem } from '../../types';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentUploaded: (doc: DocumentItem) => void;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onDocumentUploaded
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [wellId, setWellId] = useState('OIL-W102');
  const [docType, setDocType] = useState('Daily Drilling Report');
  const [uploading, setUploading] = useState(false);

  if (!isOpen) return null;

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    try {
      const newDoc = await api.uploadDocument(file, wellId, docType);
      onDocumentUploaded(newDoc);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fade-in">
      <div className="petrol-card w-full max-w-lg p-6 space-y-4 shadow-2xl border-brand-blue/40">
        <div className="flex items-center justify-between pb-3 border-b border-[#1C2A3A]">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-brand-cyan" />
            <h3 className="font-mono text-base font-bold text-slate-100">
              INGEST OPERATIONAL DRILLING REPORT
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleUpload} className="space-y-4">
          <div className="border-2 border-dashed border-[#1C2A3A] hover:border-brand-blue/60 rounded-lg p-6 text-center cursor-pointer transition-colors bg-[#0A121D]">
            <input
              type="file"
              accept=".pdf,.docx,.doc,.txt,.csv"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer space-y-2 block">
              <FileText className="w-8 h-8 text-brand-cyan mx-auto" />
              <div className="text-xs font-mono text-slate-300">
                {file ? <span className="text-emerald-400 font-bold">{file.name}</span> : 'Click or Drag PDF, DOCX, or TXT Drilling Log'}
              </div>
              <p className="text-[10px] text-slate-400">
                Automatic OCR extraction & RAG indexing into knowledge base
              </p>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase">Associated Well ID</label>
              <input
                type="text"
                value={wellId}
                onChange={(e) => setWellId(e.target.value)}
                className="w-full bg-[#0A121D] border border-[#1C2A3A] rounded px-3 py-2 text-xs font-mono text-slate-100 outline-none focus:border-brand-cyan"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase">Document Classification</label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full bg-[#0A121D] border border-[#1C2A3A] rounded px-3 py-2 text-xs font-mono text-slate-100 outline-none focus:border-brand-cyan"
              >
                <option value="Daily Drilling Report">Daily Drilling Report (DDR)</option>
                <option value="End of Well Report">End of Well Report (EOWR)</option>
                <option value="Incident Investigation">Incident Investigation</option>
                <option value="Mud Logging Record">Mud Logging Record</option>
                <option value="Geomechanical Study">Geomechanical Study</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!file || uploading}
              className="px-4 py-2 rounded bg-brand-blue hover:bg-blue-500 disabled:opacity-50 text-white font-mono text-xs font-bold flex items-center gap-2"
            >
              {uploading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              <span>{uploading ? 'Parsing & Indexing...' : 'Upload & Index'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
