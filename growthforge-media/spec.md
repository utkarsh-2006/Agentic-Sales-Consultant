# GrowthForge Media

## Current State
New project with empty backend actor and no frontend content.

## Requested Changes (Diff)

### Add
- Full marketing/agency website for GrowthForge Media, a Facebook & Instagram Ads agency for local businesses
- Sticky navigation bar with logo, nav links, and CTA button
- Hero section with headline, subheadline, dual CTAs, and key stats (150+ clients, 92% retention, 3-5x lead increases)
- Stats/trust bar section
- Services section: Facebook Ads, Instagram Ads, Lead Generation Funnels, Content Creation, Ad Optimization
- Pricing section: Starter ($750-$1,250/mo), Growth ($2,150-$3,900/mo, most popular), Premium ($4,000-$9,000+/mo), Enterprise Custom
- Case studies section: 5 real case studies with ROI numbers and client quotes
- Onboarding/workflow section: 4-step process
- Industries served section
- FAQ accordion: 20+ Q&A pairs across general, pricing, services, results, technical, getting started
- Contact/lead capture form: name, business, email, phone, monthly budget, message
- Footer with links, contact info, certifications
- Smooth scroll animations, hover effects, responsive design

### Modify
- Backend: add contact form submission handler (store leads in stable memory)

### Remove
- Nothing (new project)

## Implementation Plan
1. Write spec.md (this file) and rename project
2. Generate Motoko backend with a contact form submission endpoint that stores leads
3. Build comprehensive React frontend with all sections from content files
4. Use premium SaaS design: dark navy/charcoal + indigo/blue accents, clean typography, card-based layout
5. Wire contact form to backend
6. Validate and deploy
