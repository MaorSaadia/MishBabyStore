import { ReactNode } from "react";
import {
  Scroll,
  ShoppingCart,
  UserCheck,
  AlertTriangle,
  Shield,
  Scale,
} from "lucide-react";

interface TermsSectionProps {
  icon: ReactNode;
  title: string;
  content: ReactNode;
}

const CurrentDate = () => {
  const now = new Date();
  const formattedDate = `${now.toLocaleString("en-US", {
    month: "long",
  })} ${now.getDate()}, ${now.getFullYear()}`;

  return (
    <p className="text-sm text-gray-500">
      <strong>Effective Date:</strong> {formattedDate}
    </p>
  );
};

const TermsSection: React.FC<TermsSectionProps> = ({
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

const TermsOfService: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-cyan-800 to-cyan-400 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Terms of Service
          </h1>
          <p className="mt-6 text-xl max-w-3xl">
            Please read these terms carefully before using our services.
          </p>
        </div>
      </header>

      <main className="flex-grow bg-white shadow-xl rounded-lg mx-4 sm:mx-6 lg:mx-8 my-8 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <section className="space-y-8 text-gray-700">
            <div className="border-b pb-4">
              <CurrentDate />
            </div>

            <p className="text-lg">
              Welcome to MishBaby. By accessing or using our website, you agree
              to be bound by these Terms of Service. If you disagree with any
              part of these terms, you may not access our website or use our
              services.
            </p>

            <TermsSection
              icon={<Scroll />}
              title="1. Acceptance of Terms"
              content={
                <p>
                  By accessing this website, you are agreeing to be bound by
                  these Terms of Service, all applicable laws and regulations,
                  and agree that you are responsible for compliance with any
                  applicable local laws.
                </p>
              }
            />

            <TermsSection
              icon={<ShoppingCart />}
              title="2. Use of Our Services"
              content={
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    You must be at least 18 years old to use this website.
                  </li>
                  <li>
                    You are responsible for maintaining the confidentiality of
                    your account and password.
                  </li>
                  <li>
                    You agree to accept responsibility for all activities that
                    occur under your account.
                  </li>
                  <li>
                    We reserve the right to refuse service, terminate accounts,
                    remove or edit content, or cancel orders at our sole
                    discretion.
                  </li>
                </ul>
              }
            />

            <TermsSection
              icon={<UserCheck />}
              title="3. User Obligations"
              content={
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    You agree to provide accurate, current, and complete
                    information during the registration process and with all
                    your interactions with our website.
                  </li>
                  <li>
                    You agree not to use our products for any illegal or
                    unauthorized purpose.
                  </li>
                  <li>
                    You must not transmit any worms or viruses or any code of a
                    destructive nature.
                  </li>
                </ul>
              }
            />

            <TermsSection
              icon={<AlertTriangle />}
              title="4. Product Information and Pricing"
              content={
                <p>
                  We strive to provide accurate product information and pricing.
                  However, in the event of an error, we reserve the right to
                  correct such error and revise your order accordingly or to
                  cancel the order and refund any amount charged.
                </p>
              }
            />

            <TermsSection
              icon={<Shield />}
              title="5. Intellectual Property"
              content={
                <p>
                  The content on this website, including without limitation, the
                  text, graphics, photos, and all other content, is protected by
                  copyright and other intellectual property laws. You may not
                  reproduce, distribute, or create derivative works from this
                  content without express written consent from MishBaby.
                </p>
              }
            />

            <TermsSection
              icon={<Scale />}
              title="6. Limitations of Liability"
              content={
                <p>
                  MishBaby shall not be liable for any direct, indirect,
                  incidental, consequential, or punitive damages arising out of
                  your access to, or use of, the website. Your use of the
                  website and any dispute arising out of such use is subject to
                  the laws of [Your Jurisdiction].
                </p>
              }
            />

            <div className="mt-12 border-t pt-8">
              <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
              <p>
                We reserve the right to update or change our Terms of Service at
                any time. Your continued use of the service after we post any
                modifications to the Terms of Service on this page will
                constitute your acknowledgment of the modifications and your
                consent to abide and be bound by the modified Terms of Service.
              </p>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us
                at:
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

export default TermsOfService;
