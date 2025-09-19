// app/account/invitation/[token]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useInvitation } from '../../../../lib/hooks/useInvitation';

export default function InvitationSignupPage() {
  const { token } = useParams();
  const router = useRouter();
  const { loading, error, validateToken, signupWithToken } = useInvitation();

  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setMessage('Token tidak ditemukan');
      return;
    }
    (async () => {
      const resp = await validateToken(token as string);
      if (resp && resp.id) {
        setTokenValid(true);
        setEmail((resp as any).email || '');
      } else {
        setTokenValid(false);
        setMessage(error || (resp as any)?.detail || 'Token tidak valid atau kadaluarsa');
      }
    })();
  }, [token, validateToken, error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (password1 !== password2) {
      setMessage('Password dan konfirmasi harus sama');
      return;
    }

    try {
      const resp: any = await signupWithToken({
        email,
        password1,
        password2,
        token: token as string,
      });

      if (resp && (resp as any).success) {
        // Kalau backend kasih pesan verifikasi email
        if (resp.detail?.toLowerCase().includes('verification')) {
          router.push('/account/verify-email');
        } else {
          router.push('/account');
        }
      } else {
        setMessage(resp?.detail || error || 'Pendaftaran gagal');
      }
    } catch (err: any) {
      setMessage(err?.data?.detail || err.message || 'Pendaftaran gagal');
    }
  };

  if (tokenValid === null) {
    return <p>Memverifikasi token...</p>;
  }

  if (!tokenValid) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{message}</div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Daftar dengan Undangan</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={email}
            readOnly
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password1" className="form-label">Password</label>
          <input
            type="password"
            id="password1"
            className="form-control"
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password2" className="form-label">Konfirmasi Password</label>
          <input
            type="password"
            id="password2"
            className="form-control"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
          />
        </div>
        {message && <div className="alert alert-warning">{message}</div>}
        <button type="submit" className="btn btn-success" disabled={loading}>
          {loading ? 'Memproses...' : 'Daftar'}
        </button>
      </form>
    </div>
  );
}
