// src/lib/hooks/useInvitation.ts
import { useState, useCallback } from 'react';
import * as API from '../../lib/allauth';

export interface InvitationValidationResponse {
  id: number;
  email: string;
  token: string;
  expires_at: string;
  used: boolean;
  [key: string]: any;
}

export function useInvitation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendEmailRequest = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      return await API.submitEmailRequest(email);
    } catch (e: any) {
      setError(e.data?.detail || e.message);
      return undefined;
    } finally {
      setLoading(false);
    }
  }, []);

  const validateToken = useCallback(async (token: string): Promise<InvitationValidationResponse | undefined> => {
    setLoading(true);
    setError(null);
    try {
      return await API.validateToken(token);
    } catch (e: any) {
      setError(e.data?.detail || e.message);
      return undefined;
    } finally {
      setLoading(false);
    }
  }, []);

  // 2) Signup dengan invitation
  const signupWithToken = useCallback(async ({
    email, password1, password2, token
  }: {
    email: string;
    password1: string;
    password2: string;
    token: string;
  }) => {
    setLoading(true); setError(null);
    try {
      // a) Panggil endpoint headless signup
      const signupResp = await API.registerWithInvitation({ email, password1, password2, token });
      // b) Jika signup berhasil, tandai token sebagai used
      if (signupResp && signupResp.detail) {
        await API.useInvitation(signupResp.id);   // atau panggil useInvitation(validateResp.id)
      }
      return signupResp;
    } catch (e: any) {
      setError(e.data?.detail || e.message);
      return undefined;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    sendEmailRequest,
    validateToken,
    signupWithToken,
  };
}
