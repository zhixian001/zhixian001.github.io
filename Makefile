.PHONY: dev build clean webpack

webpack:
	pnpm run webpack

dev: webpack
	hugo server -D --bind 127.0.0.1 -p 1313

build: webpack
	hugo --minify
	@mkdir -p public/page2 && cp public/page/2/index.html public/page2/index.html 2>/dev/null || true

clean:
	rm -rf public _site_hugo _site_jekyll_baseline .hugo_build.lock
