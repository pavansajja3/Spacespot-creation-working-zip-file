import React, { useState, useEffect } from 'react';
import api from '../src/api/axios'; // adjust path if needed
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  Calendar,
  ChevronDown,
  ChevronRight,
  Minus,
  X,
  FileText,
  Hash,
  Landmark,
  Mail,
  Maximize2,
  MapPin,
  Search,
  Settings,
  Shield,
  Tag,
  Trash2,
  User,
  Plus,
} from 'lucide-react';

interface SpaceData {
  id: string;
  name: string;
  location: string;
  category: string;
  website: string;
  activeFrom: string;
  activeTo: string;
  ownership: string;
  management: string;
  currentOwner: string;
  newOwner: string;
  transferDate: string;
  effectiveDate: string;
  transferReason: string;
  additionalNotes: string;
  minTenantPli: number;
  tradingHours: string;
  managedBy: string;
  overallRentableArea: number;
  otherRentableArea: number;
  permanentRentableArea: number;
  specialClauses: string;
  totalArea: number;
  rentableArea: number;
  floors: number;
  units: number;
  status: 'Active' | 'Inactive';
  images?: string[];
  documents?: string[];
}

export default function EditSpace() {
  const navigate = useNavigate();
  const { spaceId } = useParams<{ spaceId: string }>();

  const [formData, setFormData] = useState<SpaceData>({
  id: '',
  name: '',
  location: '',
  category: '',
  website: '',
  activeFrom: '',
  activeTo: '',
  ownership: '',
  management: '',
  currentOwner: '',
  newOwner: '',
  transferDate: '',
  effectiveDate: '',
  transferReason: '',
  additionalNotes: '',
  minTenantPli: 0,
  tradingHours: '',
  managedBy: '',
  overallRentableArea: 0,
  otherRentableArea: 0,
  permanentRentableArea: 0,
  specialClauses: '',
  totalArea: 0,
  rentableArea: 0,
  floors: 0,
  units: 0,
  status: 'Active',
  images: [],
  documents: [],
});

  const handleChange = (field: keyof SpaceData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
  try {
    const payload = {
      name: formData.name,
      address: formData.location,
      category: formData.category || "Office",
      website: formData.website || "",
      managed_by: formData.managedBy || "",
      status: formData.status.toLowerCase(),
    };

    console.log("UPDATE SPACE PAYLOAD:", payload);

    await api.put(`/spaces/${spaceId}`, payload);

    alert("Space updated successfully");
    navigate("/manage/spaces");
  } catch (error) {
    console.error("Error updating space:", error);
    alert("Failed to update space");
  }
};



  const [floors, setFloors] = useState<any[]>([]);
  const [expandedFloorId, setExpandedFloorId] = useState<number | string | null>(null);
  const [mergeFloorId, setMergeFloorId] = useState<number | string | null>(null);
  const [selectedUnitsByFloor, setSelectedUnitsByFloor] = useState<Record<string, string[]>>({});
  const [mergeDialogFloorId, setMergeDialogFloorId] = useState<string | null>(null);
  const [hoveredUnitKey, setHoveredUnitKey] = useState<string | null>(null);
  const [splitDialogUnit, setSplitDialogUnit] = useState<{ floorId: string; unitId: string } | null>(null);
  const [splitUnitCount, setSplitUnitCount] = useState(2);
  useEffect(() => {
  if (!spaceId) return;

  const fetchSpace = async () => {
    try {
      const res = await api.get(`/spaces/${spaceId}`);
      const space = res.data?.data || res.data;

      setFormData(prev => ({
                ...prev,
                id: String(space.id || ''),
                name: space.name || '',
                location: space.address || space.location || '',
                category: space.category || '',
                website: space.website || '',
                activeFrom: space.active_from || space.activeFrom || '',
                activeTo: space.active_to || space.activeTo || '',
                ownership: space.ownership || '',
                management: space.management || '',
                currentOwner: space.current_owner || space.currentOwner || '',
                minTenantPli: Number(space.min_tenant_pli || space.minTenantPli || 0),
                tradingHours: space.trading_hours || space.tradingHours || '',
                managedBy: space.managed_by || space.managedBy || '',
                overallRentableArea: Number(space.overall_rentable_area || space.overallRentableArea || 0),
                otherRentableArea: Number(space.other_rentable_area || space.otherRentableArea || 0),
                permanentRentableArea: Number(space.permanent_rentable_area || space.permanentRentableArea || 0),
                specialClauses: space.special_clauses || space.specialClauses || '',
                totalArea: Number(space.total_area || space.totalArea || 0),
                rentableArea: Number(space.rentable_area || space.rentableArea || 0),
                floors: Number(space.floors || 0),
                units: Number(space.units || 0),
                status: String(space.status).toLowerCase() === 'inactive' ? 'Inactive' : 'Active',
                images: Array.isArray(space.images) ? space.images : [],
                documents: Array.isArray(space.documents) ? space.documents : [],
              }));
    } catch (err) {
      console.error('Error loading space:', err);
    }
  };

  fetchSpace();
}, [spaceId]);
useEffect(() => {
  if (!spaceId) return;

  const fetchFloors = async () => {
    try {
      const res = await api.get(`/floors/spaces/${spaceId}/floors`);

      const floorsData =
        res.data?.data ||
        res.data?.data?.floors ||
        [];

      setFloors(Array.isArray(floorsData) ? floorsData : []);
    } catch (err) {
      console.error("Error loading floors:", err);
      setFloors([]);
    }
  };

  fetchFloors();
}, [spaceId]);

  const toggleUnitSelection = (floorId: string, unitId: string) => {
    setSelectedUnitsByFloor((prev) => {
      const selected = prev[floorId] || [];
      const nextSelected = selected.includes(unitId)
        ? selected.filter((u) => u !== unitId)
        : [...selected, unitId];
      return { ...prev, [floorId]: nextSelected };
    });
  };

  const mergeDialogUnits = mergeDialogFloorId ? selectedUnitsByFloor[mergeDialogFloorId] || [] : [];
  const mergedUnitName = mergeDialogUnits.join('+');

  const splitPreviewUnits = splitDialogUnit
    ? Array.from({ length: splitUnitCount }, (_, index) => `${splitDialogUnit.unitId}-${String.fromCharCode(65 + index)}`)
    : [];

  return (
    <div style={{ padding: '12px 14px 18px', backgroundColor: 'var(--spacespot-gray-50)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1220px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: '14px', alignItems: 'start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <button
                type="button"
                onClick={() => navigate('/manage/spaces')}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  border: '1px solid var(--spacespot-gray-200)',
                  backgroundColor: 'var(--spacespot-gray-100)',
                  color: 'var(--spacespot-gray-500)',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <ArrowLeft size={14} />
              </button>

              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--spacespot-cyan-primary)',
                  display: 'grid',
                  placeItems: 'center',
                  boxShadow: '0 8px 14px rgba(20, 216, 204, 0.2)',
                }}
              >
                <Building2 size={20} color="white" />
              </div>

              <div>
                <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#374151' }}>Edit Space</h1>
                <p style={{ margin: 0, fontSize: '15px', color: '#6b7280' }}>Space ID: {formData.id}</p>
              </div>
            </div>

            <Card style={{ padding: '16px', border: '1px solid #94a3b8' }}>
                            {/* Images Preview */}
                            {formData.images && formData.images.length > 0 && (
                              <div style={{ margin: '12px 0' }}>
                                <div style={{ fontWeight: 600, fontSize: '12px', marginBottom: 4 }}>Images</div>
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                  {formData.images.map((img, idx) => (
                                    <img key={idx} src={img} alt={`space-img-${idx}`} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6, border: '1px solid #eee' }} />
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Documents Preview */}
                            {formData.documents && formData.documents.length > 0 && (
                              <div style={{ margin: '12px 0' }}>
                                <div style={{ fontWeight: 600, fontSize: '12px', marginBottom: 4 }}>Documents</div>
                                <ul style={{ paddingLeft: 16, fontSize: '11px' }}>
                                  {formData.documents.map((doc, idx) => (
                                    <li key={idx}>
                                      <a href={doc} target="_blank" rel="noopener noreferrer">Document {idx + 1}</a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '8px', backgroundColor: '#f3f4f6', display: 'grid', placeItems: 'center' }}>
                  <Shield size={14} color="#6b7280" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#374151' }}>Basic Information</h3>
                  <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#9ca3af' }}>Update space details</p>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '10px' }}>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#374151', fontWeight: '600', marginBottom: '4px' }}><Hash size={12} color='var(--spacespot-cyan-primary)' />Space ID</label>
                  <input type="text" value={formData.id} disabled style={{ width: '100%', height: '32px', border: '1px solid #94a3b8', borderRadius: '8px', padding: '0 10px', fontSize: '14px', color: '#6b7280', backgroundColor: '#f8fafc' }} />
                  <div style={{ marginTop: '3px', fontSize: '10px', color: '#9ca3af' }}>Space ID cannot be modified</div>
                </div>

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#374151', fontWeight: '600', marginBottom: '4px' }}><Building2 size={12} color='var(--spacespot-cyan-primary)' />Space Name</label>
                  <input type="text" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} style={{ width: '100%', height: '32px', border: '1px solid #94a3b8', borderRadius: '8px', padding: '0 10px', fontSize: '14px', color: '#374151', backgroundColor: 'white' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#374151', fontWeight: '600', marginBottom: '4px' }}><Tag size={12} color='var(--spacespot-cyan-primary)' />Category</label>
                    <select value={formData.category} onChange={(e) => handleChange('category', e.target.value)} style={{ width: '100%', height: '32px', border: '1px solid #94a3b8', borderRadius: '8px', padding: '0 10px', fontSize: '14px', color: '#374151', backgroundColor: 'white' }}>
                      <option>Office</option>
                      <option>Commercial</option>
                      <option>Retail</option>
                      <option>Medical</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#374151', fontWeight: '600', marginBottom: '4px' }}><Landmark size={12} color='var(--spacespot-cyan-primary)' />Centre Website</label>
                    <input type="text" value={formData.website} onChange={(e) => handleChange('website', e.target.value)} style={{ width: '100%', height: '32px', border: '1px solid #94a3b8', borderRadius: '8px', padding: '0 10px', fontSize: '14px', color: '#374151', backgroundColor: 'white' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#374151', fontWeight: '600', marginBottom: '4px' }}><Mail size={12} color='var(--spacespot-cyan-primary)' />Managed By</label>
                  <input type="text" value={formData.managedBy} onChange={(e) => handleChange('managedBy', e.target.value)} style={{ width: '48%', height: '32px', border: '1px solid #94a3b8', borderRadius: '8px', padding: '0 10px', fontSize: '14px', color: '#374151', backgroundColor: 'white' }} />
                </div>

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#374151', fontWeight: '600', marginBottom: '4px' }}><MapPin size={12} color='var(--spacespot-cyan-primary)' />Address</label>
                  <input type="text" value={formData.location} onChange={(e) => handleChange('location', e.target.value)} style={{ width: '100%', height: '32px', border: '1px solid #94a3b8', borderRadius: '8px', padding: '0 10px', fontSize: '14px', color: '#374151', backgroundColor: 'white' }} />
                </div>

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#374151', fontWeight: '600', marginBottom: '6px' }}><Landmark size={12} color='var(--spacespot-cyan-primary)' />Space Logo</label>
                  <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '8px', backgroundColor: '#dff7f6', display: 'grid', placeItems: 'center' }}>
                        <Landmark size={14} color='var(--spacespot-cyan-primary)' />
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: '600', color: '#374151' }}>office-complex-logo.png</div>
                        <div style={{ fontSize: '10px', color: '#6b7280' }}>Current logo file</div>
                      </div>
                    </div>
                    <button type="button" style={{ height: '26px', border: 'none', borderRadius: '8px', backgroundColor: 'var(--spacespot-cyan-primary)', color: 'white', fontSize: '11px', fontWeight: '600', padding: '0 12px', cursor: 'pointer' }}>Replace</button>
                  </div>
                  <div style={{ marginTop: '4px', fontSize: '10px', color: '#9ca3af' }}>PNG, JPG up to 5MB</div>
                </div>

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#374151', fontWeight: '600', marginBottom: '6px' }}><MapPin size={12} color='var(--spacespot-cyan-primary)' />Upload Map</label>
                  <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '8px', backgroundColor: '#dff7f6', display: 'grid', placeItems: 'center' }}>
                        <MapPin size={14} color='var(--spacespot-cyan-primary)' />
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: '600', color: '#374151' }}>office-complex-map.png</div>
                        <div style={{ fontSize: '10px', color: '#6b7280' }}>Current map file</div>
                      </div>
                    </div>
                    <button type="button" style={{ height: '26px', border: 'none', borderRadius: '8px', backgroundColor: 'var(--spacespot-cyan-primary)', color: 'white', fontSize: '11px', fontWeight: '600', padding: '0 12px', cursor: 'pointer' }}>Replace</button>
                  </div>
                  <div style={{ marginTop: '4px', fontSize: '10px', color: '#9ca3af' }}>PNG, JPG up to 10MB</div>
                </div>
              </div>

            </Card>

            <Card style={{ padding: '16px', border: '1px solid var(--spacespot-cyan-primary)', marginTop: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '8px', backgroundColor: '#dff7f6', display: 'grid', placeItems: 'center' }}>
                  <Settings size={14} color="var(--spacespot-cyan-primary)" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#374151' }}>Operational Details</h3>
                  <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#9ca3af' }}>Manage operational information</p>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '10px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#374151', fontWeight: '600', marginBottom: '4px' }}><Calendar size={12} color='var(--spacespot-cyan-primary)' />Active From</label>
                    <input type="text" value={formData.activeFrom} onChange={(e) => handleChange('activeFrom', e.target.value)} style={{ width: '100%', height: '32px', border: '1px solid #94a3b8', borderRadius: '8px', padding: '0 10px', fontSize: '14px', color: '#374151', backgroundColor: 'white' }} />
                    <div style={{ marginTop: '3px', fontSize: '10px', color: '#9ca3af' }}>Activation date cannot be modified</div>
                  </div>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#374151', fontWeight: '600', marginBottom: '4px' }}><Calendar size={12} color='var(--spacespot-cyan-primary)' />Active To</label>
                    <input type="text" value={formData.activeTo} onChange={(e) => handleChange('activeTo', e.target.value)} style={{ width: '100%', height: '32px', border: '1px solid #94a3b8', borderRadius: '8px', padding: '0 10px', fontSize: '14px', color: '#374151', backgroundColor: 'white' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '11px', color: '#374151', fontWeight: '600', marginBottom: '4px', display: 'block' }}>Ownership</label>
                    <input type="text" value={formData.ownership} onChange={(e) => handleChange('ownership', e.target.value)} style={{ width: '100%', height: '32px', border: '1px solid #94a3b8', borderRadius: '8px', padding: '0 10px', fontSize: '14px', color: '#374151', backgroundColor: 'white' }} />
                    <div style={{ marginTop: '3px', fontSize: '10px', color: '#9ca3af' }}>Ownership cannot be modified here</div>
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#374151', fontWeight: '600', marginBottom: '4px', display: 'block' }}>Management</label>
                    <input type="text" value={formData.management} onChange={(e) => handleChange('management', e.target.value)} style={{ width: '100%', height: '32px', border: '1px solid #94a3b8', borderRadius: '8px', padding: '0 10px', fontSize: '14px', color: '#374151', backgroundColor: 'white' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#374151', fontWeight: '600', marginBottom: '4px' }}><Shield size={12} color='var(--spacespot-cyan-primary)' />Min. Public Liability Insurance Value</label>
                  <input type="number" value={formData.minTenantPli} onChange={(e) => handleChange('minTenantPli', Number(e.target.value))} style={{ width: '100%', height: '32px', border: '1px solid #94a3b8', borderRadius: '8px', padding: '0 10px', fontSize: '14px', color: '#374151', backgroundColor: 'white' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#374151', fontWeight: '600', marginBottom: '4px' }}><Maximize2 size={12} color='var(--spacespot-cyan-primary)' />Overall Rentable Area</label>
                    <div style={{ position: 'relative' }}>
                      <input type="number" value={formData.overallRentableArea} onChange={(e) => handleChange('overallRentableArea', Number(e.target.value))} style={{ width: '100%', height: '32px', border: '1px solid #94a3b8', borderRadius: '8px', padding: '0 44px 0 10px', fontSize: '14px', color: '#374151', backgroundColor: 'white' }} />
                      <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', color: '#6b7280' }}>Sq M</span>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#374151', fontWeight: '600', marginBottom: '4px' }}><Maximize2 size={12} color='var(--spacespot-cyan-primary)' />Other Rentable Area</label>
                    <div style={{ position: 'relative' }}>
                      <input type="number" value={formData.otherRentableArea} onChange={(e) => handleChange('otherRentableArea', Number(e.target.value))} style={{ width: '100%', height: '32px', border: '1px solid #94a3b8', borderRadius: '8px', padding: '0 44px 0 10px', fontSize: '14px', color: '#374151', backgroundColor: 'white' }} />
                      <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', color: '#6b7280' }}>Sq M</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#374151', fontWeight: '600', marginBottom: '4px' }}><Maximize2 size={12} color='var(--spacespot-cyan-primary)' />Permanent Rentable Area</label>
                  <div style={{ position: 'relative' }}>
                    <input type="number" value={formData.permanentRentableArea} onChange={(e) => handleChange('permanentRentableArea', Number(e.target.value))} style={{ width: '100%', height: '32px', border: '1px solid #94a3b8', borderRadius: '8px', padding: '0 44px 0 10px', fontSize: '14px', color: '#374151', backgroundColor: 'white' }} />
                    <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', color: '#6b7280' }}>Sq M</span>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#374151', fontWeight: '600', marginBottom: '6px' }}><FileText size={12} color='var(--spacespot-cyan-primary)' />Special Clauses for the Spaces</label>
                  <textarea value={formData.specialClauses} onChange={(e) => handleChange('specialClauses', e.target.value)} placeholder="Enter any special clauses or terms..." rows={4} style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '10px', padding: '12px 10px', fontSize: '14px', color: '#374151', backgroundColor: '#f8fafc', resize: 'vertical', outline: 'none' }} />
                </div>
              </div>
            </Card>

            <Card style={{ padding: '16px', border: '1px solid #a855f7', marginTop: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '8px', backgroundColor: '#f3e8ff', display: 'grid', placeItems: 'center' }}>
                  <User size={14} color="#a855f7" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#374151' }}>Change Ownership</h3>
                  <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#9ca3af' }}>Transfer ownership and update details</p>
                </div>
              </div>

              <div style={{ border: '1px solid #d1d5db', borderRadius: '10px', backgroundColor: '#faf7ff', padding: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '8px', backgroundColor: '#f3e8ff', display: 'grid', placeItems: 'center' }}>
                    <User size={13} color="#a855f7" />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#374151' }}>Ownership Transfer</div>
                    <div style={{ fontSize: '11px', color: '#9ca3af' }}>Transfer space ownership to another party</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '10px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#374151', fontWeight: '600', marginBottom: '4px' }}><User size={11} color='#a855f7' />Current Owner</label>
                      <input type="text" value={formData.currentOwner} onChange={(e) => handleChange('currentOwner', e.target.value)} style={{ width: '100%', height: '32px', border: '1px solid #94a3b8', borderRadius: '8px', padding: '0 10px', fontSize: '14px', color: '#6b7280', backgroundColor: '#f8fafc' }} />
                    </div>
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#374151', fontWeight: '600', marginBottom: '4px' }}><User size={11} color='#a855f7' />New Owner</label>
                      <input type="text" placeholder="Enter new owner name" value={formData.newOwner} onChange={(e) => handleChange('newOwner', e.target.value)} style={{ width: '100%', height: '32px', border: '1px solid #94a3b8', borderRadius: '8px', padding: '0 10px', fontSize: '14px', color: '#374151', backgroundColor: 'white' }} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#374151', fontWeight: '600', marginBottom: '4px' }}><Calendar size={11} color='#a855f7' />Transfer Date</label>
                      <input type="text" value={formData.transferDate} onChange={(e) => handleChange('transferDate', e.target.value)} style={{ width: '100%', height: '32px', border: '1px solid #94a3b8', borderRadius: '8px', padding: '0 10px', fontSize: '14px', color: '#374151', backgroundColor: 'white' }} />
                    </div>
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#374151', fontWeight: '600', marginBottom: '4px' }}><Calendar size={11} color='#a855f7' />Effective Date</label>
                      <input type="text" value={formData.effectiveDate} onChange={(e) => handleChange('effectiveDate', e.target.value)} style={{ width: '100%', height: '32px', border: '1px solid #94a3b8', borderRadius: '8px', padding: '0 10px', fontSize: '14px', color: '#374151', backgroundColor: 'white' }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#374151', fontWeight: '600', marginBottom: '4px' }}><FileText size={11} color='#a855f7' />Transfer Reason</label>
                    <textarea rows={3} placeholder="Enter reason for ownership transfer..." value={formData.transferReason} onChange={(e) => handleChange('transferReason', e.target.value)} style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '10px', fontSize: '14px', color: '#374151', backgroundColor: '#f8fafc', resize: 'vertical', outline: 'none' }} />
                  </div>

                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#374151', fontWeight: '600', marginBottom: '4px' }}><FileText size={11} color='#a855f7' />Additional Notes</label>
                    <textarea rows={3} placeholder="Enter any additional notes or details..." value={formData.additionalNotes} onChange={(e) => handleChange('additionalNotes', e.target.value)} style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '10px', fontSize: '14px', color: '#374151', backgroundColor: '#f8fafc', resize: 'vertical', outline: 'none' }} />
                  </div>

                  <div style={{ backgroundColor: '#fffbeb', border: '1px solid #f59e0b', borderRadius: '8px', padding: '10px', display: 'flex', gap: '8px' }}>
                    <AlertTriangle size={14} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: '#92400e', marginBottom: '2px' }}>Special Permission Required</div>
                      <div style={{ fontSize: '11px', color: '#a16207', lineHeight: 1.45 }}>
                        This action requires special permission to be submitted. Contact your administrator to request ownership transfer privileges.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <div style={{ border: '1px solid #f59e0b', borderRadius: '10px', padding: '12px', marginTop: '12px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#1f2937', marginBottom: '10px' }}>Space Status <span style={{ color: '#ef4444' }}>*</span></label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => handleChange('status', 'Active')}
                  style={{
                    textAlign: 'left',
                    border: formData.status === 'Active' ? '1px solid #10b981' : '1px solid #d1d5db',
                    backgroundColor: formData.status === 'Active' ? '#ecfdf5' : '#f9fafb',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '700', color: formData.status === 'Active' ? '#059669' : '#6b7280', marginBottom: '4px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: formData.status === 'Active' ? '#10b981' : '#9ca3af', display: 'inline-block' }} />
                    Active
                  </div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>Space is operational and accepting bookings</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleChange('status', 'Inactive')}
                  style={{
                    textAlign: 'left',
                    border: formData.status === 'Inactive' ? '1px solid #9ca3af' : '1px solid #d1d5db',
                    backgroundColor: '#f9fafb',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '700', color: '#6b7280', marginBottom: '4px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#9ca3af', display: 'inline-block' }} />
                    Inactive
                  </div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>Space is not currently available</div>
                </button>
              </div>
            </div>

            <Card style={{ padding: '12px', border: '1px solid var(--spacespot-cyan-primary)', marginTop: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#374151' }}>Floors & Units</h3>
              <p style={{ margin: '3px 0 10px', fontSize: '10px', color: '#9ca3af' }}>Manage floors and units for this space</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                <div style={{ border: '1px solid #c7ece9', backgroundColor: '#eefaf9', borderRadius: '6px', padding: '8px 10px' }}>
                  <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '2px' }}>Total Floors</div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#374151' }}>
                    {floors.length}
                  </div>
                </div>
                <div style={{ border: '1px solid #c7ece9', backgroundColor: '#eefaf9', borderRadius: '6px', padding: '8px 10px' }}>
                  <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '2px' }}>Total Units</div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#374151' }}>
                    {floors.reduce((sum, floor) => sum + Number(floor.units?.length || floor.total_units || 0), 0)}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px' }}>Search Floors</div>
              <div style={{ position: 'relative', marginBottom: '8px' }}>
                <Search size={12} color="#9ca3af" style={{ position: 'absolute', left: '9px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search by floor name, number, or ID..."
                  style={{ width: '100%', height: '30px', border: '1px solid #d1d5db', borderRadius: '6px', padding: '0 10px 0 30px', fontSize: '11px', color: '#374151', backgroundColor: '#f8fafc' }}
                />
              </div>

              <button
                type="button"
                onClick={() => navigate(`/manage/add-floor/${spaceId}`)}
                style={{
                  width: '100%',
                  height: '30px',
                  border: '1px solid var(--spacespot-cyan-primary)',
                  borderRadius: '6px',
                  backgroundColor: '#ffffff',
                  color: 'var(--spacespot-cyan-primary)',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  marginBottom: '10px',
                }}
              >
                <Plus size={13} /> Add New Floor
              </button>

              {floors.map((floor) => {
                const isExpanded = expandedFloorId === floor.id;
                const isMergeMode = mergeFloorId === floor.id;
                const selectedUnits = selectedUnitsByFloor[floor.id] || [];
                return (
                  <div
                    key={floor.id}
                    style={{
                      border: isExpanded ? '2px solid var(--spacespot-cyan-primary)' : '1px solid #d1d5db',
                      borderRadius: '12px',
                      backgroundColor: '#f8fafc',
                      padding: '10px',
                      marginBottom: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isExpanded ? '10px' : 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#dff7f6', display: 'grid', placeItems: 'center' }}>
                          <Building2 size={14} color='var(--spacespot-cyan-primary)' />
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: '700', color: '#1f2937' }}>{floor.floor_name || `Floor ${floor.id}`}</div>
                          <div style={{ fontSize: '11px', color: '#6b7280' }}>Level {floor.floor_number || '-'} • {floor.units?.length || floor.total_units || 0} units</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type='button'
                          onClick={() => {
                            const nextExpanded = isExpanded ? null : floor.id;
                            setExpandedFloorId(nextExpanded);
                            if (!nextExpanded || mergeFloorId !== nextExpanded) {
                              setMergeFloorId(null);
                            }
                          }}
                          style={{ border: 'none', borderRadius: '12px', backgroundColor: '#dbeafe', color: '#2563eb', fontSize: '12px', fontWeight: 700, padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                        >
                          {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />} Modify
                        </button>
                        <button type='button' style={{ border: 'none', borderRadius: '12px', backgroundColor: '#fee2e2', color: '#dc2626', fontSize: '12px', fontWeight: 700, padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Trash2 size={13} /> Remove
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <>
                        <div style={{ height: '1px', backgroundColor: '#d1d5db', margin: '8px 0 10px' }} />
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <div style={{ fontSize: '15px', fontWeight: '700', color: '#1f2937' }}>Units in {floor.floor_name || `Floor ${floor.id}`}</div>
                          {!isMergeMode && (
                            <button
                              type='button'
                              onClick={() => {
                                setMergeFloorId(floor.id);
                                setSelectedUnitsByFloor((prev) => ({ ...prev, [floor.id]: prev[floor.id] || [] }));
                              }}
                              style={{ border: 'none', borderRadius: '12px', backgroundColor: '#ede9fe', color: '#7c3aed', fontSize: '12px', fontWeight: 700, padding: '8px 14px', cursor: 'pointer' }}
                            >
                              Merge Units
                            </button>
                          )}
                          {isMergeMode && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ fontSize: '12px', color: '#f59e0b', backgroundColor: '#fffbeb', borderRadius: '8px', padding: '6px 8px' }}>
                                {selectedUnits.length} selected
                              </div>
                              <button
                                type='button'
                                onClick={() => setMergeDialogFloorId(floor.id)}
                                style={{ border: 'none', borderRadius: '12px', backgroundColor: '#f59e0b', color: 'white', fontSize: '12px', fontWeight: 700, padding: '8px 14px', cursor: selectedUnits.length > 1 ? 'pointer' : 'not-allowed', opacity: selectedUnits.length > 1 ? 1 : 0.65 }}
                                disabled={selectedUnits.length <= 1}
                              >
                                Merge Selected
                              </button>
                              <button
                                type='button'
                                onClick={() => {
                                  setMergeFloorId(null);
                                  setSelectedUnitsByFloor((prev) => ({ ...prev, [floor.id]: [] }));
                                }}
                                style={{ border: 'none', borderRadius: '12px', backgroundColor: '#f3f4f6', color: '#374151', fontSize: '12px', padding: '8px 14px', cursor: 'pointer' }}
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                        </div>
                        <div style={{ height: '1px', backgroundColor: '#d1d5db', margin: '0 0 10px' }} />
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0,1fr))', gap: '10px' }}>
                          {(floor.units || []).map((unit: any) => {
                            const u = unit.unit_number || unit.name || `Unit ${unit.id}`;
                            const unitKey = `${floor.id}:${u}`;
                            const isHovered = hoveredUnitKey === unitKey;
                            const isSelected = selectedUnits.includes(u);

                            return (
                              <button
                                key={u}
                                type="button"
                                onMouseEnter={() => {
                                  if (!isMergeMode) setHoveredUnitKey(unitKey);
                                }}
                                onMouseLeave={() => {
                                  if (!isMergeMode) setHoveredUnitKey(null);
                                }}
                                onClick={() => {
                                  if (isMergeMode) toggleUnitSelection(floor.id, u);
                                }}
                                style={{
                                  border: isSelected
                                    ? '2px solid #a855f7'
                                    : isHovered
                                    ? '2px solid var(--spacespot-cyan-primary)'
                                    : '2px solid #d1d5db',
                                  borderRadius: '12px',
                                  backgroundColor: isSelected
                                    ? '#f5f3ff'
                                    : isHovered
                                    ? '#dff7f6'
                                    : '#ffffff',
                                  minHeight: '66px',
                                  padding: '10px 12px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '8px',
                                  cursor: isMergeMode ? 'pointer' : 'default',
                                  textAlign: 'left',
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  {isMergeMode ? (
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      readOnly
                                      style={{ accentColor: '#a855f7' }}
                                    />
                                  ) : (
                                    <Building2 size={13} color="var(--spacespot-cyan-primary)" />
                                  )}
                                  <div style={{ fontSize: '14px', fontWeight: '700' }}>{u}</div>
                                </div>

                                {!isMergeMode && isHovered && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSplitDialogUnit({ floorId: floor.id, unitId: u });
                                      setSplitUnitCount(2);
                                    }}
                                    style={{
                                      border: 'none',
                                      borderRadius: '8px',
                                      backgroundColor: '#e8eefc',
                                      padding: '6px',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    Split
                                  </button>
                                )}
                              </button>
                            );
                          })}
                         
                        </div>
                      </>
                    )}
                  </div>
                );
              })}

              <div style={{ border: '1px solid #99f6e4', backgroundColor: '#ecfeff', borderRadius: '8px', padding: '8px' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#0f766e', marginBottom: '2px' }}>Floor Management Tips</div>
                <div style={{ fontSize: '10px', color: '#0f766e' }}>Use Modify to update a floor and Manage to edit unit details together.</div>
              </div>
            </Card>

            <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
            <button
              type="button"
              onClick={() => navigate("/manage/spaces")}
              style={{
                height: "36px",
                padding: "0 18px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                backgroundColor: "white",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              style={{
                height: "36px",
                padding: "0 18px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "var(--spacespot-cyan-primary)",
                color: "white",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Save Updates
            </button>
          </div>
          </div>

          <aside
            style={{
              position: 'fixed',
              top: '96px',
              right: '32px',
              width: '280px',
              maxHeight: 'calc(100vh - 112px)',
              overflowY: 'auto',
              paddingRight: '4px',
              zIndex: 20,
            }}
          >
            <Card style={{ padding: '16px', border: '1.5px solid #9fe5df', borderRadius: '12px', marginBottom: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#1f2937' }}>Space Summary</h3>
              <p style={{ margin: '2px 0 10px', fontSize: '10px', color: '#9ca3af' }}>Real-time overview</p>
              <div style={{ marginBottom: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#6b7280' }}>
                <span>Completion</span><span style={{ color: 'var(--spacespot-cyan-primary)', fontWeight: 700 }}>100%</span>
              </div>
              <div style={{ height: '6px', borderRadius: '999px', backgroundColor: '#dff7f6', overflow: 'hidden', marginBottom: '10px' }}><div style={{ width: '100%', height: '100%', backgroundColor: 'var(--spacespot-cyan-primary)' }} /></div>
              <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '2px' }}>Space ID</div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '7px' }}>{formData.id}</div>
              <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '2px' }}>Space Name</div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '7px' }}>{formData.name}</div>
              <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '2px' }}>Category</div>
              <div style={{ marginBottom: '7px' }}><span style={{ fontSize: '10px', borderRadius: '999px', padding: '2px 8px', backgroundColor: '#dff7f6', color: 'var(--spacespot-cyan-dark)' }}>{formData.category}</span></div>
              <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '2px' }}>Status</div>
              <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 600, marginBottom: '7px', display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />{formData.status}</div>
              <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '2px' }}>Address</div>
              <div style={{ fontSize: '11px', color: '#4b5563', marginBottom: '7px' }}>{formData.location}</div>
              <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '2px' }}>Website</div>
              <div style={{ fontSize: '11px', color: 'var(--spacespot-cyan-primary)' }}>{formData.website}</div>
            </Card>

            <Card style={{ padding: '16px', border: '1.5px solid #9fe5df', borderRadius: '12px', marginBottom: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#1f2937' }}>Structure</h3>
              <p style={{ margin: '2px 0 10px', fontSize: '10px', color: '#9ca3af' }}>Floors & Units</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', padding: '10px', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Total Floors</span>
                <span style={{ fontSize: '20px', fontWeight: '700', color: '#374151' }}>{floors.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', padding: '10px' }}>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Total Units</span>
                <span style={{ fontSize: '20px', fontWeight: '700', color: '#374151' }}>{floors.reduce((sum, floor) => sum + Number(floor.units?.length || floor.total_units || 0), 0)}</span>
              </div>
            </Card>

            <Card style={{ padding: '16px', border: '1.5px solid #9fe5df', borderRadius: '12px', marginBottom: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#1f2937' }}>Operations</h3>
              <p style={{ margin: '2px 0 10px', fontSize: '10px', color: '#9ca3af' }}>Key details</p>
              <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '2px' }}>Trading Hours</div>
              <div style={{ fontSize: '11px', color: '#374151', marginBottom: '7px' }}>{formData.tradingHours}</div>
              <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '2px' }}>Managed By</div>
              <div style={{ fontSize: '11px', color: '#374151', marginBottom: '7px' }}>{formData.managedBy}</div>
              <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '2px' }}>Active Period</div>
              <div style={{ fontSize: '11px', color: '#374151' }}>{formData.activeFrom} to {formData.activeTo}</div>
            </Card>

            <Card style={{ padding: '16px', border: '1.5px solid #9fe5df', borderRadius: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#1f2937' }}>Area Details</h3>
              <p style={{ margin: '2px 0 10px', fontSize: '10px', color: '#9ca3af' }}>Square meters</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span style={{ color: '#6b7280' }}>Overall</span>
                <span style={{ color: '#374151', fontWeight: 700 }}>{formData.totalArea} m²</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: '#6b7280' }}>Rentable</span>
                <span style={{ color: '#374151', fontWeight: 700 }}>{formData.rentableArea} m²</span>
              </div>
            </Card>
          </aside>
        </div>
      </div>

      {mergeDialogFloorId && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.28)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            zIndex: 50,
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '580px',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 24px 60px rgba(15, 23, 42, 0.24)',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '26px 26px 22px', borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)', display: 'grid', placeItems: 'center', boxShadow: '0 12px 24px rgba(147, 51, 234, 0.28)' }}>
                  <Building2 size={22} color='#ffffff' />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1f2937' }}>Merge Units</h2>
                  <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#6b7280' }}>Combine selected units into one</p>
                </div>
              </div>
              <button
                type='button'
                onClick={() => setMergeDialogFloorId(null)}
                style={{ border: 'none', background: 'transparent', color: '#6b7280', cursor: 'pointer', padding: 0 }}
              >
                <X size={22} />
              </button>
            </div>

            <div style={{ padding: '26px' }}>
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#1f2937', marginBottom: '12px' }}>Units to Merge</div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {mergeDialogUnits.map((unit) => (
                    <div key={unit} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#f3e8ff', color: '#7c3aed', borderRadius: '12px', padding: '10px 14px', fontSize: '14px', fontWeight: '700' }}>
                      <Building2 size={14} />
                      {unit}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '28px' }}>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#1f2937', marginBottom: '10px' }}>Merged Unit Name</div>
                <div style={{ border: '2px solid var(--spacespot-cyan-primary)', backgroundColor: '#dff7f6', borderRadius: '14px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Building2 size={18} color='var(--spacespot-cyan-primary)' />
                  <span style={{ fontSize: '16px', fontWeight: '700', color: '#1f2937' }}>{mergedUnitName}</span>
                </div>
              </div>

              <div style={{ backgroundColor: '#fffbeb', borderLeft: '4px solid #f59e0b', borderRadius: '12px', padding: '16px 18px', display: 'flex', gap: '12px' }}>
                <AlertTriangle size={18} color='#f59e0b' style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#1f2937', marginBottom: '4px' }}>Confirm Merge Operation</div>
                  <div style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.5 }}>
                    This will combine {mergeDialogUnits.length} units into a single merged unit. This action cannot be undone.
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', padding: '22px 26px 26px', borderTop: '1px solid #e5e7eb' }}>
              <button
                type='button'
                onClick={() => setMergeDialogFloorId(null)}
                style={{ border: 'none', backgroundColor: '#6b7280', color: '#ffffff', borderRadius: '14px', padding: '14px 28px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type='button'
                onClick={() => {
                  setMergeDialogFloorId(null);
                  setMergeFloorId(null);
                  if (mergeDialogFloorId) {
                    setSelectedUnitsByFloor((prev) => ({ ...prev, [mergeDialogFloorId]: [] }));
                  }
                }}
                style={{ border: 'none', backgroundColor: 'var(--spacespot-navy-primary)', color: '#ffffff', borderRadius: '14px', padding: '14px 28px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                <Building2 size={16} />
                Confirm Merge
              </button>
            </div>
          </div>
        </div>
      )}

      {splitDialogUnit && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.28)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            zIndex: 55,
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '520px',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 24px 60px rgba(15, 23, 42, 0.24)',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '22px 22px 18px', borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)', display: 'grid', placeItems: 'center', boxShadow: '0 12px 24px rgba(59, 130, 246, 0.24)' }}>
                  <ChevronRight size={18} color='#ffffff' style={{ transform: 'rotate(90deg)' }} />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1f2937' }}>Split Unit</h2>
                  <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#6b7280' }}>Divide unit into multiple units</p>
                </div>
              </div>
              <button
                type='button'
                onClick={() => setSplitDialogUnit(null)}
                style={{ border: 'none', background: 'transparent', color: '#6b7280', cursor: 'pointer', padding: 0 }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '20px 22px 22px' }}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>Original Unit</div>
                <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f8fafc' }}>
                  <Building2 size={13} color='#6b7280' />
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>{splitDialogUnit.unitId}</span>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>Number of Units to Split Into</div>
                <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 32px', gap: '10px', alignItems: 'center' }}>
                  <button
                    type='button'
                    onClick={() => setSplitUnitCount((count) => Math.max(2, count - 1))}
                    style={{ width: '32px', height: '32px', border: 'none', borderRadius: '8px', backgroundColor: '#f3f4f6', color: '#374151', display: 'grid', placeItems: 'center', cursor: splitUnitCount > 2 ? 'pointer' : 'not-allowed', opacity: splitUnitCount > 2 ? 1 : 0.6 }}
                    disabled={splitUnitCount <= 2}
                  >
                    <Minus size={14} />
                  </button>
                  <div style={{ border: '2px solid var(--spacespot-cyan-primary)', backgroundColor: '#dff7f6', borderRadius: '12px', minHeight: '40px', display: 'grid', placeItems: 'center', textAlign: 'center' }}>
                    <div>
                      <span style={{ fontSize: '22px', fontWeight: '700', color: '#1f2937' }}>{splitUnitCount}</span>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}> units</span>
                    </div>
                  </div>
                  <button
                    type='button'
                    onClick={() => setSplitUnitCount((count) => Math.min(6, count + 1))}
                    style={{ width: '32px', height: '32px', border: 'none', borderRadius: '8px', backgroundColor: '#f3f4f6', color: '#374151', display: 'grid', placeItems: 'center', cursor: splitUnitCount < 6 ? 'pointer' : 'not-allowed', opacity: splitUnitCount < 6 ? 1 : 0.6 }}
                    disabled={splitUnitCount >= 6}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '8px' }}>New Units Preview</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {splitPreviewUnits.map((unit) => (
                    <div key={unit} style={{ minWidth: '110px', border: '1px solid #93c5fd', backgroundColor: '#eff6ff', color: '#1d4ed8', borderRadius: '8px', padding: '8px 12px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', fontWeight: '600' }}>
                      <Building2 size={12} />
                      {unit}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ backgroundColor: '#fffbeb', borderLeft: '4px solid #f59e0b', borderRadius: '12px', padding: '14px 16px', display: 'flex', gap: '10px' }}>
                <AlertTriangle size={16} color='#f59e0b' style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#1f2937', marginBottom: '3px' }}>Confirm Split Operation</div>
                  <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.45 }}>
                    This will split the unit into {splitUnitCount} separate units. This action cannot be undone.
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', padding: '18px 22px 22px', borderTop: '1px solid #e5e7eb' }}>
              <button
                type='button'
                onClick={() => setSplitDialogUnit(null)}
                style={{ border: 'none', backgroundColor: '#6b7280', color: '#ffffff', borderRadius: '12px', padding: '12px 24px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type='button'
                onClick={() => setSplitDialogUnit(null)}
                style={{ border: 'none', backgroundColor: 'var(--spacespot-navy-primary)', color: '#ffffff', borderRadius: '12px', padding: '12px 24px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <ChevronRight size={14} style={{ transform: 'rotate(90deg)' }} />
                Confirm Split
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

