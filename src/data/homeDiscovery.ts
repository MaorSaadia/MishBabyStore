export const needCards = [
  {
    title: "Preparing for a Newborn",
    description: "Start with the everyday care items families reach for most.",
    href: "/list?cat=baby-cares",
    icon: "heart",
  },
  {
    title: "Better Baby Sleep",
    description: "Explore calm, comfortable additions for bedtime routines.",
    href: "/list?cat=nursery-decor",
    icon: "moon",
  },
  {
    title: "Starting Solid Foods",
    description: "Find practical mealtime tools for a new stage of feeding.",
    href: "/list?cat=feeding-mealtime",
    icon: "utensils",
  },
  {
    title: "Traveling with Baby",
    description: "Browse portable essentials for easier days away from home.",
    href: "/list?cat=all-products",
    icon: "luggage",
  },
  {
    title: "Baby-Proofing the Home",
    description: "Discover simple products designed around safer spaces.",
    href: "/list?cat=safety-comfort",
    icon: "shield",
  },
  {
    title: "Gifts for New Parents",
    description: "Explore useful and playful ideas for growing families.",
    href: "/list?cat=toys-games",
    icon: "gift",
  },
  {
    title: "Small-Space Nursery",
    description: "Make a cozy room work harder with compact ideas.",
    href: "/list?cat=nursery-decor",
    icon: "home",
  },
  {
    title: "Budget Baby Essentials",
    description: "Browse broadly and choose the options that fit your family.",
    href: "/list?cat=all-products",
    icon: "wallet",
  },
] as const;

export const shoppingOptions = [
  "Amazon",
  "AliExpress",
  "iHerb",
  "Target",
  "Direct baby brands",
] as const;

export const footerGroups = [
  {
    title: "Shop",
    links: [
      { label: "All products", href: "/list?cat=all-products" },
      { label: "Baby essentials", href: "/list?cat=baby-cares" },
      { label: "Feeding & mealtime", href: "/list?cat=feeding-mealtime" },
      { label: "Toys & development", href: "/list?cat=toys-games" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Categories", href: "/#categories" },
      { label: "Shop by need", href: "/#shop-by-need" },
      { label: "Buying guides", href: "/blog" },
      { label: "How MishBaby works", href: "/#how-it-works" },
    ],
  },
  {
    title: "MishBaby",
    links: [
      { label: "About", href: "/about-us" },
      { label: "Affiliate disclosure", href: "/#affiliate-disclosure" },
      { label: "Contact", href: "/customer-service" },
      { label: "Order tracking", href: "/order-tracking" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", href: "/privacy-policy" },
      { label: "Terms of service", href: "/terms-of-service" },
      { label: "Return policy", href: "/return-policy" },
      { label: "Shipping information", href: "/shipping-restrictions" },
    ],
  },
] as const;
