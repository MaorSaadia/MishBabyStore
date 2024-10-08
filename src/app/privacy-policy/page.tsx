import { ReactNode } from "react";
import {
  Scroll,
  Shield,
  Eye,
  UserCheck,
  Lock,
  AlertTriangle,
  Clock,
  CookieIcon,
  Globe,
  PersonStanding,
  ThumbsUp,
} from "lucide-react";

interface PolicySectionProps {
  icon: ReactNode;
  title: string;
  content: ReactNode;
}

const CurrentDate = () => {
  const now = new Date();
  // Format the date
  const formattedDate = `${now.toLocaleString("en-US", {
    month: "long",
  })} ${now.getDate()}, ${now.getFullYear()}`;

  return (
    <p className="text-sm text-gray-500">
      <strong>Effective Date:</strong> {formattedDate}
    </p>
  );
};

const PolicySection: React.FC<PolicySectionProps> = ({
  icon,
  title,
  content,
}) => (
  <div className="flex space-x-4">
    <div className="flex-shrink-0">
      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-slate-900 text-white">
        {icon}
      </div>
    </div>
    <div>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="text-gray-700">{content}</div>
    </div>
  </div>
);

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-cyan-800 to-cyan-400 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Privacy Policy
          </h1>
          <p className="mt-6 text-xl max-w-3xl">
            Protecting your personal information is our top priority.
          </p>
        </div>
      </header>

      <main className="flex-grow bg-white shadow-xl rounded-lg mx-4 sm:mx-6 lg:mx-8 my-8 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <section className="space-y-8 text-gray-700">
            <div className="border-b pb-4">
              <p className="text-sm text-gray-500">
                <CurrentDate />
              </p>
            </div>

            <p className="text-lg">
              At MishBaby, we are committed to safeguarding your privacy and
              ensuring the security of your personal information. This Privacy
              Policy outlines our practices regarding the collection, use, and
              protection of your data when you interact with our website, make
              purchases, or engage with our services.
            </p>

            <PolicySection
              icon={<Scroll />}
              title="1. Information We Collect"
              content={
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    <strong>Personal Information:</strong> Name, email address,
                    phone number, billing and shipping addresses.
                  </li>
                  <li>
                    <strong>Payment Information:</strong> Secure processing of
                    credit/debit card details or other payment methods.
                  </li>
                  <li>
                    <strong>Automatically Collected Data:</strong> IP address,
                    browser type, device information, and browsing behavior.
                  </li>
                  <li>
                    <strong>Order Information:</strong> Details of products
                    purchased and transaction history.
                  </li>
                </ul>
              }
            />

            <PolicySection
              icon={<Eye />}
              title="2. How We Use Your Information"
              content={
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    Process and fulfill your orders, including shipping and
                    payment transactions.
                  </li>
                  <li>
                    Communicate about your orders, products, and services.
                  </li>
                  <li>
                    Enhance our website, customer service, and product
                    offerings.
                  </li>
                  <li>
                    Personalize your experience with relevant content and
                    product recommendations.
                  </li>
                  <li>
                    Comply with legal obligations, prevent fraud, and maintain
                    security.
                  </li>
                </ul>
              }
            />

            <PolicySection
              icon={<UserCheck />}
              title="3. Sharing Your Information"
              content={
                <div>
                  <p>
                    We do not sell, trade, or rent your personal information to
                    third parties. We may share your information with:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mt-2">
                    <li>
                      <strong>Service Providers:</strong> Third-party companies
                      assisting with payment processing, order fulfillment,
                      website hosting, and analytics.
                    </li>
                    <li>
                      <strong>Legal Compliance:</strong> When required by law,
                      to protect our rights, or in response to legal processes.
                    </li>
                  </ul>
                </div>
              }
            />

            <PolicySection
              icon={<Lock />}
              title="4. Security of Your Information"
              content="We implement industry-standard security measures to protect your personal information. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security."
            />

            <PolicySection
              icon={<Shield />}
              title="5. Your Rights"
              content={
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    <strong>Access:</strong> Request access to your personal
                    information.
                  </li>
                  <li>
                    <strong>Correction:</strong> Request corrections to any
                    inaccuracies.
                  </li>
                  <li>
                    <strong>Deletion:</strong> Request deletion of your data,
                    subject to legal obligations.
                  </li>
                  <li>
                    <strong>Opt-Out:</strong> Unsubscribe from marketing
                    communications.
                  </li>
                </ul>
              }
            />

            <PolicySection
              icon={<AlertTriangle />}
              title="6. Changes to this Privacy Policy"
              content="We may update this Privacy Policy periodically. Any changes will be posted on this page with an updated effective date. We encourage you to review this policy regularly to stay informed about how we protect your information."
            />

            <PolicySection
              icon={<Clock />}
              title="7. Data Retention"
              content="We retain your personal data for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. After this period, your data will be deleted or anonymized."
            />

            <PolicySection
              icon={<CookieIcon />}
              title="8. Cookies and Tracking Technologies"
              content="Our website uses cookies and similar tracking technologies to enhance your browsing experience and analyze site traffic. You can manage your cookie preferences through your browser settings."
            />

            <PolicySection
              icon={<Globe />}
              title="9. International Data Transfers"
              content="Your personal information may be transferred to and processed in countries other than your own. We ensure that these transfers comply with applicable data protection laws and safeguard your information accordingly."
            />

            <PolicySection
              icon={<PersonStanding />}
              title="10. Children's Privacy"
              content="Our services are not directed to individuals under the age of 13, and we do not knowingly collect personal data from children. If we become aware that a child’s personal information has been collected without parental consent, we will take steps to delete it."
            />

            <PolicySection
              icon={<ThumbsUp />}
              title="11. Your Consent"
              content="By using our services, you consent to the collection and use of your personal data as described in this policy. If you wish to withdraw consent, please contact us at the email provided."
            />
            <div className="mt-12 border-t pt-8">
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p>
                If you have any questions or concerns about this Privacy Policy
                or your personal information, please don&apos;t hesitate to
                reach out:
              </p>
              <p className="mt-4">
                <strong>MishBaby</strong>
                <br />
                Email:{" "}
                <a
                  href="mailto:MishBabySupport@gmail.com"
                  className="text-blue-600 hover:underline"
                >
                  mishbabyshop@gmail.com
                </a>
              </p>
            </div>
          </section>
        </div>
      </main>

      <footer className="m-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center mb-6">
          <p>&copy; 2024 MishBaby. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
