import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  Bell,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock3,
  CreditCard,
  FileCheck,
  FileText,
  Info,
  Search,
} from "lucide-react";
import api from "../src/api/axios";
declare global {
  interface Window {
    selectedSpaceId?: string;
  }
}
type LeaseFormData = {
  leaseId: string;
  leaseForUnitId: string;
  customerId: string;
  leasedTo: string;
  leasePrice: string;
  leasePeriodCount: string;
  leasePeriodUnit: string;
  leaseStartDate: string;
  leaseEndDate: string;
  spaceTncStatus: "Accepted" | "Pending";
  privacyAuthStatus: "Received" | "Pending";
  pliStatus: "Received" | "Pending";
  pliValidAmount: string;
  pliValidUntil: string;
  leaseInvoicePeriod: string;
  invoiceStatus: "Generate Invoice" | "Invoice generated" | "Preview Invoice";
  advancePaymentReceived: "Yes" | "No";
  paymentStatus: "Received" | "Pending";
};

type UnitItem = {
  id: string;
  name: string;
  spaceName: string;
  spaceId: string;   // ✅ ADD THIS
  price: string;
};

type CustomerItem = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
};

const sectionCard: React.CSSProperties = {
  backgroundColor: "#ffffff",
  border: "1.5px solid #9fe5df",
  borderRadius: "8px",
  padding: "10px",
};

const leaseDetailsCard: React.CSSProperties = {
  backgroundColor: "#ffffff",
  border: "1.5px solid #6f7b8d",
  borderRadius: "10px",
  padding: "12px",
};

const labelStyle: React.CSSProperties = {
  fontSize: "10px",
  color: "var(--spacespot-navy-primary)",
  marginBottom: "6px",
  display: "block",
  fontWeight: 600,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: "30px",
  border: "1px solid #7f8ea1",
  borderRadius: "4px",
  backgroundColor: "#ffffff",
  fontSize: "10px",
  color: "#203249",
  padding: "0 8px",
  boxSizing: "border-box",
};

const lookupOverlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(15, 23, 42, 0.45)",
  display: "grid",
  placeItems: "center",
  zIndex: 150,
};

const lookupModalStyle: React.CSSProperties = {
  width: "520px",
  maxWidth: "calc(100vw - 24px)",
  maxHeight: "80vh",
  overflow: "auto",
  backgroundColor: "#ffffff",
  borderRadius: "10px",
  border: "1px solid #d5e2ee",
  padding: "14px",
};

