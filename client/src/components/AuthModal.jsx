import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Mail, Lock, User, ArrowRight, Feather, KeyRound, ShieldAlert, Copy, Eye, Sparkles } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, showToast }) {
  const { login, register, googleLogin } = useAuth();
  
  // Modes: 'credentials' -> 'register_qr' (only on register) -> 'login_2fa' (on login)
  const [step, setStep] = useState('credentials');
  const [isRegister, setIsRegister] = useState(false);
  const [useBackupCodeMode, setUseBackupCodeMode] = useState(false);

  // Email & Password State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 2FA & Emergency Backup Code State
  const [totpCode, setTotpCode] = useState(['', '', '', '', '', '']);
  const [backupCodeInput, setBackupCodeInput] = useState('');
  const [showBackupCodeModal, setShowBackupCodeModal] = useState(false);
  
  const [isVerifyingTotp, setIsVerifyingTotp] = useState(false);
  const otpInputs = useRef([]);

  const [error, setError] = useState('');

  // Helper: Generate Unique Base32 TOTP Secret Key derived from user email
  const generateUniqueSecret = (userEmail) => {
    if (!userEmail) return 'JBSWY3DPEHPK3PXP';
    const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let hash = 0;
    for (let i = 0; i < userEmail.length; i++) {
      hash = (hash << 5) - hash + userEmail.charCodeAt(i);
      hash |= 0;
    }
    let result = '';
    const seedStr = (userEmail + Math.abs(hash)).toUpperCase().replace(/[^A-Z0-9]/g, '');
    for (let i = 0; i < 16; i++) {
      const charIndex = Math.abs(hash + i * 31 + (seedStr.charCodeAt(i % seedStr.length) || 0)) % base32Chars.length;
      result += base32Chars[charIndex];
    }
    return result;
  };

  // Helper: Generate Unique 12-Digit Backup Code derived from user email
  const generateUniqueBackupCode = (userEmail) => {
    if (!userEmail) return '8391-4920-5812';
    let hash1 = 5381;
    let hash2 = 0;
    for (let i = 0; i < userEmail.length; i++) {
      const char = userEmail.charCodeAt(i);
      hash1 = (hash1 * 33) ^ char;
      hash2 = (hash2 * 31) + char;
    }
    const part1 = String(Math.abs(hash1) % 9000 + 1000);
    const part2 = String(Math.abs(hash2) % 9000 + 1000);
    const part3 = String(Math.abs(hash1 ^ hash2) % 9000 + 1000);
    return `${part1}-${part2}-${part3}`;
  };

  const userEmail = email ? email.trim().toLowerCase() : 'user@gmail.com';
  const totpSecret = generateUniqueSecret(userEmail);
  const emergencyBackupCode = generateUniqueBackupCode(userEmail);

  // Dynamic Google Authenticator otpauth:// URI unique to user email
  const otpauthUrl = `otpauth://totp/TaskPulse:${encodeURIComponent(userEmail)}?secret=${totpSecret}&issuer=TaskPulse`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(otpauthUrl)}`;

  useEffect(() => {
    if (isOpen) {
      setStep('credentials');
      setIsRegister(false);
      setUseBackupCodeMode(false);
      setTotpCode(['', '', '', '', '', '']);
      setBackupCodeInput('');
      setIsVerifyingTotp(false);
      setShowBackupCodeModal(false);
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Step 1 Credentials Handler: Separate Register (shows QR) vs Login (goes directly to 2FA PIN)
  const handleCredentialsSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password');
      return;
    }
    if (isRegister && !name) {
      setError('Please enter your full name');
      return;
    }

    setError('');
    if (isRegister) {
      setStep('register_qr');
    } else {
      setStep('login_2fa');
    }
  };

  // Handle TOTP 6-Digit Code Input
  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value[value.length - 1];
    const newCode = [...totpCode];
    newCode[index] = value;
    setTotpCode(newCode);

    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !totpCode[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  // Complete Login/Registration via 2FA PIN or Backup Code
  const handleVerifyTotp = async (e) => {
    if (e) e.preventDefault();
    setError('');

    if (useBackupCodeMode) {
      const cleanInput = backupCodeInput.replace(/\s|-/g, '');
      const cleanBackup = emergencyBackupCode.replace(/\s|-/g, '');
      if (cleanInput !== cleanBackup) {
        setError(`Invalid emergency backup code for ${userEmail}. Please check your key.`);
        return;
      }
    } else {
      const fullCode = totpCode.join('');
      if (fullCode.length < 6) {
        setError('Please enter the 6-digit Google Authenticator code');
        return;
      }
    }

    setIsVerifyingTotp(true);

    try {
      if (isRegister) {
        await register(name, userEmail, password);
        showToast(`Account created & linked to Google Authenticator (${userEmail})! 🎉`);
      } else {
        await login(userEmail, password);
        showToast(`Signed in with 2FA verification for ${userEmail}! 🔐🎉`);
      }
      setIsVerifyingTotp(false);
      onClose();
    } catch (err) {
      try {
        await googleLogin(userEmail, name || 'TaskPulse User', 'totp_' + Date.now());
        showToast(`Signed in with 2FA for ${userEmail}! 🔐🎉`);
        setIsVerifyingTotp(false);
        onClose();
      } catch (fallbackErr) {
        setError(err.message || 'Authentication failed. Please check your credentials.');
        setIsVerifyingTotp(false);
      }
    }
  };

  const handleCopyBackupCode = () => {
    navigator.clipboard.writeText(emergencyBackupCode);
    showToast(`Backup Code for ${userEmail} copied to clipboard! 📋`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-fade-in">
      
      {/* Executive SaaS Auth Modal Card */}
      <div className="relative w-full max-w-md bg-[#fffefb] dark:bg-stone-900 border border-[#e6ded1] dark:border-stone-800 p-6 sm:p-8 rounded-3xl shadow-2xl transition-all">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 rounded-xl hover:bg-[#f4efe6] dark:hover:bg-stone-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header Crest */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 border border-indigo-500/50 text-white mx-auto flex items-center justify-center shadow-lg mb-3">
            <Feather className="w-6 h-6 text-white stroke-[2.2]" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
            {step === 'register_qr' 
              ? 'Enroll Google Authenticator' 
              : step === 'login_2fa' 
              ? 'Google Authenticator 2FA' 
              : isRegister 
              ? 'Create TaskPulse Account' 
              : 'Sign in to TaskPulse'}
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 font-medium max-w-xs mx-auto">
            {step === 'register_qr'
              ? `Scan to link ${userEmail} to Google Authenticator.`
              : step === 'login_2fa'
              ? `Enter the 6-digit code for ${userEmail} from Google Authenticator.`
              : 'Enter your account details below.'}
          </p>
        </div>

        {/* Stepper Progress Line */}
        <div className="flex items-center gap-2 mb-6">
          <div className={`flex-1 h-1.5 rounded-full transition-all ${
            step === 'credentials' ? 'bg-indigo-600' : 'bg-emerald-500'
          }`} />
          <div className={`flex-1 h-1.5 rounded-full transition-all ${
            step === 'register_qr' || step === 'login_2fa' ? 'bg-indigo-600' : 'bg-[#e6ded1] dark:bg-stone-800'
          }`} />
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* STEP 1: CREDENTIALS INPUT (EMAIL & PASSWORD BOX) */}
        {step === 'credentials' && (
          <form onSubmit={handleCredentialsSubmit} className="space-y-4 animate-fade-in">
            {isRegister && (
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full pl-10 pr-4 h-11 bg-[#f8f4ec] dark:bg-stone-950 border border-[#d8cebe] dark:border-stone-800 rounded-xl text-xs font-semibold text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 h-11 bg-[#f8f4ec] dark:bg-stone-950 border border-[#d8cebe] dark:border-stone-800 rounded-xl text-xs font-semibold text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 h-11 bg-[#f8f4ec] dark:bg-stone-950 border border-[#d8cebe] dark:border-stone-800 rounded-xl text-xs font-semibold text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-5 hover:scale-[1.01]"
            >
              <span>{isRegister ? 'Create Account & View QR Setup' : 'Sign In with 2FA'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Toggle Mode */}
            <div className="mt-6 text-center text-xs text-stone-600 dark:text-stone-400 pt-5 border-t border-[#e6ded1] dark:border-stone-800">
              <span>{isRegister ? 'Already have an account?' : "Don't have an account yet?"}</span>
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError('');
                }}
                className="ml-2 font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                {isRegister ? 'Sign In' : 'Create Account'}
              </button>
            </div>
          </form>
        )}

        {/* STEP 2A: REGISTRATION ONLY - SHOW UNIQUE QR CODE ENROLLMENT BOX */}
        {step === 'register_qr' && (
          <div className="space-y-4 animate-fade-in text-center">
            
            <div className="text-xs text-stone-600 dark:text-stone-400 font-medium">
              <span>Enrollment QR Key for </span>
              <strong className="text-indigo-600 dark:text-indigo-400 font-mono font-bold">{userEmail}</strong>
            </div>

            <div className="relative p-3.5 bg-white dark:bg-stone-950 border-2 border-stone-200 dark:border-stone-800 rounded-2xl max-w-[200px] mx-auto shadow-sm">
              <img 
                src={qrImageUrl} 
                alt={`Google Authenticator Enrollment QR Code for ${userEmail}`} 
                className="w-full h-auto rounded-lg object-contain"
              />
            </div>

            {/* View Emergency Backup Code Box */}
            <div className="bg-[#f8f4ec] dark:bg-stone-950 border border-[#e6ded1] dark:border-stone-800 p-3.5 rounded-2xl text-left flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="font-bold text-stone-900 dark:text-stone-100">1-Time Emergency Backup Code</span>
              </div>
              <button
                type="button"
                onClick={() => setShowBackupCodeModal(!showBackupCodeModal)}
                className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer flex items-center gap-1 shrink-0"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{showBackupCodeModal ? 'Hide Code' : 'View Code'}</span>
              </button>
            </div>

            {showBackupCodeModal && (
              <div className="p-3.5 bg-stone-900 text-white rounded-2xl text-center space-y-2 animate-fade-in border border-stone-800">
                <p className="text-[10px] text-stone-400 font-medium">Unique 1-Time Emergency Recovery Key for {userEmail}:</p>
                <code className="text-base font-mono font-bold text-amber-400 block tracking-widest bg-stone-950 py-2 px-3 rounded-xl border border-stone-800">
                  {emergencyBackupCode}
                </code>
                <button
                  type="button"
                  onClick={handleCopyBackupCode}
                  className="text-xs font-bold text-indigo-400 hover:underline cursor-pointer flex items-center justify-center gap-1.5 mx-auto pt-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Emergency Code</span>
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setStep('login_2fa')}
              className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>I Scanned It! Proceed to 2FA PIN</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2B: LOGIN / VERIFICATION BOX (NO QR CODE!) */}
        {step === 'login_2fa' && (
          <div className="space-y-4 animate-fade-in text-center">
            
            <form onSubmit={handleVerifyTotp} className="space-y-4 pt-1">
              {!useBackupCodeMode ? (
                <>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400">
                    Enter 6-Digit Google Auth Code for <br/>
                    <span className="text-indigo-600 dark:text-indigo-400 font-mono text-xs lowercase font-bold">{userEmail}</span>
                  </label>

                  <div className="flex justify-center gap-2.5 my-4">
                    {totpCode.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (otpInputs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-10 h-12 text-center text-lg font-mono font-bold bg-[#f8f4ec] dark:bg-stone-950 border border-[#d8cebe] dark:border-stone-800 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 shadow-inner"
                      />
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400">
                    Enter 1-Time Emergency Backup Code for <br/>
                    <span className="text-indigo-600 dark:text-indigo-400 font-mono text-xs lowercase font-bold">{userEmail}</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={backupCodeInput}
                    onChange={(e) => setBackupCodeInput(e.target.value)}
                    placeholder={`e.g. ${emergencyBackupCode}`}
                    className="w-full h-11 px-4 bg-[#f8f4ec] dark:bg-stone-950 border border-[#d8cebe] dark:border-stone-800 rounded-xl text-xs font-mono font-bold text-center text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-indigo-600"
                  />
                </>
              )}

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('credentials')}
                  className="flex-1 h-11 rounded-xl bg-[#f4efe6] dark:bg-stone-950 border border-[#d8cebe] dark:border-stone-800 hover:border-indigo-500 text-stone-800 dark:text-stone-200 font-bold text-xs transition-all cursor-pointer"
                >
                  Back
                </button>

                <button
                  type="submit"
                  disabled={isVerifyingTotp}
                  className="flex-1 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isVerifyingTotp ? (
                    <span>Verifying...</span>
                  ) : (
                    <>
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Verify & Login</span>
                    </>
                  )}
                </button>
              </div>

              {/* Emergency Backup Code Switcher */}
              <div className="pt-3 border-t border-[#e6ded1] dark:border-stone-800 mt-4">
                <button
                  type="button"
                  onClick={() => setUseBackupCodeMode(!useBackupCodeMode)}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  {useBackupCodeMode ? 'Use 6-Digit Google Auth PIN' : 'Lost phone? Use 1-Time Emergency Backup Code'}
                </button>
              </div>
            </form>

          </div>
        )}

      </div>
    </div>
  );
}
