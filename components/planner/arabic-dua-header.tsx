interface ArabicDuaHeaderProps {
  size?: "compact" | "hero";
}

/**
 * Verse with full tashkeel (Arabic diacritics).
 * الْحُسَيْنِ is highlighted in shrine red.
 */
export function ArabicDuaHeader({ size = "hero" }: ArabicDuaHeaderProps) {
  const arabicSizeClass =
    size === "compact"
      ? "text-lg leading-[2] sm:text-xl"
      : "text-2xl leading-[2.1] sm:text-3xl md:text-[2rem] md:leading-[2.2] lg:text-4xl";

  const translationSizeClass =
    size === "compact"
      ? "mt-0.5 text-[10px] leading-snug"
      : "mt-1 text-xs leading-snug sm:text-sm";

  return (
    <div className="mx-auto max-w-4xl text-center">
      <p
        className={`font-arabic font-bold tracking-wide ${arabicSizeClass}`}
        dir="rtl"
        lang="ar"
      >
        <span className="arabic-dua-gold">الَّذِينَ بَذَلُوا مُهَجَهُمْ دُونَ </span>
        <span className="arabic-dua-hussain">الْحُسَيْنِ</span>
        <span className="arabic-dua-gold"> عَلَيْهِ السَّلَامُ</span>
      </p>
      <p className={`mx-auto max-w-2xl font-normal tracking-wide text-zinc-400 ${translationSizeClass}`}>
        Those who sacrificed their hearts&apos; blood and vital lifeforce for the sake of{" "}
        <span className="arabic-dua-hussain font-semibold">Hussain</span>{" "}
        <span className="font-arabic text-zinc-500" dir="rtl" lang="ar">
          عَلَيْهِ السَّلَامُ
        </span>
      </p>
    </div>
  );
}
