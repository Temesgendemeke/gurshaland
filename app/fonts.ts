import localFont from "next/font/local";
import { Instrument_Sans } from "next/font/google";


export const InstrumentSansFont = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const SatoshiFont = localFont({
  src: [
    {
      path: "../public/fonts/Satoshi-Light.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/Satoshi-LightItalic.woff",
      weight: "300",
      style: "italic",
    },
    {
      path: "../public/fonts/Satoshi-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Satoshi-Italic.woff",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/Satoshi-Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Satoshi-MediumItalic.woff",
      weight: "500",
      style: "italic",
    },
    {
      path: "../public/fonts/Satoshi-Bold.woff",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/Satoshi-BoldItalic.woff",
      weight: "700",
      style: "italic",
    },
    {
      path: "../public/fonts/Satoshi-Black.woff",
      weight: "900",
      style: "normal",
    },
    {
      path: "../public/fonts/Satoshi-BlackItalic.woff",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-statoshi",
  display: "swap",
});

export const GoshFont = localFont({
  src: [
    {
      path: "../public/fonts/goshtrial-light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/goshtrial-lightitalic.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../public/fonts/goshtrial-regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/goshtrial-italic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/goshtrial-semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/goshtrial-semibolditalic.otf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../public/fonts/goshtrial-bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/goshtrial-bolditalic.otf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../public/fonts/goshtrial-heavy.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/fonts/goshtrial-heavyitalic.otf",
      weight: "800",
      style: "italic",
    },
    {
      path: "../public/fonts/goshtrial-black.otf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../public/fonts/goshtrial-blackitalic.otf",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-gosh",
  display: "swap",
});
