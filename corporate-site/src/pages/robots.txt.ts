export function GET({site}: {site?:URL}) {
  const origin=(site ?? new URL('https://example.com')).origin;
  return new Response(`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap-index.xml\n`,{headers:{'Content-Type':'text/plain; charset=utf-8'}});
}
