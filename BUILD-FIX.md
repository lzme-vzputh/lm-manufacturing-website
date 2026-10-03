# Cloudflare build fix

- Career and other content slugs are normalized automatically.
- `it_manager`, `IT Manager`, and `it-manager` all become `it-manager`.
- The Khmer careers folder is included so Astro glob loader does not warn that the base directory is missing.
- Recommended CMS slug format remains lowercase words separated by hyphens.
