import DOMPurify from "isomorphic-dompurify";

export const sanitizeHtml = (input: string) =>
  DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "u", "br", "p", "span", "sup", "sub"],
    ALLOWED_ATTR: ["class"],
  });
