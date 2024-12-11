import React from "react";
import Head from "next/head";

const TermsOfService: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Terms of Service</title>
        <meta name="description" content="Terms of Service" />
      </Head>

      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

      <section className="mb-6">
        <p className="text-sm text-gray-500 mb-4">
          <strong>Effective Date:</strong>{" "}
          {new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>

        <p className="mb-4">
          Welcome to Mishbaby Store. By accessing or using our website, you
          agree to be bound by these Terms of Service. If you disagree with any
          part of these terms, you may not access our website or use our
          services.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
        <div className="flex space-x-4">
          <div className="flex-shrink-0"></div>
          <div>
            <p>
              By accessing this website, you are agreeing to be bound by these
              Terms of Service, all applicable laws and regulations, and agree
              that you are responsible for compliance with any applicable local
              laws.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">2. Use of Our Services</h2>
        <div className="flex space-x-4">
          <div className="flex-shrink-0"></div>
          <div>
            <ul className="list-disc pl-6 mb-4">
              <li className="mb-2">
                You must be at least 18 years old to use this website.
              </li>
              <li className="mb-2">
                You are responsible for maintaining the confidentiality of your
                account and password.
              </li>
              <li className="mb-2">
                You agree to accept responsibility for all activities that occur
                under your account.
              </li>
              <li className="mb-2">
                We reserve the right to refuse service, terminate accounts,
                remove or edit content, or cancel orders at our sole discretion.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">3. User Obligations</h2>
        <div className="flex space-x-4">
          <div className="flex-shrink-0"></div>
          <div>
            <ul className="list-disc pl-6 mb-4">
              <li className="mb-2">
                You agree to provide accurate, current, and complete information
                during the registration process and with all your interactions
                with our website.
              </li>
              <li className="mb-2">
                You agree not to use our products for any illegal or
                unauthorized purpose.
              </li>
              <li className="mb-2">
                You must not transmit any worms or viruses or any code of a
                destructive nature.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">
          4. Product Information and Pricing
        </h2>
        <div className="flex space-x-4">
          <div className="flex-shrink-0"></div>
          <div>
            <p>
              We strive to provide accurate product information and pricing.
              However, in the event of an error, we reserve the right to correct
              such error and revise your order accordingly or to cancel the
              order and refund any amount charged.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">
          5. Intellectual Property
        </h2>
        <div className="flex space-x-4">
          <div className="flex-shrink-0"></div>
          <div>
            <p>
              The content on this website, including without limitation, the
              text, graphics, photos, and all other content, is protected by
              copyright and other intellectual property laws. You may not
              reproduce, distribute, or create derivative works from this
              content without express written consent from Mishbaby.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">
          6. Limitations of Liability
        </h2>
        <div className="flex space-x-4">
          <div className="flex-shrink-0"></div>
          <div>
            <p>
              Mishbaby Essentials shall not be liable for any direct, indirect,
              incidental, consequential, or punitive damages arising out of your
              access to, or use of, the website. Your use of the website and any
              dispute arising out of such use is subject to the laws of [Your
              Jurisdiction].
            </p>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
        <p>
          We reserve the right to update or change our Terms of Service at any
          time. Your continued use of the service after we post any
          modifications to the Terms of Service on this page will constitute
          your acknowledgment of the modifications and your consent to abide and
          be bound by the modified Terms of Service.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
        <p className="mb-4">
          If you have any questions about these Terms, please contact us at:
        </p>
        <p className="mb-4">
          Email:{" "}
          <a href="mailto:mishbabyshop@gmail.com">mishbabyshop@gmail.com</a>
        </p>
      </section>

      <section>
        <p className="font-bold">
          Last Updated:{" "}
          {new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </section>
    </div>
  );
};

export default TermsOfService;
