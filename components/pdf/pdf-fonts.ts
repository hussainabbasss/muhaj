import { Font } from "@react-pdf/renderer";

let registered = false;

/** Registers Arabic TTF for PDF rendering (client-side, once). */
export function registerPdfFonts() {
  if (registered) return;
  registered = true;

  Font.register({
    family: "Arabic",
    fonts: [
      {
        src: "https://raw.githubusercontent.com/google/fonts/main/ofl/scheherazadenew/ScheherazadeNew-Regular.ttf",
        fontWeight: 400,
      },
      {
        src: "https://raw.githubusercontent.com/google/fonts/main/ofl/scheherazadenew/ScheherazadeNew-Bold.ttf",
        fontWeight: 700,
      },
    ],
  });
}
