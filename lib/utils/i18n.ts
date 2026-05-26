// lib/getField.ts
import i18n from "@/i18n";

export function getField<T extends object | undefined>(
  obj: T,
  field: keyof T | (string & {}),
  fallback = "en"
): string {
  if (!obj || !field) return "";

  const lang = resolveCurrentLang();
  const o = obj as Record<string, unknown>;
  const f = field as string;

  return (
    (o[`${f}_${lang}`] as string) ??
    (o[`${f}_${fallback}`] as string) ??
    (o[f] as string) ??
    ""
  );
}

function resolveCurrentLang(): string {
  const raw = (i18n.language || "en").toLowerCase();

  if (raw.startsWith("ru")) return "ru";
  if (raw.startsWith("uz")) return "uz";
  return "en";
}
