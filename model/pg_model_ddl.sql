-- SpaceSpot Commercial Lease Management System
-- PostgreSQL Schema with BIGSERIAL Primary Keys
-- Generated from UI Component Analysis

-- ============================================================
-- ENUM TYPES FOR STATUS FIELDS
-- ============================================================
CREATE TYPE customer_status AS ENUM ('active', 'inactive', 'suspended', 'archived');
CREATE TYPE space_status AS ENUM ('draft', 'active', 'maintenance', 'inactive', 'archived');
CREATE TYPE unit_status AS ENUM ('available', 'occupied', 'maintenance', 'reserved', 'archived');
CREATE TYPE lease_status AS ENUM ('draft', 'pending', 'active', 'completed', 'terminated', 'cancelled');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'checked_in', 'checked_out');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded', 'partial');
CREATE TYPE document_status AS ENUM ('draft', 'pending_review', 'approved', 'rejected', 'active', 'archived');
CREATE TYPE floor_status AS ENUM ('active', 'maintenance', 'archived');

-- ============================================================
-- SEQUENCE GENERATORS
-- ============================================================
CREATE SEQUENCE seq_customers START 1 INCREMENT 1;
CREATE SEQUENCE seq_spaces START 1 INCREMENT 1;
CREATE SEQUENCE seq_floors START 1 INCREMENT 1;
CREATE SEQUENCE seq_units START 1 INCREMENT 1;
CREATE SEQUENCE seq_pricing START 1 INCREMENT 1;
CREATE SEQUENCE seq_leases START 1 INCREMENT 1;
CREATE SEQUENCE seq_bookings START 1 INCREMENT 1;
CREATE SEQUENCE seq_payments START 1 INCREMENT 1;
CREATE SEQUENCE seq_documents START 1 INCREMENT 1;
CREATE SEQUENCE seq_notifications START 1 INCREMENT 1;
CREATE SEQUENCE seq_users START 1 INCREMENT 1;

-- ============================================================
-- USERS TABLE
-- ============================================================
CREATE TABLE users (
    id BIGINT NOT NULL PRIMARY KEY DEFAULT NEXTVAL('seq_users'),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) NOT NULL DEFAULT 'customer',
    is_active BOOLEAN NOT NULL DEFAULT true,
    email_verified BOOLEAN NOT NULL DEFAULT false,
    phone VARCHAR(50),
    avatar_url VARCHAR(500),
    last_login_at TIMESTAMPTZ,
    failed_login_attempts INTEGER NOT NULL DEFAULT 0,
    locked_until TIMESTAMPTZ,
    created_by BIGINT,
    updated_by BIGINT,
    deleted_by BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    
    -- Constraints
    CONSTRAINT valid_role CHECK (role IN ('admin', 'manager', 'customer')),
    CONSTRAINT valid_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Comments
COMMENT ON TABLE users IS 'System users including admins, managers, and customers';
COMMENT ON COLUMN users.id IS 'Primary key';
COMMENT ON COLUMN users.email IS 'Unique email address for login';
COMMENT ON COLUMN users.password_hash IS 'BCrypted password hash';
COMMENT ON COLUMN users.role IS 'User role: admin, manager, or customer';
COMMENT ON COLUMN users.is_active IS 'Whether user account is active';
COMMENT ON COLUMN users.email_verified IS 'Whether email has been verified';
COMMENT ON COLUMN users.last_login_at IS 'Timestamp of last successful login';
COMMENT ON COLUMN users.failed_login_attempts IS 'Count of failed login attempts';
COMMENT ON COLUMN users.locked_until IS 'Account lock expiration timestamp';

