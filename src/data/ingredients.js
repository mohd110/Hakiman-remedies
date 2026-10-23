// Ingredient index built only from ingredients named on the source product pages.
// `mentions` quotes the exact source sentence; no benefit is stated that the brand has not published.

export const ingredientGroups = [
  {
    id: 'minerals',
    title: 'Mineral salts',
    intro: 'The mineral blend behind the PASHOYA bath and foot soak.',
    items: [
      { name: 'Epsom Salt', products: ['pashoya-pain-salt-joint-support-amp-amp-amp-amp-natural-body-detox-salt-250-g-'] },
      { name: 'Sajji Khar', products: ['pashoya-pain-salt-joint-support-amp-amp-amp-amp-natural-body-detox-salt-250-g-'] },
      { name: 'Bhind Salt', products: ['pashoya-pain-salt-joint-support-amp-amp-amp-amp-natural-body-detox-salt-250-g-'] },
      { name: 'Java Khar', products: ['pashoya-pain-salt-joint-support-amp-amp-amp-amp-natural-body-detox-salt-250-g-'] },
    ],
    mention:
      'A traditional mineral blend of Epsom Salt, Sajji Khar, Bhind Salt, Java Khar and essential oils, crafted for a refreshing self-care ritual.',
  },
  {
    id: 'oils',
    title: 'Essential oils',
    intro: 'Aromatics infused into the PASHOYA soak.',
    items: ['Eucalyptus', 'Mint', 'Lavender', 'Bergamot', 'Orange', 'Lemongrass'].map((name) => ({
      name: `${name} Oil`,
      products: ['pashoya-pain-salt-joint-support-amp-amp-amp-amp-natural-body-detox-salt-250-g-'],
    })),
    mention:
      'Infused with Eucalyptus, Mint, Lavender, Bergamot, Orange and Lemongrass essential oils for an uplifting and calming soak.',
  },
  {
    id: 'herbs',
    title: 'Ayurvedic herbs',
    intro: 'Herbs named in the Cystorita Syrup formulation.',
    items: ['Ashoka', 'Lodhra', 'Shatavari', 'Guduchi'].map((name) => ({ name, products: ['cystorita-syrup'] })),
    mention:
      'Formulated with selected Ayurvedic herbs including Ashoka, Lodhra, Shatavari and Guduchi to support women’s wellness naturally.',
  },
  {
    id: 'skin',
    title: 'Skin botanicals',
    intro: 'Botanicals named across the hand made soap range.',
    items: [
      { name: 'Haldi (Turmeric)', products: ['haldi-chandan-hand-made-soap-1', 'de-tan-hand-made-soap'] },
      { name: 'Chandan (Sandalwood)', products: ['haldi-chandan-hand-made-soap-1', 'de-tan-hand-made-soap'] },
      { name: 'Neem', products: ['neem-hand-made-soap', 'de-tan-hand-made-soap'] },
      { name: 'Aloe Vera', products: ['haldi-chandan-hand-made-soap-1', 'de-tan-hand-made-soap'] },
      { name: 'Natural oils', products: ['haldi-chandan-hand-made-soap-1'] },
    ],
    mention:
      'Haldi is traditionally valued for its skin-brightening properties, Chandan is known for its soothing and refreshing feel, Aloe Vera helps maintain skin moisture, while natural oils provide nourishing care.',
  },
]

export const ingredientsNotPublished = [
  'advanced-ayurvedic-piles-care-capsules',
  'hakiman-cystorita-advanced-ayurvedic-women-s-health-capsules',
  'hakiman-fizoliv-ds-syrup-sugar-free-ayurvedic-liver-amp-amp-amp-digestive-care',
]
