# Sitemap Generator

## Usage

1. Install node module deps: `npm i`
1. Point it at a starting URL, which can be a sitemap.xml or an HTML point `node index.js --start [start url]`

## Options

* `--start (s)`: Start URL, e.g. http://localhost:8080/sitemap.xml.
* `--dest (d)`: Output path, e.g. /path/to/your/sitemap.jsonld.
* `--follow-links (f)`: Boolean, follow links found in HTML pages.
* `--verbose (v)`: Verbose, whether to output log messages.
