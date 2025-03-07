'use client';
import React, { useState, useEffect } from 'react';
import { nhost } from './lib/nhost-client';
import Dashboard from './dashboard';

export default function Authentication() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const signInUser = async () => {
      try {
        let needsRefresh = false;
        if (!localStorage.getItem('nhostRefreshToken')) {
          needsRefresh = true;
        }

        await nhost.auth.signIn({
          email: 'quentin@jarvi.tech',
          password: 'mYAW9QVdMKZenfbA',
        });

        if (needsRefresh) {
          await nhost.auth.refreshSession();
        }

        setIsAuthenticated(true);
      } catch (err) {
        console.error(err);
        setError('Authentication failed');
      }
    };

    signInUser();
  }, []);

  if (isAuthenticated) {
    return <Dashboard />;
  } else {
    return (
      <div>
        <h1>{error}</h1>
        <p>Authenticating...</p>
      </div>
    );
  }
}
