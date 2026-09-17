import { AlertTriangle } from "lucide-react";

export function FirebaseSetupNotice() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#f5f5f7] dark:bg-black">
      <div className="max-w-sm w-full rounded-3xl bg-white dark:bg-[#1c1c1e] p-6 shadow-[var(--shadow-card)] dark:shadow-[var(--shadow-card-dark)] text-center">
        <div className="w-14 h-14 rounded-2xl bg-[var(--color-yellow)]/15 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={26} className="text-[var(--color-yellow)]" strokeWidth={1.75} />
        </div>
        <h1 className="text-lg font-bold text-black/90 dark:text-white/90 mb-2">
          Firebase 설정이 필요해요
        </h1>
        <p className="text-[14px] text-black/55 dark:text-white/55 leading-relaxed mb-4">
          로그인/회원가입(구글 로그인 포함) 기능을 쓰려면 Firebase 프로젝트를 만들고
          <code className="mx-1 px-1.5 py-0.5 rounded bg-black/[0.06] dark:bg-white/[0.1] text-[12.5px]">
            .env.local
          </code>
          에 설정 값을 채워야 해요.
        </p>
        <ol className="text-left text-[13px] text-black/60 dark:text-white/60 space-y-1.5 mb-4 list-decimal list-inside">
          <li>console.firebase.google.com 에서 새 프로젝트 생성</li>
          <li>웹 앱 추가 후 설정 값(config) 복사</li>
          <li>Authentication → Sign-in method 에서 Google, 이메일/비밀번호 사용 설정</li>
          <li>
            프로젝트 루트의{" "}
            <code className="px-1 py-0.5 rounded bg-black/[0.06] dark:bg-white/[0.1] text-[12px]">
              .env.example
            </code>
            을{" "}
            <code className="px-1 py-0.5 rounded bg-black/[0.06] dark:bg-white/[0.1] text-[12px]">
              .env.local
            </code>
            로 복사하고 값 채우기
          </li>
          <li>개발 서버 재시작 (npm run dev)</li>
        </ol>
        <p className="text-[12px] text-black/35 dark:text-white/35">
          자세한 방법은 README.md를 참고하세요.
        </p>
      </div>
    </div>
  );
}