-- ============================================================
-- CUSTOMERS TABLE
-- ============================================================
CREATE TABLE customers (
    id BIGINT PRIMARY KEY DEFAULT nextval('seq_customers'),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    company_name VARCHAR(255),
    tax_id VARCHAR(100),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    contact_person VARCHAR(255),
    preferences JSONB,
    status customer_status DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

-- ============================================================
-- SPACES (VENUES/PROPERTIES) TABLE
-- ============================================================
CREATE TABLE spaces (
    id BIGINT PRIMARY KEY DEFAULT nextval('seq_spaces'),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    property_type VARCHAR(100),
    capacity INTEGER,
    amenities JSONB,
    status space_status DEFAULT 'draft',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

-- ============================================================
-- FLOORS TABLE
-- ============================================================
CREATE TABLE floors (
    id BIGINT PRIMARY KEY DEFAULT nextval('seq_floors'),
    space_id BIGINT NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
    floor_number INTEGER NOT NULL,
    name VARCHAR(100),
    status floor_status DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(space_id, floor_number)
);

-- ============================================================
-- UNITS TABLE
-- ============================================================
CREATE TABLE units (
    id BIGINT PRIMARY KEY DEFAULT nextval('seq_units'),
    space_id BIGINT NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
    floor_id BIGINT REFERENCES floors(id) ON DELETE SET NULL,
    unit_number VARCHAR(50) NOT NULL,
    name VARCHAR(255),
    description TEXT,
    size_sqm DECIMAL(10, 2),
    size_sqft DECIMAL(10, 2),
    capacity INTEGER,
    unit_type VARCHAR(100),
    features JSONB,
    status unit_status DEFAULT 'available',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ,
    UNIQUE(space_id, unit_number)
);

-- ============================================================
-- PRICING TABLE
-- ============================================================
CREATE TABLE pricing (
    id BIGINT PRIMARY KEY DEFAULT nextval('seq_pricing'),
    unit_id BIGINT NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    space_id BIGINT NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
    pricing_type VARCHAR(50) NOT NULL, -- 'hourly', 'daily', 'monthly', 'yearly'
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    discount_percentage DECIMAL(5, 2),
    effective_date DATE NOT NULL,
    end_date DATE,
    min_duration INTEGER, -- in the unit of pricing_type
    max_duration INTEGER,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- LEASES TABLE
-- ============================================================
CREATE TABLE leases (
    id BIGINT PRIMARY KEY DEFAULT nextval('seq_leases'),
    customer_id BIGINT NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    unit_id BIGINT NOT NULL REFERENCES units(id) ON DELETE RESTRICT,
    lease_number VARCHAR(50) UNIQUE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status lease_status DEFAULT 'draft',
    rent_amount DECIMAL(12, 2) NOT NULL,
    rent_frequency VARCHAR(20) DEFAULT 'monthly', -- 'monthly', 'yearly'
    security_deposit DECIMAL(12, 2),
    terms JSONB, -- Lease terms and conditions
    renewal_options JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    UNIQUE(unit_id, start_date, end_date)
);

-- ============================================================
-- BOOKINGS TABLE
-- ============================================================
CREATE TABLE bookings (
    id BIGINT PRIMARY KEY DEFAULT nextval('seq_bookings'),
    customer_id BIGINT NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    space_id BIGINT REFERENCES spaces(id) ON DELETE CASCADE,
    unit_id BIGINT REFERENCES units(id) ON DELETE CASCADE,
    booking_reference VARCHAR(50) UNIQUE NOT NULL,
    start_datetime TIMESTAMPTZ NOT NULL,
    end_datetime TIMESTAMPTZ NOT NULL,
    status booking_status DEFAULT 'pending',
    purpose TEXT,
    guests INTEGER,
    special_requests TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ
);

-- ============================================================
-- PAYMENTS TABLE
-- ============================================================
CREATE TABLE payments (
    id BIGINT PRIMARY KEY DEFAULT nextval('seq_payments'),
    customer_id BIGINT NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    lease_id BIGINT REFERENCES leases(id) ON DELETE SET NULL,
    booking_id BIGINT REFERENCES bookings(id) ON DELETE SET NULL,
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method VARCHAR(50), -- 'card', 'bank_transfer', 'cash', 'check'
    payment_gateway VARCHAR(100),
    transaction_reference VARCHAR(255),
    status payment_status DEFAULT 'pending',
    due_date DATE,
    paid_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- DOCUMENTS TABLE
-- ============================================================
CREATE TABLE documents (
    id BIGINT PRIMARY KEY DEFAULT nextval('seq_documents'),
    document_type VARCHAR(100) NOT NULL, -- 'lease', 'contract', 'invoice', 'policy'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT, -- Optional text content
    file_url VARCHAR(500), -- URL to stored file
    file_type VARCHAR(50),
    file_size BIGINT, -- in bytes
    version INTEGER DEFAULT 1,
    status document_status DEFAULT 'draft',
    associated_type VARCHAR(50) NOT NULL, -- 'lease', 'space', 'unit', 'customer'
    associated_id BIGINT NOT NULL,
    created_by BIGINT REFERENCES customers(id),
    approved_by BIGINT,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    archived_at TIMESTAMPTZ
);

-- ============================================================
-- NOTIFICATIONS TABLE
-- ============================================================
CREATE TABLE notifications (
    id BIGINT PRIMARY KEY DEFAULT nextval('seq_notifications'),
    customer_id BIGINT REFERENCES customers(id) ON DELETE CASCADE,
    lease_id BIGINT REFERENCES leases(id) ON DELETE CASCADE,
    booking_id BIGINT REFERENCES bookings(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'lease', 'booking', 'payment', 'system'
    read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    action_url VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- PERFORMANCE INDEXES
-- ============================================================
-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_users_created_by ON users(created_by);
CREATE INDEX idx_users_deleted_at ON users(deleted_at) WHERE deleted_at IS NOT NULL;

-- Customers indexes
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_status ON customers(status);
CREATE INDEX idx_customers_deleted ON customers(deleted_at) WHERE deleted_at IS NOT NULL;

-- Spaces indexes
CREATE INDEX idx_spaces_city_state ON spaces(city, state);
CREATE INDEX idx_spaces_status ON spaces(status);
CREATE INDEX idx_spaces_deleted ON spaces(deleted_at) WHERE deleted_at IS NOT NULL;

-- Units indexes
CREATE INDEX idx_units_space_id ON units(space_id);
CREATE INDEX idx_units_status ON units(status);
CREATE INDEX idx_units_deleted ON units(deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX idx_units_space_status ON units(space_id, status);

-- Floors indexes
CREATE INDEX idx_floors_space_id ON floors(space_id);
CREATE INDEX idx_floors_status ON floors(status);

-- Pricing indexes
CREATE INDEX idx_pricing_unit_id ON pricing(unit_id);
CREATE INDEX idx_pricing_space_id ON pricing(space_id);
CREATE INDEX idx_pricing_dates ON pricing(effective_date, end_date);

-- Leases indexes
CREATE INDEX idx_leases_customer_id ON leases(customer_id);
CREATE INDEX idx_leases_unit_id ON leases(unit_id);
CREATE INDEX idx_leases_status ON leases(status);
CREATE INDEX idx_leases_dates ON leases(start_date, end_date);

-- Bookings indexes
CREATE INDEX idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX idx_bookings_space_id ON bookings(space_id);
CREATE INDEX idx_bookings_unit_id ON bookings(unit_id);
CREATE INDEX idx_bookings_start_datetime ON bookings(start_datetime);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_datetime_range ON bookings(start_datetime, end_datetime);

-- Payments indexes
CREATE INDEX idx_payments_customer_id ON payments(customer_id);
CREATE INDEX idx_payments_lease_id ON payments(lease_id);
CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_due_date ON payments(due_date);

-- Documents indexes
CREATE INDEX idx_documents_associated ON documents(associated_type, associated_id);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_created_at ON documents(created_at);

-- Notifications indexes
CREATE INDEX idx_notifications_customer_id ON notifications(customer_id);
CREATE INDEX idx_notifications_read ON notifications(customer_id, read);
CREATE INDEX idx_notifications_type ON notifications(type);

-- ============================================================
-- TRIGGERS FOR AUTO-UPDATE timestamps
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;$$ language 'plpgsql';

-- Apply triggers to all tables
CREATE TRIGGER trigger_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_spaces_updated_at BEFORE UPDATE ON spaces
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_floors_updated_at BEFORE UPDATE ON floors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_units_updated_at BEFORE UPDATE ON units
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pricing_updated_at BEFORE UPDATE ON pricing
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leases_updated_at BEFORE UPDATE ON leases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- VIEW: ACTIVE ENTITIES (SOFT DELETE FILTERING)
-- ============================================================
CREATE VIEW active_customers AS
SELECT * FROM customers WHERE deleted_at IS NULL;

CREATE VIEW active_spaces AS
SELECT * FROM spaces WHERE deleted_at IS NULL;

CREATE VIEW active_units AS
SELECT * FROM units WHERE deleted_at IS NULL;

CREATE VIEW active_floors AS
SELECT * FROM floors; -- Floors don't have soft delete

CREATE VIEW active_leases AS
SELECT * FROM leases WHERE deleted_at IS NULL;

CREATE VIEW active_bookings AS
SELECT * FROM bookings WHERE cancelled_at IS NULL;

CREATE VIEW active_payments AS
SELECT * FROM payments WHERE deleted_at IS NULL;

CREATE VIEW active_documents AS
SELECT * FROM documents WHERE archived_at IS NULL;

-- Customer lifecycle
customer_status ENUM ('active', 'inactive', 'suspended', 'archived')

-- Space management
space_status ENUM ('draft', 'active', 'maintenance', 'inactive', 'archived')

-- Unit availability
unit_status ENUM ('available', 'occupied', 'maintenance', 'reserved', 'archived')

-- Lease lifecycle
lease_status ENUM ('draft', 'pending', 'active', 'completed', 'terminated', 'cancelled')

-- Booking workflow
booking_status ENUM ('pending', 'confirmed', 'cancelled', 'checked_in', 'checked_out')

-- Payment tracking
payment_status ENUM ('pending', 'completed', 'failed', 'refunded', 'partial')

-- Document workflow
document_status ENUM ('draft', 'pending_review', 'approved', 'rejected', 'active', 'archived')

-- Floor management
floor_status ENUM ('active', 'maintenance', 'archived')

-- ============================================================
-- SAMPLE USAGE QUERIES
-- ============================================================
/*
-- Sample Admin User (Password: admin123 - change in production!)
INSERT INTO users (email, password_hash, role, first_name, last_name, is_active)
VALUES ('admin@spacespot.com', '$2a$10$YourHashedPasswordHere', 'admin', 'Admin', 'User', true);

-- Get all active spaces with their units
SELECT s.id, s.name, s.status, u.id as unit_id, u.unit_number, u.status as unit_status
FROM spaces s
LEFT JOIN units u ON u.space_id = s.id AND u.deleted_at IS NULL
WHERE s.deleted_at IS NULL;

-- Get leases for a specific customer with unit details
SELECT l.*, c.name as customer_name, u.unit_number, f.floor_number, s.name as space_name
FROM leases l
JOIN customers c ON l.customer_id = c.id
JOIN units u ON l.unit_id = u.id
LEFT JOIN floors f ON u.floor_id = f.id
LEFT JOIN spaces s ON u.space_id = s.id
WHERE l.customer_id = 1;

-- Get upcoming bookings
SELECT * FROM bookings
WHERE start_datetime > CURRENT_TIMESTAMP
  AND status IN ('pending', 'confirmed')
ORDER BY start_datetime;

-- Get payments due within 7 days
SELECT * FROM payments
WHERE due_date IS NOT NULL
  AND due_date <= CURRENT_DATE + INTERVAL '7 days'
  AND status IN ('pending', 'partial')
ORDER BY due_date;
*/