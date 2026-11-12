import { getHeadings, parseMarkdown } from "@/components/insights/markdown";
import body from "./privacy-policy.body";

export const PRIVACY_EMAIL = "privacy@identyca.io";

const blocks = parseMarkdown(body);
const headings = getHeadings(blocks);

/** Parsed once at module load - the policy text is static. */
export function getPrivacyPolicy() {
  return { blocks, headings };
}
