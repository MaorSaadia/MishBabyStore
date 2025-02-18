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
    <Preview>Complete your purchase and save with a special discount!</Preview>
    <Body className="bg-gray-100 font-sans">
      <Container className="bg-white mx-auto p-8 max-w-[600px]">
        <Img
          src="[Your Logo URL]"
          width="80"
          height="80"
          alt="MishBaby"
          className="mx-auto block"
        />
        <Heading className="text-2xl font-semibold text-center text-gray-900 my-8">
          We Noticed You Left Something In Your Cart
        </Heading>
        <Section className="my-8">
          <Text className="text-gray-700 text-base leading-6">
            Hi {customerName},
          </Text>
          <Text className="text-gray-700 text-base leading-6">
            We noticed you haven&apos;t completed your purchase. Don&apos;t
            worry - we saved your cart for you!
          </Text>
          <Text className="text-gray-700 text-base leading-6">
            To make it even better, here&apos;s a special discount just for you:
          </Text>
          <Section className="bg-blue-50 border-2 border-dashed border-blue-500 rounded-lg my-6 p-6 text-center">
            <Text className="text-blue-600 text-2xl font-bold">
              {discountCode}
            </Text>
          </Section>
          <Link
            href={cartUrl}
            className="bg-cyan-500 text-white px-6 py-3 rounded-md font-semibold text-center block w-48 mx-auto my-8 no-underline"
          >
            Resume Your Order
          </Link>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default AbandonedCartEmail;
