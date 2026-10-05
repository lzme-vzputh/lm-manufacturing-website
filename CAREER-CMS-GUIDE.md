# Career CMS control guide

The English Career item is the master record for shared controls.

## English Career item
- **slug**: shared URL key. Example: `it-manager`.
- **Publish this job**: master on/off switch.
- **Show this job on Khmer website**: if off, the job is hidden from Khmer.
- **Use Khmer translation when a matching Khmer slug exists**:
  - on = use Khmer translation when available; otherwise safely fall back to English.
  - off = always show the English job on Khmer, even if a Khmer translation file exists.
- **Publish date**: shared.
- **Closing date**: shared deadline.

## Khmer translation
Create a Khmer Career item only when Khmer text is needed. Its slug must exactly match the English slug.

Example:
- English slug: `it-manager`
- Khmer slug: `it-manager`

You do not need to duplicate publish date, deadline, or publish status in Khmer. Those are controlled from the English master item.
