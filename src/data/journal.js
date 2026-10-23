// Journal / Learn CMS structure. The source journal (blog.php) currently has no published entries.
// Entries with status 'draft' are outlines only — they render solely in preview mode (/learn?preview=drafts)
// and must be written and approved by Hakiman Remedies before publishing. Do not add medical claims.
//
// Entry shape: { slug, title, status: 'draft' | 'published', category, cover, excerpt, body: string[] | null, products: handle[], approvedBy: string | null }

export const journal = [
  {
    slug: 'unani-and-ayurveda-at-hakiman',
    title: 'Unani and Ayurveda at Hakiman Remedies',
    status: 'draft',
    category: 'Heritage',
    cover: null,
    excerpt: null,
    body: null,
    products: [],
    approvedBy: null,
  },
  {
    slug: 'what-to-expect-at-a-consultation',
    title: 'What to expect at an in-person consultation',
    status: 'draft',
    category: 'Consultations',
    cover: null,
    excerpt: null,
    body: null,
    products: [],
    approvedBy: null,
  },
  {
    slug: 'caring-for-hand-made-soap',
    title: 'Caring for a hand made soap bar',
    status: 'draft',
    category: 'Rituals',
    cover: null,
    excerpt: null,
    body: null,
    products: ['neem-hand-made-soap', 'haldi-chandan-hand-made-soap-1', 'de-tan-hand-made-soap'],
    approvedBy: null,
  },
]

export const publishedEntries = () => journal.filter((e) => e.status === 'published')
