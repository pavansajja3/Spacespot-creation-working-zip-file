import React, { useEffect, useMemo, useState } from 'react';
import api from '../src/api/axios';
import {
  BookOpen,
  BriefcaseBusiness,
  ChevronDown,
  FileCheck2,
  FileText,
  FileWarning,
  ReceiptText,
  Search,
  Shield,
  ShieldAlert,
  Store,
  TriangleAlert,
  Upload,
} from 'lucide-react';
import { toast } from 'sonner';

type DocumentCategory = 'Guidelines' | 'Safety' | 'Legal' | 'Insurance' | 'Template' | 'Finance' | 'Marketing';

interface DocumentItem {
  id: string;
  title: string;
  category: DocumentCategory;
  description: string;
  spaceId: string;
  unitScope: string;
  file_url?: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
}

const INITIAL_SELECTED_UNITS: Record<string, string> = {
  'DOC-002': 'All Units',
};

const getCategoryTheme = (category: DocumentCategory) => {
  switch (category) {
    case 'Guidelines':
      return {
        border: 'var(--spacespot-cyan-300)',
        pillBg: 'var(--spacespot-cyan-pale)',
        pillText: 'var(--spacespot-cyan-dark)',
        iconColor: 'var(--spacespot-cyan-primary)',
      };
    case 'Safety':
      return {
        border: 'var(--spacespot-warning)',
        pillBg: 'var(--spacespot-warning-light)',
        pillText: 'var(--spacespot-warning)',
        iconColor: 'var(--spacespot-warning)',
      };
    case 'Legal':
      return {
        border: 'var(--spacespot-error)',
        pillBg: 'var(--spacespot-error-light)',
        pillText: 'var(--spacespot-error)',
        iconColor: 'var(--spacespot-error)',
      };
    case 'Insurance':
      return {
        border: 'var(--spacespot-info)',
        pillBg: 'var(--spacespot-info-light)',
        pillText: 'var(--spacespot-info)',
        iconColor: 'var(--spacespot-info)',
      };
    case 'Template':
      return {
        border: 'var(--spacespot-warning)',
        pillBg: 'var(--spacespot-warning-light)',
        pillText: 'var(--spacespot-warning)',
        iconColor: 'var(--spacespot-warning)',
      };
    case 'Finance':
      return {
        border: 'var(--spacespot-warning)',
        pillBg: 'var(--spacespot-warning-light)',
        pillText: 'var(--spacespot-warning)',
        iconColor: 'var(--spacespot-warning)',
      };
    default:
      return {
        border: 'var(--spacespot-info)',
        pillBg: 'var(--spacespot-info-light)',
        pillText: 'var(--spacespot-info)',
        iconColor: 'var(--spacespot-info)',
      };
  }
};
const mapDocumentTypeToCategory = (type: string): DocumentCategory => {
  switch (type) {
    case 'policy':
      return 'Guidelines';
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
  const [selectedUnitById, setSelectedUnitById] = useState(INITIAL_SELECTED_UNITS);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [viewFileUrl, setViewFileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
        useEffect(() => {
          let active = true;

          const loadDocuments = async () => {
            try {
              setLoading(true);
              setError('');

              const response = await api.get('/documents', {
                params: { limit: 100 },
              });

              const data = response.data?.data || response.data;
              const rows = Array.isArray(data)
                ? data
                : data?.documents || data?.rows || [];

              if (active) {
                setDocuments(
                  rows.map((doc: any) => ({
                    id: String(doc.id ?? ''),
                    title: String(doc.title ?? doc.name ?? '-'),
                    category: mapDocumentTypeToCategory(doc.document_type),
                    description: String(doc.description ?? '-'),
                    spaceId: String(doc.space_id ?? doc.spaceId ?? 'SP001'),
                    unitScope: String(doc.unit_scope ?? doc.unitScope ?? 'All Units'),
                    file_url: doc.file_url,
                    icon: FileText,
                  }))
                );
              }
            } catch (err) {
              if (active) {
                console.error('Documents API error:', err);
                setError(
                  (err as any)?.response?.data?.message ||
                  'Failed to load documents'
                );
                setDocuments([]);
              }
            } finally {
              if (active) {
                setLoading(false);
              }
            }
          };

          loadDocuments();

          return () => {
            active = false;
          };
        }, []);

  const filteredDocuments = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return documents.filter((document) => {
      const matchesSearch =
        query.length === 0 ||
        document.title.toLowerCase().includes(query) ||
        document.description.toLowerCase().includes(query) ||
        document.category.toLowerCase().includes(query);

      const matchesCategory = categoryFilter === 'All' || document.category === categoryFilter;
      const matchesSpace = spaceFilter === 'All' || document.spaceId === spaceFilter;

      return matchesSearch && matchesCategory && matchesSpace;
    });
  }, [documents, categoryFilter, searchTerm, spaceFilter]);

  const stats = useMemo(() => {
  return {
    total: documents.length,
    guidelines: documents.filter((document) => document.category === 'Guidelines').length,
    safety: documents.filter((document) => document.category === 'Safety').length,
    legal: documents.filter((document) => document.category === 'Legal').length,
  };
}, [documents]);

  const handleGenerate = (document: DocumentItem) => {
    const selectedUnit = selectedUnitById[document.id] ?? document.unitScope;
    toast.success(`${document.title} is being generated`, {
      description: `${spaceFilter} • ${selectedUnit}`,
    });
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
                boxShadow: '0 10px 18px rgba(20, 216, 204, 0.18)',
              }}
            >
              <FileText size={18} color="var(--spacespot-white)" />
            </div>

            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--spacespot-navy-primary)', marginBottom: '2px' }}>Generate Documents</div>
              <div style={{ fontSize: '10px', color: 'var(--spacespot-gray-500)' }}>Create professional documents for your spaces and units</div>
            </div>
          </div>

          <button
            type="button"
            style={{
              border: 'none',
              backgroundColor: 'var(--spacespot-navy-primary)',
              color: 'var(--spacespot-white)',
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
        </div>

        <div
          style={{
            backgroundColor: 'var(--spacespot-white)',
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
            <Search size={13} color="var(--spacespot-gray-400)" style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)' }} />
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
                backgroundColor: 'var(--spacespot-white)',
                color: 'var(--spacespot-navy-primary)',
                fontSize: '11px',
              }}
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value as 'All' | DocumentCategory)}
            style={{
              height: '32px',
              border: '1px solid var(--spacespot-gray-300)',
              borderRadius: '7px',
              backgroundColor: 'var(--spacespot-white)',
              padding: '0 10px',
              fontSize: '11px',
            }}
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
            onChange={(event) => setSpaceFilter(event.target.value)}
            style={{
              height: '32px',
              border: '1px solid var(--spacespot-gray-300)',
              borderRadius: '7px',
              backgroundColor: 'var(--spacespot-white)',
              padding: '0 10px',
              fontSize: '11px',
            }}
          >
            <option value="All">All Spaces</option>
            <option value="SP001">SP001</option>
            <option value="All">All Spaces</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '10px', marginBottom: '16px' }}>
          {[
            { title: 'Total Documents', value: stats.total, icon: FileText, accent: 'var(--spacespot-cyan-300)', iconColor: 'var(--spacespot-cyan-primary)' },
            { title: 'Guidelines', value: stats.guidelines, icon: BookOpen, accent: 'var(--spacespot-cyan-300)', iconColor: 'var(--spacespot-success)' },
            { title: 'Safety', value: stats.safety, icon: ShieldAlert, accent: 'var(--spacespot-warning)', iconColor: 'var(--spacespot-warning)' },
            { title: 'Legal', value: stats.legal, icon: TriangleAlert, accent: 'var(--spacespot-error)', iconColor: 'var(--spacespot-error)' },
          ].map((stat) => (
            <div
              key={stat.title}
              style={{
                backgroundColor: 'var(--spacespot-white)',
                border: `1.5px solid ${stat.accent}`,
                borderRadius: '10px',
                padding: '10px 12px',
                minHeight: '62px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              <div>
                <div style={{ fontSize: '9px', color: 'var(--spacespot-gray-400)', marginBottom: '7px' }}>{stat.title}</div>
                <div style={{ fontSize: '27px', lineHeight: 1, fontWeight: 700, color: 'var(--spacespot-navy-primary)' }}>{stat.value}</div>
              </div>

              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--spacespot-gray-50)',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <stat.icon size={13} color={stat.iconColor} />
              </div>
            </div>
         ))}
          </div>  {/* CLOSE stats grid FIRST */}
          <div>
            {loading && (
            <div style={{ padding: '24px 0', textAlign: 'center', fontSize: '11px', color: 'var(--spacespot-gray-500)' }}>
              Loading documents...
            </div>
          )}

          {error && !loading && (
            <div style={{ padding: '24px 0', textAlign: 'center', fontSize: '11px', color: 'red' }}>
              {error}
            </div>
          )}

          {!loading && !error && filteredDocuments.length === 0 && (
            <div style={{ padding: '40px 0', textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>
              No documents found
            </div>
          )}

          {!loading && !error && filteredDocuments.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: '12px',
            }}
            >
              {filteredDocuments.map((document) => {
  const theme = getCategoryTheme(document.category);
  const Icon = document.icon;
  const selectedUnit = selectedUnitById[document.id] ?? document.unitScope;

  return (
    <div
      key={document.id}
      style={{
        backgroundColor: 'var(--spacespot-white)',
        border: '1px solid var(--spacespot-gray-200)',
        borderRadius: '10px',
        boxShadow: 'var(--spacespot-shadow-sm)',
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
    Space: {document.spaceId}
  </div>
</div>

<div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
  <button
    type="button"
    onClick={async () => {
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
        }}
    style={{
      border: 'none',
      background: 'transparent',
      color: '#0f172a',
      cursor: 'pointer',
      fontSize: '14px',
    }}
  >
    View
  </button>

  <a
    href={document.file_url ? `http://localhost:3000${document.file_url}` : '#'}
    download
  >
    Download
  </a>
</div>

    </div>
  );
})}
        </div>
      )}

    </div>
  </div>
  {viewFileUrl && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.6)",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        width: "85%",
        height: "85%",
        background: "#fff",
        borderRadius: "12px",
        padding: "12px",
      }}
    >
      <button
        onClick={() => setViewFileUrl(null)}
        style={{
          float: "right",
          marginBottom: "8px",
          cursor: "pointer",
        }}
      >
        Close
      </button>

      <iframe
          src={viewFileUrl}
          title="PDF Viewer"
          style={{ width: "100%", height: "95%", border: "none" }}
        />
    </div>
  </div>
)}
</div>
);
}
