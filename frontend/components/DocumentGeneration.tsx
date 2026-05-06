import api from '../src/api/axios';
import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

interface DocumentGenerationState {
  documentType: string;
  unit: string;
  tenant: string;
  includeTerms: boolean;
  includeSignatures: boolean;
  language: string;
  copies: number;
}

export default function DocumentGeneration() {
  const [formData, setFormData] = useState<DocumentGenerationState>({
    documentType: 'lease-agreement',
    unit: '',
    tenant: '',
    includeTerms: true,
    includeSignatures: true,
    language: 'english',
    copies: 1,
  });

  const [generated, setGenerated] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const handleChange = (field: keyof DocumentGenerationState, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
  setGenerating(true);
  try {
    const response = await api.post(
      '/documents/generate',
      {
        type: formData.documentType,
        unit: formData.unit,
        tenant: formData.tenant,
        includeTerms: formData.includeTerms,
        includeSignatures: formData.includeSignatures,
        language: formData.language,
        copies: formData.copies,
      },
      {
        responseType: 'blob', // VERY IMPORTANT for file
      }
    );

    // Create download
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    setFileUrl(url);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${formData.documentType}.pdf`;
    link.click();

    setGenerating(false);
    setGenerated(true);
  } catch (error) {
    console.error(error);
    alert('Failed to generate document');
    setGenerating(false);
  }
};

  if (generated) {
    return (
      <div style={{ padding: '24px', backgroundColor: 'var(--spacespot-gray-50)', minHeight: '100vh' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--spacespot-success)', marginBottom: '8px' }}>Document Generated Successfully</h2>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>Your {formData.documentType.replace('-', ' ')} has been generated and is ready for download.</p>
            
            <Card>
                <div style={{ padding: '20px', textAlign: 'left' }}>
                <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>Document Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px', fontSize: '13px' }}>
                  <div style={{ color: '#6b7280', fontWeight: '500' }}>Type:</div>
                  <div style={{ color: '#1f2937', fontWeight: '500' }}>{formData.documentType}</div>
                  <div style={{ color: '#6b7280', fontWeight: '500' }}>Pages:</div>
                  <div style={{ color: '#1f2937', fontWeight: '500' }}>12-15 pages</div>
                  <div style={{ color: '#6b7280', fontWeight: '500' }}>Size:</div>
                  <div style={{ color: '#1f2937', fontWeight: '500' }}>~2.4 MB</div>
                  <div style={{ color: '#6b7280', fontWeight: '500' }}>Format:</div>
                  <div style={{ color: '#1f2937', fontWeight: '500' }}>PDF</div>
                </div>
              </div>
            </Card>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'center' }}>
              <Button variant="outline"onClick={() => {setGenerated(false);setFileUrl(null);}}>Generate Another</Button>
              <Button
                  variant="primary"
                  onClick={() => {
                    if (!fileUrl) return;

                    const link = document.createElement('a');
                    link.href = fileUrl;
                    link.download = `${formData.documentType}.pdf`;
                    link.click();

                    // cleanup (VERY IMPORTANT)
                    window.URL.revokeObjectURL(fileUrl);
                    setFileUrl(null);
                  }}
                >
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', backgroundColor: 'var(--spacespot-gray-50)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>Generate Documents</h1>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>Create and download lease agreements, notices, and other documents</p>
        </div>

        <Card>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', display: 'block', marginBottom: '6px' }}>Document Type</label>
              <select value={formData.documentType} onChange={(e) => handleChange('documentType', e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }}>
                <option value="lease-agreement">Lease Agreement</option>
                <option value="renewal-notice">Lease Renewal Notice</option>
                <option value="termination-notice">Termination Notice</option>
                <option value="inspection-report">Inspection Report</option>
                <option value="maintenance-invoice">Maintenance Invoice</option>
                <option value="rent-receipt">Rent Receipt</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid #e5e7eb' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', display: 'block', marginBottom: '6px' }}>Select Unit</label>
                <select value={formData.unit} onChange={(e) => handleChange('unit', e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }}>
                  <option value="">-- Choose a unit --</option>
                  <option value="U001">Unit 101</option>
                  <option value="U002">Unit 102</option>
                  <option value="U003">Unit 201</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', display: 'block', marginBottom: '6px' }}>Tenant Name</label>
                <input type="text" placeholder="Tenant name" value={formData.tenant} onChange={(e) => handleChange('tenant', e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }} />
              </div>
            </div>

            <div style={{ paddingBottom: '12px', borderBottom: '1px solid #e5e7eb' }}>
              <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>Document Options</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                  <input type="checkbox" checked={formData.includeTerms} onChange={(e) => handleChange('includeTerms', e.target.checked)} style={{ cursor: 'pointer' }} />
                  <span>Include Full Terms & Conditions</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                  <input type="checkbox" checked={formData.includeSignatures} onChange={(e) => handleChange('includeSignatures', e.target.checked)} style={{ cursor: 'pointer' }} />
                  <span>Include Signature Blocks</span>
                </label>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', display: 'block', marginBottom: '6px' }}>Language</label>
                <select value={formData.language} onChange={(e) => handleChange('language', e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }}>
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', display: 'block', marginBottom: '6px' }}>Number of Copies</label>
                <input type="number" min={1} max={10} value={formData.copies} onChange={(e) => handleChange('copies', Number(e.target.value))} style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
              <Button variant="outline">Cancel</Button>
              <Button variant="primary"onClick={handleGenerate}disabled={!formData.unit || generating}>{generating ? 'Generating...' : 'Generate Document'}</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

