# LM MANUFACTURING CO., LTD. website

A statically generated bilingual company website with editable pages, products, news and careers. Astro builds the public pages; Pages CMS edits repository content through GitHub. There is no visitor login, server, or database.

> The site now contains drafted company copy and AI-created illustrative imagery. Confirm every statement, product and news item with management before public launch. Replace the conceptual images with approved photos of the actual facility and products. Phone, email and detailed production facts remain unset; the sample career is unpublished.

## For website administrators

### First setup

1. Ask a developer to publish this project to a GitHub repository and connect that repository to Cloudflare Pages.
2. The repository administrator installs the [Pages CMS GitHub App](https://pagescms.org/docs/quick-start/) and grants it access to this repository. Editors need appropriate repository access.
3. Open [Pages CMS](https://app.pagescms.org), sign in with GitHub, and select the repository and branch used by Cloudflare Pages.
4. Update **Company Settings** first: name, description, logo, contact details, social links and SEO text. Then update **Home**, **About**, **Factory**, and **Contact**.
5. Save an edit. Pages CMS commits the content to GitHub; Cloudflare Pages rebuilds the site automatically. Wait for deployment before checking the public site.

### Language and theme

The English site is at `/`; Khmer pages are at `/kh`. Visitors can switch languages in the header, and the corresponding page is kept when both versions exist. A dark mode control is also in the header. It remembers each visitor's choice in their browser and follows their device preference until they choose a mode.

Pages CMS shows separate **English · ...** and **ភាសាខ្មែរ · ...** entries for each page and collection. Change and save each language separately. **English · Interface text** and **ភាសាខ្មែរ · Interface text** control navigation, buttons, list-page headlines, empty states and the management guide. When adding a product, news story or vacancy, create an entry with the **same slug** in both language collections; fill out and publish each version after review. A missing or unpublished translation is not linked from its language listing, so review the language switch for that item before publishing it in either language.

**English · Company Settings** owns the logo, phone, email, application email, social URLs and social preview image shared by both languages. Each language has its own company display name, description, address, hours, footer text and SEO text. Khmer company settings intentionally inherit the shared endpoints from English.

The `/manage` page is a public editing guide. Actual editing requires access to the connected GitHub repository through Pages CMS. A local ZIP alone does not provide a working admin login or live content updates.

### Editing pages and images

Choose a page in the CMS sidebar, edit a field, and save. Image fields let you upload JPG, JPEG, PNG or WebP images to `public/uploads/`. Replace illustrative images with approved photographs. Write alt text describing the actual image, unless the image is purely decorative. Prefer compressed WebP or JPEG photographs and avoid very large uploads. The logo allows SVG as well as raster images. Do not delete an image that still appears on a page.

### Products

Choose **Products** and create an entry. Use a short lowercase slug with hyphens (for example `chicken-noodles`); the slug sets its URL. Add a title, category, short description, image and alt text, then write the longer product description in the rich-text body. Add gallery photographs and specifications if useful. Set **published** to show the product; set **featured** to show it on Home. A smaller display order appears first. Delete an entry from the collection to remove it. Never use product claims before they have been approved.

### News and careers

Choose **News**, create a story, set its slug and date, add a summary and cover image, and write the article in the rich-text body. Publish it when approved. News sorts newest first; Home shows the three latest published stories. Choose **Careers** to add a position, enter responsibilities and requirements, and set its publish and optional closing dates. Publish a job only while accepting applications. Applicants are directed to the application email from Company Settings, or to Contact when it is empty. There are no applicant accounts.

### Backups and troubleshooting

Every saved CMS change creates a GitHub commit. The repository owner can inspect history and revert a mistake. Keep an independent backup of important original photographs. If an edit does not appear, check that you saved it to the correct branch and that Cloudflare Pages finished building. If a build fails, confirm required fields and image paths; ask a developer to inspect the build log. If an image is missing, check that it is under `public/uploads/` and its content path starts with `/uploads/`.

## For developers

### Structure and prerequisites

- Node.js 20.3 or later; Node 22 LTS is recommended for Cloudflare Pages.
- `src/pages/` contains routes and detail page generators.
- `src/components/` contains shared markup; `src/layouts/` contains page layouts.
- `src/data/*.json` and `src/data/kh/*.json` contain English and Khmer page content; their `site.yml` files contain language-specific settings.
- `src/content/{products,news,careers}/*.md` and `src/content/kh/{products,news,careers}/*.md` contain language-specific entries, validated by `src/content.config.ts`.
- `.pages.yml` models both language versions, interface text and media paths. Keep the two language schemas aligned.
- `public/uploads/` contains CMS uploaded images; the generated WebP assets are illustrative; the checked-in SVG is a fallback placeholder.
- `src/assets/css/` contains the shared design system and component styles.

Run `npm install`, `npm run dev` for local development, `npm run check` for content/type validation, and `npm run build` for a production build in `dist/`. Visit the local pages, including detail URLs, on desktop and mobile. Content changes require another build. Avoid renaming a published slug without planning redirects from its previous URL.

### GitHub and Cloudflare Pages

Push the project to a GitHub repository on the branch editors will use. In Cloudflare Pages, connect that repository and configure:

| Setting | Value |
| --- | --- |
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | 22 (set `NODE_VERSION=22` if the build environment needs it) |
| Environment variable | `PUBLIC_SITE_URL=https://your-real-domain.example` |

Set `PUBLIC_SITE_URL` to the final public origin including `https://`, with no trailing path. It controls canonical tags and sitemap. The generated robots file uses the same origin. Replace the example.com origin before launch. Connect a custom domain in Cloudflare Pages, verify DNS/HTTPS, and set `PUBLIC_SITE_URL` to the canonical domain. Never put credentials in this repo; `.env` files are ignored. GitHub commits from Pages CMS automatically trigger a fresh deployment once the repository is connected.

### Maintenance

Verify `.pages.yml` paths and field names whenever the content schema changes. Publishing is controlled by `published`; unpublished entries are omitted from lists and detail routes. The product category filter runs in minimal browser JavaScript. Pages CMS does not edit source code. Product specifications are optional, and empty lists do not break layouts. If an image points at a missing file, restore it or correct its path. Git history contains content versions, but large image binaries should also be backed up elsewhere.
