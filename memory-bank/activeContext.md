# Active Context: Money Pink

## Current Focus
* Tab 2 (Central Money Dashboard): Updated hero card to use the original clean card layout, displaying "ยอดคงเหลือสุทธิ / ยอดคงเหลือเก็บจริง" (`Net Balance / Balance from Actual Collections (Collected - Withdrawn)`).

---

## Active State & Observations
* **Dev Server**: `npm run dev` running successfully on port 3000.
* **Themes**: Customized pink glassmorphism styling setup, pulling in Inter & Outfit fonts, Font Awesome icons.
* **Target Audience**: Financial reporting system tailored for four members: Romulah, Patimah, Ibroheng, Sakiroh.
* **APIs**: Standard endpoints fetch dynamic data from Google Apps Script.
* **Central Money Metrics**: Hero card displays both:
  1. ยอดคงเหลือไม่รวมยอดค้าง แต่ให้รวมยอดเบิก (`ยอดเก็บ - ยอดเบิก`)
  2. ยอดคงเหลือสุทธิ (รวมยืม-คืน) (`(ยอดเก็บ + ยอดคืน) - (ยอดเบิก + ยอดยืม)`)

---

## Next Steps
* Ready for further user feedback or additional metric adjustments.
