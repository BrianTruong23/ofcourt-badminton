'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../lib/supabase/client';
import Link from 'next/link';
import styles from './account.module.css';

const supabase = createClient();

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Log every render
  console.log('[AccountPage] render', {
    loading,
    hasUser: !!user,
    userId: user?.id,
  });

  useEffect(() => {
    console.log('[AccountPage] initAuth effect: mount');

    let cancelled = false;
    let subscription;

    const initAuth = async () => {
      console.log('[AccountPage] initAuth: start');

      try {
        console.log('[AccountPage] initAuth: calling supabase.auth.getSession');
        const { data, error } = await supabase.auth.getSession();
        console.log('[AccountPage] initAuth: getSession result', {
          data,
          error,
        });

        if (cancelled) {
          console.log('[AccountPage] initAuth: cancelled after getSession');
          return;
        }

        if (error) {
          console.error('[AccountPage] initAuth: getSession error', error);
        }

        const session = data?.session ?? null;
        console.log('[AccountPage] initAuth: derived session', {
          hasSession: !!session,
          userId: session?.user?.id,
        });

        setUser(session?.user ?? null);
        console.log('[AccountPage] initAuth: setUser called', {
          hasUser: !!session?.user,
        });

        console.log(
          '[AccountPage] initAuth: setting up onAuthStateChange listener'
        );
        const { data: listener } = supabase.auth.onAuthStateChange(
          (event, newSession) => {
            console.log(
              '[AccountPage] onAuthStateChange fired',
              event,
              {
                hasSession: !!newSession,
                userId: newSession?.user?.id,
              }
            );

            if (cancelled) {
              console.log(
                '[AccountPage] onAuthStateChange: cancelled, ignoring'
              );
              return;
            }

            setUser(newSession?.user ?? null);
            console.log('[AccountPage] onAuthStateChange: setUser called', {
              hasUser: !!newSession?.user,
            });
          }
        );

        subscription = listener?.subscription;
        console.log(
          '[AccountPage] initAuth: subscription set',
          !!subscription
        );
      } catch (err) {
        if (!cancelled) {
          console.error('[AccountPage] initAuth: error', err);
        } else {
          console.log(
            '[AccountPage] initAuth: error occurred but already cancelled'
          );
        }
      } finally {
        if (!cancelled) {
          console.log(
            '[AccountPage] initAuth: finally -> setLoading(false)'
          );
          setLoading(false);
        } else {
          console.log(
            '[AccountPage] initAuth: finally skipped setLoading because cancelled'
          );
        }
      }
    };

    initAuth();

    return () => {
      console.log('[AccountPage] initAuth effect: cleanup');
      cancelled = true;
      if (subscription) {
        console.log(
          '[AccountPage] initAuth effect: unsubscribing from auth listener'
        );
        subscription.unsubscribe();
      } else {
        console.log(
          '[AccountPage] initAuth effect: no subscription to unsubscribe'
        );
      }
    };
  }, []);

  // Log redirect decisions
  useEffect(() => {
    console.log('[AccountPage] redirect effect check', {
      loading,
      hasUser: !!user,
    });

    if (!loading && !user) {
      console.log('[AccountPage] redirecting to /login');
      router.replace('/login');
    }
  }, [loading, user, router]);

  // Log user changes
  useEffect(() => {
    console.log('[AccountPage] user state changed', {
      hasUser: !!user,
      userId: user?.id,
      email: user?.email,
    });
  }, [user]);

  // Log loading changes
  useEffect(() => {
    console.log('[AccountPage] loading state changed', { loading });
  }, [loading]);

  const handleLogout = async () => {
    console.log('[AccountPage] handleLogout called');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('[AccountPage] signOut error', error);
    } else {
      console.log('[AccountPage] signOut success, redirecting to /');
    }
    router.replace('/');
    router.refresh();
  };

  if (loading) {
    console.log('[AccountPage] render branch: loading spinner');
    return (
      <main className={styles.main}>
        <div className={styles.loading}>Loading account information...</div>
      </main>
    );
  }

  if (!user) {
    console.log(
      '[AccountPage] render branch: no user, returning null (redirect effect should run)'
    );
    return null;
  }

  const displayName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split('@')[0];

  const initial = displayName ? displayName[0].toUpperCase() : 'U';

  console.log('[AccountPage] render branch: authenticated user', {
    displayName,
    initial,
  });

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.avatar}>
              {user.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="Profile" />
              ) : (
                initial
              )}
            </div>
            <h1 className={styles.title}>{displayName}</h1>
            <p className={styles.subtitle}>
              Member since {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>

          <div className={styles.content}>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Account Details</h2>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Email Address</span>
                  <span className={styles.value}>{user.email}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>User ID</span>
                  <span
                    className={styles.value}
                    style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
                  >
                    {user.id}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.actions}>
              <Link
                href="/orders"
                className={`${styles.button} ${styles.primaryButton}`}
              >
                View Order History
              </Link>
              <button
                onClick={handleLogout}
                className={`${styles.button} ${styles.secondaryButton}`}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
