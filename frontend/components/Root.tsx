  import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
  import { useEffect, useRef, useState } from 'react';
  import Logo from './Logo';
  import api from "../src/api/axios";
  import { HomeIcon, PlusIcon, FolderIcon, ChartIcon, SettingsIcon } from './icons';
  import { Sparkles, HelpCircle, User, Building2, Box, FileText, DollarSign, Clipboard, ChevronLeft, ChevronRight, ChevronDown, Settings, Bell, LogOut, Search, Check, Moon, Sun } from 'lucide-react';
  

  const USER_PREFERENCES_STORAGE_KEY = 'spacespot-user-preferences';

  function getStoredPreferences() {
    if (typeof window === 'undefined') {
      return null;
    }

    const rawPreferences = window.localStorage.getItem(USER_PREFERENCES_STORAGE_KEY);
    if (!rawPreferences) {
      return null;
    }

    try {
      return JSON.parse(rawPreferences);
    } catch {
      return null;
    }
  }

  export default function Root() {
    const location = useLocation();
    const navigate = useNavigate();
    const storedUser = JSON.parse(
    localStorage.getItem('user') ||
    localStorage.getItem('spacespot_user') ||
    localStorage.getItem('sbp_user') ||
    '{}'
  );

  const userName =
    `${storedUser.first_name || storedUser.firstName || ''} ${storedUser.last_name || storedUser.lastName || ''}`.trim() ||
    storedUser.name ||
    'User';

  const userEmail = storedUser.email || '';
    const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
    const [isManageMenuOpen, setIsManageMenuOpen] = useState(false);
    const [isExpandedSidebar, setIsExpandedSidebar] = useState(false);
    const [isUserPopupOpen, setIsUserPopupOpen] = useState(false);
    const [userPopupView, setUserPopupView] = useState('profile'); // 'profile', 'notifications', or 'preferences'
    const [preferences, setPreferences] = useState(() => {
      const storedPreferences = getStoredPreferences();

      return {
        emailNotifications: storedPreferences?.emailNotifications ?? true,
        pushNotifications: storedPreferences?.pushNotifications ?? true,
        darkMode: storedPreferences?.darkMode ?? false,
        autoSave: storedPreferences?.autoSave ?? true,
        language: storedPreferences?.language ?? 'English',
      };
    });
    
    const [isSpacesDropdownOpen, setIsSpacesDropdownOpen] = useState(false);
    const [selectedSpace, setSelectedSpace] = useState('All Spaces');
    const [spaces, setSpaces] = useState<any[]>([]);
    const createTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const manageTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const userTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const spacesTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    useEffect(() => {
      document.documentElement.dataset.theme = preferences.darkMode ? 'dark' : 'light';
      window.localStorage.setItem(USER_PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
    }, [preferences]);
    useEffect(() => {
  const fetchSpaces = async () => {
    try {
      const response = await api.get("/spaces");

      const spacesArray =
        response.data?.data?.spaces ||
        response.data?.spaces ||
        response.data?.data ||
        [];

      setSpaces(spacesArray);
    } catch (error) {
      console.error("Failed to load live spaces:", error);
      setSpaces([]);
    }
  };

  fetchSpaces();
}, []);

    useEffect(() => {
      if (!isUserPopupOpen) return;
      const handler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsUserPopupOpen(false);
          setUserPopupView('profile');
        }
      };
      document.addEventListener('keydown', handler);
      return () => document.removeEventListener('keydown', handler);
    }, [isUserPopupOpen]);

    const togglePreference = (key: 'emailNotifications' | 'pushNotifications' | 'darkMode' | 'autoSave') => {
      setPreferences((currentPreferences) => ({
        ...currentPreferences,
        [key]: !currentPreferences[key],
      }));
    };

    const renderPreferenceToggle = (
      label: string,
      description: string,
      key: 'emailNotifications' | 'pushNotifications' | 'darkMode' | 'autoSave',
    ) => {
      const isChecked = preferences[key];

      return (
        <button
          type="button"
          role="checkbox"
          aria-checked={isChecked}
          onClick={() => togglePreference(key)}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--spacespot-hover-subtle)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '20px',
            padding: '10px 8px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'transparent',
            transition: 'background-color 0.2s',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <div>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--spacespot-navy-primary)', display: 'block', marginBottom: '4px' }}>
              {label}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--spacespot-gray-500)' }}>
              {description}
            </span>
          </div>
          <div
            aria-hidden={true}
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '8px',
              border: `1.5px solid ${isChecked ? 'var(--spacespot-cyan-primary)' : 'var(--spacespot-border-strong)'}`,
              backgroundColor: isChecked ? 'var(--spacespot-cyan-primary)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'background-color 0.2s, border-color 0.2s',
            }}
          >
            {isChecked ? <Check size={16} color="#111827" strokeWidth={3} /> : null}
          </div>
        </button>
      );
    };

    const renderDarkModeToggle = () => {
      const isDarkMode = preferences.darkMode;

      return (
        <button
          type="button"
          role="switch"
          aria-checked={isDarkMode}
          aria-label="Toggle dark mode"
          onClick={() => togglePreference('darkMode')}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--spacespot-hover-subtle)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '20px',
            padding: '10px 8px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'transparent',
            transition: 'background-color 0.2s',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <div>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--spacespot-navy-primary)', display: 'block', marginBottom: '4px' }}>Dark Mode</span>
            <span style={{ fontSize: '12px', color: 'var(--spacespot-gray-500)' }}>Switch to dark theme</span>
          </div>
          <div
            aria-hidden={true}
            style={{
              width: '52px',
              height: '30px',
              borderRadius: '999px',
              border: `1.5px solid ${isDarkMode ? 'var(--spacespot-cyan-primary)' : 'var(--spacespot-border-strong)'}`,
              backgroundColor: isDarkMode ? 'var(--spacespot-cyan-primary)' : 'var(--spacespot-surface-elevated)',
              display: 'flex',
              alignItems: 'center',
              padding: '3px',
              justifyContent: isDarkMode ? 'flex-end' : 'flex-start',
              flexShrink: 0,
              transition: 'background-color 0.2s, border-color 0.2s, justify-content 0.2s',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                backgroundColor: isDarkMode ? '#111827' : 'var(--spacespot-surface-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s',
              }}
            >
              {isDarkMode ? <Moon size={13} color="var(--spacespot-cyan-primary)" strokeWidth={2.5} /> : <Sun size={13} color="var(--spacespot-text-primary)" strokeWidth={2.5} />}
            </div>
          </div>
        </button>
      );
    };

    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--spacespot-app-background)', color: 'var(--spacespot-text-primary)' }}>
        {/* Top bar full width */}
        <header
          style={{
            zIndex: 1200,
            backgroundColor: 'var(--spacespot-surface-primary)',
            borderBottom: '3px solid var(--spacespot-cyan-primary)',
            padding: '10px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--spacespot-shadow-sm)',
            gap: '20px',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            width: '100%',
            boxSizing: 'border-box',
            height: '100px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '64px' }}>
            <Logo size={98} />
          </div>

          <div style={{ position: 'relative', width: '50%', maxWidth: '620px', minWidth: '420px' }}>
            <input
              type="text"
              placeholder="Search spaces, customers, leases..."
              style={{
                width: '100%',
                borderRadius: '12px',
                border: '1.78px solid var(--spacespot-border-strong)',
                padding: '12px 44px 12px 16px',
                fontSize: '16px',
                outline: 'none',
                color: 'var(--spacespot-text-secondary)',
                backgroundColor: 'var(--spacespot-surface-elevated)',
                boxShadow: 'var(--spacespot-shadow-base)',
                transition: 'box-shadow 0.2s ease',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--spacespot-cyan-primary)';
                e.currentTarget.style.boxShadow = 'var(--spacespot-shadow-base), 0 0 0 2px rgba(20, 216, 204, 0.2)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--spacespot-border-strong)';
                e.currentTarget.style.boxShadow = 'var(--spacespot-shadow-base)';
              }}
            />
            <Search size={18} color="var(--spacespot-text-secondary)" style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
          {/* All Spaces Dropdown */}
          <div
            style={{ position: 'relative' }}
            onMouseEnter={() => { clearTimeout(spacesTimeoutRef.current); setIsSpacesDropdownOpen(true); }}
            onMouseLeave={() => { spacesTimeoutRef.current = setTimeout(() => setIsSpacesDropdownOpen(false), 150); }}
          >
            <button
              onClick={() => setIsSpacesDropdownOpen(!isSpacesDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '10px',
                backgroundColor: isSpacesDropdownOpen ? '#14D8CC' : '#1F2937',
                color: 'white',
                border: 'none',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
                transition: 'background-color 0.2s ease',
              }}
            >
              {selectedSpace}
              <ChevronDown size={16} style={{ transition: 'transform 0.2s', transform: isSpacesDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            </button>
            {isSpacesDropdownOpen && (
              <div
                onMouseEnter={() => clearTimeout(spacesTimeoutRef.current)}
                onMouseLeave={() => { spacesTimeoutRef.current = setTimeout(() => setIsSpacesDropdownOpen(false), 150); }}
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: 0,
                  width: '240px',
                  backgroundColor: 'var(--spacespot-surface-primary)',
                  border: '2px solid #14D8CC',
                  borderRadius: '14px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  zIndex: 1000,
                  overflow: 'hidden',
                }}
              >
                <div style={{ backgroundColor: '#14D8CC', padding: '10px 16px' }}>
                  <span style={{ color: 'white', fontWeight: 600, fontSize: '14px' }}>Select Space</span>
                </div>
                  {[
  { id: "all", name: "All Spaces" },
  ...spaces.map((space) => ({
    id: String(space.id),
    name: space.name || "Unnamed Space",
  })),
].map((space) => (
  <button
    key={space.id}
    onClick={() => {
      setSelectedSpace(space.name);
      setIsSpacesDropdownOpen(false);
    }}
    style={{
      width: '100%',
      textAlign: 'left',
      padding: '10px 16px',
      border: 'none',
      backgroundColor:
        selectedSpace === space.name
          ? 'var(--spacespot-hover-subtle)'
          : 'var(--spacespot-surface-primary)',
      color: 'var(--spacespot-text-primary)',
      fontSize: '14px',
      fontWeight: selectedSpace === space.name ? 600 : 400,
      cursor: 'pointer',
    }}
    onMouseEnter={(e) =>
      e.currentTarget.style.backgroundColor = 'var(--spacespot-hover-subtle)'
    }
    onMouseLeave={(e) =>
      e.currentTarget.style.backgroundColor =
        selectedSpace === space.name
          ? 'var(--spacespot-hover-subtle)'
          : 'var(--spacespot-surface-primary)'
    }
  >
    {space.name}
  </button>
))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '24px', alignItems: 'center', position: 'relative' }}>
            {['AI', 'Help'].map((label, idx) => {
              const icon = label === 'AI' ? <Sparkles size={18} /> : <HelpCircle size={18} />;

              return (
                <button
                  key={label}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--spacespot-surface-elevated)',
                    border: '1.78px solid var(--spacespot-border-strong)',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--spacespot-text-primary)',
                    gap: '2px',
                    padding: '8px 4px',
                  }}
                  title={label}
                >
                  {icon}
                  <span style={{ fontSize: '10px', fontWeight: 700, lineHeight: 1 }}>{label}</span>
                </button>
              );
            })}
            
            {/* User Button with Popup */}
            <div
              onMouseEnter={() => {
                clearTimeout(userTimeoutRef.current);
                setIsUserPopupOpen(true);
              }}
              onMouseLeave={() => {
                userTimeoutRef.current = setTimeout(() => {
                  setIsUserPopupOpen(false);
                  setUserPopupView('profile');
                }, 150);
              }}
              style={{ position: 'relative' }}
            >
              <button
                onClick={() => setIsUserPopupOpen(!isUserPopupOpen)}
                aria-label="Open user menu"
                aria-expanded={isUserPopupOpen}
                aria-haspopup="dialog"
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--spacespot-surface-elevated)',
                  border: '1.78px solid var(--spacespot-border-strong)',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--spacespot-text-primary)',
                  gap: '2px',
                  padding: '8px 4px',
                }}
              >
                <User size={18} aria-hidden={true} />
                <span style={{ fontSize: '10px', fontWeight: 700, lineHeight: 1 }}>User</span>
              </button>
              
              {/* User Popup Menu */}
              {isUserPopupOpen && (
                <div
                  onMouseEnter={() => clearTimeout(userTimeoutRef.current)}
                  onMouseLeave={() => {
                    userTimeoutRef.current = setTimeout(() => {
                      setIsUserPopupOpen(false);
                      setUserPopupView('profile');
                    }, 150);
                  }}
                  role="dialog"
                  aria-label="User menu"
                  aria-modal="true"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '12px',
                    width: '420px',
                    backgroundColor: 'var(--spacespot-surface-primary)',
                    border: '2px solid #14D8CC',
                    borderRadius: '14px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                    zIndex: 1000,
                    overflow: 'hidden',
                    maxHeight: '500px',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {userPopupView === 'profile' ? (
                    <>
                      {/* Profile Section */}
                                              
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '16px',
                            borderBottom: '1px solid rgba(20, 216, 204, 0.2)',
                          }}>
                            <div style={{
                              width: '48px',
                              height: '48px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--spacespot-cyan-primary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}>
                              <User size={24} color="#111827" aria-hidden={true} />
                            </div>

                            <div>
                              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--spacespot-navy-primary)' }}>
                                {userName}
                              </div>
                              <div style={{ fontSize: '12px', color: 'var(--spacespot-gray-500)' }}>
                                {userEmail || 'No email found'}
                              </div>
                            </div>
                          </div>
                      
                      {/* Menu Items */}
                      <div style={{ padding: '8px' }}>
                        {/* Preferences */}
                        <button
                          onClick={() => setUserPopupView('preferences')}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 16px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            color: 'var(--spacespot-navy-primary)',
                            fontSize: '14px',
                            fontWeight: 600,
                            transition: 'background-color 0.2s',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(20, 216, 204, 0.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Settings size={18} color="var(--spacespot-gray-500)" aria-hidden={true} />
                            Preferences
                          </div>
                          <ChevronRight size={18} color="var(--spacespot-gray-500)" aria-hidden={true} />
                        </button>
                        
                        {/* Notifications */}
                        <button
                          onClick={() => setUserPopupView('notifications')}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 16px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            color: 'var(--spacespot-navy-primary)',
                            fontSize: '14px',
                            fontWeight: 600,
                            transition: 'background-color 0.2s',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(20, 216, 204, 0.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Bell size={18} color="var(--spacespot-gray-500)" aria-hidden={true} />
                            Notifications
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div
                              aria-label="2 unread notifications"
                              style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--spacespot-cyan-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px',
                                fontWeight: 700,
                                color: '#111827',
                              }}>
                              2
                            </div>
                            <ChevronRight size={18} color="var(--spacespot-gray-500)" aria-hidden={true} />
                          </div>
                        </button>
                        
                        {/* Log Out */}
                        <button
                          onClick={() => {
                            localStorage.removeItem('authToken');
                            localStorage.removeItem('user');
                            localStorage.removeItem('sbp_token');
                            localStorage.removeItem('sbp_user');
                            localStorage.removeItem('spacespot_user');
                            sessionStorage.clear();

                            setIsUserPopupOpen(false);
                            setUserPopupView('profile');
                            navigate('/login', { replace: true });
                          }}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '12px 16px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            color: 'var(--spacespot-navy-primary)',
                            fontSize: '14px',
                            fontWeight: 600,
                            transition: 'background-color 0.2s',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(20, 216, 204, 0.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <LogOut size={18} color="var(--spacespot-gray-500)" aria-hidden={true} />
                          Log Out
                        </button>
                      </div>
                    </>
                  ) : userPopupView === 'notifications' ? (
                    <>
                      {/* Notifications Header */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px',
                        borderBottom: '1px solid rgba(20, 216, 204, 0.2)',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Bell size={20} color="var(--spacespot-cyan-primary)" aria-hidden={true} />
                          <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--spacespot-navy-primary)' }}>Notifications</span>
                          <div style={{
                            backgroundColor: 'var(--spacespot-cyan-primary)',
                            color: '#111827',
                            fontSize: '12px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '10px',
                          }}>2 New</div>
                        </div>
                        <button
                          aria-label="Close notifications panel"
                          onClick={() => {
                            setIsUserPopupOpen(false);
                            setUserPopupView('profile');
                          }}
                          style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--spacespot-gray-500)',
                            fontSize: '20px',
                            padding: '0',
                          }}
                        >
                          ×
                        </button>
                      </div>
                      
                      {/* Notifications List */}
                      <div style={{
                        overflowY: 'auto',
                        flex: 1,
                        padding: '12px',
                      }}>
                        {[
                          { title: 'Lease Request', from: 'ABC Corporation', time: '2 hours ago', isNew: true },
                          { title: 'Space Inquiry', from: 'Tech Startup Inc.', time: '5 hours ago', isNew: true },
                          { title: 'Document Review', from: 'Retail Store XYZ', time: '1 day ago', isNew: false },
                          { title: 'Meeting Request', from: 'Property Manager', time: '2 days ago', isNew: false },
                        ].map((notif, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                              padding: '12px 16px',
                              borderBottom: '1px solid rgba(20, 216, 204, 0.1)',
                              backgroundColor: notif.isNew ? 'rgba(20, 216, 204, 0.05)' : 'transparent',
                            }}
                          >
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--spacespot-navy-primary)' }}>{notif.title}</span>
                                <div style={{
                                  width: '8px',
                                  height: '8px',
                                  borderRadius: '50%',
                                  backgroundColor: 'var(--spacespot-cyan-primary)',
                                }}></div>
                              </div>
                              <div style={{ fontSize: '12px', color: 'var(--spacespot-gray-500)', marginBottom: '4px' }}>From: {notif.from}</div>
                              <div style={{ fontSize: '12px', color: 'var(--spacespot-gray-500)' }}>{notif.time}</div>
                            </div>
                            <button
                              aria-label={`View ${notif.title} from ${notif.from}`}
                              style={{
                                backgroundColor: 'var(--spacespot-cyan-primary)',
                                color: '#111827',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '6px 12px',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                marginLeft: '12px',
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0DB8A4'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--spacespot-cyan-primary)'}
                            >
                              View
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      {/* View All Link */}
                      <div style={{
                        padding: '12px 16px',
                        textAlign: 'center',
                        borderTop: '1px solid rgba(20, 216, 204, 0.2)',
                      }}>
                        <button
                          style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: 'var(--spacespot-navy-primary)',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            textDecoration: 'underline',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.75'}
                          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                        >
                          View All Notifications
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Preferences Header */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px',
                        borderBottom: '1px solid rgba(20, 216, 204, 0.2)',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Settings size={20} color="var(--spacespot-cyan-primary)" aria-hidden={true} />
                          <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--spacespot-navy-primary)' }}>Preferences</span>
                        </div>
                        <button
                          aria-label="Close preferences panel"
                          onClick={() => {
                            setIsUserPopupOpen(false);
                            setUserPopupView('profile');
                          }}
                          style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--spacespot-gray-500)',
                            fontSize: '20px',
                            padding: '0',
                          }}
                        >
                          ×
                        </button>
                      </div>
                      
                      {/* Preferences Content */}
                      <div style={{
                        overflowY: 'auto',
                        flex: 1,
                        padding: '16px',
                      }}>
                        {renderPreferenceToggle('Email Notifications', 'Receive updates via email', 'emailNotifications')}
                        {renderPreferenceToggle('Push Notifications', 'Get browser notifications', 'pushNotifications')}
                        {renderDarkModeToggle()}
                        {renderPreferenceToggle('Auto-Save', 'Automatically save changes', 'autoSave')}
                        
                        {/* Language */}
                        <div style={{ marginBottom: '20px' }}>
                          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--spacespot-navy-primary)', display: 'block', marginBottom: '8px' }}>Language</span>
                          <select
                            value={preferences.language}
                            onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              border: '1px solid var(--spacespot-border-subtle)',
                              borderRadius: '6px',
                              fontSize: '14px',
                              backgroundColor: 'var(--spacespot-surface-elevated)',
                              color: 'var(--spacespot-text-primary)',
                              cursor: 'pointer',
                            }}
                          >
                            <option>English</option>
                            <option>Spanish</option>
                            <option>French</option>
                            <option>German</option>
                          </select>
                          <span style={{ fontSize: '12px', color: 'var(--spacespot-gray-500)', display: 'block', marginTop: '4px' }}>Select your language</span>
                        </div>
                      </div>
                      
                      {/* Preferences Buttons */}
                      <div style={{
                        display: 'flex',
                        gap: '12px',
                        padding: '16px',
                        borderTop: '1px solid rgba(20, 216, 204, 0.2)',
                      }}>
                        <button
                          onClick={() => {
                            // Save logic here
                            setIsUserPopupOpen(false);
                            setUserPopupView('profile');
                          }}
                          style={{
                            flex: 1,
                            backgroundColor: 'var(--spacespot-cyan-primary)',
                            color: '#111827',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '10px 16px',
                            fontSize: '14px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0DB8A4'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--spacespot-cyan-primary)'}
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => {
                            setIsUserPopupOpen(false);
                            setUserPopupView('profile');
                          }}
                          style={{
                            flex: 1,
                            backgroundColor: 'var(--spacespot-surface-elevated)',
                            color: 'var(--spacespot-text-primary)',
                            border: '1px solid var(--spacespot-border-subtle)',
                            borderRadius: '8px',
                            padding: '10px 16px',
                            fontSize: '14px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--spacespot-hover-subtle)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--spacespot-surface-elevated)'}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        <div style={{ display: 'flex', height: 'calc(100vh - 100px)', minHeight: 'calc(100vh - 100px)', marginTop: '100px', transition: 'none' }}>
          <aside
                style={{
                  width: isExpandedSidebar ? '280px' : '98px',
                  backgroundColor: '#101B33',
                  color: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isExpandedSidebar ? 'stretch' : 'center',
                  padding: isExpandedSidebar ? '16px' : '16px 0',
                  gap: isExpandedSidebar ? '8px' : '10px',
                  zIndex: 100,
                  transition: 'width 0.3s ease, padding 0.3s ease',
                  overflow: 'visible',
                  position: 'sticky',
                  top: 0,
                  height: 'calc(100vh - 100px)',
                  alignSelf: 'flex-start',
                }}
              >
            {[
              { icon: HomeIcon, label: 'Home', to: '/root', activeMatch: '/root' },
              { icon: PlusIcon, label: 'Create', to: '/create/space', activeMatch: '/create' },
              { icon: FolderIcon, label: 'Manage', to: '/manage/spaces', activeMatch: '/manage' },
              { icon: ChartIcon, label: 'Insights', to: '/insights', activeMatch: '/insights' },
              { icon: SettingsIcon, label: 'Administration', to: '/administration', activeMatch: '/administration' },
            ].map((item, idx) => {
              const Icon = item.icon;
              const isActive =
                item.activeMatch === '/'
                  ? location.pathname === '/'
                  : location.pathname === item.activeMatch || location.pathname.startsWith(`${item.activeMatch}/`);
              const isCreateButton = idx === 1;
              const isManageButton = idx === 2;
              const isInsightsButton = idx === 3;
              const isDisabled = false;

              return (
                <div
                  key={item.to}
                  style={{ position: 'relative', display: 'flex', width: isExpandedSidebar ? '100%' : 'auto', justifyContent: 'center' }}
                  onMouseEnter={() => {
                    if (isCreateButton) {
                      clearTimeout(createTimeoutRef.current);
                      setIsCreateMenuOpen(true);
                    }
                    if (isManageButton) {
                      clearTimeout(manageTimeoutRef.current);
                      setIsManageMenuOpen(true);
                    }
                  }}
                  onMouseLeave={() => {
                    if (isCreateButton) {
                      createTimeoutRef.current = setTimeout(() => setIsCreateMenuOpen(false), 150);
                    }
                    if (isManageButton) {
                      manageTimeoutRef.current = setTimeout(() => setIsManageMenuOpen(false), 150);
                    }
                  }}
                >
                <Link
                      to={isCreateButton || isManageButton ? location.pathname : item.to}
                      title={item.label}
                      onClick={(e) => {
                        if (isCreateButton || isManageButton) {
                          e.preventDefault();
                          return;
                        }

                        setIsCreateMenuOpen(false);
                        setIsManageMenuOpen(false);
                      }}
                      
                    style={{
                      width: isExpandedSidebar ? '100%' : '54px',
                      height: isExpandedSidebar ? '48px' : '54px',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: isExpandedSidebar ? 'flex-start' : 'center',
                      gap: isExpandedSidebar ? '12px' : '0',
                      padding: isExpandedSidebar ? '0 16px' : '0',
                      textDecoration: 'none',
                      color: isActive ? '#0f172a' : '#0f172a',
                      backgroundColor: isActive ? 'var(--spacespot-cyan-primary)' : '#eef8fb',
                      border: isActive ? '2px solid #ffffff' : 'none',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap',
                      fontSize: isExpandedSidebar ? '14px' : '0',
                      fontWeight: isExpandedSidebar ? 500 : 'normal',
                      cursor: isDisabled ? 'default' : 'pointer',
                      opacity: 1,
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive && !isDisabled) {
                        e.currentTarget.style.backgroundColor = '#e2f2f5';
                        if (!isExpandedSidebar) {
                          e.currentTarget.style.transform = 'scale(1.03)';
                        }
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive && !isDisabled) {
                        e.currentTarget.style.backgroundColor = '#eef8fb';
                        if (!isExpandedSidebar) {
                          e.currentTarget.style.transform = 'scale(1)';
                        }
                      }
                    }}
                                    >
                    <Icon size={isExpandedSidebar ? 18 : 20} color={isActive ? '#0f172a' : '#0f172a'} />
                    {isExpandedSidebar && <span>{item.label}</span>}
                  </Link>

                  {isCreateButton && isCreateMenuOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        left: isExpandedSidebar ? 'calc(100% + 8px)' : '64px',
                        top: '0',
                        width: '202px',
                        backgroundColor: '#0e1d36',
                        border: '2px solid #14D8CC',
                        borderRadius: '18px',
                        padding: '18px',
                        boxShadow: '0 20px 44px rgba(0, 0, 0, 0.24)',
                        zIndex: 1000,
                      }}
                      onMouseEnter={() => {
                        clearTimeout(createTimeoutRef.current);
                        setIsCreateMenuOpen(true);
                      }}
                      onMouseLeave={() => {
                        createTimeoutRef.current = setTimeout(() => setIsCreateMenuOpen(false), 150);
                      }}
                    >
                      <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '18px', marginBottom: '12px' }}>Create</div>
                      <div style={{ height: '1px', backgroundColor: '#134759', margin: '0 -18px 14px' }} />
                      {[
                        { label: 'Space', Icon: Building2, route: '/create/space' },
                        { label: 'Unit', Icon: Box, route: '/create/units' },
                        { label: 'Lease', Icon: FileText, route: '/create/lease' },
                        { label: 'Customer', Icon: User, route: '/create/customer' },
                        { label: 'Documents', Icon: Clipboard, route: '/create/documents' },
                      ].map((menuItem) => {
                        const isActiveCreateItem = location.pathname === menuItem.route;

                        return (
                        <div
                          key={menuItem.label}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '10px 10px',
                            borderRadius: '14px',
                            color: isActiveCreateItem ? 'var(--spacespot-cyan-primary)' : '#f8fafc',
                            fontSize: '14px',
                            cursor: 'pointer',
                            backgroundColor: isActiveCreateItem ? 'rgba(20, 216, 204, 0.08)' : 'transparent',
                            transition: 'background 0.2s ease, color 0.2s ease',
                          }}
                          onClick={() => {
                            clearTimeout(createTimeoutRef.current);
                            setIsCreateMenuOpen(false);
                            navigate(menuItem.route);
                          }}
                          onMouseEnter={(e) => {
                            if (!isActiveCreateItem) {
                              e.currentTarget.style.backgroundColor = 'rgba(20, 216, 204, 0.08)';
                              e.currentTarget.style.color = 'var(--spacespot-cyan-primary)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isActiveCreateItem) {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = '#f8fafc';
                            }
                          }}
                        >
                          <menuItem.Icon size={18} color={isActiveCreateItem ? 'var(--spacespot-cyan-primary)' : '#f8fafc'} />
                          <span style={{ fontWeight: 500 }}>{menuItem.label}</span>
                        </div>
                      )})}
                    </div>
                  )}

                  {isManageButton && isManageMenuOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        left: isExpandedSidebar ? 'calc(100% + 8px)' : '64px',
                        top: '0',
                        width: '202px',
                        backgroundColor: '#0e1d36',
                        border: '2px solid #14D8CC',
                        borderRadius: '18px',
                        padding: '18px',
                        boxShadow: '0 20px 44px rgba(0, 0, 0, 0.24)',
                        zIndex: 1000,
                      }}
                      onMouseEnter={() => {
                        clearTimeout(manageTimeoutRef.current);
                        setIsManageMenuOpen(true);
                      }}
                      onMouseLeave={() => {
                        manageTimeoutRef.current = setTimeout(() => setIsManageMenuOpen(false), 150);
                      }}
                    >
                      <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '18px', marginBottom: '12px' }}>Manage</div>
                      <div style={{ height: '1px', backgroundColor: '#134759', margin: '0 -18px 14px' }} />
                      {[
                        { label: 'Space', Icon: Building2, route: '/manage/spaces' },
                        { label: 'Unit', Icon: Box, route: '/manage/units' },
                        { label: 'Lease', Icon: FileText, route: '/manage/leases' },
                        { label: 'Customer', Icon: User, route: '/manage/customers' },
                        { label: 'Pricing', Icon: DollarSign, route: '/manage/pricing' },
                        { label: 'Documents', Icon: Clipboard, route: '/manage/documents' },
                      ].map((menuItem) => (
                        <div
                          key={menuItem.label}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '10px 10px',
                            borderRadius: '14px',
                            color: '#f8fafc',
                            fontSize: '14px',
                            cursor: 'pointer',
                            backgroundColor: 'transparent',
                            transition: 'background 0.2s ease, color 0.2s ease',
                          }}
                          onClick={() => {
                            clearTimeout(manageTimeoutRef.current);
                            setIsManageMenuOpen(false);
                            navigate(menuItem.route);
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(20, 216, 204, 0.08)';
                            e.currentTarget.style.color = 'var(--spacespot-cyan-primary)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#f8fafc';
                          }}
                        >
                          <menuItem.Icon size={18} color={'#f8fafc'} />
                          <span style={{ fontWeight: 500 }}>{menuItem.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <button
              onClick={() => setIsExpandedSidebar(!isExpandedSidebar)}
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '8px',
                backgroundColor: 'var(--spacespot-cyan-primary)',
                border: 'none',
                color: '#0f172a',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                transition: 'all 0.2s ease',
                position: 'absolute',
                right: '-20px',
                top: '50%',
                transform: 'translateY(-50%)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%)';
              }}
            >
              {isExpandedSidebar ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          </aside>

          <main style={{ flex: 1, minHeight: 0, height: 'calc(100vh - 100px)', overflowY: 'auto' }}>
            <div style={{ padding: '20px 24px' }}>
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    );
  }

