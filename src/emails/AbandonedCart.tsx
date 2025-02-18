import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface AbandonedCartEmailProps {
  customerName?: string;
  discountCode?: string;
  cartUrl?: string;
}

export const AbandonedCartEmail: React.FC<AbandonedCartEmailProps> = ({
  customerName = "there",
  discountCode = "WELCOME10",
  cartUrl = "https://mishbaby.com/cart",
}) => (
  <Html>
    <Head />
    <Preview>
      Don&apos;t miss out! Complete your purchase and save {discountCode} today!
    </Preview>
    <Body className="bg-gray-50 font-sans">
      <Container className="bg-white mx-auto p-8 max-w-[600px] rounded-lg shadow-sm">
        {/* Header Section */}
        <Section className="text-center mb-8">
          <Img
            src="/mb-logo.png"
            width="120"
            height="120"
            alt="MishBaby"
            className="mx-auto mb-6"
          />
          <Heading className="text-3xl font-bold text-gray-900 mb-2">
            Your Cart Misses You!
          </Heading>
          <Text className="text-gray-500 text-lg">
            We saved your items just for you
          </Text>
        </Section>

        {/* Main Content */}
        <Section className="my-8">
          <Text className="text-gray-700 text-lg mb-4">
            Hello {customerName},
          </Text>
          <Text className="text-gray-700 text-lg leading-relaxed mb-4">
            We noticed you haven&apos;t completed your purchase. The items in
            your cart are waiting for you, and we want to make sure you
            don&apos;t miss out on these amazing products.
          </Text>

          {/* Discount Section */}
          <Section className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl my-8 p-8 text-center">
            <Text className="text-gray-700 text-lg mb-4">
              Here&apos;s an exclusive discount code just for you:
            </Text>
            <Text className="text-cyan-600 text-4xl font-bold mb-2">
              {discountCode}
            </Text>
            <Text className="text-gray-500 text-sm">
              Use this code at checkout to save on your purchase
            </Text>
          </Section>

          {/* CTA Button */}
          <Section className="text-center my-8">
            <Link
              href={cartUrl}
              className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-cyan-600 hover:to-blue-600 transition-colors duration-200 no-underline"
            >
              Complete Your Purchase →
            </Link>
          </Section>

          {/* Footer Section */}
          <Section className="mt-12 pt-8 border-t border-gray-200">
            <Text className="text-gray-500 text-sm text-center">
              This exclusive offer is valid for the next 48 hours. If you have
              any questions, please don&apos;t hesitate to contact our customer
              support team.
            </Text>
          </Section>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default AbandonedCartEmail;
