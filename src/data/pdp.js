// Product-page content for PASHOYA, copied verbatim from the approved design
// ("PASHOYA Product Page.html"). Text in [square brackets] is the designer's
// placeholder for facts the brand still has to supply — keep it until they do.
// Other products render the same template from their catalog fields only.

const PDP = '/assets/pdp'

export const PASHOYA_ID = 'hk-11'

export const pashoya = {
  name: 'PASHOYA Pain Salt',
  crumb: 'Body care',
  eyebrow: 'Unani mineral soak · Hakiman, Lucknow',
  announce: ['Ships in 2–3 days · Delivered across India', '25% off launch price — today ₹522', 'Lab tested · 100% natural minerals'],
  rating: '[Rating] · [N] verified reviews',
  ratingMobile: '[Rating] · [N] reviews',
  lead: 'Soothe aching feet and stiff joints in one 20-minute warm soak — with four traditional mineral salts and six essential oils.',
  leadMobile: 'Soothe aching feet and stiff joints in one 20-minute warm soak.',
  sub: 'Without swallowing a painkiller, rubbing in a greasy balm, or booking a massage.',
  size: '250 g',
  bullets: [
    { strong: 'Relaxes tired muscles', text: ' after long hours of standing or walking' },
    { strong: 'Eases everyday joint stiffness', text: ' in knees, ankles and heels' },
    { strong: 'Six-oil aromatherapy', text: ' that calms the mind before sleep' },
    { strong: 'Heritage Unani formula', text: ' from a Lucknow family practice since 1943' },
  ],
  bulletsMobile: [
    'Relaxes tired muscles after long standing',
    'Eases everyday knee, ankle and heel stiffness',
    'Calming six-oil aromatherapy before sleep',
  ],
  mobileChip: '4 mineral salts + 6 essential oils',
  gallery: [
    { src: `${PDP}/pashoya-jar.webp`, alt: 'PASHOYA Pain Salt 250 g jar', fit: 'contain', pad: '56px', padMobile: '36px', chip: '250 g jar · 4 mineral salts + 6 essential oils', label: 'Show the jar' },
    { src: `${PDP}/pashoya-jar-towel.webp`, alt: 'PASHOYA jar on a bath shelf beside a towel', fit: 'cover', pad: '0px', chip: 'Made in Lucknow by Hakiman — a family practice since 1943', label: 'Show the jar in a bathroom' },
    { src: `${PDP}/foot-soak.webp`, alt: 'Salt spooned into a warm foot soak', fit: 'cover', pad: '0px', chip: '2–4 tbsp in warm water · soak 15–20 minutes', label: 'Show the foot soak' },
    { src: `${PDP}/pashoya-minerals.webp`, alt: 'PASHOYA jar with bowls of Epsom salt, Sajji khar, Bhind salt and Java khar', fit: 'cover', pad: '0px', chip: 'Epsom salt base — the magnesium salt used in soaks for tired muscles', label: 'Show Epsom salt' },
    { src: `${PDP}/essential-oils.webp`, alt: 'Essential oil bottles', fit: 'cover', pad: '0px', chip: 'Eucalyptus, mint, lavender, bergamot, orange, lemongrass', label: 'Show the essential oils' },
    { src: `${PDP}/pashoya-key-ingredients.webp`, alt: 'PASHOYA key ingredients: Epsom salt, Sajji khar, Bhind salt and Java khar', fit: 'cover', pad: '0px', chip: 'Lab tested · no colours · no synthetic fragrance', label: 'Show the mineral salts' },
  ],
  packs: [
    { id: 1, jars: 1, title: '1 Jar', sub: 'Try the evening ritual', subMobile: '', price: '₹522', mrp: '₹695', tag: '', tagMobile: '' },
    { id: 2, jars: 2, title: '2 Jars', sub: 'One for you, one for your parents', subMobile: 'One for you, one for your parents', price: '₹[PRICE]', mrp: '₹1,390', tag: 'Most popular', tagMobile: 'Most popular' },
    { id: 3, jars: 3, title: '3 Jars', sub: 'Family pack + free wooden measuring scoop', subMobile: '+ free measuring scoop', price: '₹[PRICE]', mrp: '₹2,085', tag: 'Best value', tagMobile: '' },
  ],
  defaultPack: 2,
  trust: ['Lab tested', 'Secure checkout', '[Cash on delivery]'],
  trustMobile: ['Lab tested', 'Ships in 2–3 days', '[COD]'],
  accordions: [
    { title: "What's inside", body: ['Epsom salt, Sajji khar, Bhind salt and Java khar, infused with eucalyptus, mint, lavender, bergamot, orange and lemongrass essential oils. No colours, no synthetic fragrance.'] },
    { title: 'How to use', body: ['Add 2–4 tablespoons to a basin or tub of warm water. Soak your feet or body for 15–20 minutes. Pat dry and rest. For external use only.'] },
  ],
  benefits: [
    { icon: 'waves', title: 'Relaxes muscles', text: 'Warm magnesium-rich water loosens calves and soles.' },
    { icon: 'target', title: 'Eases joint discomfort', text: 'A daily comfort ritual for knees, ankles and heels.' },
    { icon: 'drop', title: 'Refreshes tired feet', text: 'Mint and eucalyptus leave feet light and cool.' },
    { icon: 'moon', title: 'Calms before sleep', text: 'Lavender and bergamot help you switch off.' },
  ],
  indications: [
    { n: '01', icon: `${PDP}/icons/long-day.svg`, tint: '#F7E1C8', when: 'Evening', title: 'After a long day on your feet', body: 'Shopkeepers, teachers, nurses, salon and kitchen staff, homemakers — anyone who stands for hours and comes home with heavy, throbbing feet.', bodyMobile: 'Shopkeepers, teachers, nurses, homemakers.', soak: 'Foot soak · 2 tbsp · 20 min' },
    { n: '02', icon: `${PDP}/icons/winter.svg`, tint: '#F3E6DA', when: 'Winter', title: 'Stiff knees and ankles in the cold', body: 'When joints feel tight on chilly mornings and evenings, and climbing stairs takes a little longer than it used to.', bodyMobile: 'When stairs take a little longer than they used to.', soak: 'Foot or bucket soak · 3–4 tbsp · 20 min' },
    { n: '03', icon: `${PDP}/icons/travel.svg`, tint: '#FBE7D2', when: 'After travel', title: 'Swollen, heavy feet after a journey', body: 'Long train, bus or flight rides, or standing through a full day of wedding functions and family gatherings.', bodyMobile: 'Long train rides, flights, wedding functions.', soak: 'Foot soak · 2–3 tbsp · 15–20 min' },
    { n: '04', icon: `${PDP}/icons/exercise.svg`, tint: '#F7E1C8', when: 'After exercise', title: 'Sore calves after a walk or workout', body: 'Morning walkers, gym-goers, cricket and badminton players — soak tight calves and soles the same evening.', soak: 'Bucket bath · 4 tbsp · 15–20 min' },
    { n: '05', icon: `${PDP}/icons/heels.svg`, tint: '#F3E6DA', when: 'Daily wear', title: 'Aching heels and soles', body: 'From hard floors, flat chappals or bare feet all day, when the soles feel bruised by evening.', soak: 'Foot soak · 2 tbsp · 15 min' },
    { n: '06', icon: `${PDP}/icons/sleep.svg`, tint: '#FBE7D2', when: 'Before bed', title: 'When you can’t switch off', body: 'Lavender, bergamot and orange oils turn a warm soak into a wind-down ritual before sleep.', bodyMobile: 'Lavender and bergamot turn it into a wind-down ritual.', soak: 'Foot soak · 2 tbsp · 20 min' },
    { n: '07', icon: `${PDP}/icons/elders.svg`, tint: '#F7E1C8', when: 'For elders', title: 'Your parents’ evening ritual', body: 'A gentle, drug-free comfort routine for parents and grandparents with everyday joint aches.', soak: 'Foot soak · 2–3 tbsp · 15–20 min' },
    { n: '08', icon: `${PDP}/icons/chores.svg`, tint: '#F3E6DA', when: 'After chores', title: 'After housework or festival prep', body: 'Deep cleaning, cooking for a crowd, Eid or Diwali preparations — when the whole body is tired, not just the feet.', soak: 'Full bath · 4 tbsp · 20 min' },
  ],
  // The mobile design leads with these four, in this order, then "See all 8 moments".
  mobileIndications: ['01', '02', '03', '06'],
  day: [
    { time: '8 AM', text: 'Stiff first steps out of bed', dot: 'background: #FBEBD8; opacity: 0.45' },
    { time: '9–7', text: 'Hours of standing, walking, commuting', dot: 'background: #FBEBD8; opacity: 0.6' },
    { time: '9 PM', text: 'PASHOYA soak, 20 minutes', dot: 'background: #E8641B', bold: true },
    { time: '10 PM', text: 'Light feet, calm mind, deep sleep', dot: 'background: #FBEBD8' },
  ],
  often: [
    { label: 'Tired feet', text: 'Whenever you need it — once a day is fine.' },
    { label: 'Joint stiffness', text: '[3–4 evenings a week — Hakim to confirm]' },
    { label: 'Best time', text: 'Evening, after work and before bed.' },
  ],
  checkFirst: [
    'Skip on open cuts, cracked or broken skin.',
    'Diabetic or reduced feeling in feet? Test water with your hand first and ask your doctor.',
    'Pregnant or under treatment? Ask your doctor before use.',
    'Warm water, never hot. For external use only.',
  ],
  checkFirstMobile: 'Skip on cuts or cracked skin. Diabetic, pregnant or under treatment? Ask your doctor. Warm water, never hot.',
  reels: [
    { src: `${PDP}/foot-soak.webp`, alt: 'Salt being spooned into a warm foot soak', caption: '[Customer reel — shopkeeper, after a 10-hour day]' },
    { src: `${PDP}/pashoya-jar-towel.webp`, alt: 'PASHOYA jar beside a towel', caption: '[Customer reel — mother\'s winter knee stiffness]' },
    { src: `${PDP}/essential-oils.webp`, alt: 'Essential oils used in PASHOYA', caption: '[Customer reel — gym-goer, sore calves]' },
    { src: `${PDP}/pashoya-jar.webp`, alt: 'PASHOYA Pain Salt jar', caption: '[Customer reel — after a long train journey]', contain: true },
  ],
  minerals: [
    { src: `${PDP}/epsom-salt.webp`, name: 'Epsom salt', role: 'Relaxes', body: 'Magnesium sulphate — the classic soaking salt used for tired muscles and stiff joints.' },
    { src: `${PDP}/sajji-khar.webp`, name: 'Sajji khar', role: 'Traditional Unani salt', body: 'A natural alkaline salt long used in Unani preparations. [Hakim to confirm benefit line]' },
    { src: `${PDP}/bhind-salt.webp`, name: 'Bhind salt', role: 'Mineral-rich', body: 'A traditional rock salt that adds trace minerals to the soak. [Hakim to confirm]' },
    { src: `${PDP}/java-khar.webp`, name: 'Java khar', role: 'Traditional Unani salt', body: 'An alkali made from barley-plant ash, used in classical Unani and Ayurvedic formulas. [Hakim to confirm]' },
  ],
  oils: [
    { name: 'Eucalyptus', body: 'Cooling, clears the head' },
    { name: 'Mint', body: 'Fresh, tingling relief for hot feet' },
    { name: 'Lavender', body: 'Calming, helps you unwind' },
    { name: 'Bergamot', body: 'Lifts the mood' },
    { name: 'Orange', body: 'Warm, uplifting aroma' },
    { name: 'Lemongrass', body: 'Fresh and deodorising' },
  ],
  steps: [
    { title: 'Add 2–4 tablespoons', text: '2 for a foot basin, 4 for a bucket or tub of warm water. Stir until it dissolves.' },
    { title: 'Soak 15–20 minutes', text: 'Sit back, breathe in the oils, let the warmth do the work.' },
    { title: 'Pat dry and rest', text: 'Moisturise your feet and keep them warm. Best done before bed.' },
  ],
  stepsMobile: [
    { big: '2–4', small: 'tbsp in warm water' },
    { big: '15–20', small: 'minutes soak' },
    { big: 'Rest', small: 'pat dry, then sleep' },
  ],
  compareCols: ['Painkiller tablets', 'Balms & sprays', 'Plain hot water'],
  compare: [
    { label: 'Nothing to swallow', a: 'Yes', b: 'No', c: 'Yes', d: 'Yes' },
    { label: 'Relaxes the whole foot, not one spot', a: 'Yes', b: '—', c: 'No', d: 'Partly' },
    { label: 'Calming aromatherapy', a: 'Yes', b: 'No', c: 'No', d: 'No' },
    { label: 'No greasy residue on clothes', a: 'Yes', b: 'Yes', c: 'No', d: 'Yes' },
    { label: 'Traditional Unani minerals', a: 'Yes', b: 'No', c: 'Rarely', d: 'No' },
  ],
  heritage: {
    title: 'From a family Unani practice on Aishbagh Road, Lucknow.',
    text: 'Hakiman began as a neighbourhood herbal practice that treated every patron like family. PASHOYA is the foot soak our elders prepared for people who spent their days on their feet — now measured, lab tested and sealed in a jar.',
    quote: '“[A short line from the family Hakim on why PASHOYA was made.]”',
    cite: '— [Name], [title], Hakiman',
    stats: [
      { big: '1943', text: 'Year the Hakiman practice began', tone: 'dark' },
      { big: '10', text: 'Natural ingredients, zero synthetic fragrance', tone: 'light' },
      { big: 'Lab', text: 'Tested for quality and safety', tone: 'light' },
      { big: '[N]+', text: 'Jars sold across India', tone: 'accent' },
    ],
  },
  reviewScore: '[4.x]',
  reviewCount: 'Based on [N] verified reviews',
  reviews: [
    { head: '[At first I thought it was just salt, but…]', body: '[Real review that answers the “is this just Epsom salt?” doubt.]', who: '[Name, city]' },
    { head: '[My mother’s knees…]', body: '[Real review from someone buying for a parent — speaks to the elder buyer.]', who: '[Name, city]' },
    { head: '[I stand 10 hours at my shop…]', body: '[Real review from a working professional on their feet all day.]', who: '[Name, city]' },
  ],
  faqs: [
    { q: 'How soon will I feel a difference?', a: 'Most people feel lighter, relaxed feet after the very first soak. For everyday joint stiffness, a regular evening routine works best. [Hakim to confirm wording]' },
    { q: 'How many soaks does one jar give?', a: '[N] foot soaks at 2 tablespoons each, or [N] full baths at 4 tablespoons.' },
    { q: 'Can I use it in a bucket bath instead of a basin?', a: 'Yes. Dissolve 4 tablespoons in a bucket of warm water and use it for your bath, or soak your whole body in a tub for 15–20 minutes.' },
    { q: 'Is it safe if I have diabetes?', a: 'Many diabetic feet have reduced feeling, so always test the water with your hand and keep it warm, not hot. Skip it on cuts or cracks and check with your doctor first.' },
    { q: 'Can I use it during pregnancy?', a: 'Please ask your doctor before using any bath salt or essential oils during pregnancy.' },
    { q: 'When will my order arrive?', a: 'Orders are dispatched in 2–3 business days and delivered in 5–7 days, anywhere in India.' },
    { q: 'Is cash on delivery available?', a: '[Confirm COD availability and any charges.]' },
    { q: 'What if my jar arrives damaged?', a: 'Message us within 7 days of delivery with a photo and we’ll refund to your original payment method within 7–10 business days.' },
  ],
  final: {
    image: `${PDP}/pashoya-jar.webp`,
    title: 'Tonight, give your feet the 20 minutes they\'ve earned.',
    text: 'Four mineral salts, six essential oils, one warm soak. Made by Hakiman in Lucknow.',
    perks: ['Ships in 2–3 days', 'Lab tested', '7-day help on damaged or wrong items'],
  },
  crossSellTitle: 'Complete your evening ritual',
  crossSell: ['hk-24', 'hk-22', 'hk-21'],
}

// Shown on every product page; restated from the published shipping and refund policies.
export const shippingAccordion = {
  title: 'Shipping & returns',
  body: ['Ships to every state in India. Dispatched in 2–3 business days, delivered in 5–7. Damaged or wrong item? Tell us within 7 days of delivery with a photo and we\'ll refund to your original payment method.'],
}

export const storeFaqs = [
  { q: 'When will my order arrive?', a: 'Orders are dispatched in 2–3 business days and delivered in 5–7 days, anywhere in India.' },
  { q: 'Is cash on delivery available?', a: '[Confirm COD availability and any charges.]' },
  { q: 'What if my order arrives damaged?', a: 'Message us within 7 days of delivery with a photo and we’ll refund to your original payment method within 7–10 business days.' },
]

export const PDP_LOGO = `${PDP}/logo-stacked.webp`
