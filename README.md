# AI Tools Hub — Cloudflare Pages + Supabase

A mobile-first AI tools directory with a Supabase-powered admin panel and Adsterra ad-code manager.

## 1) Create Supabase project
Create a free Supabase project, then open SQL Editor and run `schema.sql`.

## 2) Create admin login
In Supabase Dashboard → Authentication → Users, create your admin email/password.

## 3) Configure the site
Copy `config.example.js` to `config.js` and put your Supabase project URL and publishable/anon key in it.

Do NOT put a Supabase `service_role` key in this project.

## 4) Local test
Serve the folder through a local web server (not file://). For example:
`python -m http.server 8000`

Then open:
- Public site: http://localhost:8000/
- Admin: http://localhost:8000/admin.html

## 5) Cloudflare Pages
Create a Cloudflare Pages project and deploy this folder as a static site. Set the build output to the project root because there is no build step.

You can also connect the GitHub repository for automatic deployments.

## 6) Add tools
Admin → Tools → fill the form → Save Tool.

## 7) Add Adsterra ads
Admin → Ads Manager → choose Banner / Pop-under / Social Bar / Direct Link → paste the exact Adsterra code supplied by Adsterra → choose placement → Active → Save.

Only trusted admins should have access to the admin panel.

## Important production notes
- Replace the example Privacy/Terms pages with your real policies.
- Use HTTPS.
- Review Adsterra's current publisher terms and the exact ad-format rules before enabling pop-under/pop-up or other formats.
- The demo intentionally contains no real CPA links or Adsterra code.
- For a commercial project, confirm that your chosen hosting plan's terms allow your intended use.
