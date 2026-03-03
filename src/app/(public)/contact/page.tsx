'use client';

import { Button } from '@/components/ui/button';
import { Mail, MapPin, Phone, Clock, Send, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from '@/hooks/use-translation';

export default function ContactPage() {
  const { t } = useTranslation('contact');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setSubmitStatus('success');
    setIsSubmitting(false);
    setFormData({ name: '', email: '', subject: '', message: '' });

    // Reset success message after 5 seconds
    setTimeout(() => setSubmitStatus('idle'), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-primary/5 via-blue-500/5 to-purple-500/5 py-16 sm:py-20 md:py-24">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="animate-fade-in-down mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
              <MessageSquare className="h-4 w-4" />
              <span>{t('hero.badge')}</span>
            </div>

            <h1 className="animate-fade-in-up mb-6">
              {t('hero.title1')}{' '}
              <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t('hero.titleHighlight')}
              </span>
            </h1>

            <p className="animate-fade-in-up animation-delay-100 text-lg text-muted-foreground">
              {t('hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information + Form */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <h2 className="mb-8">{t('info.title')}</h2>

              <div className="space-y-6">
                {/* Email */}
                <div className="group flex items-start gap-4 rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
                  <div className="flex-shrink-0 rounded-xl bg-primary/10 p-3 transition-all duration-300 group-hover:scale-110">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="mb-1 font-semibold">{t('info.email.label')}</h4>
                    <a href="mailto:support@gydi.com" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                      {t('info.email.value')}
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="group flex items-start gap-4 rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-blue-500/50 hover:shadow-lg">
                  <div className="flex-shrink-0 rounded-xl bg-blue-500/10 p-3 transition-all duration-300 group-hover:scale-110">
                    <Phone className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="mb-1 font-semibold">{t('info.phone.label')}</h4>
                    <a href="tel:+1234567890" className="text-sm text-muted-foreground transition-colors hover:text-blue-600">
                      {t('info.phone.value')}
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="group flex items-start gap-4 rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-purple-500/50 hover:shadow-lg">
                  <div className="flex-shrink-0 rounded-xl bg-purple-500/10 p-3 transition-all duration-300 group-hover:scale-110">
                    <MapPin className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="mb-1 font-semibold">{t('info.address.label')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t('info.address.line1')}<br />
                      {t('info.address.line2')}<br />
                      {t('info.address.line3')}
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="group flex items-start gap-4 rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-orange-500/50 hover:shadow-lg">
                  <div className="flex-shrink-0 rounded-xl bg-orange-500/10 p-3 transition-all duration-300 group-hover:scale-110">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="mb-1 font-semibold">{t('info.hours.label')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t('info.hours.weekdays')}<br />
                      {t('info.hours.saturday')}<br />
                      {t('info.hours.sunday')}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {t('info.hours.support')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="rounded-3xl border-2 border-border/50 bg-card p-6 shadow-xl sm:p-8">
                <h2 className="mb-6">{t('form.title')}</h2>

                {submitStatus === 'success' && (
                  <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                    {t('form.success')}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-semibold text-foreground">
                      {t('form.name.label')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-border/50 bg-background px-4 py-3 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder={t('form.name.placeholder')}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-semibold text-foreground">
                      {t('form.email.label')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-border/50 bg-background px-4 py-3 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder={t('form.email.placeholder')}
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="mb-2 block text-sm font-semibold text-foreground">
                      {t('form.subject.label')} <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-border/50 bg-background px-4 py-3 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">{t('form.subject.placeholder')}</option>
                      <option value="hosting">{t('form.subject.hosting')}</option>
                      <option value="affiliate">{t('form.subject.affiliate')}</option>
                      <option value="support">{t('form.subject.support')}</option>
                      <option value="billing">{t('form.subject.billing')}</option>
                      <option value="partnership">{t('form.subject.partnership')}</option>
                      <option value="other">{t('form.subject.other')}</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="mb-2 block text-sm font-semibold text-foreground">
                      {t('form.message.label')} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="w-full rounded-xl border border-border/50 bg-background px-4 py-3 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder={t('form.message.placeholder')}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full transition-all duration-300 hover:scale-105"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                        {t('form.sending')}
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        {t('form.submit')}
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground">
                    {t('form.privacy')}{' '}
                    <a href="/privacy" className="text-primary hover:underline">{t('form.privacyLink')}</a>.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t bg-gradient-to-b from-gray-50/50 to-white py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4">{t('faq.title')}</h2>
            <p className="mb-12 text-lg text-muted-foreground">
              {t('faq.subtitle')}
            </p>

            <div className="space-y-4 text-left">
              <details className="group rounded-2xl border border-border/50 bg-card p-6">
                <summary className="cursor-pointer font-semibold text-foreground">
                  {t('faq.q1')}
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">
                  {t('faq.a1')}
                </p>
              </details>

              <details className="group rounded-2xl border border-border/50 bg-card p-6">
                <summary className="cursor-pointer font-semibold text-foreground">
                  {t('faq.q2')}
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">
                  {t('faq.a2')}
                </p>
              </details>

              <details className="group rounded-2xl border border-border/50 bg-card p-6">
                <summary className="cursor-pointer font-semibold text-foreground">
                  {t('faq.q3')}
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">
                  {t('faq.a3')}
                </p>
              </details>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
