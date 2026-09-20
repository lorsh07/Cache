import { useState, type FormEvent } from "react";
import { ChevronLeft } from "lucide-react";
import { useAuth } from "../store/AuthContext";
import { GoogleIcon } from "../components/GoogleIcon";

export type AuthMode = "login" | "signup";

interface AuthScreenProps {
  mode: AuthMode;
  onSwitchMode: (mode: AuthMode) => void;
  onBack: () => void;
}

export function AuthScreen({ mode, onSwitchMode, onBack }: AuthScreenProps) {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  const isSignup = mode === "signup";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (isSignup && password !== confirmPassword) {
      setError("비밀번호가 일치하지 않아요.");
      return;
    }

    setSubmitting(true);
    try {
      if (isSignup) {
        await signUpWithEmail(name, email, password);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "문제가 발생했어요.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    setGoogleSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : "문제가 발생했어요.");
    } finally {
      setGoogleSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f7] dark:bg-black px-6 py-8">
      <button
        type="button"
        onClick={onBack}
        className="w-9 h-9 rounded-full bg-black/[0.05] dark:bg-white/[0.08] flex items-center justify-center text-black/60 dark:text-white/70 mb-6"
        aria-label="뒤로"
      >
        <ChevronLeft size={18} />
      </button>

      <div className="max-w-sm w-full mx-auto flex-1 flex flex-col">
        <h1 className="text-[26px] font-bold text-black/90 dark:text-white/90 mb-1">
          {isSignup ? "회원가입" : "로그인"}
        </h1>
        <p className="text-[14px] text-black/45 dark:text-white/45 mb-7">
          {isSignup ? "Cache 계정을 만들어보세요" : "다시 만나서 반가워요"}
        </p>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={googleSubmitting}
          className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-white dark:bg-[#2c2c2e] ring-1 ring-black/10 dark:ring-white/15 py-3 text-[14.5px] font-semibold text-black/80 dark:text-white/85 transition-transform active:scale-[0.98] disabled:opacity-50 mb-5"
        >
          <GoogleIcon size={18} />
          Google로 계속하기
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="h-px flex-1 bg-black/10 dark:bg-white/15" />
          <span className="text-[12px] text-black/35 dark:text-white/35">또는</span>
          <div className="h-px flex-1 bg-black/10 dark:bg-white/15" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {isSignup && (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름"
              autoComplete="name"
              className="w-full rounded-xl bg-black/[0.05] dark:bg-white/[0.07] px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-[var(--color-accent)] placeholder:text-black/35 dark:placeholder:text-white/35"
            />
          )}
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            placeholder="이메일"
            autoComplete="email"
            className="w-full rounded-xl bg-black/[0.05] dark:bg-white/[0.07] px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-[var(--color-accent)] placeholder:text-black/35 dark:placeholder:text-white/35"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            minLength={6}
            placeholder="비밀번호 (6자 이상)"
            autoComplete={isSignup ? "new-password" : "current-password"}
            className="w-full rounded-xl bg-black/[0.05] dark:bg-white/[0.07] px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-[var(--color-accent)] placeholder:text-black/35 dark:placeholder:text-white/35"
          />
          {isSignup && (
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              required
              minLength={6}
              placeholder="비밀번호 확인"
              autoComplete="new-password"
              className="w-full rounded-xl bg-black/[0.05] dark:bg-white/[0.07] px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-[var(--color-accent)] placeholder:text-black/35 dark:placeholder:text-white/35"
            />
          )}

          {error && (
            <p className="text-[13px] font-medium text-[var(--color-red)] px-1">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-[var(--color-accent)] text-white font-semibold py-3.5 text-[15px] transition-transform active:scale-[0.98] disabled:opacity-50"
          >
            {submitting ? "처리 중..." : isSignup ? "가입하기" : "로그인"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => onSwitchMode(isSignup ? "login" : "signup")}
          className="mt-6 text-[13.5px] font-medium text-black/45 dark:text-white/45"
        >
          {isSignup ? "이미 계정이 있으신가요? " : "계정이 없으신가요? "}
          <span className="text-[var(--color-accent)] font-semibold">
            {isSignup ? "로그인" : "회원가입"}
          </span>
        </button>
      </div>
    </div>
  );
}
