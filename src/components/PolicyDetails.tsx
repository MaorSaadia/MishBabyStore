import { ArrowRight } from "lucide-react";

const PolicyDetails = () => {
  const policies = [
    {
      id: "shipping",
      title: "SHIPPING INFO",
      sections: [
        {
          title: "1. Shipping Process",
          content:
            "Once your order is placed, our fulfillment team processes it promptly, and the product is shipped directly to your address. We work closely with trusted suppliers to ensure both timely delivery and high-quality products. Once your order has been shipped, you will receive an email with your order tracking number to monitor your delivery status.",
        },
        {
          title: "2. International Shipping and Timeframes",
          content:
            "We offer free international shipping to most countries. However, please note that there are some countries we cannot ship to due to regulations. You can check our shipping restrictions page for the complete list. Delivery times typically range from 7-16 business days, depending on your location and product availability.",
        },
      ],
    },
    {
      id: "returns",
      title: "RETURN & REFUND POLICY",
      sections: [
        {
          title: "1. Returns & Exchanges",
          content:
            "We want you to be completely satisfied with your purchase. If you receive a damaged or incorrect item, you may return or exchange it. Please contact our customer support team within 14 days of receiving the product to initiate the process. In certain cases, we may allow you to keep the item and provide a 50% refund or store credit for the full amount of your order. We'll guide you through every step to ensure a smooth experience.",
        },
        {
          title: "2. Damaged or Lost Items",
          content: [
            {
              subtitle: "Damaged Items:",
              text: "If your item arrives damaged or becomes defective within 30 days of delivery, we will offer a full refund or send a free replacement.",
            },
            {
              subtitle: "Lost Items:",
              text: "If your order is lost in transit and cannot be recovered within 30 days of placing the order, we will either reship the item or offer a full refund. Your satisfaction is our priority, and we will work diligently to resolve any issues.",
            },
          ],
        },
        {
          title: "3. Refund Processing Time",
          content:
            "Once we receive your returned item, refunds are typically processed within 5-7 business days. If there are any issues or delays, feel free to contact our support team to confirm that the refund has been initiated. If everything is correct on our end, we recommend checking with your bank for further updates.",
        },
      ],
    },
  ];

  return (
    <div>
      {policies.map((policy) => (
        <div key={policy.id} className="">
          <details className="mt-6 border-t border-gray-200 pt-4">
            <summary className="font-medium text-gray-900 cursor-pointer flex items-center">
              {policy.title}
              <ArrowRight className="w-4 h-4 ml-2" />
            </summary>
            <div className="mt-2 text-sm text-gray-500">
              {policy.sections.map((section, index) => (
                <div key={index}>
                  <p>
                    <span className="font-bold">{section.title}</span>
                  </p>
                  {Array.isArray(section.content) ? (
                    section.content.map((item, idx) => (
                      <p key={idx}>
                        <span className="font-bold">{item.subtitle}</span>{" "}
                        {item.text}
                      </p>
                    ))
                  ) : (
                    <p>{section.content}</p>
                  )}
                  {index < policy.sections.length - 1 && (
                    <p className="mt-4"></p>
                  )}
                </div>
              ))}
            </div>
          </details>
        </div>
      ))}
    </div>
  );
};

export default PolicyDetails;
