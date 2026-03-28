/**
 * Ngày sinh: hiển thị/nhập dd/mm/yyyy; API giữ ISO yyyy-mm-dd (không đổi backend).
 */

/** ISO "YYYY-MM-DD" hoặc ISO datetime → "dd/mm/yyyy" để hiển thị. */
export function isoDateToDdMmYyyy(iso: string | null | undefined): string {
  if (!iso) return "";
  const part = iso.slice(0, 10);
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(part);
  if (!m) return "";
  return `${m[3]}/${m[2]}/${m[1]}`;
}

/** Chuỗi chỉ số (tối đa 8) → định dạng dd/mm/yyyy khi gõ. */
export function formatDobDigitsInput(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export type ParseDobResult =
  | { ok: true; iso: string | null }
  | { ok: false; message: string };

/** Parse "dd/mm/yyyy"; rỗng → không gửi ngày (null). */
export function parseDdMmYyyy(input: string): ParseDobResult {
  const t = input.trim();
  if (!t) return { ok: true, iso: null };

  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(t);
  if (!m) {
    return {
      ok: false,
      message: "Ngày sinh phải đúng định dạng dd/mm/yyyy (ví dụ 15/08/2000).",
    };
  }
  const day = parseInt(m[1], 10);
  const month = parseInt(m[2], 10) - 1;
  const year = parseInt(m[3], 10);
  const date = new Date(year, month, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return { ok: false, message: "Ngày sinh không hợp lệ." };
  }
  const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return { ok: true, iso };
}

/** Đủ tuổi theo năm (local date), ví dụ 18. */
export function isAtLeastYearsOld(birth: Date, years: number): boolean {
  const boundary = new Date(
    birth.getFullYear() + years,
    birth.getMonth(),
    birth.getDate()
  );
  const today = new Date();
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  return boundary <= todayStart;
}

/** Thông báo tuổi tối thiểu (dùng chung validate + gợi ý trên form). */
export const DOB_UNDER_18_MESSAGE =
  "Bạn phải đủ 18 tuổi trở lên để sử dụng ứng dụng.";

export function validateDobForSubmit(input: string): ParseDobResult {
  const parsed = parseDdMmYyyy(input);
  if (!parsed.ok) return parsed;
  if (parsed.iso === null) return { ok: true, iso: null };
  const [y, mo, d] = parsed.iso.split("-").map(Number);
  const birth = new Date(y, mo - 1, d);
  if (!isAtLeastYearsOld(birth, 18)) {
    return {
      ok: false,
      message: DOB_UNDER_18_MESSAGE,
    };
  }
  return parsed;
}

/** Hiển thị đọc (card): dd/mm/yyyy hoặc — */
export function formatDobDisplay(iso: string | null | undefined): string {
  if (!iso) return "—";
  const s = isoDateToDdMmYyyy(iso);
  return s || "—";
}
