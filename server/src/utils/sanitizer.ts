import DOMPurify from "dompurify"
import { JSDOM } from "jsdom"

// Create a DOM window for server-side DOMPurify
const window = new JSDOM("").window
const purify = DOMPurify(window as any)

// Configure DOMPurify for markdown content
const sanitizeConfig = {
  ALLOWED_TAGS: [
    "p",
    "br",
    "strong",
    "em",
    "u",
    "s",
    "code",
    "pre",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "ul",
    "ol",
    "li",
    "blockquote",
    "a",
  ],
  ALLOWED_ATTR: ["href", "title"],
  ALLOW_DATA_ATTR: false,
  FORBID_SCRIPT: true,
  FORBID_TAGS: ["script", "object", "embed", "form", "input", "textarea"],
  FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover", "style"],
}

export const sanitizeMarkdown = (content: string): string => {
  if (!content || typeof content !== "string") {
    return ""
  }

  // First sanitize the raw content
  const sanitized = purify.sanitize(content, sanitizeConfig)

  // Additional custom sanitization
  return sanitized
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove any remaining scripts
    .replace(/javascript:/gi, "") // Remove javascript: protocols
    .replace(/on\w+\s*=/gi, "") // Remove event handlers
    .trim()
}

export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== "string") {
    return ""
  }

  return input
    .replace(/[<>]/g, "") // Remove angle brackets
    .replace(/javascript:/gi, "") // Remove javascript protocols
    .replace(/on\w+\s*=/gi, "") // Remove event handlers
    .trim()
}
