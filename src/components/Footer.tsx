import Image from "next/image";
import Link from "next/link";

import Container from "@/components/ui/Container";
import { footerGroups } from "@/data/homeDiscovery";

const socialLinks = [
  { name: "Instagram", icon: "instagram", url: "https://www.instagram.com/mishbabystore" },
  { name: "Facebook", icon: "facebook", url: "https://www.facebook.com/profile.php?id=61567086625746" },
  { name: "YouTube", icon: "youtube", url: "https://www.youtube.com/@MishBabyShop" },
  { name: "TikTok", icon: "tiktok", url: "https://www.tiktok.com/@mishbaby_shop" },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">MishBaby footer</h2>
      <Container className="py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div className="max-w-sm">
            <Link href="/" className="inline-flex rounded-md" aria-label="MishBaby home">
              <Image src="/mb-logo.png" alt="" width={58} height={61} className="h-16 w-auto" />
            </Link>
            <p className="mt-5 text-base leading-7 text-ink-secondary">
              Thoughtful baby-product discovery, useful guidance, and more ways to choose where you shop.
            </p>
            <p className="mt-4 text-sm leading-6 text-ink-muted">
              Retailer availability varies. Purchases, payment, shipping, and fulfillment take place with the selected seller.
            </p>
            <div className="mt-6 flex gap-2">
              {socialLinks.map((social) => (
                <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-page transition hover:border-cyan-200 hover:bg-brand-soft" aria-label={`MishBaby on ${social.name}`}>
                  <Image src={`/${social.icon}.png`} alt="" width={20} height={20} />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-4">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-bold text-ink">{group.title}</h3>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="rounded-sm text-sm leading-6 text-ink-secondary hover:text-brand-hover">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-xs leading-5 text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 MishBaby. All rights reserved.</p>
          <p>MishBaby may earn a commission from selected links at no extra cost to you.</p>
        </div>
      </Container>
    </footer>
  );
}
