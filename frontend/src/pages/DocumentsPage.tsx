import React, { useState } from 'react';
import { DocumentItem } from '../types';
import { DocumentUploadModal } from '../components/documents/DocumentUploadModal';
import { DocumentViewer } from '../components/documents/DocumentViewer';
import { FileText, Upload, Search, Filter, ShieldCheck, Eye, Download } from 'lucide-react';

interface DocumentsPageProps {
  documents: DocumentItem[];
  onDocumentUploaded: (doc: DocumentItem) => void;
}

export const DocumentsPage: React.FC<DocumentsPageProps> = ({
  documents,
  onDocumentUploaded
}) => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const filteredDocs = documents.filter((d) => {
    const matchSearch = d.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (d.well_id && d.well_id.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchType = typeFilter === 'ALL' || d.document_type.includes(typeFilter);
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="petrol-card p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#1C2A3A]">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-cyan" />
              <h2 className="font-mono text-base font-bold text-slate-100 uppercase tracking-wider">
                HISTORICAL DRILLING DOCUMENT REPOSITORY
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              OCR-extracted daily drilling reports, end-of-well summaries, and incident investigations indexed into the RAG knowledge graph
            </p>
          </div>

          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded bg-brand-blue hover:bg-blue-500 text-white font-mono text-xs font-bold transition-all shadow-md"
          >
            <Upload className="w-4 h-4" />
            <span>INGEST NEW REPORT</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports by filename or well ID..."
              className="w-full bg-[#0A121D] border border-[#1C2A3A] rounded pl-9 pr-3 py-2 text-xs font-mono text-slate-100 placeholder-slate-400 outline-none focus:border-brand-cyan"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full bg-[#0A121D] border border-[#1C2A3A] rounded px-3 py-2 text-xs font-mono text-slate-100 outline-none focus:border-brand-cyan"
          >
            <option value="ALL">All Document Types</option>
            <option value="Daily Drilling Report">Daily Drilling Reports (DDR)</option>
            <option value="End of Well Report">End of Well Reports (EOWR)</option>
            <option value="Incident Investigation">Incident Investigations</option>
            <option value="Geomechanical Study">Geomechanical Studies</option>
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            onClick={() => setSelectedDoc(doc)}
            className="petrol-card p-4 space-y-3 hover:border-brand-blue/60 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-brand-blue/20 text-brand-cyan flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {doc.document_type}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  INDEXED
                </span>
              </div>

              <h3 className="font-mono text-xs font-bold text-slate-100 group-hover:text-brand-cyan transition-colors mt-2 leading-snug">
                {doc.filename}
              </h3>

              <p className="text-[11px] text-slate-400 font-sans line-clamp-3 mt-1.5 leading-relaxed">
                {doc.extracted_text || 'Structured OCR extraction complete. Contains depth logs and geomechanical hazards.'}
              </p>
            </div>

            <div className="pt-2 border-t border-[#1C2A3A] flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>Well: <strong className="text-brand-sky">{doc.well_id || 'Regional'}</strong></span>
              <span className="text-brand-cyan flex items-center gap-1 group-hover:underline">
                <Eye className="w-3 h-3" />
                Read Document
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal & Document Viewer */}
      <DocumentUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onDocumentUploaded={onDocumentUploaded}
      />

      <DocumentViewer
        document={selectedDoc}
        onClose={() => setSelectedDoc(null)}
      />
    </div>
  );
};
