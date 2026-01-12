import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Building2, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

const Register = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: User Info
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    // Step 2: Company Info
    companyName: '',
    legalName: '',
    companyEmail: '',
    companyPhone: '',
    companyAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    website: '',
    nib: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    // Validate Step 1: Email, Password, First Name are required
    if (!formData.email || !formData.password || !formData.firstName) {
      toast({
        title: t('error'),
        description: t('pleaseFillAllFields'),
        variant: 'destructive',
      });
      return;
    }
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate Step 2: Name (companyName) and Legal Name are required
    if (!formData.companyName || !formData.legalName) {
      toast({
        title: t('error'),
        description: t('pleaseFillAllFields'),
        variant: 'destructive',
      });
      return;
    }

    // Construct the payload in the required structure
    const payload = {
      username: formData.email, // Using email as username
      email: formData.email,
      password: formData.password,
      first_name: formData.firstName,
      last_name: formData.lastName,
      company: {
        name: formData.companyName,
        legal_name: formData.legalName,
        email: formData.companyEmail,
        phone: formData.companyPhone,
        address: formData.companyAddress,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        country: formData.country,
        website: formData.website,
        nib: formData.nib,
      }
    };

    console.log('Registration Payload:', payload);

    // API placeholder for registration
    try {
      // const response = await fetch('https://backend.ricefield-dev.cloud/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload),
      // });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: t('success'),
        description: t('registrationSuccess'),
      });
      
      setTimeout(() => {
        navigate('/verify-otp', { state: { email: formData.email } });
      }, 1500);
    } catch (error) {
      toast({
        title: t('error'),
        description: t('registrationFailed'),
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('register')} - Event Guestbook Platform</title>
        <meta name="description" content="Register for Event Guestbook Platform" />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-yellow-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-xl"
        >
          <Card className="shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                {t('register')}
              </CardTitle>
              <CardDescription>
                {step === 1 ? t('step1UserInfo') : t('step2CompanyInfo')}
              </CardDescription>
              <div className="flex justify-center gap-2 mt-4">
                <div className={`h-2 w-16 rounded-full ${step === 1 ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'}`} />
                <div className={`h-2 w-16 rounded-full ${step === 2 ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'}`} />
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  {step === 1 ? (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-4">
                        <User className="w-5 h-5" />
                        <span className="font-semibold">{t('userInformation')}</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="Enter First Name"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Enter Last Name (Optional)"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter Email"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">Password *</Label>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Enter Password"
                          required
                        />
                      </div>

                      <Button
                        type="button"
                        onClick={handleNext}
                        className="w-full bg-green-600 hover:bg-green-700 mt-4"
                      >
                        {t('next')}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-4">
                        <Building2 className="w-5 h-5" />
                        <span className="font-semibold">{t('companyInformation')}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="companyName">Name *</Label>
                          <Input
                            id="companyName"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            placeholder="Company Name"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="legalName">Legal Name *</Label>
                          <Input
                            id="legalName"
                            name="legalName"
                            value={formData.legalName}
                            onChange={handleChange}
                            placeholder="Legal Entity Name"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="space-y-2">
                          <Label htmlFor="companyEmail">Email</Label>
                          <Input
                            id="companyEmail"
                            name="companyEmail"
                            type="email"
                            value={formData.companyEmail}
                            onChange={handleChange}
                            placeholder="Company Email (Optional)"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="companyPhone">Phone</Label>
                          <Input
                            id="companyPhone"
                            name="companyPhone"
                            type="tel"
                            value={formData.companyPhone}
                            onChange={handleChange}
                            placeholder="Phone Number (Optional)"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="companyAddress">Address</Label>
                        <Input
                          id="companyAddress"
                          name="companyAddress"
                          value={formData.companyAddress}
                          onChange={handleChange}
                          placeholder="Street Address (Optional)"
                        />
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="City"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            placeholder="State"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zipCode">Zip Code</Label>
                          <Input
                            id="zipCode"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleChange}
                            placeholder="Zip"
                          />
                        </div>
                         <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            placeholder="Country"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            placeholder="Website URL (Optional)"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="nib">NIB</Label>
                          <Input
                            id="nib"
                            name="nib"
                            value={formData.nib}
                            onChange={handleChange}
                            placeholder="NIB (Optional)"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 mt-6">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleBack}
                          className="flex-1"
                        >
                          <ArrowLeft className="mr-2 w-4 h-4" />
                          {t('back')}
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          {t('register')}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('alreadyHaveAccount')}{' '}
                  <Link to="/login" className="text-green-600 hover:underline font-medium">
                    {t('login')}
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

export default Register;