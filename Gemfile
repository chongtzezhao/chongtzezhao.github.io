source "https://rubygems.org"

# Use the github-pages gem so the local build matches what GitHub Pages runs
# server-side. This pins Jekyll + all whitelisted plugins to GitHub's versions,
# so "works locally" means "works when deployed".
gem "github-pages", group: :jekyll_plugins

# Plugins (also listed in _config.yml). github-pages already bundles these,
# but naming them keeps intent explicit.
group :jekyll_plugins do
  gem "jekyll-seo-tag"
  gem "jekyll-feed"
  gem "jekyll-sitemap"
end

# Windows / JRuby timezone data (harmless elsewhere).
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

# Boot speed on Windows.
gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]
