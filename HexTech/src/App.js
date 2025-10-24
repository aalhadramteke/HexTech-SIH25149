import React, { useState, useEffect } from 'react';
import { Camera, Upload, MapPin, Clock, CheckCircle, XCircle, User, Building2, FileText, Phone, Image, Video, AlertCircle, LogOut, Eye, EyeOff, Calendar, DollarSign, Home, Settings, HelpCircle, ChevronRight, Info, Check, X, RefreshCw, Download, Filter, Search, Bell, Menu } from 'lucide-react';
import './App.css';

const LoanVerificationApp = () => {
  const [userRole, setUserRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('login');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [uploads, setUploads] = useState([]);
  const [currentUpload, setCurrentUpload] = useState({ 
    type: 'photo', 
    file: null, 
    description: '', 
    gpsCoords: null, 
    timestamp: null,
    assetType: '',
    assetValue: '',
    purchaseDate: ''
  });
  const [aiValidation, setAiValidation] = useState(null);
  const [validationProgress, setValidationProgress] = useState(0);

  const [loanEntries, setLoanEntries] = useState([
    { 
      id: 1, 
      beneficiary: 'Rajesh Kumar', 
      phone: '+91 98765 43210', 
      amount: '₹50,000', 
      purpose: 'Tractor', 
      status: 'Pending Verification',
      loanDate: '2023-05-15',
      disbursementDate: '2023-05-20',
      documents: 2,
      lastUpdated: '2023-06-10'
    },
    { 
      id: 2, 
      beneficiary: 'Priya Sharma', 
      phone: '+91 98765 43211', 
      amount: '₹25,000', 
      purpose: 'Dairy Equipment', 
      status: 'Verified',
      loanDate: '2023-04-10',
      disbursementDate: '2023-04-15',
      documents: 3,
      lastUpdated: '2023-05-05'
    }
  ]);
  
  const [newLoan, setNewLoan] = useState({ 
    beneficiaryName: '', 
    phone: '', 
    amount: '', 
    purpose: '', 
    loanDate: '', 
    disbursementDate: '',
    documents: 0,
    notes: ''
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showLoanDetails, setShowLoanDetails] = useState(null);

  // Show notification helper
  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Handle send OTP
  const handleSendOTP = () => { 
    if (phoneNumber.length === 10) {
      setLoading(true);
      setTimeout(() => {
        setOtpSent(true);
        setLoading(false);
        showNotification('OTP sent successfully!', 'success');
      }, 1000);
    } else {
      showNotification('Please enter a valid 10-digit phone number', 'error');
    }
  };

  // Handle verify OTP
  const handleVerifyOTP = () => { 
    if (otp === '1234') {
      setLoading(true);
      setTimeout(() => {
        setIsLoggedIn(true);
        setCurrentScreen(userRole === 'beneficiary' ? 'beneficiary-home' : 'agency-home');
        setLoading(false);
        showNotification('Login successful!', 'success');
      }, 1000);
    } else {
      showNotification('Invalid OTP. Please try again.', 'error');
    }
  };

  // Handle file select
  const handleFileSelect = (type) => {
    setCurrentUpload({ 
      ...currentUpload, 
      type, 
      file: `${type}-${Date.now()}.jpg`, 
      gpsCoords: { lat: 21.1458, lng: 79.0882 }, 
      timestamp: new Date().toISOString() 
    });
    
    // Simulate AI validation progress
    setValidationProgress(0);
    const interval = setInterval(() => {
      setValidationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setAiValidation({ 
            isValid: Math.random() > 0.3, 
            confidence: (Math.random() * 30 + 70).toFixed(1), 
            checks: { 
              geotagValid: true, 
              timestampValid: true, 
              imageAuthentic: Math.random() > 0.2, 
              duplicateCheck: Math.random() > 0.8, 
              assetMatch: Math.random() > 0.3 
            } 
          });
          showNotification('AI validation complete!', 'success');
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  // Submit upload
  const submitUpload = () => { 
    if (currentUpload.file && currentUpload.description) {
      setLoading(true);
      setTimeout(() => {
        setUploads([...uploads, { ...currentUpload, id: Date.now(), aiValidation }]); 
        setCurrentUpload({ 
          type: 'photo', 
          file: null, 
          description: '', 
          gpsCoords: null, 
          timestamp: null,
          assetType: '',
          assetValue: '',
          purchaseDate: ''
        }); 
        setAiValidation(null);
        setValidationProgress(0);
        setLoading(false);
        setCurrentScreen('beneficiary-home');
        showNotification('Asset proof submitted successfully!', 'success');
      }, 1000);
    } else {
      showNotification('Please fill all required fields', 'error');
    }
  };

  // Add loan entry
  const addLoanEntry = () => { 
    if (newLoan.beneficiaryName && newLoan.phone && newLoan.amount) {
      setLoading(true);
      setTimeout(() => {
        setLoanEntries([...loanEntries, { 
          id: Date.now(), 
          beneficiary: newLoan.beneficiaryName, 
          phone: newLoan.phone, 
          amount: newLoan.amount, 
          purpose: newLoan.purpose, 
          loanDate: newLoan.loanDate, 
          disbursementDate: newLoan.disbursementDate,
          documents: newLoan.documents,
          notes: newLoan.notes,
          status: 'Pending Verification',
          lastUpdated: new Date().toISOString().split('T')[0]
        }]); 
        setNewLoan({ 
          beneficiaryName: '', 
          phone: '', 
          amount: '', 
          purpose: '', 
          loanDate: '', 
          disbursementDate: '',
          documents: 0,
          notes: ''
        }); 
        setLoading(false);
        setCurrentScreen('agency-home');
        showNotification('Loan entry added successfully!', 'success');
      }, 1000);
    } else {
      showNotification('Please fill all required fields', 'error');
    }
  };

  // Update loan status
  const updateLoanStatus = (id, newStatus) => {
    setLoanEntries(loanEntries.map(loan => 
      loan.id === id ? { ...loan, status: newStatus, lastUpdated: new Date().toISOString().split('T')[0] } : loan
    ));
    showNotification(`Loan status updated to ${newStatus}`, 'success');
  };

  // Delete loan entry
  const deleteLoanEntry = (id) => {
    if (window.confirm('Are you sure you want to delete this loan entry?')) {
      setLoanEntries(loanEntries.filter(loan => loan.id !== id));
      showNotification('Loan entry deleted', 'info');
    }
  };

  // Logout
  const logout = () => { 
    setIsLoggedIn(false); 
    setUserRole(null); 
    setCurrentScreen('login'); 
    setPhoneNumber(''); 
    setOtp(''); 
    setOtpSent(false);
    showNotification('Logged out successfully', 'info');
  };

  // Filter loans based on search and status
  const filteredLoans = loanEntries.filter(loan => {
    const matchesSearch = loan.beneficiary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         loan.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         loan.phone.includes(searchQuery);
    const matchesStatus = filterStatus === 'all' || loan.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Notification component
  const Notification = () => {
    if (!notification.show) return null;
    
    return (
      <div className={`notification notification-${notification.type}`}>
        <div className="notification-content">
          {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
          {notification.type === 'error' && <XCircle className="w-5 h-5" />}
          {notification.type === 'info' && <Info className="w-5 h-5" />}
          <span>{notification.message}</span>
        </div>
        <button onClick={() => setNotification({ show: false })} className="notification-close">
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  };

  // Loading overlay
  const LoadingOverlay = () => {
    if (!loading) return null;
    
    return (
      <div className="loading-overlay">
        <div className="loading-spinner">
          <RefreshCw className="w-8 h-8 animate-spin" />
          <p>Processing...</p>
        </div>
      </div>
    );
  };

  // --- Screen Rendering ---

  if (currentScreen === 'login' && !userRole) {
    return (
      <div className="page-container">
        <Notification />
        <LoadingOverlay />
        <div className="content-container">
          <div className="card card-login">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <h1 className="mb-2">Loan Verification System</h1>
              <p className="text-muted">Select your role to continue</p>
            </div>
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => setUserRole('beneficiary')} 
                className="btn btn-primary btn-lg"
              >
                <User className="w-5 h-5" />
                I am a Beneficiary
              </button>
              <button 
                onClick={() => setUserRole('agency')} 
                className="btn btn-outline btn-lg"
              >
                <Building2 className="w-5 h-5" />
                State Agency / Bank Officer
              </button>
            </div>
            <div className="mt-8 text-center">
              <button className="btn-ghost text-sm">
                <HelpCircle className="w-4 h-4 mr-1" />
                Need Help?
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'login' && userRole && !isLoggedIn) {
    return (
      <div className="page-container">
        <Notification />
        <LoadingOverlay />
        <div className="content-container">
          <button 
            onClick={() => setUserRole(null)} 
            className="btn-back btn-back-light mb-4 flex items-center"
          >
            ← Back
          </button>
          <div className="card card-login">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-indigo-600" />
              </div>
              <h2 className="mb-2">Mobile Login</h2>
              <p className="text-muted">
                {userRole === 'beneficiary' ? 'Enter your registered mobile number' : 'Officer login via mobile'}
              </p>
            </div>
            {!otpSent ? (
              <div className="space-y-4">
                <div>
                  <label>Mobile Number</label>
                  <div className="input-group">
                    <span className="input-prefix">+91</span>
                    <input 
                      type="tel" 
                      value={phoneNumber} 
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))} 
                      placeholder="Enter 10-digit number" 
                      maxLength="10" 
                    />
                  </div>
                </div>
                <button 
                  onClick={handleSendOTP} 
                  disabled={phoneNumber.length !== 10} 
                  className="btn btn-primary btn-block"
                >
                  Send OTP
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="validation-box success">
                  <p className="text-sm">OTP sent to +91 {phoneNumber}</p>
                  <p className="text-sm font-semibold">Demo OTP: 1234</p>
                </div>
                <div>
                  <label>Enter OTP</label>
                  <div className="otp-input-container">
                    {[0, 1, 2, 3].map((index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength="1"
                        value={otp[index] || ''}
                        onChange={(e) => {
                          const newOtp = otp.split('');
                          newOtp[index] = e.target.value;
                          setOtp(newOtp.join(''));
                          if (e.target.value && index < 3) {
                            document.getElementById(`otp-${index + 1}`).focus();
                          }
                        }}
                        id={`otp-${index}`}
                        className="otp-input"
                      />
                    ))}
                  </div>
                </div>
                <button 
                  onClick={handleVerifyOTP} 
                  disabled={otp.length !== 4} 
                  className="btn btn-primary btn-block"
                >
                  Verify & Login
                </button>
                <button 
                  onClick={() => setOtpSent(false)} 
                  className="btn-ghost btn-block"
                >
                  Resend OTP
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'beneficiary-home') {
    return (
      <div className="app-container">
        <Notification />
        <LoadingOverlay />
        <header className="app-header">
          <div className="header-container">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)} 
                className="btn-icon md:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1>My Loan Verification</h1>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn-icon">
                <Bell className="w-5 h-5" />
              </button>
              <button onClick={logout} className="btn-icon">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>
        
        <div className="app-body">
          <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
            <nav className="sidebar-nav">
              <button 
                onClick={() => setCurrentScreen('beneficiary-home')} 
                className="sidebar-item active"
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </button>
              <button 
                onClick={() => setCurrentScreen('upload')} 
                className="sidebar-item"
              >
                <Upload className="w-5 h-5" />
                <span>Upload Proof</span>
              </button>
              <button className="sidebar-item">
                <FileText className="w-5 h-5" />
                <span>My Documents</span>
              </button>
              <button className="sidebar-item">
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>
              <button className="sidebar-item">
                <HelpCircle className="w-5 h-5" />
                <span>Help & Support</span>
              </button>
            </nav>
          </aside>
          
          <main className="main-content">
            <div className="content-header">
              <h2>Dashboard</h2>
              <div className="stats-container">
                <div className="stat-card">
                  <div className="stat-icon bg-blue-100">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="stat-value">{uploads.length}</p>
                    <p className="stat-label">Total Uploads</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon bg-green-100">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="stat-value">{uploads.filter(u => u.aiValidation?.isValid).length}</p>
                    <p className="stat-label">Verified</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon bg-amber-100">
                    <Clock className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="stat-value">{uploads.filter(u => !u.aiValidation?.isValid).length}</p>
                    <p className="stat-label">Pending</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="content-body">
              <div className="section-header">
                <h3>Upload New Asset Proof</h3>
                <button 
                  onClick={() => setCurrentScreen('upload')} 
                  className="btn btn-primary"
                >
                  <Upload className="w-4 h-4 mr-1" />
                  Upload Now
                </button>
              </div>
              
              <div className="section">
                <h3>My Submissions</h3>
                {uploads.length === 0 ? (
                  <div className="empty-state">
                    <Image className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                    <p className="text-muted">No uploads yet</p>
                    <p className="text-sm text-muted">Start by uploading your asset proof</p>
                    <button 
                      onClick={() => setCurrentScreen('upload')} 
                      className="btn btn-primary mt-4"
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      Upload First Asset
                    </button>
                  </div>
                ) : (
                  <div className="uploads-grid">
                    {uploads.map((upload) => (
                      <div key={upload.id} className="upload-card">
                        <div className="upload-media">
                          {upload.type === 'photo' ? 
                            <Image className="w-10 h-10 text-indigo-600" /> : 
                            <Video className="w-10 h-10 text-purple-600" />
                          }
                        </div>
                        <div className="upload-details">
                          <h4>{upload.description}</h4>
                          <div className="upload-meta">
                            <span className="meta-item">
                              <MapPin className="w-3 h-3" />
                              GPS Tagged
                            </span>
                            <span className="meta-item">
                              <Clock className="w-3 h-3" />
                              {new Date(upload.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          {upload.aiValidation && (
                            <div className={`validation-status ${upload.aiValidation.isValid ? 'success' : 'warning'}`}>
                              {upload.aiValidation.isValid ? 
                                <><CheckCircle className="w-4 h-4" /> AI Verified</> : 
                                <><AlertCircle className="w-4 h-4" /> AI Review Required</>
                              }
                              <span>({upload.aiValidation.confidence}% confidence)</span>
                            </div>
                          )}
                        </div>
                        <div className="upload-actions">
                          <button className="btn-icon btn-sm">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="btn-icon btn-sm">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (currentScreen === 'upload') {
    return (
      <div className="app-container">
        <Notification />
        <LoadingOverlay />
        <header className="app-header">
          <div className="header-container has-back-button">
            <button 
              onClick={() => setCurrentScreen('beneficiary-home')} 
              className="btn-back"
            >
              ← Back
            </button>
            <h1>Upload Asset Proof</h1>
            <div className="flex items-center gap-2">
              <button className="btn-icon">
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>
        
        <main className="main-content">
          <div className="content-body">
            <div className="section">
              <h3>Select Media Type</h3>
              <div className="media-type-selector">
                <button 
                  onClick={() => handleFileSelect('photo')} 
                  className={`media-type-card ${currentUpload.type === 'photo' && currentUpload.file ? 'selected' : ''}`}
                >
                  <Camera className="w-10 h-10 text-indigo-600" />
                  <span className="font-semibold">Photo</span>
                  <span className="text-xs text-muted">Take or upload photo</span>
                </button>
                <button 
                  onClick={() => handleFileSelect('video')} 
                  className={`media-type-card ${currentUpload.type === 'video' && currentUpload.file ? 'selected' : ''}`}
                >
                  <Video className="w-10 h-10 text-purple-600" />
                  <span className="font-semibold">Video</span>
                  <span className="text-xs text-muted">Record or upload video</span>
                </button>
              </div>
            </div>
            
            {currentUpload.file && (
              <>
                <div className="section">
                  <h3>Asset Details</h3>
                  <div className="form-grid">
                    <div>
                      <label>Asset Type *</label>
                      <select 
                        value={currentUpload.assetType} 
                        onChange={(e) => setCurrentUpload({ ...currentUpload, assetType: e.target.value })}
                      >
                        <option value="">Select asset type</option>
                        <option value="tractor">Tractor</option>
                        <option value="dairy-equipment">Dairy Equipment</option>
                        <option value="irrigation">Irrigation System</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label>Asset Value (₹)</label>
                      <input 
                        type="text" 
                        value={currentUpload.assetValue} 
                        onChange={(e) => setCurrentUpload({ ...currentUpload, assetValue: e.target.value })}
                        placeholder="e.g., 50000"
                      />
                    </div>
                    <div>
                      <label>Purchase Date</label>
                      <input 
                        type="date" 
                        value={currentUpload.purchaseDate} 
                        onChange={(e) => setCurrentUpload({ ...currentUpload, purchaseDate: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="section">
                  <h3>Asset Description *</h3>
                  <textarea 
                    value={currentUpload.description} 
                    onChange={(e) => setCurrentUpload({ ...currentUpload, description: e.target.value })} 
                    placeholder="Describe the asset (e.g., New Tractor - Mahindra 575 DI with all accessories)" 
                    rows="3" 
                  />
                </div>
                
                {validationProgress > 0 && validationProgress < 100 && (
                  <div className="section">
                    <h3>AI Validation Progress</h3>
                    <div className="progress-container">
                      <div 
                        className="progress-bar" 
                        style={{ width: `${validationProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-muted mt-2">Analyzing image for authenticity...</p>
                  </div>
                )}
                
                {aiValidation && (
                  <div className="section">
                    <h3>AI Validation Results</h3>
                    <div className={`validation-box ${aiValidation.isValid ? 'success' : 'warning'}`}>
                      <div className="validation-header">
                        {aiValidation.isValid ? 
                          <><CheckCircle className="w-6 h-6 text-green-600" /> <span className="font-bold">Validation Passed</span></> : 
                          <><AlertCircle className="w-6 h-6 text-amber-600" /> <span className="font-bold">Review Required</span></>
                        }
                        <span className="confidence-badge">{aiValidation.confidence}% confidence</span>
                      </div>
                      <div className="validation-checks">
                        <div className={`check-item ${aiValidation.checks.geotagValid ? 'valid' : 'invalid'}`}>
                          {aiValidation.checks.geotagValid ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                          <span>Geotag Valid</span>
                        </div>
                        <div className={`check-item ${aiValidation.checks.timestampValid ? 'valid' : 'invalid'}`}>
                          {aiValidation.checks.timestampValid ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                          <span>Timestamp Valid</span>
                        </div>
                        <div className={`check-item ${aiValidation.checks.imageAuthentic ? 'valid' : 'invalid'}`}>
                          {aiValidation.checks.imageAuthentic ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                          <span>Image Authentic</span>
                        </div>
                        <div className={`check-item ${aiValidation.checks.duplicateCheck ? 'valid' : 'invalid'}`}>
                          {aiValidation.checks.duplicateCheck ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                          <span>No Duplicates Found</span>
                        </div>
                        <div className={`check-item ${aiValidation.checks.assetMatch ? 'valid' : 'invalid'}`}>
                          {aiValidation.checks.assetMatch ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                          <span>Asset Type Match</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="section">
                  <button 
                    onClick={submitUpload} 
                    disabled={!currentUpload.description || !aiValidation || loading} 
                    className="btn btn-primary btn-block btn-lg"
                  >
                    {!aiValidation ? 'Processing AI Validation...' : 'Submit for Verification'}
                  </button>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    );
  }

  if (currentScreen === 'agency-home') {
    return (
      <div className="app-container">
        <Notification />
        <LoadingOverlay />
        <header className="app-header bg-emerald-600">
          <div className="header-container">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)} 
                className="btn-icon md:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1>Agency Dashboard</h1>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn-icon">
                <Bell className="w-5 h-5" />
              </button>
              <button onClick={logout} className="btn-icon">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>
        
        <div className="app-body">
          <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
            <nav className="sidebar-nav">
              <button 
                onClick={() => setCurrentScreen('agency-home')} 
                className="sidebar-item active"
              >
                <Home className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
              <button 
                onClick={() => setCurrentScreen('add-loan')} 
                className="sidebar-item"
              >
                <FileText className="w-5 h-5" />
                <span>Add Loan</span>
              </button>
              <button className="sidebar-item">
                <User className="w-5 h-5" />
                <span>Beneficiaries</span>
              </button>
              <button className="sidebar-item">
                <Calendar className="w-5 h-5" />
                <span>Schedule</span>
              </button>
              <button className="sidebar-item">
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>
            </nav>
          </aside>
          
          <main className="main-content">
            <div className="content-header">
              <h2>Loan Management</h2>
              <div className="header-actions">
                <div className="search-container">
                  <Search className="w-4 h-4 search-icon" />
                  <input 
                    type="text" 
                    placeholder="Search loans..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="filter-container">
                  <Filter className="w-4 h-4 filter-icon" />
                  <select 
                    value={filterStatus} 
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="Pending Verification">Pending</option>
                    <option value="Verified">Verified</option>
                  </select>
                </div>
                <button 
                  onClick={() => setCurrentScreen('add-loan')} 
                  className="btn btn-secondary"
                >
                  <FileText className="w-4 h-4 mr-1" />
                  Add New Loan
                </button>
              </div>
            </div>
            
            <div className="content-body">
              <div className="stats-container">
                <div className="stat-card">
                  <div className="stat-icon bg-blue-100">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="stat-value">{loanEntries.length}</p>
                    <p className="stat-label">Total Loans</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon bg-amber-100">
                    <Clock className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="stat-value">{loanEntries.filter(l => l.status === 'Pending Verification').length}</p>
                    <p className="stat-label">Pending Verification</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon bg-green-100">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="stat-value">{loanEntries.filter(l => l.status === 'Verified').length}</p>
                    <p className="stat-label">Verified</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon bg-purple-100">
                    <DollarSign className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="stat-value">₹{loanEntries.reduce((sum, loan) => sum + parseInt(loan.amount.replace(/[₹,]/g, '')), 0).toLocaleString()}</p>
                    <p className="stat-label">Total Amount</p>
                  </div>
                </div>
              </div>
              
              <div className="section">
                <h3>Loan Records</h3>
                {filteredLoans.length === 0 ? (
                  <div className="empty-state">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                    <p className="text-muted">No loan records found</p>
                    <p className="text-sm text-muted">Try adjusting your search or filter</p>
                    <button 
                      onClick={() => setCurrentScreen('add-loan')} 
                      className="btn btn-secondary mt-4"
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      Add First Loan
                    </button>
                  </div>
                ) : (
                  <div className="loans-table-container">
                    <table className="loans-table">
                      <thead>
                        <tr>
                          <th>Beneficiary</th>
                          <th>Phone</th>
                          <th>Amount</th>
                          <th>Purpose</th>
                          <th>Status</th>
                          <th>Last Updated</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLoans.map((loan) => (
                          <tr key={loan.id} className="loan-row">
                            <td className="loan-beneficiary">
                              <div className="beneficiary-info">
                                <h4>{loan.beneficiary}</h4>
                                <span className="text-xs text-muted">ID: {loan.id}</span>
                              </div>
                            </td>
                            <td>{loan.phone}</td>
                            <td className="loan-amount">{loan.amount}</td>
                            <td>{loan.purpose}</td>
                            <td>
                              <span className={`status-pill ${loan.status === 'Verified' ? 'status-success' : 'status-warning'}`}>
                                {loan.status}
                              </span>
                            </td>
                            <td>{loan.lastUpdated}</td>
                            <td>
                              <div className="loan-actions">
                                <button 
                                  onClick={() => setShowLoanDetails(loan.id)}
                                  className="btn-icon btn-sm"
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                {loan.status === 'Pending Verification' && (
                                  <button 
                                    onClick={() => updateLoanStatus(loan.id, 'Verified')}
                                    className="btn-icon btn-sm"
                                    title="Mark as Verified"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                )}
                                <button 
                                  onClick={() => deleteLoanEntry(loan.id)}
                                  className="btn-icon btn-sm"
                                  title="Delete"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              
              {showLoanDetails && (
                <div className="modal-overlay">
                  <div className="modal">
                    <div className="modal-header">
                      <h3>Loan Details</h3>
                      <button 
                        onClick={() => setShowLoanDetails(null)}
                        className="btn-icon"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="modal-body">
                      {(() => {
                        const loan = loanEntries.find(l => l.id === showLoanDetails);
                        if (!loan) return null;
                        
                        return (
                          <div className="loan-details">
                            <div className="detail-section">
                              <h4>Beneficiary Information</h4>
                              <div className="detail-grid">
                                <div className="detail-item">
                                  <span className="detail-label">Name</span>
                                  <span className="detail-value">{loan.beneficiary}</span>
                                </div>
                                <div className="detail-item">
                                  <span className="detail-label">Phone</span>
                                  <span className="detail-value">{loan.phone}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="detail-section">
                              <h4>Loan Information</h4>
                              <div className="detail-grid">
                                <div className="detail-item">
                                  <span className="detail-label">Amount</span>
                                  <span className="detail-value">{loan.amount}</span>
                                </div>
                                <div className="detail-item">
                                  <span className="detail-label">Purpose</span>
                                  <span className="detail-value">{loan.purpose}</span>
                                </div>
                                <div className="detail-item">
                                  <span className="detail-label">Loan Date</span>
                                  <span className="detail-value">{loan.loanDate}</span>
                                </div>
                                <div className="detail-item">
                                  <span className="detail-label">Disbursement Date</span>
                                  <span className="detail-value">{loan.disbursementDate}</span>
                                </div>
                                <div className="detail-item">
                                  <span className="detail-label">Status</span>
                                  <span className={`status-pill ${loan.status === 'Verified' ? 'status-success' : 'status-warning'}`}>
                                    {loan.status}
                                  </span>
                                </div>
                                <div className="detail-item">
                                  <span className="detail-label">Last Updated</span>
                                  <span className="detail-value">{loan.lastUpdated}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="detail-section">
                              <h4>Documents</h4>
                              <div className="documents-list">
                                {[...Array(loan.documents || 0)].map((_, i) => (
                                  <div key={i} className="document-item">
                                    <FileText className="w-4 h-4" />
                                    <span>Document {i + 1}</span>
                                    <button className="btn-icon btn-sm">
                                      <Download className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            {loan.notes && (
                              <div className="detail-section">
                                <h4>Notes</h4>
                                <p>{loan.notes}</p>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                    <div className="modal-footer">
                      {(() => {
                        const loan = loanEntries.find(l => l.id === showLoanDetails);
                        if (!loan) return null;
                        
                        return (
                          <>
                            {loan.status === 'Pending Verification' && (
                              <button 
                                onClick={() => {
                                  updateLoanStatus(loan.id, 'Verified');
                                  setShowLoanDetails(null);
                                }}
                                className="btn btn-success"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Mark as Verified
                              </button>
                            )}
                            <button 
                              onClick={() => setShowLoanDetails(null)}
                              className="btn btn-outline"
                            >
                              Close
                            </button>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (currentScreen === 'add-loan') {
    return (
      <div className="app-container">
        <Notification />
        <LoadingOverlay />
        <header className="app-header bg-emerald-600">
          <div className="header-container has-back-button">
            <button 
              onClick={() => setCurrentScreen('agency-home')} 
              className="btn-back"
            >
              ← Back
            </button>
            <h1>Add Loan Entry</h1>
            <div className="flex items-center gap-2">
              <button className="btn-icon">
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>
        
        <main className="main-content">
          <div className="content-body">
            <div className="card">
              <div className="form-section">
                <h3>Beneficiary Information</h3>
                <div className="form-grid">
                  <div>
                    <label>Beneficiary Name *</label>
                    <input 
                      type="text" 
                      value={newLoan.beneficiaryName} 
                      onChange={(e) => setNewLoan({ ...newLoan, beneficiaryName: e.target.value })} 
                      placeholder="Enter full name" 
                    />
                  </div>
                  <div>
                    <label>Mobile Number *</label>
                    <div className="input-group">
                      <span className="input-prefix">+91</span>
                      <input 
                        type="tel" 
                        value={newLoan.phone} 
                        onChange={(e) => setNewLoan({ ...newLoan, phone: e.target.value.replace(/\D/g, '') })} 
                        placeholder="98765 43210" 
                        maxLength="10"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="form-section">
                <h3>Loan Details</h3>
                <div className="form-grid">
                  <div>
                    <label>Loan Amount *</label>
                    <div className="input-group">
                      <span className="input-prefix">₹</span>
                      <input 
                        type="text" 
                        value={newLoan.amount} 
                        onChange={(e) => setNewLoan({ ...newLoan, amount: e.target.value })} 
                        placeholder="50,000" 
                      />
                    </div>
                  </div>
                  <div>
                    <label>Loan Purpose *</label>
                    <select 
                      value={newLoan.purpose} 
                      onChange={(e) => setNewLoan({ ...newLoan, purpose: e.target.value })}
                    >
                      <option value="">Select purpose</option>
                      <option value="Tractor">Tractor</option>
                      <option value="Dairy Equipment">Dairy Equipment</option>
                      <option value="Irrigation System">Irrigation System</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label>Loan Date</label>
                    <input 
                      type="date" 
                      value={newLoan.loanDate} 
                      onChange={(e) => setNewLoan({ ...newLoan, loanDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label>Disbursement Date</label>
                    <input 
                      type="date" 
                      value={newLoan.disbursementDate} 
                      onChange={(e) => setNewLoan({ ...newLoan, disbursementDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-section">
                <h3>Additional Information</h3>
                <div className="form-grid">
                  <div>
                    <label>Number of Documents</label>
                    <input 
                      type="number" 
                      value={newLoan.documents} 
                      onChange={(e) => setNewLoan({ ...newLoan, documents: parseInt(e.target.value) || 0 })}
                      min="0"
                    />
                  </div>
                  <div className="full-width">
                    <label>Notes</label>
                    <textarea 
                      value={newLoan.notes} 
                      onChange={(e) => setNewLoan({ ...newLoan, notes: e.target.value })} 
                      placeholder="Additional notes about this loan" 
                      rows="3" 
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-actions">
                <button 
                  onClick={addLoanEntry} 
                  disabled={!newLoan.beneficiaryName || !newLoan.phone || !newLoan.amount || !newLoan.purpose} 
                  className="btn btn-secondary btn-lg"
                >
                  <FileText className="w-5 h-5 mr-1" />
                  Add Loan Entry
                </button>
                <button 
                  onClick={() => setCurrentScreen('agency-home')} 
                  className="btn btn-outline btn-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return null;
};

export default LoanVerificationApp;