export default function CreateLease() {
  const navigate = useNavigate();

  const [isInvoiceGenerated, setIsInvoiceGenerated] = useState(false);
  const [isInvoicePreviewOpen, setIsInvoicePreviewOpen] = useState(false);

  const [units, setUnits] = useState<UnitItem[]>([]);
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [unitSearch, setUnitSearch] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [showUnitLookup, setShowUnitLookup] = useState(false);
  const [showCustomerLookup, setShowCustomerLookup] = useState(false);
  const [lookupLoading, setLookupLoading] = useState(false);

  const [form, setForm] = useState<LeaseFormData>({
    leaseId: `LEASE-${Date.now()}`,
    leaseForUnitId: "",
    customerId: "",
    leasedTo: "",
    leasePrice: "",
    leasePeriodCount: "",
    leasePeriodUnit: "Select an option",
    leaseStartDate: "",
    leaseEndDate: "",
    spaceTncStatus: "Accepted",
    privacyAuthStatus: "Pending",
    pliStatus: "Received",
    pliValidAmount: "e.g., $10,000",
    pliValidUntil: "",
    leaseInvoicePeriod: "Select an option",
    invoiceStatus: "Preview Invoice",
    advancePaymentReceived: "No",
    paymentStatus: "Pending",
  });

  const updateField = <K extends keyof LeaseFormData>(
    key: K,
    value: LeaseFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const fetchLookupData = async () => {
      try {
        setLookupLoading(true);

        const [unitRes, customerRes] = await Promise.all([
          api.get("/units/available"),
          api.get("/customers"),
        ]);

        const unitsArray =
          unitRes.data?.data?.units ||
          unitRes.data?.units ||
          unitRes.data?.data ||
          [];

        const customersArray =
          customerRes.data?.data?.customers ||
          customerRes.data?.customers ||
          customerRes.data?.data ||
          [];

        console.log("AVAILABLE UNITS:", unitsArray);
  setUnits(
  unitsArray.map((unit: any) => ({
    id: String(unit.id),
    name:
      unit.unit_number ||
      unit.unit_name ||
      unit.name ||
      unit.number ||
      `Unit ${unit.id}`,
    spaceName: unit.floor?.space?.name || "Unknown Space",
    spaceId: String(unit.floor?.space?.id || ""),
    price: String(
      unit.price ||
        unit.rent ||
        unit.monthly_rent ||
        unit.daily_rate ||
        ""
    ),
  }))
);

        setCustomers(
          customersArray.map((customer: any) => ({
            id: String(customer.id),
            name:
              customer.name ||
              customer.full_name ||
              customer.customer_name ||
              "Unnamed Customer",
            email: customer.email || "",
            phone: customer.phone || customer.mobile || "",
          }))
        );
      } catch (error) {
        console.error("Failed to fetch lookup data:", error);
        toast.error("Failed to load units or customers");
      } finally {
        setLookupLoading(false);
      }
    };

    fetchLookupData();
  }, []);

  const filteredUnits = useMemo(() => {
    const query = unitSearch.toLowerCase();

    return units.filter(
      (unit) =>
        unit.id.toLowerCase().includes(query) ||
        unit.name.toLowerCase().includes(query) ||
        unit.spaceName.toLowerCase().includes(query)
    );
  }, [units, unitSearch]);

  const filteredCustomers = useMemo(() => {
    const query = customerSearch.toLowerCase();

    return customers.filter(
      (customer) =>
        customer.id.toLowerCase().includes(query) ||
        customer.name.toLowerCase().includes(query) ||
        (customer.email || "").toLowerCase().includes(query) ||
        (customer.phone || "").toLowerCase().includes(query)
    );
  }, [customers, customerSearch]);

  const handleSelectUnit = (unit: UnitItem) => {
  updateField("leaseForUnitId", unit.id);

  // store spaceId temporarily
  window.selectedSpaceId = unit.spaceId;

  if (unit.price) {
    updateField("leasePrice", unit.price);
  }

  setShowUnitLookup(false);
};

  const handleSelectCustomer = (customer: CustomerItem) => {
    updateField("customerId", customer.id);
    updateField("leasedTo", customer.name);
    setShowCustomerLookup(false);
  };

  const handleConfirmLease = async () => {
    if (!form.leaseForUnitId) {
      toast.error("Please select a unit");
      return;
    }

    if (!form.customerId && !form.leasedTo) {
      toast.error("Please select a customer");
      return;
    }

    try {
  await api.post("/leases", {
    space_id: window.selectedSpaceId || "",
    lease_id: form.leaseId,
    unit_id: form.leaseForUnitId,
    customer_id: form.customerId,
    customer_name: form.leasedTo,
    monthly_rent: Number(form.leasePrice || 0),
    lease_period_count: form.leasePeriodCount,
    lease_period_unit: form.leasePeriodUnit,
    start_date: form.leaseStartDate,
    end_date: form.leaseEndDate,
    space_tnc_status: form.spaceTncStatus,
    privacy_auth_status: form.privacyAuthStatus,
    pli_status: form.pliStatus,
    pli_valid_amount: form.pliValidAmount,
    pli_valid_until: form.pliValidUntil,
    lease_invoice_period: form.leaseInvoicePeriod,
    invoice_status: form.invoiceStatus,
    advance_payment_received: form.advancePaymentReceived,
    payment_status: form.paymentStatus,
    status: "pending",
  });

  toast.success("Lease created successfully");
  navigate("/manage/leases");
} catch (error) {
  console.error("Lease creation failed:", error);
  toast.error("Failed to create lease");
}
  };

  const handleGenerateInvoice = () => {
    setIsInvoiceGenerated(true);
    updateField("invoiceStatus", "Invoice generated");
    toast.success("Invoice generated");
  };

  return (
    <div
      style={{
        padding: "12px 10px 20px",
        backgroundColor: "#eef2f6",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: "1060px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "8px",
          }}
        >
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              border: "1px solid #d0dae5",
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              color: "#203249",
              fontSize: "11px",
              height: "28px",
              padding: "0 10px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
            }}
          >
            <ArrowLeft size={13} />
            Back
          </button>

          <button
            type="button"
            style={{
              border: "1px solid #d0dae5",
              backgroundColor: "#1e2f46",
              borderRadius: "8px",
              color: "#ffffff",
              fontSize: "11px",
              height: "28px",
              padding: "0 10px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
            }}
          >
            All Spaces <ChevronDown size={13} />
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr)",
            gap: "10px",
            alignItems: "start",
          }}
        >
          <div style={{ display: "grid", gap: "8px", paddingRight: "250px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "2px",
              }}
            >
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "10px",
                  backgroundColor: "#1fc8bf",
                  display: "grid",
                  placeItems: "center",
                  boxShadow: "0 6px 10px rgba(20, 216, 204, 0.2)",
                }}
              >
                <FileText size={15} color="#ffffff" />
              </div>

              <div>
                <div
                  style={{
                    fontSize: "20px",
                    color: "var(--spacespot-navy-primary)",
                    fontWeight: 700,
                    lineHeight: 1.1,
                  }}
                >
                  Create Lease
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--spacespot-gray-500)",
                    marginTop: "2px",
                  }}
                >
                  Set up a new lease agreement
                </div>
              </div>
            </div>

            <div style={leaseDetailsCard}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "9px",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "6px",
                    backgroundColor: "#dff9f7",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <Calendar size={10} color="var(--spacespot-cyan-primary)" />
                </div>

                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--spacespot-navy-primary)",
                  }}
                >
                  Lease Details
                </span>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px 12px",
                }}
              >
                <div>
                  <label style={labelStyle}>Lease ID *</label>
                  <input
                    style={inputStyle}
                    value={form.leaseId}
                    onChange={(e) => updateField("leaseId", e.target.value)}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Lease For Unit *</label>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      gap: "6px",
                    }}
                  >
                    <input
                      style={inputStyle}
                      value={form.leaseForUnitId}
                      onChange={(e) =>
                        updateField("leaseForUnitId", e.target.value as string)
                      }
                      placeholder="Select unit"
                    />

                    <button
                      type="button"
                      onClick={() => setShowUnitLookup(true)}
                      style={{
                        height: "30px",
                        border: "none",
                        borderRadius: "4px",
                        backgroundColor: "#6b7788",
                        color: "#ffffff",
                        fontSize: "10px",
                        padding: "0 12px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        cursor: "pointer",
                      }}
                    >
                      <Search size={11} /> Lookup
                    </button>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Leased To Customer *</label>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      gap: "6px",
                    }}
                  >
                    <input
                      style={inputStyle}
                      value={form.leasedTo}
                      onChange={(e) => updateField("leasedTo", e.target.value)}
                      placeholder="Select customer"
                    />

                    <button
                      type="button"
                      onClick={() => setShowCustomerLookup(true)}
                      style={{
                        height: "30px",
                        border: "none",
                        borderRadius: "4px",
                        backgroundColor: "#6b7788",
                        color: "#ffffff",
                        fontSize: "10px",
                        padding: "0 12px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        cursor: "pointer",
                      }}
                    >
                      <Search size={11} /> Lookup
                    </button>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>
                    Lease Price{" "}
                    <span style={{ color: "var(--spacespot-gray-500)" }}>
                      (Auto-populated or overwrite)
                    </span>
                  </label>
                  <input
                    style={inputStyle}
                    value={form.leasePrice}
                    onChange={(e) => updateField("leasePrice", e.target.value)}
                    placeholder="e.g., $1000 per day"
                  />
                </div>

                <div>
                  <label style={labelStyle}>Lease Period</label>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "6px",
                    }}
                  >
                    <input
                      style={inputStyle}
                      value={form.leasePeriodCount}
                      onChange={(e) =>
                        updateField("leasePeriodUnit", e.target.value as string)
                      }
                      placeholder="Number"
                    />

                    <select
                      style={inputStyle}
                      value={form.leasePeriodUnit}
                      onChange={(e) =>
                        updateField("leasePeriodUnit", e.target.value)
                      }
                    >
                      <option>Select an option</option>
                      <option>Month</option>
                      <option>Year</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Lease Start Date</label>
                  <input
                    type="date"
                    style={inputStyle}
                    value={form.leaseStartDate}
                    onChange={(e) =>
                      updateField("leaseStartDate", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label style={labelStyle}>Lease End Date</label>
                  <input
                    type="date"
                    style={inputStyle}
                    value={form.leaseEndDate}
                    onChange={(e) =>
                      updateField("leaseEndDate", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            <div style={sectionCard}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "5px",
                    backgroundColor: "#dff9f7",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <FileCheck size={9} color="var(--spacespot-cyan-primary)" />
                </div>

                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    color: "var(--spacespot-navy-primary)",
                  }}
                >
                  Terms & Conditions Documents
                </span>
              </div>

              <div style={{ display: "grid", gap: "9px" }}>
                <div>
                  <label
                    style={{ ...labelStyle, fontSize: "8px", marginBottom: "4px" }}
                  >
                    Space T&C's Guidelines
                  </label>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "6px",
                      backgroundColor: "#f2f4f7",
                      borderRadius: "999px",
                      padding: "2px",
                    }}
                  >
                    {["Accepted", "Pending"].map((status) => {
                      const active = form.spaceTncStatus === status;

                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() =>
                            updateField(
                              "spaceTncStatus",
                              status as "Accepted" | "Pending"
                            )
                          }
                          style={{
                            border: "none",
                            borderRadius: "999px",
                            height: "16px",
                            fontSize: "7px",
                            cursor: "pointer",
                            backgroundColor: active
                              ? "var(--spacespot-success)"
                              : "transparent",
                            color: active
                              ? "#ffffff"
                              : "var(--spacespot-gray-400)",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "3px",
                          }}
                        >
                          {!active && <Clock3 size={7} />} {status}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label
                    style={{ ...labelStyle, fontSize: "8px", marginBottom: "4px" }}
                  >
                    Privacy & Authorization
                  </label>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "6px",
                      backgroundColor: "#f2f4f7",
                      borderRadius: "999px",
                      padding: "2px",
                    }}
                  >
                    {["Received", "Pending"].map((status) => {
                      const active = form.privacyAuthStatus === status;

                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() =>
                            updateField(
                              "privacyAuthStatus",
                              status as "Received" | "Pending"
                            )
                          }
                          style={{
                            border: "none",
                            borderRadius: "999px",
                            height: "16px",
                            fontSize: "7px",
                            cursor: "pointer",
                            backgroundColor: active
                              ? status === "Pending"
                                ? "var(--spacespot-warning)"
                                : "#9ca3af"
                              : "transparent",
                            color: active
                              ? "#ffffff"
                              : "var(--spacespot-gray-400)",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "3px",
                          }}
                        >
                          {!active && <Clock3 size={7} />} {status}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div style={sectionCard}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "5px",
                    backgroundColor: "#dff9f7",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <CreditCard size={9} color="var(--spacespot-cyan-primary)" />
                </div>

                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    color: "var(--spacespot-navy-primary)",
                  }}
                >
                  Payment
                </span>
              </div>

              <div style={{ display: "grid", gap: "9px" }}>
                <div>
                  <label
                    style={{ ...labelStyle, fontSize: "8px", marginBottom: "4px" }}
                  >
                    PLI
                  </label>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "6px",
                      backgroundColor: "#f2f4f7",
                      borderRadius: "999px",
                      padding: "2px",
                    }}
                  >
                    {["Received", "Pending"].map((status) => {
                      const active = form.pliStatus === status;

                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() => {
                            updateField(
                              "pliStatus",
                              status as "Received" | "Pending"
                            );
                            if (status === "Received") {
                              updateField("advancePaymentReceived", "No");
                              updateField("paymentStatus", "Pending");
                            }
                          }}
                          style={{
                            border: "none",
                            borderRadius: "999px",
                            height: "16px",
                            fontSize: "7px",
                            cursor: "pointer",
                            backgroundColor: active
                              ? status === "Received"
                                ? "var(--spacespot-success)"
                                : "var(--spacespot-warning)"
                              : "transparent",
                            color: active
                              ? "#ffffff"
                              : "var(--spacespot-gray-400)",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "3px",
                          }}
                        >
                          {!active && <Clock3 size={7} />} {status}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {form.pliStatus === "Received" && (
                  <div
                    style={{
                      border: "1px solid #14D8CC",
                      borderRadius: "6px",
                      padding: "8px",
                      backgroundColor: "#d9edf0",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "8px",
                        fontWeight: 600,
                        color: "var(--spacespot-navy-primary)",
                        marginBottom: "6px",
                      }}
                    >
                      PLI Valid
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "6px",
                      }}
                    >
                      <input
                        style={{ ...inputStyle, height: "24px", fontSize: "8px" }}
                        value={form.pliValidAmount}
                        onChange={(e) =>
                          updateField("pliValidAmount", e.target.value)
                        }
                        placeholder="e.g., $10,000"
                      />

                      <input
                        type="date"
                        style={{ ...inputStyle, height: "24px", fontSize: "8px" }}
                        value={form.pliValidUntil}
                        onChange={(e) =>
                          updateField("pliValidUntil", e.target.value)
                        }
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label
                    style={{ ...labelStyle, fontSize: "8px", marginBottom: "4px" }}
                  >
                    Lease Invoice Period
                  </label>

                  <select
                    style={{ ...inputStyle, height: "26px", fontSize: "8px" }}
                    value={form.leaseInvoicePeriod}
                    onChange={(e) =>
                      updateField("leaseInvoicePeriod", e.target.value as string)
                    }
                  >
                    <option>Select an option</option>
                    <option>Monthly</option>
                    <option>Quarterly</option>
                    <option>Yearly</option>
                  </select>
                </div>

                <div>
                  <label
                    style={{ ...labelStyle, fontSize: "8px", marginBottom: "4px" }}
                  >
                    Invoice
                  </label>

                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    <button
                      type="button"
                      onClick={handleGenerateInvoice}
                      style={{
                        border: "none",
                        borderRadius: "6px",
                        height: "26px",
                        minWidth: "120px",
                        padding: "0 12px",
                        fontSize: "8px",
                        cursor: "pointer",
                        backgroundColor: "#6b7280",
                        color: "#ffffff",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        fontWeight: 600,
                      }}
                    >
                      <CheckCircle2 size={9} /> Generate Invoice{" "}
                      <FileText size={9} />
                    </button>

                    {isInvoiceGenerated && (
                      <button
                        type="button"
                        onClick={() => {
                          updateField("invoiceStatus", "Preview Invoice");
                          setIsInvoicePreviewOpen(true);
                        }}
                        style={{
                          border: "none",
                          borderRadius: "6px",
                          height: "26px",
                          minWidth: "105px",
                          padding: "0 12px",
                          fontSize: "8px",
                          cursor: "pointer",
                          backgroundColor: "#16c8bd",
                          color: "#ffffff",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          fontWeight: 600,
                        }}
                      >
                        <FileText size={9} /> Preview Invoice
                      </button>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: "#f3f5f8",
                    borderRadius: "6px",
                    padding: "8px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "8px",
                      color: "var(--spacespot-navy-primary)",
                      marginBottom: "5px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <Bell size={8} color="var(--spacespot-cyan-primary)" />
                    Setup Email Reminder to Customer
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gap: "2px",
                      fontSize: "7px",
                      color: "var(--spacespot-gray-500)",
                    }}
                  >
                    <span>A week before the payment date</span>
                    <span>3 days before the payment date</span>
                    <span>A day before the payment date</span>
                  </div>
                </div>

                <div>
                  <label
                    style={{ ...labelStyle, fontSize: "8px", marginBottom: "4px" }}
                  >
                    Advance Payment Received
                  </label>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "6px",
                      backgroundColor: "#f2f4f7",
                      borderRadius: "999px",
                      padding: "2px",
                    }}
                  >
                    {["Yes", "No"].map((status) => {
                      const active = form.advancePaymentReceived === status;

                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() =>
                            updateField(
                              "advancePaymentReceived",
                              status as "Yes" | "No"
                            )
                          }
                          style={{
                            border: "none",
                            borderRadius: "999px",
                            height: "16px",
                            fontSize: "7px",
                            cursor: "pointer",
                            backgroundColor: active
                              ? status === "Yes"
                                ? "var(--spacespot-success)"
                                : "var(--spacespot-warning)"
                              : "transparent",
                            color: active
                              ? "#ffffff"
                              : "var(--spacespot-gray-400)",
                          }}
                        >
                          {status}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label
                    style={{ ...labelStyle, fontSize: "8px", marginBottom: "4px" }}
                  >
                    Payment
                  </label>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "6px",
                      backgroundColor: "#f2f4f7",
                      borderRadius: "999px",
                      padding: "2px",
                    }}
                  >
                    {["Received", "Pending"].map((status) => {
                      const active = form.paymentStatus === status;

                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() =>
                            updateField(
                              "paymentStatus",
                              status as "Received" | "Pending"
                            )
                          }
                          style={{
                            border: "none",
                            borderRadius: "999px",
                            height: "16px",
                            fontSize: "7px",
                            cursor: "pointer",
                            backgroundColor: active
                              ? status === "Received"
                                ? "#9ca3af"
                                : "var(--spacespot-warning)"
                              : "transparent",
                            color: active
                              ? "#ffffff"
                              : "var(--spacespot-gray-400)",
                          }}
                        >
                          {status}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ ...sectionCard, borderColor: "#f4c978" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "9px",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "6px",
                    backgroundColor: "#fff7e8",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <Info size={10} color="var(--spacespot-warning)" />
                </div>

                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--spacespot-navy-primary)",
                  }}
                >
                  Administration Actions
                </span>
              </div>

              <button
                type="button"
                style={{
                  width: "100%",
                  border: "none",
                  borderRadius: "4px",
                  backgroundColor: "#6b7280",
                  color: "#ffffff",
                  fontSize: "9px",
                  fontWeight: 600,
                  height: "24px",
                  cursor: "pointer",
                  marginBottom: "8px",
                }}
              >
                Send T&C's to Customer
              </button>

              <div
                style={{
                  fontSize: "8px",
                  color: "#8a99aa",
                  lineHeight: 1.4,
                  backgroundColor: "var(--spacespot-gray-50)",
                  borderRadius: "6px",
                  padding: "8px",
                }}
              >
                Pending Leases to Approve
                <br />
                This lease will be sent to Administration for approval.
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => navigate("/manage/leases")}
                style={{
                  border: "1px solid #cdd7e3",
                  backgroundColor: "#f8fafd",
                  borderRadius: "6px",
                  color: "#4d5f75",
                  fontSize: "10px",
                  height: "26px",
                  padding: "0 12px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>

          <aside
            style={{
              position: "fixed",
              top: "96px",
              right: "32px",
              width: "230px",
              zIndex: 20,
              display: "grid",
              gap: "8px",
            }}
          >
            <div style={sectionCard}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "6px",
                    backgroundColor: "#dff9f7",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <FileText size={9} color="var(--spacespot-cyan-primary)" />
                </div>

                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    color: "var(--spacespot-navy-primary)",
                  }}
                >
                  Lease Summary
                </span>
              </div>

              <div
                style={{
                  backgroundColor: "#d9edf0",
                  borderRadius: "6px",
                  padding: "8px",
                  marginBottom: "8px",
                }}
              >
                <div style={{ fontSize: "7px", color: "var(--spacespot-gray-500)" }}>
                  Lease ID
                </div>
                <div
                  style={{
                    fontSize: "9px",
                    color: "var(--spacespot-navy-primary)",
                    fontWeight: 700,
                  }}
                >
                  {form.leaseId}
                </div>
              </div>

              <button
                type="button"
                onClick={handleConfirmLease}
                style={{
                  width: "100%",
                  border: "none",
                  borderRadius: "6px",
                  backgroundColor: "var(--spacespot-navy-primary)",
                  color: "#ffffff",
                  fontSize: "11px",
                  height: "34px",
                  cursor: "pointer",
                  fontWeight: 600,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                <Calendar size={12} /> Confirm Lease
              </button>
            </div>

            <div style={{ ...sectionCard, padding: "8px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  marginBottom: "4px",
                }}
              >
                <Info size={9} color="var(--spacespot-cyan-primary)" />
                <span
                  style={{
                    fontSize: "8px",
                    fontWeight: 600,
                    color: "var(--spacespot-navy-primary)",
                  }}
                >
                  Required Fields
                </span>
              </div>

              <div style={{ fontSize: "7px", color: "#8a99aa", lineHeight: 1.4 }}>
                Lease ID, Unit ID, and Customer are required to create a lease.
              </div>
            </div>
          </aside>

          {showUnitLookup && (
            <div style={lookupOverlayStyle}>
              <div style={lookupModalStyle}>
                <h3 style={{ margin: "0 0 10px", fontSize: "16px" }}>
                  Select Unit
                </h3>

                <input
                  style={{ ...inputStyle, marginBottom: "10px" }}
                  placeholder="Search unit or space..."
                  value={unitSearch}
                  onChange={(e) => setUnitSearch(e.target.value)}
                />

                {lookupLoading && <div>Loading units...</div>}

                {!lookupLoading &&
                  filteredUnits.map((unit) => (
                    <button
                      key={unit.id}
                      type="button"
                      onClick={() => handleSelectUnit(unit)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "10px",
                        marginBottom: "6px",
                        border: "1px solid #d5e2ee",
                        borderRadius: "8px",
                        backgroundColor: "#ffffff",
                        cursor: "pointer",
                      }}
                    >
                      <strong>{unit.name}</strong>
                    <div style={{ fontSize: "11px", color: "#66788d" }}>
                      Space: {unit.spaceName}
                    </div>
                    <div style={{ fontSize: "11px", color: "#66788d" }}>
                      Unit ID: {unit.id}
                    </div>
                      {unit.price && (
                        <div style={{ fontSize: "11px", color: "#66788d" }}>
                          Price: {unit.price}
                        </div>
                      )}
                    </button>
                  ))}

                <button
                  type="button"
                  onClick={() => setShowUnitLookup(false)}
                  style={{
                    marginTop: "8px",
                    height: "30px",
                    padding: "0 12px",
                    border: "none",
                    borderRadius: "6px",
                    backgroundColor: "#6b7280",
                    color: "#ffffff",
                    cursor: "pointer",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {showCustomerLookup && (
            <div style={lookupOverlayStyle}>
              <div style={lookupModalStyle}>
                <h3 style={{ margin: "0 0 10px", fontSize: "16px" }}>
                  Select Customer
                </h3>

                <input
                  style={{ ...inputStyle, marginBottom: "10px" }}
                  placeholder="Search customer..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                />

                {lookupLoading && <div>Loading customers...</div>}

                {!lookupLoading &&
                  filteredCustomers.map((customer) => (
                    <button
                      key={customer.id}
                      type="button"
                      onClick={() => handleSelectCustomer(customer)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "10px",
                        marginBottom: "6px",
                        border: "1px solid #d5e2ee",
                        borderRadius: "8px",
                        backgroundColor: "#ffffff",
                        cursor: "pointer",
                      }}
                    >
                      <strong>{customer.name}</strong>
                      <div style={{ fontSize: "11px", color: "#66788d" }}>
                        ID: {customer.id}
                      </div>
                      {customer.email && (
                        <div style={{ fontSize: "11px", color: "#66788d" }}>
                          Email: {customer.email}
                        </div>
                      )}
                    </button>
                  ))}

                <button
                  type="button"
                  onClick={() => setShowCustomerLookup(false)}
                  style={{
                    marginTop: "8px",
                    height: "30px",
                    padding: "0 12px",
                    border: "none",
                    borderRadius: "6px",
                    backgroundColor: "#6b7280",
                    color: "#ffffff",
                    cursor: "pointer",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {isInvoicePreviewOpen && (
            <div style={lookupOverlayStyle}>
              <div style={lookupModalStyle}>
                <h3>Invoice Preview</h3>
                <p>Invoice #: {form.leaseId}</p>
                <p>Customer: {form.leasedTo || "N/A"}</p>
                <p>Unit: {form.leaseForUnitId || "N/A"}</p>
                <p>Amount: {form.leasePrice || "N/A"}</p>

                <button
                  type="button"
                  onClick={() => setIsInvoicePreviewOpen(false)}
                  style={{
                    height: "30px",
                    padding: "0 12px",
                    border: "none",
                    borderRadius: "6px",
                    backgroundColor: "#6b7280",
                    color: "#ffffff",
                    cursor: "pointer",
                  }}
                >
                  Close Preview
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}