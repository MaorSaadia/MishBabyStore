import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "What is the shipping process like?",
    answer:
      "Once you place an order, our fulfillment team processes it, and the product is shipped directly to your address. We work with trusted suppliers to ensure prompt delivery and high-quality products.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes, we offer free international shipping to most eligible countries. For United States destinations, there is a $2.99 shipping fee (due to recent tariff changes). Please note that there are some countries we cannot ship to due to regulations. You can check our shipping restrictions page for the complete list. Delivery times typically range from 7-16 business days, depending on your location.",
  },
  {
    question: "Why is there a shipping fee for US orders?",
    answer:
      "Due to recent tariff changes implemented in early 2025, we now need to charge a $2.99 shipping fee for all orders delivered to the United States. We source many of our products from international suppliers, and these new tariffs have directly impacted our shipping costs. We're working to keep these fees as low as possible for our customers.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Shipping times depend on your location and the product's availability. Typically, orders are delivered within 7-16 business days.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order has been shipped, you will receive an email with your order tracking number. You can use this number to monitor your delivery status through the carrier's website or our order tracking page.",
  },
  {
    question: "Can I return or exchange products?",
    answer:
      "We offer returns for damaged or incorrect items. Please contact our customer support within 14 days of receiving the product, send us the image of the damaged or incorrect itmes, and we'll guide you through the process. In certain cases, we may allow you to keep the item and provide a 50% refund or store credit for the full amount of your order.",
  },
  {
    question: "What happens if my items are lost or damaged?",
    answer:
      "For damaged items, we will process a full refund or provide a free replacement if the item becomes defective within 14 days of delivery. For lost items, if the order is lost in transit and cannot be recovered within 14 days of placing the order, we will either reship the item or offer a full refund.",
  },
  {
    question: "How long does it take to process a refund?",
    answer:
      "Refunds are typically processed within 5-7 business days after we receive the returned item. If there are any issues with the refund, please contact us to confirm whether it was properly initiated on our end. If the refund was processed correctly, you may need to check with your bank for further details.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit/debit cards and PayPal, ensuring that your payment is secure and encrypted.",
  },
  {
    question: "Are there any hidden fees?",
    answer:
      "No, the price you see on the product page is the final price you pay at checkout, plus any applicable shipping fees. For most eligible countries, shipping is free. For United States destinations, there is a $2.99 shipping fee due to recent tariff changes. Any additional customs fees or taxes, where applicable, are the responsibility of the buyer.",
  },
  // {
  //   question: "Can I cancel my order?",
  //   answer:
  //     "You can cancel your order within 24 hours after placing it. However, if the item has already been shipped, we won't be able to cancel it.",
  // },
  {
    question: "What if my order hasn't arrived?",
    answer:
      "If your order hasn't arrived within the expected delivery window, Or if there's a delay, contact our support team for checking your order.",
  },
  {
    question: "Are your products authentic?",
    answer:
      "Yes, we work closely with verified suppliers to ensure that all products meet our quality standards before being shipped to our customers.",
  },
  {
    question: "Is shopping on your website secure?",
    answer:
      "Yes, we prioritize the security of your personal and payment information. All transactions are encrypted, and we comply with industry standards to keep your data safe.",
  },
  {
    question: "How do I contact customer support?",
    answer:
      "You can reach our customer support team through the Customer Support page. We aim to respond to all inquiries within 24 hours.",
  },
  {
    question: "Do you offer discounts or promotions?",
    answer:
      "Yes, we offer discounts and promotions from time to time. Be sure to stay updated on the latest deals.",
  },
];

const FAQPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        Frequently Asked Questions
      </h1>
      <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="border-b border-gray-200"
          >
            <AccordionTrigger className="text-left py-4 px-2 sm:px-4 hover:bg-gray-50 transition-colors duration-200">
              <span className="text-sm sm:text-base font-medium">
                {faq.question}
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-2 sm:px-4 py-3 text-sm sm:text-base text-gray-600">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQPage;
