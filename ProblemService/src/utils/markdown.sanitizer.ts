import sanitizeHtml from "sanitize-html";
import TurndownService from "turndown";
import logger from "../config/logger.config";

export async function sanitizeMarkdown(markdown: string): Promise<string> {
  if (!markdown || typeof markdown !== "string") {
    return "";
  }

  try {
    const sanitized = sanitizeHtml(markdown, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat([
        "img",
        "pre",
        "code",
      ]),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        img: ["src", "alt"],
        pre: ["class"],
        code: ["class"],
        a: ["href", "https"],
      },
      allowedSchemes: ["http", "https", "mailto"],
      allowedSchemesByTag: {
        img: ["http", "https"],
      },
    });
    const tds = new TurndownService();
    return tds.turndown(sanitized);
  } catch (error) {
    logger.error("Error sanitizing markdown:", error);
    return "";
  }
}
