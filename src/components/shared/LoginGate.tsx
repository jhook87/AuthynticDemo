import { useState } from 'react';
import { login } from '../../services/auth/authService';

interface LoginGateProps {
  onAuthenticated: (session: { token: string; operator: { name: string; role: string } }) => void;
}

export const LoginGate = ({ onAuthenticated }: LoginGateProps) => {
  const [email, setEmail] = useState('system.admin@authyntic.one');
  const [passcode, setPasscode] = useState('operator');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const session = await login({ email, passcode });
      onAuthenticated(session);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.');
      setSubmitting(false);
    }
  };

  return (
    <div className="login-gate">
      <div className="login-panel">
        <header>
          <span>Authyntic Strategic Control</span>
          <h1>Operator Console Access</h1>
          <p>Sign in to view the live strategic dashboard demo.</p>
        </header>
        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>
          <label>
            Passcode
            <input
              type="password"
              value={passcode}
              onChange={(event) => setPasscode(event.target.value)}
              placeholder="Enter demo passcode"
              required
            />
          </label>
          {error && <p className="login-error">{error}</p>}
          <button type="submit" disabled={submitting}>
            {submitting ? 'Verifying access…' : 'Enter console'}
          </button>
        </form>
        <footer>
          <small>Demo credentials: system.admin@authyntic.one / operator</small>
        </footer>
      </div>
    </div>
  );
};
