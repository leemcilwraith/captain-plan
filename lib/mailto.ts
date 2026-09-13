export function buildMailtoUrl(params: {
  to: string[];
  subject: string;
  body: string;
}): string {
  const { to, subject, body } = params;
  const query = new URLSearchParams();
  query.set("subject", subject);
  query.set("body", body);
  // URLSearchParams encodes spaces as "+"; mailto needs %20.
  const encoded = query.toString().replace(/\+/g, "%20");
  return `mailto:${to.map(encodeURIComponent).join(",")}?${encoded}`;
}

export function openMailto(url: string): void {
  window.location.href = url;
}
