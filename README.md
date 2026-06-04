# chongtzezhao.github.io

Personal site and technical blog of **Chong Tze Zhao** — a content hub for
long-form writeups on quantitative-trading research (microstructure, ML
validation, execution). Built with [Jekyll](https://jekyllrb.com/) and served by
**GitHub Pages**.

- **Live:** https://chongtzezhao.github.io
- **Stack:** Jekyll + `jekyll-seo-tag` (OpenGraph/Twitter cards), `jekyll-feed`
  (RSS), `jekyll-sitemap`. Code highlighting via Rouge; math via KaTeX.

---

## Publishing a post

Adding a post is **adding one Markdown file** — the index, RSS feed, and sitemap
update automatically.

1. Create `_posts/YYYY-MM-DD-your-slug.md`.
2. Add front matter, then write in Markdown below it:

   ```markdown
   ---
   title: "The Phantom Fill Trap"
   description: "Why ~65% of my backtest fills were never real — and how I found out."
   date: 2026-06-10
   tags: [microstructure, backtesting]
   math: true        # set true only if the post uses LaTeX (loads KaTeX)
   draft: false      # true keeps it out of the build entirely
   ---

   Your writing here. **Code** and math both render:

   ```python
   sharpe = returns.mean() / returns.std() * (periods_per_year ** 0.5)
   ```

   Inline math like $\text{Sharpe} = \frac{E[R]}{\sigma_R}$ and display math:

   $$\widehat{\text{DSR}} = Z\!\left[\frac{(\text{SR} - \text{SR}_0)\sqrt{T-1}}{\sqrt{1 - \gamma_3 \text{SR} + \frac{\gamma_4 - 1}{4}\text{SR}^2}}\right]$$
   ```

3. Commit and push to `master`. GitHub Pages rebuilds and deploys in ~1 minute.

**Notes**
- The post URL is `/writing/<slug>/` (configured in `_config.yml`).
- `draft: true` or a future `date` keeps a post unpublished.
- Set `math: true` only when needed — it keeps non-math pages lean.

---

## Running locally

You do **not** need a local build to publish — GitHub Pages builds on push.
This is only for previewing changes first.

### Option A — Docker (no Ruby install needed)

```bash
docker run --rm -p 4000:4000 \
  -v "$PWD":/srv -w /srv -e BUNDLE_PATH=/srv/vendor/bundle ruby:3.3 \
  bash -lc "bundle install && bundle exec jekyll serve --host 0.0.0.0 --livereload"
```

Then open http://localhost:4000.

### Option B — native Ruby

```bash
gem install bundler
bundle install
bundle exec jekyll serve --livereload
```

---

## Project structure

```
_config.yml          Site config, plugins, SEO defaults
_layouts/            default · home(index) · page · post
_includes/           head (meta/OG) · nav · footer · social-links
assets/css/          style.scss  (design system: light + dark)
assets/js/           theme.js    (dark-mode toggle)
assets/img/          favicon + og-default.png (link-preview card)
_posts/              Blog posts (Markdown) — drop new posts here
index.html           Home — doubles as About (identity panel + bio, selected work, writing, contact)
writing/index.html   Writing index (auto-lists posts; empty state until then)
404.html             Not-found page
robots.txt           + auto-generated sitemap.xml & feed.xml
```

---

## Deployment

GitHub Pages serves the **default branch** (`master`) of the
`chongtzezhao.github.io` repository and builds the Jekyll site automatically on
every push. No CI workflow is required.

---

## Custom domain (later)

To move to a custom domain (e.g. `chongtzezhao.com`) with no rework:

1. Add a file named `CNAME` at the repo root containing only the domain, e.g.
   `chongtzezhao.com`.
2. At your DNS provider, point the domain at GitHub Pages
   ([instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)).
3. Update `url:` in `_config.yml` to the new domain so absolute links, OG tags,
   the sitemap, and the feed stay correct.

---

## Editing checklist

- **Links/contact** live in `_config.yml` under `social_links`, `resume_path`,
  and `contact_email` — edit once, used everywhere.
- **Twitter/X**: add `twitter.username` and `social_links.twitter` in
  `_config.yml` once the account exists; the link and `twitter:site` card tag
  appear automatically.
- **Résumé**: replace `resume.pdf` at the repo root (built from `resume.tex`).
```
