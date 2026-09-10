import React, { useEffect, useState } from 'react';
import { FileText, Upload, Trash2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { getDocuments, uploadDocument, deleteDocument } from '../services/api';
import type { DocumentMetadata } from '../types/document';

export const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [medicine, setMedicine] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const docs = await getDocuments();
      setDocuments(docs);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a PDF file to upload.");
      return;
    }
    if (!medicine.trim()) {
      setError("Please enter the product name.");
      return;
    }

    setError(null);
    setSuccessMsg(null);
    setUploading(true);

    try {
      const res = await uploadDocument(file, medicine.trim());
      setSuccessMsg(res.message);
      setFile(null);
      setMedicine('');
      await fetchDocs();
    } catch (err: any) {
      console.error("Upload error:", err);
      const msg = err.response?.data?.detail || "Document upload failed.";
      setError(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId: string, filename: string) => {
    if (!window.confirm(`Are you sure you want to delete '${filename}'?`)) return;

    try {
      await deleteDocument(docId);
      setSuccessMsg(`Document '${filename}' deleted successfully.`);
      await fetchDocs();
    } catch (err: any) {
      console.error("Delete error:", err);
      setError(err.response?.data?.detail || "Deletion failed.");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Approved Product Labels
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Upload and manage official approved pharmaceutical labeling documents used for claim verification.
        </p>
      </div>

      {/* Upload Form Box */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-700 flex items-center gap-2">
          <Upload className="w-4 h-4 text-blue-600" />
          Upload Product Label PDF
        </h3>

        <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Product / Medicine Name</label>
            <input
              type="text"
              placeholder="e.g. Ibuprofen, Metformin..."
              value={medicine}
              onChange={(e) => setMedicine(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Drug Label PDF</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full bg-white border border-gray-300 rounded-lg p-1.5 text-xs text-gray-700 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={uploading}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-xs disabled:opacity-50 h-10"
            >
              {uploading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload Label
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>

      {/* Document List Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">
            Available Label Documents ({documents.length})
          </h3>
          <button
            onClick={fetchDocs}
            className="px-3 py-1.5 rounded-md bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-gray-500">Loading documents...</div>
        ) : documents.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-500">
            No approved product labels uploaded yet. Upload a PDF label document using the form above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] font-semibold tracking-wider border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3">Document Name</th>
                  <th className="px-4 py-3">Product Name</th>
                  <th className="px-4 py-3">Total Pages</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {documents.map((doc) => (
                  <tr key={doc.document_id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-medium text-gray-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                      {doc.filename}
                    </td>
                    <td className="px-4 py-3.5 capitalize font-normal text-gray-700">{doc.medicine}</td>
                    <td className="px-4 py-3.5 text-gray-600">{doc.total_pages}</td>
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {doc.status === 'ingested' ? 'Ready' : doc.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => handleDelete(doc.document_id, doc.filename)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-red-50 text-red-600 border border-red-200 text-xs transition-colors"
                        title="Delete Document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default Documents;
