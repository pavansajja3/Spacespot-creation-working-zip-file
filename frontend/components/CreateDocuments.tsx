import React, { useEffect, useMemo, useState } from 'react';
import api from '../src/api/axios';
import {
  BookOpen,
  ChevronDown,
  FileText,
  Search,
  ShieldAlert,
  TriangleAlert,
} from 'lucide-react';
import { toast } from 'sonner';

type DocumentCategory =
  | 'Guidelines'
  | 'Safety'
  | 'Legal'
  | 'Insurance'
  | 'Template'
  | 'Finance'
  | 'Marketing';

interface DocumentItem {
  id: string;
  title: string;
  category: DocumentCategory;
  description: string;
  spaceId: string;
  unitScope: string;
  file_url?: string;
}

const mapDocumentTypeToCategory = (type: string): DocumentCategory => {
  switch ((type || '').toLowerCase()) {
    case 'guidelines':
    case 'guideline':
    case 'policy':
      return 'Guidelines';

    case 'safety':
      return 'Safety';

    case 'legal':
    case 'contract':
    case 'lease_agreement':
    case 'addendum':
      return 'Legal';

    case 'invoice':
    case 'receipt':
      return 'Finance';

    default:
      return 'Template';
  }
};

export default function CreateDocuments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | DocumentCategory>('All');
  const [spaceFilter, setSpaceFilter] = useState('All');

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [spaces, setSpaces] = useState<any[]>([]);

  const [viewFileUrl, setViewFileUrl] = useState<string | null>(null);

  const [showUpload, setShowUpload] = useState(false);
  const [selectedSpaceId, setSelectedSpaceId] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDocuments = async (selectedSpace = spaceFilter) => {
    try {
      setLoading(true);
      setError('');

      const params: any = { limit: 100 };
      if (selectedSpace !== 'All') {
        params.space_id = selectedSpace;
      }

      const response = await api.get('/documents', { params });

      const data = response.data?.data || response.data;
      const rows = Array.isArray(data)
        ? data
        : data?.documents || data?.rows || [];

      const spacesResponse = await api.get('/spaces');
      const spacesData = spacesResponse.data?.data || spacesResponse.data;
      const spaceRows = Array.isArray(spacesData)
        ? spacesData
        : spacesData?.spaces || spacesData?.rows || [];

      setSpaces(spaceRows);

      setDocuments(
        rows.map((doc: any) => ({
          id: String(doc.id ?? ''),
          title: String(doc.title ?? doc.name ?? doc.file_name ?? '-'),
          category: mapDocumentTypeToCategory(doc.document_type),
          description: String(doc.description ?? '-'),
          spaceId: doc.space_id ? String(doc.space_id) : '',
          unitScope: String(doc.unit_scope ?? doc.unitScope ?? 'All Units'),
          file_url: doc.file_url,
        }))
      );
    } catch (err) {
      console.error('Documents API error:', err);
      setError((err as any)?.response?.data?.message || 'Failed to load documents');
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments(spaceFilter);
  }, [spaceFilter]);

  const filteredDocuments = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return documents.filter((document) => {
      const matchesSearch =
        query.length === 0 ||
        document.title.toLowerCase().includes(query) ||
        document.description.toLowerCase().includes(query) ||
        document.category.toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter === 'All' || document.category === categoryFilter;

      const matchesSpace =
      spaceFilter === 'All' ||
      String(document.spaceId) === String(spaceFilter);

      return matchesSearch && matchesCategory && matchesSpace;
    });
  }, [documents, categoryFilter, searchTerm, spaceFilter]);

  const stats = useMemo(() => {
    return {
        total: filteredDocuments.length,
        guidelines: filteredDocuments.filter(d => d.category === 'Guidelines').length,
        safety: filteredDocuments.filter(d => d.category === 'Safety').length,
        legal: filteredDocuments.filter(d => d.category === 'Legal').length,
    };
  }, [filteredDocuments]);

  const handleView = async (document: DocumentItem) => {
    if (!document.file_url) return;

    const fileUrl = `http://localhost:3000${document.file_url}`;

    if (document.file_url.toLowerCase().endsWith('.pdf')) {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const pdfUrl = URL.createObjectURL(blob);
      setViewFileUrl(pdfUrl);
    } else {
      window.open(fileUrl, '_blank');
    }
  };
  const handleDownload = async (url?: string, fileName?: string) => {
  if (!url) return;

  try {
    const response = await fetch(`http://localhost:3000${url}`);

    const blob = await response.blob();

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName || url.split("/").pop() || "document";
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(link.href);
  } catch (err) {
    console.error("Download failed", err);
    toast.error("Download failed");
  }
};
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm('Delete this document?');
    if (!confirmDelete) return;

    try {
      await api.delete(`/documents/${id}`);
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
      toast.success('Deleted successfully');
    } catch (err) {
      console.error(err);
      toast.error('Delete failed');
    }
  };

  const handleUpload = async () => {
    if (!selectedSpaceId || !selectedFile) {
      toast.error('Select space and file');
      return;
    }

    const formData = new FormData();
    formData.append('documents', selectedFile);
    formData.append('space_id', selectedSpaceId);

    try {
      await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Uploaded successfully');
      setShowUpload(false);
      setSelectedSpaceId('');
      setSelectedFile(null);
      loadDocuments();
    } catch (err) {
      console.error(err);
      toast.error('Upload failed');
    }
  };

  return (
    <div style={{ padding: '18px 20px 24px', backgroundColor: 'var(--spacespot-gray-50)', minHeight: '100vh' }}>
      <div style={{ width: '100%', maxWidth: '1080px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: 'var(--spacespot-cyan-primary)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <FileText size={18} color="white" />
            </div>

            <div>
              <div style={{ fontSize: '13px', fontWeight: 700 }}>
                Generate Documents
              </div>
              <div style={{ fontSize: '10px', color: 'var(--spacespot-gray-500)' }}>
                Create professional documents for your spaces and units
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              style={{
                border: 'none',
                backgroundColor: 'var(--spacespot-navy-primary)',
                color: 'white',
                borderRadius: '8px',
                padding: '0 12px',
                height: '30px',
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              All Spaces <ChevronDown size={14} />
            </button>

            <button
              type="button"
              onClick={() => setShowUpload(true)}
              style={{
                background: '#14d8cc',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '0 14px',
                height: '30px',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 600,
              }}
            >
              Upload
            </button>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'white',
            border: '1.5px solid var(--spacespot-gray-300)',
            borderRadius: '10px',
            padding: '12px',
            display: 'grid',
            gridTemplateColumns: '1.1fr 1fr 1fr',
            gap: '10px',
            marginBottom: '14px',
          }}
        >
          <div style={{ position: 'relative' }}>
            <Search size={13} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              style={{
                width: '100%',
                height: '32px',
                padding: '0 12px 0 32px',
                border: '1px solid var(--spacespot-gray-300)',
                borderRadius: '7px',
                fontSize: '11px',
              }}
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value as 'All' | DocumentCategory)}
            style={{ height: '32px', borderRadius: '7px', fontSize: '11px' }}
          >
            <option value="All">All</option>
            <option value="Guidelines">Guidelines</option>
            <option value="Safety">Safety</option>
            <option value="Legal">Legal</option>
            <option value="Insurance">Insurance</option>
            <option value="Template">Template</option>
            <option value="Finance">Finance</option>
            <option value="Marketing">Marketing</option>
          </select>

          <select
            value={spaceFilter}
            onChange={(event) => {
            const value = event.target.value;
            setSpaceFilter(value);
            
          }}
            style={{ height: '32px', borderRadius: '7px', fontSize: '11px' }}
          >
            <option value="All">All Spaces</option>
            {spaces.map((space) => (
              <option key={space.id} value={String(space.id)}>
                {space.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '10px', marginBottom: '16px' }}>
          {[
            { title: 'Total Documents', value: stats.total, filter: 'All' as const, icon: FileText },
            { title: 'Guidelines', value: stats.guidelines, filter: 'Guidelines' as const, icon: BookOpen },
            { title: 'Safety', value: stats.safety, filter: 'Safety' as const, icon: ShieldAlert },
            { title: 'Legal', value: stats.legal, filter: 'Legal' as const, icon: TriangleAlert },
          ].map((stat) => (
            <div
              key={stat.title}
              onClick={() => setCategoryFilter(stat.filter)}
              style={{
                backgroundColor: 'white',
                border: '1.5px solid var(--spacespot-cyan-300)',
                borderRadius: '10px',
                padding: '10px 12px',
                minHeight: '62px',
                display: 'flex',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <div>
                <div style={{ fontSize: '9px', color: 'var(--spacespot-gray-400)', marginBottom: '7px' }}>
                  {stat.title}
                </div>
                <div style={{ fontSize: '27px', fontWeight: 700 }}>
                  {stat.value}
                </div>
              </div>
              <stat.icon size={16} />
            </div>
          ))}
        </div>

        {loading && <div style={{ textAlign: 'center' }}>Loading documents...</div>}

        {error && !loading && (
          <div style={{ textAlign: 'center', color: 'red' }}>{error}</div>
        )}

        {!loading && !error && filteredDocuments.length === 0 && (
          <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>
            No documents found
          </div>
        )}

        {!loading && !error && filteredDocuments.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px' }}>
            {filteredDocuments.map((document) => (
              <div
                key={document.id}
                style={{
                  backgroundColor: 'white',
                  border: '1px solid var(--spacespot-gray-200)',
                  borderRadius: '10px',
                  padding: '12px',
                  minHeight: '136px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600 }}>
                    {document.title}
                  </div>

                  <div style={{ fontSize: '10px', color: '#64748b', marginTop: '6px' }}>
                    {document.description}
                  </div>

                  <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '6px' }}>
                    Space: {
                      spaces.find((s) => String(s.id) === document.spaceId)?.name || '-'
                    }
                  </div>

                  <div style={{ fontSize: '10px', color: '#14d8cc', marginTop: '6px' }}>
                    {document.category}
                  </div>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                  <button type="button" onClick={() => handleView(document)}>
                    View
                  </button>

                  <button
                      type="button"
                      onClick={() => handleDownload(document.file_url, document.title)}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        padding: 0,
                        fontSize: '14px',
                      }}
                    >
                      Download
                    </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(document.id)}
                    style={{ color: 'red' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showUpload && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', width: '360px' }}>
            <h3>Upload Document</h3>

            <select
              value={selectedSpaceId}
              onChange={(e) => setSelectedSpaceId(e.target.value)}
            >
              <option value="">Select Space</option>
              {spaces.map((space) => (
                <option key={space.id} value={String(space.id)}>
                  {space.name}
                </option>
              ))}
            </select>

            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
              <button
                type="button"
                onClick={() => {
                  setShowUpload(false);
                  setSelectedSpaceId('');
                  setSelectedFile(null);
                }}
              >
                Cancel
              </button>

              <button type="button" onClick={handleUpload}>
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {viewFileUrl && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ width: '85%', height: '85%', background: '#fff', borderRadius: '12px', padding: '12px' }}>
            <button
              type="button"
              onClick={() => setViewFileUrl(null)}
              style={{ float: 'right', marginBottom: '8px', cursor: 'pointer' }}
            >
              Close
            </button>

            <iframe
              src={viewFileUrl}
              title="PDF Viewer"
              style={{ width: '100%', height: '95%', border: 'none' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}