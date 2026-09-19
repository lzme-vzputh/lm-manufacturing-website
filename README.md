# LM MANUFACTURING CO., LTD. website

A statically generated bilingual company website with editable pages, products, news and careers. Astro builds the public pages; Pages CMS edits repository content through GitHub. There is no visitor login, server, or database.

> The site contains drafted company copy and illustrative imagery. Confirm every statement, product and news item with management before public launch. Replace conceptual images with approved photos of the actual facility and products.

## For website administrators

### First setup

1. Ask a developer to publish this project to a GitHub repository and connect that repository to Cloudflare Pages.
2. The repository administrator installs the [Pages CMS GitHub App](https://pagescms.org/docs/quick-start/) and grants it access to this repository. Editors need appropriate repository access.
3. Open [Pages CMS](https://app.pagescms.org), sign in with GitHub, and select the repository and branch used by Cloudflare Pages.
4. Update **Company Settings · English + Khmer + Shared** first: both company names and descriptions, logo, contact details, social links, fonts, colors and SEO text. Then update **Home**, **About**, **Factory**, and **Contact**.
5. Save an edit. Pages CMS commits the content to GitHub; Cloudflare Pages rebuilds the site automatically. Wait for deployment before checking the public site.

### Language and theme

The English site is at `/`; Khmer pages are at `/kh`. Visitors can switch languages in the header, and the corresponding page is kept when both versions exist. A dark mode control is also in the header. It remembers each visitor's choice in their browser and follows their device preference until they choose a mode.

The header stays visible while scrolling. Navigation uses a soft highlighted pill on hover and a gold pill for the current page, without a link underline. Buttons, product filters and cards provide hover and pressed feedback; people who request reduced motion see the same content without animation.

Pages CMS has two clear menus: **English + Shared Settings** and **Khmer Text Only**. Shared images, destinations, dates, publication switches and company contact details appear only under English. Khmer contains only Khmer wording and image descriptions. For products and news, create a Khmer translation with the **same slug** as its English entry. The English entry controls its image, date, order, featured state and publication in both languages. A published English vacancy automatically appears on the Khmer Careers page; a Khmer entry with the same slug supplies the Khmer wording. An unpublished English entry stays hidden in both languages.

Each English Product, News and Career entry contains a clearly labelled **MAIN CONTROL — Shared for English and Khmer** block. Use it to publish or hide the entry on both websites. Product Main Control also owns the shared main image, gallery, homepage feature switch and display order. News Main Control owns the shared date, cover image and homepage feature switch. Career Main Control owns the shared publish date and optional closing date. Do not look for these controls in the Khmer translation entries.

One **Company Settings · English + Khmer + Shared** form owns both company names and descriptions, both addresses and business hours, both footer and SEO texts, plus one shared logo, phone, email, application email, social links, fonts, default image and color palette. The English Contact page owns the Google Maps embed URL for both languages.

The Khmer site uses the bundled **Noto Sans Khmer** variable font by default; the English site keeps its current font. To change either font later, open **English + Shared Settings → Company Settings · English + Khmer + Shared**. Upload a `.ttf` file to the English or Khmer font field and save. Fonts are stored in `public/uploads/fonts/` automatically. Leave the Khmer field blank to use Noto Sans Khmer.

The Contact page displays LinkedIn, Telegram and YouTube icons even while their URLs are empty. Enter verified company URLs once in **Company Settings → Social links — shared** to make the icons clickable in both languages. Facebook appears after its URL is entered. External URLs must use HTTPS and match the named service.

The `/manage` page is a public editing guide. Actual editing requires access to the connected GitHub repository through Pages CMS. A local ZIP alone does not provide a working admin login or live content updates.

### Editing pages and images

Choose a page in the CMS sidebar, edit a field, and save. Image fields accept JPG, JPEG, PNG, WebP and AVIF in `public/uploads/`; logos also accept SVG. You do not need to rename a file before upload: Pages CMS safely adjusts its filename. After saving, a GitHub workflow converts JPG, JPEG, PNG and AVIF files to WebP and updates their paths in page content. Already uploaded WebP and SVG files stay in their format. Give the workflow time to finish before checking the final image URL. Replace illustrative images with approved photographs. Write alt text describing the actual image, unless the image is purely decorative. Do not delete an image that still appears on a page.

Upload each shared image through its **English** page or collection entry. The Khmer page uses that image automatically and has its own editable image description. For galleries, Khmer image descriptions follow the same order as the English gallery; add or reorder images in English first, then review Khmer descriptions.

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
- `src/data/*.json` and `src/data/kh/*.json` contain English and Khmer page content. `src/data/site.yml` contains unified bilingual and shared company settings.
- `src/content/{products,news,careers}/*.md` and `src/content/kh/{products,news,careers}/*.md` contain language-specific entries, validated by `src/content.config.ts`.
- `.pages.yml` exposes shared values once and separate Khmer text. `src/lib/content.ts` combines them for the Khmer site by page and by matching collection slug.
- `public/uploads/` contains CMS uploaded images; the generated WebP assets are illustrative; the checked-in SVG is a fallback placeholder.
- `src/assets/css/` contains the shared design system and component styles.
- `.github/workflows/normalize-images.yml` runs after image uploads, and `scripts/normalize-images.mjs` converts images and updates references. The workflow requires GitHub Actions enabled and `contents: write` permission on the repository.

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
