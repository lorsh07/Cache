import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { auth, googleProvider, isFirebaseConfigured } from "../lib/firebase";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  configured: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (name: string, email: string, password: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function translateAuthError(error: unknown): string {
  const code = (error as { code?: string })?.code ?? "";
  switch (code) {
    case "auth/email-already-in-use":
      return "이미 가입된 이메일이에요.";
    case "auth/invalid-email":
      return "이메일 형식이 올바르지 않아요.";
    case "auth/weak-password":
      return "비밀번호는 6자 이상이어야 해요.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "이메일 또는 비밀번호가 올바르지 않아요.";
    case "auth/popup-closed-by-user":
      return "로그인 창이 닫혔어요. 다시 시도해주세요.";
    default:
      return "문제가 발생했어요. 잠시 후 다시 시도해주세요.";
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      configured: isFirebaseConfigured,
      signInWithGoogle: async () => {
        if (!auth) return;
        try {
          await signInWithPopup(auth, googleProvider);
        } catch (error) {
          throw new Error(translateAuthError(error));
        }
      },
      signUpWithEmail: async (name, email, password) => {
        if (!auth) return;
        try {
          const credential = await createUserWithEmailAndPassword(auth, email, password);
          if (name.trim()) {
            await updateProfile(credential.user, { displayName: name.trim() });
          }
        } catch (error) {
          throw new Error(translateAuthError(error));
        }
      },
      signInWithEmail: async (email, password) => {
        if (!auth) return;
        try {
          await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
          throw new Error(translateAuthError(error));
        }
      },
      signOutUser: async () => {
        if (!auth) return;
        await signOut(auth);
      },
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
