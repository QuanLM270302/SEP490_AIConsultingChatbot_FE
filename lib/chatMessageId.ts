import type { ChatMessageResponse } from "@/types/chatbot";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Backend history/chat payloads may expose the row id as `messageId`, `id`, or `message_id`.
 */
export function resolveServerMessageId(
  msg: ChatMessageResponse | Record<string, unknown> | null | undefined
): string | undefined {
  if (!msg || typeof msg !== "object") return undefined;
  const record = msg as Record<string, unknown>;
  const raw = record.messageId ?? record.message_id ?? record.id;
  if (raw == null) return undefined;
  const s = String(raw).trim();
  if (!s || s === "undefined" || s === "null") return undefined;
  return s;
}

export function isRatingMessageId(id: string | null | undefined): boolean {
  if (id == null || typeof id !== "string") return false;
  return UUID_RE.test(id.trim());
}
