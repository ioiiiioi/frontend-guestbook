import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Shield, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const email = location.state?.email || '';

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      toast({
        title: t('error'),
        description: t('pleaseEnterCompleteOTP'),
        variant: 'destructive',
      });
      return;
    }

    // API placeholder for OTP verification
    try {
      const response = await fetch('https://backend.ricefield-dev.cloud/api/v1/auth/verify-email/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpCode }),
      });

      toast({
        title: t('success'),
        description: t('otpVerified'),
      });

      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      toast({
        title: t('error'),
        description: t('invalidOTP'),
        variant: 'destructive',
      });
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    // API placeholder for resending OTP
    try {
      await fetch('https://backend.ricefield-dev.cloud/api/v1/auth/verify-email/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      toast({
        title: t('success'),
        description: t('otpResent'),
      });

      setTimer(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
    } catch (error) {
      toast({
        title: t('error'),
        description: t('resendFailed'),
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('otpVerification')} - Event Guestbook Platform</title>
        <meta name="description" content="Verify your OTP code" />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-yellow-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl font-bold">{t('verifyOTP')}</CardTitle>
              <CardDescription>
                {t('otpSentTo')} {email}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex gap-2 justify-center">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center text-lg font-bold"
                    />
                  ))}
                </div>

                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResend}
                      className="text-green-600 hover:underline font-medium"
                    >
                      {t('resendOTP')}
                    </button>
                  ) : (
                    <span>{t('resendIn')} {timer}s</span>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {t('verify')}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link to="/login" className="text-sm text-green-600 hover:underline">
                  {t('backToLogin')}
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default OTPVerification;