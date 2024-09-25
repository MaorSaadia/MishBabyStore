import React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Link,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

interface CustomerServiceProps {
  name: string;
  email: string;
  orderNumber: string;
  issueType: string;
  message: string;
}

const CustomerService: React.FC<CustomerServiceProps> = ({
  name,
  email,
  orderNumber,
  issueType,
  message,
}) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="bg-white mx-auto my-8 p-8 rounded-lg shadow-lg">
            <Heading className="text-3xl font-bold text-gray-800 mb-6">
              New Support Ticket
            </Heading>
            <Hr className="border-gray-300 my-6" />
            <Section>
              <Text className="text-xl font-semibold text-gray-700 mb-4">
                Customer Information
              </Text>
              <Text className="text-gray-600 mb-2">
                <strong>Name:</strong> {name}
              </Text>
              <Text className="text-gray-600 mb-4">
                <strong>Email:</strong>{" "}
                <Link
                  href={`mailto:${email}`}
                  className="text-blue-600 hover:underline"
                >
                  {email}
                </Link>
              </Text>
            </Section>
            <Hr className="border-gray-300 my-6" />
            <Section>
              <Text className="text-xl font-semibold text-gray-700 mb-4">
                Ticket Details
              </Text>
              <Text className="text-gray-600 mb-2">
                <strong>Order Number:</strong> {orderNumber}
              </Text>
              <Text className="text-gray-600 mb-4">
                <strong>Issue Type:</strong> {issueType}
              </Text>
            </Section>
            <Hr className="border-gray-300 my-6" />
            <Section>
              <Text className="text-xl font-semibold text-gray-700 mb-4">
                Customer Message
              </Text>
              <Text className="text-gray-600 whitespace-pre-wrap">
                {message}
              </Text>
            </Section>
            <Hr className="border-gray-300 my-6" />
            <Text className="text-sm text-gray-500 text-center mt-6">
              This ticket was submitted on{" "}
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default CustomerService;
