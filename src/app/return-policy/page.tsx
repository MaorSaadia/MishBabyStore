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
          1. Product Condition & Window
        </h2>
        <p className="mb-4">
          We accept returns only for new and unused items. To ensure the quality
          of our products and customer satisfaction:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">
            <strong>Return Window:</strong> Returns must be initiated within 14
            days of receiving your order.
          </li>
          <li className="mb-2">
            <strong>Product Condition:</strong> Items must be in their original
            condition, unused, and with all original tags and packaging intact.
          </li>
          <li className="mb-2">
            <strong>Verification:</strong> All returned items undergo inspection
            to ensure they meet our return criteria.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">2. Method & Fees</h2>
        <p className="mb-4">
          To make your return process as smooth as possible, please note the
          following:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">
            <strong>Return Method:</strong> All returns must be sent by mail to
            our designated return address.
          </li>
          <li className="mb-2">
            <strong>Return Label:</strong> Return labels are available upon
            request and will be provided in original packaging.
          </li>
          <li className="mb-2">
            <strong>Restocking Fee:</strong> A 10% restocking fee will be
            deducted from your refund amount.
          </li>
          <li className="mb-2">
            <strong>Processing Time:</strong> Refunds are typically processed
            within 5 business days of receiving your return.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">3. Return Process</h2>
        <p className="mb-4">Follow these steps to initiate your return:</p>
        <ol className="list-decimal pl-6 mb-4">
          <li className="mb-2">
            Contact our customer service team at mishbabyshop@gmail.com to
            request a return authorization.
          </li>
          <li className="mb-2">
            Pack the item securely in its original packaging with all tags
            attached.
          </li>
          <li className="mb-2">Include the return label in your package.</li>
          <li className="mb-2">
            Ship the package using the provided return label.
          </li>
          <li className="mb-2">
            Wait for confirmation of receipt and refund processing.
          </li>
        </ol>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">4. Non-Returnable Items</h2>
        <p className="mb-4">
          For hygiene and safety reasons, the following items cannot be
          returned:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">Items that have been used or worn</li>
          <li className="mb-2">Products with removed tags or packaging</li>
          <li className="mb-2">Personal care items and accessories</li>
          <li className="mb-2">Sale or clearance items marked as final sale</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">5. Refund Information</h2>
        <p className="mb-4">
          Once your return is received and inspected, your refund will be
          processed as follows:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">
            <strong>Refund Method:</strong> Refunds will be issued to the
            original payment method used for purchase.
          </li>
          <li className="mb-2">
            <strong>Processing Time:</strong> Please allow 5 business days for
            your refund to be processed.
          </li>
          <li className="mb-2">
            <strong>Deductions:</strong> The 10% restocking fee will be deducted
            from your refund amount.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">
          6. Damaged or Incorrect Items
        </h2>
        <p className="mb-4">If you receive a damaged or incorrect item:</p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">
            Contact us immediately with photos of the damaged item or packaging
          </li>
          <li className="mb-2">
            We will provide a prepaid return label for these cases
          </li>
          <li className="mb-2">
            No restocking fee will be charged for damaged or incorrect items
          </li>
          <li className="mb-2">
            A replacement or full refund will be issued upon verification
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">7. Contact Information</h2>
        <p className="mb-4">
          For any questions or concerns about our return policy, please contact
          us:
        </p>
        <Link
          href="/customer-service"
          className="text-blue-600 hover:underline"
        >
          Contact our support team
        </Link>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">8. Policy Updates</h2>
        <p className="mb-4">
          We reserve the right to modify this return policy at any time. Any
          changes will be posted on this page with an updated revision date.
        </p>
        <p className="font-bold">Last Updated: January 29, 2025</p>
      </section>
    </div>
  );
};

export default ReturnPolicy;
