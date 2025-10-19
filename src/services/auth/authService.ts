interface LoginPayload {
  email: string;
  passcode: string;
}

interface LoginResponse {
  token: string;
  operator: {
    name: string;
    role: string;
  };
}

export const login = async ({ email, passcode }: LoginPayload): Promise<LoginResponse> =>
  new Promise((resolve, reject) => {
    window.setTimeout(() => {
      if (email.trim().toLowerCase() === 'system.admin@authyntic.one' && passcode.trim() === 'operator') {
        resolve({
          token: 'demo-session-token',
          operator: {
            name: 'System Admin',
            role: 'Strategic Control',
          },
        });
        return;
      }

      if (email.trim() && passcode.trim()) {
        resolve({
          token: 'demo-session-token',
          operator: {
            name: email.trim(),
            role: 'Observer',
          },
        });
        return;
      }

      reject(new Error('Enter a valid email and passcode.'));
    }, 650);
  });
