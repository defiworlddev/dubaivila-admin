import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { authService } from '../service/authService';

export const Verification = () => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const { verifyCode, login } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const phoneNumber = location.state?.phoneNumber || '';

  useEffect(() => {
    if (!phoneNumber) {
      navigate('/login');
    }
  }, [phoneNumber, navigate]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (code.length !== 6) {
      setError('Please enter the 6-digit verification code');
      return;
    }

    setIsLoading(true);
    try {
      await verifyCode(phoneNumber, code);
      // Check if user needs to complete registration
      const currentUser = authService.getCurrentUser();
      if (currentUser?.isNewUser) {
        navigate('/register');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid verification code');
      setCode('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    
    setError('');
    setIsLoading(true);
    try {
      await login(phoneNumber);
      setResendCooldown(60);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 border border-primary-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-900 mb-2">Verify Your Phone</h1>
          <p className="text-primary-700 font-medium">
            Enter the 6-digit code sent to<br />
            <span className="font-semibold text-primary-900">{phoneNumber}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="code" className="block text-sm font-semibold text-primary-800 mb-2">
              Verification Code
            </label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setCode(value);
              }}
              placeholder="123456"
              className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 outline-none transition text-center text-2xl tracking-widest font-mono text-primary-900 bg-white"
              disabled={isLoading}
              maxLength={6}
              autoFocus
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || code.length !== 6}
            className="w-full bg-primary-700 text-white py-3 rounded-lg font-semibold hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg hover:shadow-xl"
          >
            {isLoading ? 'Verifying...' : 'Verify'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResend}
              disabled={resendCooldown > 0 || isLoading}
              className="text-primary-700 hover:text-primary-800 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {resendCooldown > 0
                ? `Resend code in ${resendCooldown}s`
                : "Didn't receive code? Resend"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

