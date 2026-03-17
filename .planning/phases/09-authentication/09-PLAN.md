---
phase: 9
plan: 1
title: "AuthContext + Supabase Auth Logic"
wave: 1
depends_on: ["08-01"]
files_modified:
  - "app/src/contexts/AuthContext.tsx"
requirements:
  - AUTH-01
  - AUTH-02
  - AUTH-03
  - AUTH-04
  - AUTH-06
autonomous: true
---

# Plan 09-01: AuthContext + Supabase Auth Logic

## Objective

Create AuthContext provider that wraps the entire app with Supabase auth state. Handles signup, login (email + Google), logout, session auto-refresh, and exposes user/loading state to all components.

## Context

- Supabase client already exists at `app/src/lib/supabase.ts`
- Current app uses no auth — API key stored in localStorage
- Supabase Auth handles: password hashing, JWT tokens, refresh, Google OAuth callback
- Google OAuth provider must be configured in Supabase Dashboard manually (not code)
- `onAuthStateChange` listener handles session lifecycle

## Tasks

<task id="01" title="Create AuthContext provider">
Create `app/src/contexts/AuthContext.tsx`:

```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    return { error: error ? new Error(error.message) : null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? new Error(error.message) : null };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    return { error: error ? new Error(error.message) : null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
```

Key design decisions:
- `loading` state prevents flash of login screen on refresh
- `onAuthStateChange` handles silent token refresh (AUTH-04)
- Google OAuth uses redirect flow (not popup — more reliable)
- Error handling returns `{ error }` for consistent UI handling
</task>

## Verification

- [ ] `AuthContext.tsx` exports `AuthProvider` and `useAuth`
- [ ] All 5 auth functions implemented: signUp, signIn, signInWithGoogle, signOut
- [ ] onAuthStateChange listener handles session changes
- [ ] Loading state prevents premature render
- [ ] `vite build` passes

## must_haves

- AuthProvider wraps app with user/session/loading state
- signUp with email/password + optional name
- signIn with email/password
- signInWithGoogle via OAuth redirect
- signOut clears session
- Auto-refresh via onAuthStateChange (AUTH-04)

---
---
phase: 9
plan: 2
title: "Login + Register Screens"
wave: 1
depends_on: ["09-01"]
files_modified:
  - "app/src/LoginScreen.tsx"
  - "app/src/RegisterScreen.tsx"
requirements:
  - UI-01
  - UI-02
autonomous: true
---

# Plan 09-02: Login + Register Screens

## Objective

Create Login and Register screens matching the existing app's dark mode design system. Login has email/password form + Google button. Register has email/password + name.

## Context

- App uses TailwindCSS v4 with custom tokens: `bg-bg-base`, `bg-bg-surface1`, `text-text-primary`, `text-accent`, etc.
- Motion library for animations (`motion/react`)
- Lucide icons for iconography
- No routing library — screens rendered via `currentScreen` state in `App.tsx`
- Existing form patterns: see `SettingsModal` (lines 311-381) for input/button styles
- Google button should use branded Google colors (white bg + Google logo SVG)

## Tasks

<task id="01" title="Create LoginScreen component">
Create `app/src/LoginScreen.tsx`:

- Email input + Password input
- "Sign In" button (ai-gradient style)
- "Continue with Google" button (white bg, Google logo)
- "Don't have an account? Sign up" link → navigates to register screen
- Error display for auth failures
- Loading state on submit
- Uses `useAuth().signIn` and `useAuth().signInWithGoogle`
- Motion entrance animation (consistent with other screens)
- Responsive — centered, max-width 400px

Design notes:
- Match existing dark mode aesthetic
- Use existing CSS classes: `bg-bg-surface1`, `border border-border-default`, `rounded-xl`, etc.
- Input styling from SettingsModal: `bg-bg-surface1 border border-border-default hover:border-border-hover focus:border-accent focus:ring-1 focus:ring-accent rounded-lg px-[14px] py-[10px] text-[14px]`
</task>

<task id="02" title="Create RegisterScreen component">
Create `app/src/RegisterScreen.tsx`:

- Name input + Email input + Password input
- "Create Account" button (ai-gradient style)
- "Continue with Google" button
- "Already have an account? Sign in" link → navigates to login screen
- Error display + loading state
- Uses `useAuth().signUp` and `useAuth().signInWithGoogle`
- Same design language as LoginScreen
</task>

