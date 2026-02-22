'use client';

import { App, type URLOpenListenerEvent } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { Capacitor, type PluginListenerHandle } from '@capacitor/core';
import { useEffect } from 'react';

const MOBILE_CALLBACK_SCHEMES = ['boostus:', 'com.boostus.app:'];

const normalizeRedirectPath = (redirect: string | null): string => {
  if (!redirect) return '/';
  return redirect.startsWith('/') ? redirect : '/';
};

const isMobileOAuthCallbackUrl = (rawUrl: string): boolean => {
  try {
    const parsed = new URL(rawUrl);
    return (
      MOBILE_CALLBACK_SCHEMES.includes(parsed.protocol) &&
      parsed.host === 'auth' &&
      parsed.pathname === '/callback'
    );
  } catch {
    return false;
  }
};

const completeMobileLogin = async (code: string): Promise<void> => {
  const res = await fetch('/api/auth/mobile/complete', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'x-proxied-by': 'next',
    },
    body: JSON.stringify({ code }),
  });

  if (!res.ok) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    throw new Error(`mobile oauth complete failed: ${res.status}`);
  }
};

const closeBrowserIfAvailable = async (): Promise<void> => {
  if (!Capacitor.isPluginAvailable('Browser')) return;

  try {
    await Browser.close();
  } catch {
    // no-op
  }
};

const MobileOAuthBridge = () => {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let listener: PluginListenerHandle | null = null;

    const handleOAuthCallback = async (rawUrl: string) => {
      if (!isMobileOAuthCallbackUrl(rawUrl)) {
        return;
      }

      const parsed = new URL(rawUrl);
      const code = parsed.searchParams.get('code');
      const redirect = normalizeRedirectPath(
        parsed.searchParams.get('redirect')
      );

      if (!code) {
        await closeBrowserIfAvailable();
        window.location.href = '/login?error=missing_oauth_code';
        return;
      }

      try {
        await completeMobileLogin(code);
        await closeBrowserIfAvailable();
        window.location.href = redirect;
      } catch (error) {
        console.error('Mobile OAuth completion failed:', error);
        await closeBrowserIfAvailable();
        window.location.href = '/login?error=mobile_oauth_failed';
      }
    };

    void (async () => {
      listener = await App.addListener(
        'appUrlOpen',
        (event: URLOpenListenerEvent) => {
          void handleOAuthCallback(event.url);
        }
      );

      const launchData = await App.getLaunchUrl();
      if (launchData?.url) {
        void handleOAuthCallback(launchData.url);
      }
    })();

    return () => {
      if (listener) {
        void listener.remove();
      }
    };
  }, []);

  return null;
};

export default MobileOAuthBridge;
