# LM Manufacturing update

Upload the files in this ZIP to the matching paths in the `main` branch of `lzme-vzputh/lm-manufacturing-website`, replacing existing files where names match. Keep the folder structure. GitHub may need the `.github/workflows/normalize-images.yml` and `scripts/normalize-images.mjs` files created as new files.

The contact page shows LinkedIn, Telegram and YouTube icons in English and Khmer. Icons become clickable after you enter the real company URLs in Pages CMS → English → Company Settings → Social and ភាសាខ្មែរ → ការកំណត់ក្រុមហ៊ុន → Social. English entries that led to GitHub Education and an unrelated music video have been cleared. The Facebook icon also appears if you add its company URL.

Pages CMS accepts JPG, JPEG, PNG, WebP and AVIF pictures, plus SVG logos. It safely normalizes uploaded filenames, so there is no need to rename them before upload. After uploads of JPG, JPEG, PNG or AVIF to public/uploads, the GitHub Actions workflow converts them to WebP and updates references in src. Already uploaded WebP and SVG files retain their type. Enable Actions and grant workflows read/write repository permissions if your repository currently restricts them.

The change was verified with `npm run check` (0 errors), `npm run build`, and a real PNG conversion test that checked the updated content URL.
