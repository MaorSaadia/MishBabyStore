import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import * as React from "react";

interface AbandonedCartEmailProps {
  customerName?: string;
  discountCode?: string;
  cartUrl?: string;
}

export const AbandonedCartEmail: React.FC<AbandonedCartEmailProps> = ({
  customerName = "",
  discountCode = "dbrt15dis",
  cartUrl = "",
}) => (
  <Html>
    <Head />
    <Preview>Complete your purchase and save {discountCode} today!</Preview>
    <Tailwind>
      <Body className="bg-white font-sans">
        <Container className="mx-auto px-4 py-6 max-w-[500px]">
          {/* Logo */}
          <Img
            src="https://static.wixstatic.com/media/f33a90_eae077b5b3c2407582b7eb6ad1db5934~mv2.png"
            width="80"
            height="80"
            alt="MishBaby"
            className="mx-auto mb-6"
          />

          {/* Main Content */}
          <Section className="text-center mb-6">
            <Heading className="text-2xl font-bold text-cyan-900 mb-3">
              Your Cart Misses You!
            </Heading>
            <Text className="text-gray-600 text-base mb-6 px-2">
              Looks like you left something behind. Return to your cart to
              complete your MishBaby purchase.
            </Text>
          </Section>

          {/* Centered Sections Container */}
          <Section className="text-center mb-6 justify-center">
            {/* Discount and Button grouped together */}
            <div className="w-full max-w-[500px] mx-auto">
              {/* Discount Section */}
              <Section className="bg-cyan-50 rounded-lg p-5 mb-6 text-center">
                <Text className="text-cyan-900 text-lg mb-3">
                  Exclusive offer just for you:
                </Text>
                <Text className="text-cyan-700 text-3xl font-bold mb-2 tracking-wide">
                  {discountCode}
                </Text>
                <Text className="text-cyan-600 text-base mb-2">
                  Use this code at checkout to save on your purchase
                </Text>
                <Text className="text-gray-500 text-sm font-medium">
                  This exclusive offer is valid for the next 48 hours.
                </Text>
              </Section>

              {/* CTA Button */}
              <Link
                href={cartUrl}
                className="inline-block bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold text-base text-center no-underline"
              >
                RETURN TO CART
              </Link>
            </div>
          </Section>
          <Hr className="border-gray-500 my-2" />

          {/* Footer */}
          <Section className="text-center text-gray-500 text-sm">
            <Text>
              Need help? Contact us at our{" "}
              <Link
                href="https://mishbaby.com/customer-service"
                className="text-cyan-600 no-underline"
              >
                Customer Support
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default AbandonedCartEmail;
