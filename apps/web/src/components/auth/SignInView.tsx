'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Locale } from '@/lib/i18n';
import { Sheet } from '@/components/paper/Sheet';
import { Field } from '@/components/paper/Field';
import { PaperButton } from '@/components/paper/PaperButton';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/cn';

interface SignInViewProps {
  lang: Locale;
  dict: {
    signIn: {
      title: string;
      tabSignIn: string;
      tabSignUp: string;
      emailLabel: string;
      emailPlaceholder: string;
      passwordLabel: string;
      passwordPlaceholder: string;
      nameLabel: string;
      namePlaceholder: string;
      showPassword: string;
      hidePassword: string;
      submitSignIn: string;
      submitSignUp: string;
      mockHint: string;
    };
  };
}

export function SignInView({ lang, dict }: SignInViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('user@kepio.app');
  const [password, setPassword] = useState('demo1234');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      router.push(`/${lang}/library`);
    }, 400);
  };

  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div>
          <Link
            href={`/${lang}`}
            className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-ink-muted hover:text-ink transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>KEPIO</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ink">
            {dict.signIn.title}
          </h1>
        </div>

        {/* Layered Sheet with Tabs */}
        <div>
          {/* Tabs */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('signin')}
              className={cn(
                'px-4 py-2 font-mono text-xs uppercase tracking-wider rounded-t-paper border-t border-x transition-colors',
                activeTab === 'signin'
                  ? 'bg-paper text-ink font-bold border-rule -mb-px relative z-10'
                  : 'bg-desk text-ink-muted border-transparent hover:text-ink'
              )}
            >
              {dict.signIn.tabSignIn}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('signup')}
              className={cn(
                'px-4 py-2 font-mono text-xs uppercase tracking-wider rounded-t-paper border-t border-x transition-colors',
                activeTab === 'signup'
                  ? 'bg-paper text-ink font-bold border-rule -mb-px relative z-10'
                  : 'bg-desk text-ink-muted border-transparent hover:text-ink'
              )}
            >
              {dict.signIn.tabSignUp}
            </button>
          </div>

          <Sheet className="p-6 sm:p-8 space-y-5 rounded-tl-none">
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === 'signup' && (
                <Field
                  id="user-name"
                  label={dict.signIn.nameLabel}
                  placeholder={dict.signIn.namePlaceholder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              )}

              <Field
                id="user-email"
                type="email"
                label={dict.signIn.emailLabel}
                placeholder={dict.signIn.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="user-password"
                    className="block font-mono text-xs text-ink-muted uppercase"
                  >
                    {dict.signIn.passwordLabel}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="inline-flex items-center gap-1 font-mono text-[11px] text-ink-muted hover:text-ink"
                  >
                    {showPassword ? (
                      <>
                        <EyeOff className="w-3 h-3" />
                        <span>{dict.signIn.hidePassword}</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3 h-3" />
                        <span>{dict.signIn.showPassword}</span>
                      </>
                    )}
                  </button>
                </div>
                <input
                  id="user-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={dict.signIn.passwordPlaceholder}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-2.5 bg-paper border border-rule rounded-paper font-mono text-sm text-ink placeholder:text-ink-muted/50 focus:border-ink focus:ring-1 focus:ring-ink focus:outline-none transition-colors"
                />
              </div>

              <div className="pt-2">
                <PaperButton
                  type="submit"
                  variant="primary"
                  className="w-full justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? '...'
                    : activeTab === 'signin'
                    ? dict.signIn.submitSignIn
                    : dict.signIn.submitSignUp}
                </PaperButton>
              </div>
            </form>

            <div className="pt-2 border-t border-rule text-center">
              <p className="font-mono text-[11px] text-ink-muted leading-relaxed">
                {dict.signIn.mockHint}
              </p>
            </div>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
