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
  customerName = "there",
  discountCode = "dbrt15dis",
  cartUrl = "",
}) => (
  <Html>
    <Head />
    <Preview>Complete your MishBaby purchase with code {discountCode}</Preview>

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

          <Text className="text-cyan-900 text-xl mb-3">Hi {customerName},</Text>
          <Text className="text-cyan-700 text-base mb-2">
            We noticed that you left some items in your MishBaby cart. To
            encourage you to complete your purchase, we&apos;re offering you a
            special discount code:
          </Text>

          {/* Centered Sections Container */}
          <Section className="text-center mb-6 justify-center">
            {/* Discount and Button grouped together */}
            <div className="w-full max-w-[500px] mx-auto">
              {/* Discount Section */}
              <Section className="bg-cyan-50 rounded-lg p-5 mb-6 text-center">
                <Text className="text-cyan-900 text-lg mb-3">
                  Your special discount:
                </Text>
                <Text className="text-cyan-700 text-3xl font-bold mb-2 tracking-wide">
                  {discountCode}
                </Text>
                <Text className="text-cyan-600 text-base mb-2">
                  Use this code at checkout to save on your purchase
                </Text>
              </Section>

              {/* CTA Button */}
              <Link
                href={cartUrl}
                className="inline-block bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold text-base text-center no-underline"
              >
                Return to Cart
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
          {/* <Text className="text-gray-500 text-sm">
            If you no longer wish to receive these emails, please{" "}
            <Link
              href="https://mishbaby.com/unsubscribe"
              className="text-cyan-600 no-underline"
            >
              click here
            </Link>
            to opt out.
          </Text> */}
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default AbandonedCartEmail;
