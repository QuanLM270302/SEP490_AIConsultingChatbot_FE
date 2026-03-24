import type { ReactNode } from "react";

type AuthHeroPanelProps = {
  children: ReactNode;
};

export function AuthHeroPanel({ children }: AuthHeroPanelProps) {
  return (
    <div className="relative hidden overflow-hidden bg-zinc-950 lg:flex lg:w-1/2 lg:items-center lg:justify-center">
      <div className="absolute inset-0 overflow-hidden">
        <video
          className="absolute left-1/2 top-1/2 h-[103%] min-h-full w-[103%] min-w-full -translate-x-1/2 -translate-y-1/2 object-cover blur-sm"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden
        >
          <source src="/videos/login-bg.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="absolute inset-0 bg-linear-to-br from-zinc-950/55 via-emerald-950/30 to-zinc-950/75" />
      <div className="absolute inset-0 bg-linear-to-t from-zinc-950/20 via-transparent to-zinc-950/55" />
      <div className="relative z-10 px-10 text-center lg:px-16">{children}</div>
    </div>
  );
}
