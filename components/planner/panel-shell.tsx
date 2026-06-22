import type { ReactNode } from "react";

interface PanelShellProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  inactive?: boolean;
  children?: ReactNode;
}

export function PanelShell({
  title,
  subtitle,
  icon,
  inactive,
  children,
}: PanelShellProps) {
  return (
    <section
      className={`animate-fade-up overflow-hidden rounded-2xl transition-all ${
        inactive ? "glass-panel-inactive" : "glass-panel"
      }`}
    >
      <div className="p-6 md:p-8">
        <div className="mb-5 flex items-center gap-4">
          {icon && (
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${
                inactive
                  ? "border-white/5 bg-white/[0.02] text-zinc-500"
                  : "border-[#D4AF37]/20 bg-[#D4AF37]/10 text-[#D4AF37]"
              }`}
            >
              {icon}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-lg font-semibold tracking-wide text-zinc-100 md:text-xl">
              {title}
            </h3>
            {subtitle && (
              <p className="mt-1 text-sm tracking-wide text-zinc-400">{subtitle}</p>
            )}
          </div>
        </div>
        <div className="text-zinc-100">{children}</div>
      </div>
    </section>
  );
}
