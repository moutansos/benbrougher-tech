// src/pages/rss.xml.js
import rss, { pagesGlobToRssItems } from '@astrojs/rss';

const postImportResult = import.meta.glob('./posts/*.{md,mdx}');

export const get = async (context) =>
  rss({
    // `<title>` field in output xml
    title: 'benbrougher.tech',
    // `<description>` field in output xml
    description:
      'Written by Ben Brougher who lives and works in the Pacific Northwest developing solutions to problems (usually with software). He graduated 2020 from Eastern Washington University as a Computer Science Major, Bachelor of Science (BS), and works engineering and developing software solutions in the enterprise telecommunications industry.',
    // base URL for RSS <item> links
    // SITE will use "site" from your project's astro.config.
    site: context.site,
    // list of `<item>`s in output xml
    // simple example: generate items for every md file in /src/pages
    // see "Generating items" section for required frontmatter and advanced use cases
    items: await pagesGlobToRssItems(postImportResult),
    // (optional) inject custom xml
    customData: `<language>en-us</language>`,
  });
