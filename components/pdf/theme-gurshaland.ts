import { defaultPrimitives } from "./primitives";
import type { PdfcnTheme } from "./theme-types";

export const gurshalandPdfTheme: PdfcnTheme = {
  colors: {
    accent: "#c03622",
    background: "#ffffff",
    border: "#e4e4e7",
    destructive: "#dc2626",
    foreground: "#18181b",
    info: "#0ea5e9",
    muted: "#fafafa",
    mutedForeground: "#71717a",
    primary: "#c03622",
    primaryForeground: "#ffffff",
    success: "#16a34a",
    warning: "#d97706",
  },
  name: "gurshaland",
  page: {
    orientation: "portrait",
    size: "A4",
  },
  primitives: defaultPrimitives,
  spacing: {
    componentGap: 12,
    page: {
      marginBottom: 36,
      marginLeft: 36,
      marginRight: 36,
      marginTop: 36,
    },
    paragraphGap: 8,
    sectionGap: 18,
  },
  typography: {
    body: {
      fontFamily: "Helvetica",
      fontSize: 10,
      lineHeight: 1.5,
    },
    heading: {
      fontFamily: "Times-Roman",
      fontSize: {
        h1: 24,
        h2: 18,
        h3: 14,
        h4: 12,
        h5: 10,
        h6: 8.5,
      },
      fontWeight: 700,
      lineHeight: 1.2,
    },
  },
};
