# Smart Termite Tulsa

A static, lead-generation website for **Smart Termite Tulsa** â€” local termite education and inspection requests for homeowners across the Tulsa metro.

- Production domain: `https://www.smarttermitetulsa.com`
- Phone placeholder: `(918) 555-0199` (`tel:+19185550199`)
- Email placeholder: `hello@smarttermitetulsa.com`
- Service areas: Tulsa, Broken Arrow, Jenks, Bixby, Owasso, Sand Springs, Sapulpa, Glenpool, Claremore, Catoosa

---

## Tech stack

- [Astro](https://astro.build) (latest, static output)
- `@astrojs/sitemap` (auto-generated `sitemap-index.xml`)
- Vanilla CSS in `src/styles/global.css` (no Tailwind, no React, no Vue)
- Lightweight vanilla JS for accordion, mobile menu, sticky bar, tracking shim
- Inter (Google Fonts)

---

## Local development

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs to ./dist
npm run preview    # preview the built site
```

---

## Deploy: GitHub Pages

1. Push the repo to GitHub.
2. **Settings â†’ Pages â†’ Source: `GitHub Actions`**.
3. The workflow at `.github/workflows/deploy.yml` builds on every push to `main` and deploys via `withastro/action@v3`.
4. **Custom domain:** In GitHub Pages settings, enter `www.smarttermitetulsa.com`. The `CNAME` file in the repo root is already configured.
5. **DNS:** At your registrar, add a `CNAME` record for `www` pointing to `<your-github-username>.github.io`. (Apex / root domain: add four `A` records to GitHub's Pages IPs per [GitHub's docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).)
6. After DNS resolves, enable **Enforce HTTPS** in Pages settings.

---

## Replacing the phone number

Search the repo for both forms:

```
(918) 555-0199
+19185550199
```

Replace with the final business or call-tracking number. Hits live in:
- `src/components/Header.astro`
- `src/components/Footer.astro`
- `src/components/Hero.astro`
- `src/components/StickyMobileBar.astro`
- `src/pages/contact.astro`
- `src/components/Schema.astro` (telephone)

Every replacement location has a `<!-- TODO: Replace with final business / call-tracking number -->` comment.

## Replacing the email

Search for:

```
hello@smarttermitetulsa.com
```

Replace in `Footer.astro`, `contact.astro`, and `Schema.astro` (email).

---

## Connecting the lead form

All forms share `src/components/LeadForm.astro`. The form `action` is set to:

```js
const ACTION = 'REPLACE_WITH_UGotLeads_WEBHOOK_OR_FORM_ENDPOINT';
```

Replace that string with your endpoint.

### Option A â€” UGotLeads webhook

```js
const ACTION = 'https://api.UGotLeads.com/v1/inbound/<workspace>/<key>';
```

The form already submits all 22 fields documented below as `application/x-www-form-urlencoded`. Configure UGotLeads to expect those field names and to redirect to `/thank-you` on success. If UGotLeads does not natively redirect, the hidden `_next` input (`value="/thank-you"`) acts as a backup signal â€” process it in your webhook handler.

### Option B â€” Formspree

1. Create a Formspree form: https://formspree.io
2. Set `ACTION` to `https://formspree.io/f/xxxxxxxx`.
3. Formspree honors the hidden `_next` input automatically â€” no extra config needed.

### Option C â€” Basin

1. Create a Basin form: https://usebasin.com
2. Set `ACTION` to `https://usebasin.com/f/xxxxxxxxxxxx`.
3. Basin honors `_next` for the redirect.

### Option D â€” Supabase Edge Function

```js
const ACTION = 'https://<project>.functions.supabase.co/lead-intake';
```

Sample Edge Function (`lead-intake/index.ts`):

```ts
import { serve } from 'https://deno.land/std/http/server.ts';

serve(async (req) => {
  const form = await req.formData();
  const lead = Object.fromEntries(form.entries());
  if (lead.website) return new Response('ok'); // honeypot
  // insert into table
  await fetch(`${Deno.env.get('SUPABASE_URL')}/rest/v1/leads`, {
    method: 'POST',
    headers: {
      apikey: Deno.env.get('SUPABASE_SERVICE_ROLE')!,
      Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE')}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(lead),
  });
  return Response.redirect(new URL('/thank-you', req.headers.get('origin') || 'https://www.smarttermitetulsa.com'), 303);
});
```

### Option E â€” Zapier Catch Hook

```js
const ACTION = 'https://hooks.zapier.com/hooks/catch/123456/abcdef/';
```

Zapier doesn't auto-redirect â€” the page will stay on the form. Workarounds: (1) set Zapier to return a `Location` header, or (2) post via fetch from JS and manually redirect on success.

---

## UGotLeads CRM payload â€” full field reference

| Field | Type | Notes |
|-------|------|------|
| `first_name` | text | required |
| `last_name` | text | required |
| `phone` | tel | required |
| `email` | email | required |
| `address_or_zip` | text | required |
| `city` | select | from the 10 service areas or "Other Tulsa-metro" |
| `service_needed` | select | Termite inspection / treatment / warning signs / annual prevention / not sure |
| `message` | textarea | freeform description |
| `preferred_contact_method` | select | Call / Text / Email |
| `urgency` | select | Today / This week / Planning ahead |
| `consent` | checkbox | required |
| `website` | hidden honeypot | reject if non-empty |
| `source_page` | hidden | auto-set to `location.pathname` |
| `utm_source` | hidden | from query string |
| `utm_medium` | hidden | from query string |
| `utm_campaign` | hidden | from query string |
| `utm_content` | hidden | from query string |
| `utm_term` | hidden | from query string |
| `lead_type` | hidden | `termite-inspection-request` |
| `service_area` | hidden | per-page service area context |
| `pipeline_stage` | hidden | `New Lead` |
| `lead_status` | hidden | `New` |
| `crm_workspace` | hidden | `smart-termite-tulsa` |
| `created_at` | hidden | ISO timestamp set client-side |

That's 22 mappable fields plus the `_next` redirect signal.

---

## Recommended UGotLeads tags

- `source:website`
- `source:google-organic`
- `source:google-ads`
- `source:facebook-ads`
- `source:referral`
- `service:inspection`
- `service:treatment`
- `service:prevention`
- `service:warning-signs`
- `urgency:today`
- `urgency:this-week`
- `urgency:planning-ahead`
- `area:tulsa`, `area:broken-arrow`, `area:jenks`, `area:bixby`, `area:owasso`, `area:sand-springs`, `area:sapulpa`, `area:glenpool`, `area:claremore`, `area:catoosa`
- `lead:warm`, `lead:cold`
- `nurture:email-sequence`
- `consent:sms-opted-in`

---

## Recommended UGotLeads pipeline stages

1. **New Lead** â€” auto-set from form submission
2. **Contacted** â€” first outreach made
3. **Qualified** â€” confirmed real homeowner, real need, in service area
4. **Inspection Scheduled** â€” appointment booked
5. **Inspection Completed** â€” written summary delivered
6. **Quoted** â€” treatment quote provided
7. **Won** â€” booked treatment / annual program
8. **Lost** â€” closed out (with reason tag)
9. **Nurture** â€” long-term follow-up via email sequence

---

## Recommended automations

1. **Auto-respond to new lead** (instant) â€” Trigger: pipeline_stage = New Lead. Action: send Email 1 (confirmation) + SMS confirmation if consented + notify internal Slack/email of the new lead with full payload.
2. **One-business-day follow-up reminder** â€” Trigger: pipeline_stage still "New Lead" after 24 business hours. Action: create internal task and ping assigned rep.
3. **Inspection nurture sequence** â€” Trigger: New Lead. Action: enroll in 5-email educational sequence (see "Email automation copy" below). Pause sequence when stage advances to "Quoted" or "Won".
4. **Stale lead win-back** â€” Trigger: no stage change in 30 days. Action: send "Still thinking about that inspection?" email + assign to rep for one more call attempt.
5. **Post-inspection follow-up** â€” Trigger: pipeline_stage = Inspection Completed. Action: send written summary email after 24 hours, then NPS / review request 7 days later.

---

## Email automation copy

All emails use a warm, mentor tone. No hype. No guarantees. Careful language ("may", "can", "commonly", "a licensed termite professional can evaluate").

### Email 1 â€” Confirmation (sent instantly)

**Subject:** We got your termite inspection request

Hi {{first_name}},

Thanks for reaching out to Smart Termite Tulsa. We received your inspection request and a team member will follow up within one business day to confirm the details and schedule a time that works for you.

Here's what to expect: an inspection typically takes 45 to 90 minutes on-site. The inspector will walk the foundation, crawlspace or basement, baseboards, and any areas you flagged. They'll show you what they found before leaving and you'll receive a written summary within a day or two.

In the meantime, if you spotted something specific â€” mud tubes, wings, soft wood â€” please don't disturb it. Termites scatter when disturbed, which can make activity harder to locate.

If anything urgent comes up before we reach you, you can call us at (918) 555-0199.

Talk soon,
The Smart Termite Tulsa team

---

### Email 2 â€” 5 warning signs to look for now (sent +1 day)

**Subject:** 5 termite warning signs to check while you wait

Hi {{first_name}},

While we get your inspection scheduled, here are five warning signs you can look for around your home in about 15 minutes. None of these are reasons to panic â€” they're just things worth noting so you can show the inspector when they arrive.

1. Pencil-thin mud tubes running up your foundation or crawlspace walls.
2. Small piles of identical translucent wings on windowsills or in spider webs.
3. Baseboards or door frames that sound hollow when you tap them with a screwdriver handle.
4. Bubbling or blistering paint that looks like minor water damage but isn't near a known leak.
5. Doors or windows that suddenly stick when they worked fine last year.

If you find any of these, snap a photo on your phone and have it ready when we talk. Photos help the inspector know what to look for first.

You can read the full 10-sign guide here: https://www.smarttermitetulsa.com/tulsa-termite-warning-signs

Talk soon,
Smart Termite Tulsa

---

### Email 3 â€” What happens during a termite inspection (sent +3 days)

**Subject:** Here's what actually happens during a termite inspection

Hi {{first_name}},

A lot of homeowners ask what we're actually doing for that 45 to 90 minutes on-site. Here's the short version.

A licensed inspector will walk the full perimeter of your home looking for mud tubes, moisture issues, and wood-to-soil contact. They'll check the crawlspace or basement if you have one â€” that's where most subterranean termite activity in Tulsa shows up first. They'll tap baseboards and door frames with a probe, look at attic accessible areas, and check plumbing penetrations and bath traps (a frequent entry point).

You won't be expected to follow them around the whole time, but they'll walk you through anything they found before they leave. A written summary usually arrives within 24 to 48 hours.

If activity is found, the report will outline options. There's no obligation to act on the spot, and a reputable inspector will never pressure you into same-day treatment.

If you have any questions before your inspection, just reply to this email.

Smart Termite Tulsa

---

### Email 4 â€” What attracts termites to Tulsa homes (sent +5 days)

**Subject:** Why termites love certain Tulsa homes more than others

Hi {{first_name}},

Eastern subterranean termites are present throughout the Tulsa metro, but they don't treat every home equally. Here's what makes a Tulsa home more attractive to termites than the house next door.

**Moisture.** Leaking spigots, AC condensate lines that drip near the foundation, downspouts emptying right next to the house, and damp crawlspaces all give termites the water they need to thrive.

**Wood-to-soil contact.** Siding or trim that touches dirt, deck posts, wooden landscape edging, and firewood stacked against the house are all open invitations.

**Mulch piled against the foundation.** Mulch itself is fine, but a thick layer touching the side of the house creates a moist, hidden corridor. Keep a 6-to-12-inch bare strip of soil or gravel between any mulch bed and the foundation.

**Clay soils that shift seasonally.** Tulsa's clay-heavy soils open hairline cracks that termites use as entry points. There's not much you can do about the soil, but it's why annual inspections matter so much locally.

None of these guarantee termites â€” they just raise the odds. Fixing the ones you can is one of the best things you can do for your home, with or without active termites.

Smart Termite Tulsa

---

### Email 5 â€” Still unsure? (sent +10 days)

**Subject:** Still thinking about that inspection?

Hi {{first_name}},

We noticed we haven't connected yet on getting your termite inspection scheduled. No pressure at all â€” we just wanted to check in.

If now isn't the right time, that's completely fine. We're here whenever you're ready. The most important thing is that you have a clear plan, even if that plan is "I'll do this in three months when I'm less busy."

If something's holding you back, here are a few things people often ask:

- **Cost:** Inspection pricing varies. Many local providers offer a no-obligation quote when you request an inspection â€” no commitment to treatment.
- **Timing:** Most inspections can be scheduled within a week of your request.
- **What if there's nothing wrong?** Then you have peace of mind and a baseline written record. That's worth something.

If you'd like to reschedule or just have a question, reply to this email or call us at (918) 555-0199.

Either way, we appreciate you reaching out â€” and we hope this little series was useful even if you decide to wait.

Smart Termite Tulsa

---

## A2P 10DLC SMS compliance notes

If you send any SMS through UGotLeads or another provider, you need A2P 10DLC registration in the US. Key points:

- **Brand registration.** Register the legal business entity with The Campaign Registry (TCR) via your messaging provider.
- **Campaign registration.** Register a specific use case (likely "Customer Care" or "Lead Generation").
- **Consent.** Every SMS recipient must have given prior express consent on the form. Our form's consent checkbox text covers this: "By submitting, I agree Smart Termite Tulsa may contact me by phone, text, or email about my inquiry."
- **Opt-out language.** Every campaign SMS must include "Reply STOP to opt out." Our consent text already discloses this.
- **Help text.** Provide a HELP response describing the program and a way to reach a human.
- **No prohibited content.** No SHAFT content (Sex, Hate, Alcohol, Firearms, Tobacco), no third-party data sharing, no affiliate marketing of unrelated products.
- **Throughput limits.** Unregistered numbers are heavily throttled. Registration unlocks proper throughput.
- **Privacy policy link.** Include in any web form that collects phone numbers. (Recommend adding a `/privacy` page before launch.)

---

## Analytics setup

Placeholders are inlined as comments in `src/layouts/BaseLayout.astro`. Find the `<!-- TODO: ... -->` blocks in `<head>` and paste your IDs:

- **GA4** â€” replace `G-XXXXXXX` with your measurement ID.
- **Google Tag Manager** â€” replace `GTM-XXXXXXX`.
- **Microsoft Clarity** â€” replace the project ID.
- **PostHog** â€” replace `phc_XXXX` with your project key.

The tracking shim at the bottom of `BaseLayout.astro` already pushes events to `window.dataLayer` and logs to the console on localhost. Anything with `data-event="..."` is tracked automatically (phone clicks, CTA clicks, FAQ opens, form submits, area card clicks, checklist downloads).

---

## Image replacement

See `public/images/README.md` for the full slot list and sourcing rules. Short version:

- Royalty-free only (Unsplash, Pexels, paid stock).
- Compress to under 200 KB.
- Use WebP where possible.
- Descriptive alt text.
- No fake homes / fake reviews / fake staff / fake awards.

---

## SEO checklist

- [x] Unique title and meta description on every page
- [x] One H1 per page, sequential H2/H3
- [x] Canonical URL on every page
- [x] Open Graph + Twitter card meta
- [x] LocalBusiness, WebSite, Service, FAQPage, ContactPage, Article, BreadcrumbList JSON-LD via `Schema.astro`
- [x] Auto-generated `sitemap-index.xml` via `@astrojs/sitemap`
- [x] `robots.txt` referencing the sitemap
- [x] Internal links between related pages
- [x] AEO blocks (Quick Answer / What it means / When to call a professional / What to do next / Related questions) on guide pages
- [x] Mobile-first responsive layout
- [x] Sticky mobile call/inspection bar
- [ ] Replace OG image with a real branded image (1200x630)
- [ ] Add a `/privacy` page before public launch

---

## Launch checklist

- [ ] Replace `(918) 555-0199` and `+19185550199` with the final number everywhere
- [ ] Replace `hello@smarttermitetulsa.com` everywhere
- [ ] Replace `REPLACE_WITH_UGotLeads_WEBHOOK_OR_FORM_ENDPOINT` in `src/components/LeadForm.astro`
- [ ] Submit a test lead end-to-end (form â†’ CRM â†’ confirmation email â†’ SMS if enabled)
- [ ] Confirm the `/thank-you` redirect fires
- [ ] Add real images to `/public/images` (delete placeholder slots)
- [ ] Add OG image and verify with the [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) and [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [ ] Add a `/privacy` page (linked from consent text and footer)
- [ ] Paste GA4, GTM, Clarity, and/or PostHog IDs in `BaseLayout.astro`
- [ ] Configure GitHub Pages: Settings â†’ Pages â†’ Source = GitHub Actions
- [ ] Set custom domain `www.smarttermitetulsa.com` in Pages settings
- [ ] Add DNS `CNAME` for `www` at registrar
- [ ] Enable Enforce HTTPS once DNS resolves
- [ ] Validate JSON-LD with [Google's Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Submit `sitemap-index.xml` to Google Search Console and Bing Webmaster Tools
- [ ] Verify mobile sticky bar appears on small screens
- [ ] Verify accordion, mobile menu, and form validation work
- [ ] Verify the print stylesheet on `/termite-warning-signs-checklist`
- [ ] Register A2P 10DLC brand + campaign before sending any SMS
- [ ] Test all 5 nurture emails through the sending platform (rendering, links, unsubscribe)
- [ ] Confirm pipeline stages and tags configured in UGotLeads
- [ ] Set up automation 1-5 in UGotLeads
- [ ] Internal team trained on the response SLA (one business day)

---

## Hard rules (do not violate)

- No fake reviews, ratings, license numbers, address, hours, staff, or awards
- No "guaranteed", no "licensed [us]" claims, no "free inspection" promises
- No keyword stuffing or duplicate area content
- No Tailwind / React / Vue â€” pure Astro + vanilla CSS / JS
- One visible attribution: `Local visibility support by MyUSA Local` (footer only, "MyUSA Local" is the anchor)

---

*Built for Smart Termite Tulsa. Local visibility support by [MyUSA Local](https://myusalocal.com).*

