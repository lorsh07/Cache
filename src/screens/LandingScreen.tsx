import { Camera, Link as LinkIcon, Palette } from "lucide-react";

interface LandingScreenProps {
  onLogin: () => void;
  onSignup: () => void;
}

const FEATURES = [
  { icon: LinkIcon, text: "웹에서 저장한 링크를 한곳에 모아보기" },
  { icon: Camera, text: "스크린샷과 사진을 갤러리로 정리" },
  { icon: Palette, text: "색상으로 나만의 카테고리 분류" },
];

export function LandingScreen({ onLogin, onSignup }: LandingScreenProps) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f5f5f7] dark:bg-black px-6 py-10">
      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-sm mx-auto w-full">
        <div className="w-20 h-20 rounded-[26px] bg-gradient-to-br from-[#FF3B30] via-[#FFCC00] to-[#007AFF] shadow-[var(--shadow-pop)] flex items-center justify-center mb-6">
          <LinkIcon size={32} className="text-white" strokeWidth={2} />
        </div>
        <h1 className="text-[34px] font-bold tracking-tight text-black/90 dark:text-white/90 mb-2">
          Cache
        </h1>
        <p className="text-[15px] text-black/50 dark:text-white/50 leading-relaxed mb-10">
          웹서핑과 인스타그램에서 저장한 것들을
          <br />
          한눈에 모아 분류하고 다시 찾아보세요
        </p>

        <div className="w-full space-y-4 text-left">
          {FEATURES.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <div className="w-9 h-9 shrink-0 rounded-xl bg-black/[0.05] dark:bg-white/[0.08] flex items-center justify-center">
                <Icon size={16} className="text-black/60 dark:text-white/70" />
              </div>
              <p className="text-[14px] text-black/65 dark:text-white/70">{text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-sm mx-auto w-full space-y-3">
        <button
          type="button"
          onClick={onSignup}
          className="w-full rounded-xl bg-[var(--color-accent)] text-white font-semibold py-3.5 text-[15px] transition-transform active:scale-[0.98]"
        >
          회원가입
        </button>
        <button
          type="button"
          onClick={onLogin}
          className="w-full rounded-xl bg-black/[0.06] dark:bg-white/[0.1] text-black/80 dark:text-white/85 font-semibold py-3.5 text-[15px] transition-transform active:scale-[0.98]"
        >
          로그인
        </button>
      </div>
    </div>
  );
}
