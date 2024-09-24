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
    question: "How long does shipping take?",
    answer:
      "Shipping times depend on your location and the product's availability. Typically, orders are delivered within 10-30 business days. Each product page provides specific shipping estimates.",
  },
  {
    question: "Do you provide tracking information?",
    answer:
      "Yes, once your order has been shipped, you will receive a tracking number to follow the status of your delivery.",
  },
  {
    question: "Can I return or exchange products?",
    answer:
      "We offer returns or exchanges for damaged or incorrect items. Please contact our customer support within 30 days of receiving the product, and we'll guide you through the process.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit/debit cards and PayPal, ensuring that your payment is secure and encrypted.",
  },
  {
    question: "Are there any hidden fees?",
    answer:
      "No, the price you see on the product page is the final price you pay at checkout. Any additional customs fees or taxes, where applicable, are the responsibility of the buyer.",
  },
  {
    question: "Can I cancel my order?",
    answer:
      "You can cancel your order within 24 hours after placing it. Once the order is processed, we won't be able to cancel it, so please reach out to us as soon as possible.",
  },
  {
    question: "What if my order hasn't arrived?",
    answer:
      "If your order hasn't arrived within the expected delivery window, check the tracking information provided. If there's a delay, contact our support team for assistance.",
  },
  {
    question: "Are your products authentic?",
    answer:
      "Yes, we work closely with verified suppliers to ensure that all products meet our quality standards before being shipped to our customers.",
  },
  {
    question: "Can I change my shipping address after placing an order?",
    answer:
      "You can modify your shipping address within 24 hours of placing the order. If it has already been processed, unfortunately, we cannot make changes.",
  },
  {
    question: "Is shopping on your website secure?",
    answer:
      "Yes, we prioritize the security of your personal and payment information. All transactions are encrypted, and we comply with industry standards to keep your data safe.",
  },
  {
    question: "How do I contact customer support?",
    answer:
      "You can reach our customer support team through the Contact Us page or by emailing support@[yourwebsite].com. We aim to respond to all inquiries within 24 hours.",
  },
  {
    question: "Do you offer discounts or promotions?",
    answer:
      "Yes, we offer discounts and promotions from time to time. Be sure to sign up for our newsletter to stay updated on the latest deals.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes, we offer international shipping to most countries. Shipping costs and delivery times may vary based on your location.",
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
