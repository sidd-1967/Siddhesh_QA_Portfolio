/**
 * sanitize.ts
 * Client-side HTML sanitization using DOMPurify.
 *
 * Used to safely render admin-entered rich-text HTML via dangerouslySetInnerHTML.
 * Prevents Stored XSS: if the admin account is ever compromised, an attacker
 * could store malicious HTML in the DB. DOMPurify strips all dangerous tags/attrs
 * before it reaches the DOM.
 *
 * Config: FORBID_TAGS/FORBID_ATTR blocks the most abused vectors while keeping
 * standard formatting tags (b, i, ul, ol, li, a, p, br, strong, em, h1-h6) intact.
 */

import DOMPurify from 'isomorphic-dompurify';

const PURIFY_CONFIG = {
  // Strip script, style, iframe, form, and all event handlers
  FORBID_TAGS: ['script', 'style', 'iframe', 'form', 'input', 'button', 'object', 'embed', 'base'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'onchange',
                'onsubmit', 'onkeydown', 'onkeyup', 'onkeypress', 'style'],
  // Allow safe href targets but block javascript: and data: URIs
  ALLOW_UNKNOWN_PROTOCOLS: false,
  // Forbid data: and javascript: URIs in href/src
  ALLOWED_URI_REGEXP: /^(?:https?|mailto|tel):/i,
};

/**
 * Sanitize an HTML string before injecting into the DOM.
 * isomorphic-dompurify works safely in both Node.js (SSR) and the browser.
 */
export function sanitizeHtml(dirty: string | undefined | null): string {
  if (!dirty) return '';
  return DOMPurify.sanitize(dirty, PURIFY_CONFIG) as string;
}