## Verification

- [ ] LoginScreen renders with email, password, Google button
- [ ] RegisterScreen renders with name, email, password, Google button
- [ ] Both screens use existing design tokens and dark mode aesthetic
- [ ] Navigation links between login ↔ register work
- [ ] Error messages display correctly
- [ ] Loading state shown during auth operations
- [ ] `vite build` passes

## must_haves

- Login page with email/password form and Google sign-in button (UI-01)
- Register page with email/password + name form (UI-02)
- Consistent dark mode design with existing app
- Error handling and loading states

---
---
phase: 9
plan: 3
title: "Auth Gate + App Integration"
wave: 2
depends_on: ["09-01", "09-02"]
files_modified:
  - "app/src/App.tsx"
  - "app/src/main.tsx"
requirements:
  - AUTH-05
  - UI-03
autonomous: true
---

# Plan 09-03: Auth Gate + App Integration

## Objective

Wrap the App with AuthProvider and add auth gate logic: unauthenticated users see Login/Register only, authenticated users see the full app. Add logout button to header.

## Context

- App.tsx currently renders all screens based on `currentScreen` state (line 14)
- `main.tsx` renders `<App />` directly
- Need: `main.tsx` wraps with `<AuthProvider>`, App.tsx checks auth state
- Screen type needs `login` and `register` added
- Header needs user menu or logout button
- API key currently saved in localStorage — keep working for now (Phase 10 moves to server)

## Tasks

<task id="01" title="Wrap App with AuthProvider in main.tsx">
Edit `app/src/main.tsx`:
- Import `AuthProvider` from `./contexts/AuthContext`
- Wrap `<App />` with `<AuthProvider>`

```tsx
import { AuthProvider } from './contexts/AuthContext';

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
```
</task>

<task id="02" title="Add auth gate to App.tsx">
Edit `app/src/App.tsx`:

1. Add `'login' | 'register'` to `Screen` type
2. Import `useAuth` from `./contexts/AuthContext`
3. Import `LoginScreen` and `RegisterScreen`
4. At the top of App component, add auth gate:

```tsx
const { user, loading, signOut } = useAuth();
const [authScreen, setAuthScreen] = useState<'login' | 'register'>('login');

// Auth gate: show loading or auth screens if not logged in
if (loading) {
  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center">
      <div className="w-8 h-8 rounded ai-gradient animate-pulse" />
    </div>
  );
}

if (!user) {
  return (
    <div className="min-h-screen bg-bg-base text-text-primary font-sans">
      <AnimatePresence mode="wait">
        {authScreen === 'login' ? (
          <LoginScreen key="login" onSwitchToRegister={() => setAuthScreen('register')} />
        ) : (
          <RegisterScreen key="register" onSwitchToLogin={() => setAuthScreen('login')} />
        )}
      </AnimatePresence>
    </div>
  );
}
```

5. Add logout to header — replace Settings button area with user indicator + logout:
```tsx
<div className="flex items-center gap-3">
  <span className="text-[12px] text-text-tertiary hidden sm:inline">{user.email}</span>
  <button onClick={() => setIsSettingsOpen(true)} ...>
    <Settings />
  </button>
  <button onClick={signOut} className="text-text-secondary hover:text-text-primary transition-colors" aria-label="Sign out">
    <LogOut className="w-4 h-4" />
  </button>
</div>
```

6. Import `LogOut` from lucide-react
</task>

<task id="03" title="Update LoginScreen and RegisterScreen props">
Update LoginScreen to accept `onSwitchToRegister` prop instead of navigating via screen state.
Update RegisterScreen to accept `onSwitchToLogin` prop.

This keeps auth screen navigation separate from the main app's screen routing.
</task>

## Verification

- [ ] App shows loading spinner while checking auth state
- [ ] Unauthenticated users see LoginScreen only
- [ ] After login → full app visible (Landing screen)
- [ ] After register → full app visible (or email confirmation if enabled)
- [ ] Logout button in header → returns to LoginScreen
- [ ] Page refresh → app checks session, shows app if still logged in
- [ ] Login ↔ Register navigation works
- [ ] `vite build` passes
- [ ] No flash of app content before auth check completes

## must_haves

- Auth gate blocks unauthenticated access (AUTH-05, UI-03)
- Loading state during session check (no flash)
- Logout button in header
- Smooth transitions between login/register/app
