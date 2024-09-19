const PrivacyPolicy = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-sky-600 text-white py-8 text-center">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
      </header>

      <main className="flex-grow bg-white text-gray-800 p-8 md:px-16 lg:px-32 xl:px-64">
        <section className="space-y-6">
          <p>
            <strong>Effective Date:</strong> [Insert Date]
          </p>
          <p>
            MishBaby (“we,” “us,” or “our”) is committed to protecting the
            privacy of our customers. This Privacy Policy outlines how we
            collect, use, and safeguard your personal information when you visit
            our website, purchase products, or otherwise interact with us.
          </p>

          <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
          <p>
            We may collect the following types of information:
            <ul className="list-disc list-inside">
              <li>
                <strong>Personal Information:</strong> When you create an
                account, make a purchase, or contact us, we may collect personal
                details such as your name, email address, phone number, billing
                address, and shipping address.
              </li>
              <li>
                <strong>Payment Information:</strong> We collect payment details
                such as credit/debit card information or other payment methods
                when you make a purchase.
              </li>
              <li>
                <strong>Automatically Collected Information:</strong> We may
                collect information automatically when you visit our website,
                including your IP address, browser type, device information, and
                browsing behavior through cookies and similar technologies.
              </li>
              <li>
                <strong>Order Information:</strong> We collect information about
                the products you purchase, including item descriptions and
                transaction history.
              </li>
            </ul>
          </p>

          <h2 className="text-2xl font-semibold">
            2. How We Use Your Information
          </h2>
          <p>
            We use the information we collect for the following purposes:
            <ul className="list-disc list-inside">
              <li>
                To process and fulfill your orders, including shipping and
                payment transactions.
              </li>
              <li>
                To communicate with you about your orders, products, and
                services.
              </li>
              <li>
                To improve our website, customer service, and product offerings.
              </li>
              <li>
                To personalize your experience and provide relevant content and
                product recommendations.
              </li>
              <li>
                To comply with legal obligations, prevent fraud, and ensure
                security.
              </li>
            </ul>
          </p>

          <h2 className="text-2xl font-semibold">
            3. Sharing Your Information
          </h2>
          <p>
            We do not sell, trade, or rent your personal information to third
            parties. However, we may share your information with:
            <ul className="list-disc list-inside">
              <li>
                <strong>Service Providers:</strong> We work with third-party
                companies that assist with payment processing, order
                fulfillment, website hosting, and analytics.
              </li>
              <li>
                <strong>Legal Compliance:</strong> We may disclose your
                information if required by law, to protect our rights, or in
                response to legal processes.
              </li>
            </ul>
          </p>

          <h2 className="text-2xl font-semibold">
            4. Cookies and Tracking Technologies
          </h2>
          <p>
            We use cookies and similar tracking technologies to collect
            information about your browsing activities. Cookies help us provide
            a more personalized experience, track shopping cart activities, and
            analyze website performance.
          </p>

          <h2 className="text-2xl font-semibold">
            5. Security of Your Information
          </h2>
          <p>
            We implement industry-standard security measures to protect your
            personal information. However, no system is 100% secure, and we
            cannot guarantee the absolute security of your information.
          </p>

          <h2 className="text-2xl font-semibold">6. Your Rights</h2>
          <p>
            You have the right to:
            <ul className="list-disc list-inside">
              <li>
                <strong>Access:</strong> Request access to the personal
                information we hold about you.
              </li>
              <li>
                <strong>Correction:</strong> Request corrections to any
                inaccuracies in your personal information.
              </li>
              <li>
                <strong>Deletion:</strong> Request that we delete your personal
                information, subject to legal obligations.
              </li>
              <li>
                <strong>Opt-Out:</strong> Unsubscribe from marketing
                communications by following the instructions in those
                communications.
              </li>
            </ul>
          </p>

          <h2 className="text-2xl font-semibold">7. Children’s Privacy</h2>
          <p>
            Our website is not intended for children under the age of 13. We do
            not knowingly collect or solicit personal information from children.
            If you believe we have collected personal information from a child,
            please contact us to have the information removed.
          </p>

          <h2 className="text-2xl font-semibold">
            8. Changes to this Privacy Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes
            will be posted on this page with the updated effective date. Please
            review the policy periodically for updates.
          </p>

          <h2 className="text-2xl font-semibold">9. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or your personal
            information, please contact us at:
          </p>
          <p>
            <strong>MishBaby</strong>
            <br />
            MishBabySupport@gmail.com
          </p>
        </section>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
