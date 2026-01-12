import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { LogIn, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/components/ui/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError(t('pleaseFillAllFields'));
      setLoading(false);
      return;
    }

    // API placeholder for login
    try {
      // Simulate API call
      const response = await fetch('https://backend.ricefield-dev.cloud/api/v1/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      // Simulated successful response
      const mockUser = {
        username: result.data.username,
        email: result.data.email,
        name: result.data.name,
      };
      const mockToken = result.data.jwt.access;
      const mockRefreshToken = result.data.jwt.refresh;

      login(mockUser, mockToken, mockRefreshToken);
      
      toast({
        title: t('success'),
        description: t('loginSuccess'),
      });

      navigate('/dashboard');
    } catch (err) {
      setError(t('invalidCredentials'));
      toast({
        title: t('error'),
        description: t('loginFailed'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('login')} - Event Guestbook Platform</title>
        <meta name="description" content="Login to Event Guestbook Platform" />
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
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                The Guest Book
              </CardTitle>
              <CardDescription>
                by{' '}
                <a 
                  href="https://ricefield.agency" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-green-600 hover:underline font-medium"
                >
                  Ricefield
                </a>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">{t('email')}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t('enterEmail')}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{t('password')}</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={t('enterPassword')}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={loading}
                >
                  {loading ? t('loading') : t('login')}
                  <LogIn className="ml-2 w-4 h-4" />
                </Button>
              </form>

              <div className="mt-6 text-center space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('dontHaveAccount')}{' '}
                  <Link to="/register" className="text-green-600 hover:underline font-medium">
                    {t('register')}
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default Login;