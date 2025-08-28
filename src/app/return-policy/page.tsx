import Head from "next/head";
import Link from "next/link";

const ReturnPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Return Policy</title>
        <meta name="description" content="Return policy" />
      </Head>

      <h1 className="text-3xl font-bold mb-6">Return Policy</h1>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">
          1. Damaged or Incorrect Items
        </h2>
        <p className="mb-4">
          We only accept returns or exchanges if the product you received is
          damaged or incorrect. Your satisfaction is important to us, and we are
          committed to resolving such cases quickly.
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">
            Please contact us within <strong>14 days</strong> of receiving your
            order.
          </li>
          <li className="mb-2">
            Provide clear photos of the damaged or incorrect item and its
            packaging.
          </li>
          <li className="mb-2">
            Once verified, we will provide a prepaid return label.
          </li>
          <li className="mb-2">
            You may choose between a replacement item or a full refund.
          </li>
          <li className="mb-2">
            No restocking fees will be charged for damaged or incorrect items.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">2. Non-Returnable Items</h2>
        <p className="mb-4">
          Please note that we cannot accept returns for items that are not
          damaged or incorrect. This includes:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">
            Items you no longer want or changed your mind about
          </li>
          <li className="mb-2">
            Products that arrived as ordered and undamaged
          </li>
          <li className="mb-2">Sale or clearance items marked as final sale</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">3. Refund Information</h2>
        <p className="mb-4">
          Once your return is received and verified, your refund will be
          processed as follows:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">
            <strong>Refund Method:</strong> Issued to the original payment
            method.
          </li>
          <li className="mb-2">
            <strong>Processing Time:</strong> Please allow up to 5 business days
            after we confirm the return.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">4. Contact Information</h2>
        <p className="mb-4">
          For any questions or to initiate a return, please contact us:
        </p>
        <Link
          href="/customer-service"
          className="text-blue-600 hover:underline"
        >
          Contact our support team
        </Link>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">5. Policy Updates</h2>
        <p className="mb-4">
          We reserve the right to update this return policy at any time. Any
          changes will be posted on this page with the updated revision date.
        </p>
        <p className="font-bold">Last Updated: January 29, 2025</p>
      </section>
    </div>
  );
};

export default ReturnPolicy;
