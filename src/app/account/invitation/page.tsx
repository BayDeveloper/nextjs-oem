// app/account/invitation/page.tsx
'use client';

import React, { useState } from 'react';
import { useInvitation } from '../../../lib/hooks/useInvitation';

export default function InvitationRequestPage() {
  const { loading, error, sendEmailRequest } = useInvitation();
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    const resp = await sendEmailRequest(email);
    if (resp?.detail) {
      setSuccessMessage(resp.detail);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Ajukan Permintaan Undangan</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email Anda</label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Mengirim...' : 'Kirim Permintaan Undangan'}
        </button>
      </form>
    </div>
  );
}
