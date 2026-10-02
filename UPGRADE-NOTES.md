# LM Manufacturing Website Upgrade — 2026-10-02

## Changes made

1. About Us
   - Added a new Owner / Leadership section.
   - Added editable owner fields: eyebrow, section title, owner name, position, portrait, alt text and message.
   - Added English and Khmer content support.
   - Owner photo is shared from the English About record for both languages.
   - Current owner portrait is a placeholder until an approved real portrait is uploaded.

2. Header / Logo
   - Increased company logo from 40px to 72px on desktop.
   - Responsive sizes: 60px tablet and 48px mobile.
   - Increased header height to give the logo more space.

3. Products
   - Unpublished the sample Chicken Noodles product.
   - When only one product is published, Products now uses a centered single-product showcase instead of a 3-column grid.
   - Product packaging is displayed large in the center with a subtle brand glow and a View Product button.
   - Multi-product grid remains available automatically for the future when more products are published.

4. CMS
   - Added Owner / Leadership editing fields to `.pages.yml`.

## Before production launch

Replace the owner placeholder with the approved owner portrait and replace `Company Owner` with the correct name/title. Also replace any illustrative noodle packaging with approved final product photography when available.

## Validation note

JSON/content checks passed. Full `npm run build` could not be completed in the current environment because dependency installation exceeded the execution limit.
