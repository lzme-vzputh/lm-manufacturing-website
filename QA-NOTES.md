# Final QA Notes

Checked the current website source for:

- All referenced `/uploads/...` image paths exist.
- All Astro `<img>` elements include alt text.
- Published products have a title, slug, category, description, image, alt text and display order.
- The published English product has a matching Khmer translation.
- The sample Chicken Noodles entry remains unpublished and cannot appear publicly.
- JSON data files parse correctly.
- Product carousel supports arbitrary product categories and updates title/category/description when the active product changes.
- Product carousel loops forward/backward and supports mouse hold-drag, touch swipe and arrow buttons.
- Product images use `object-fit: contain` and transparent presentation where intended.
- Hero/factory/owner background images use `cover` so different aspect ratios remain usable.
- Responsive CSS includes desktop, laptop, tablet, phone and small-phone breakpoints.
- The company logo file was cropped to remove transparent padding and improve visible size on mobile.

Note: a full Astro build could not be completed in this environment because dependency installation timed out before the Astro CLI became available.
