import React from "react";
import { NextResponse } from "next/server";
import { render } from "@react-email/render";

import { mailOptions, transporter } from "@/app/config/nodemailer";
import AbandonedCartEmail from "@/emails/AbandonedCart";

interface AbandonedCartData {
  customerEmail: string;
  customerName?: string;
  discountCode: string;
  cartUrl: string;
}

export async function POST(request: Request) {
  try {
    const data: AbandonedCartData = await request.json();

    // Validate required fields
    if (!data.customerEmail || !data.discountCode || !data.cartUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Render email template
    const emailHtml = await render(
      React.createElement(AbandonedCartEmail, {
        customerName: data.customerName,
        discountCode: data.discountCode,
        cartUrl: data.cartUrl,
      })
    );

    // Send email
    await transporter.sendMail({
      ...mailOptions,
      from: {
        name: "MishBaby",
        address: "no-reply@mishbabyshop.com",
      },
      to: data.customerEmail,
      subject:
        "We Noticed You Left Something Behind! - Special Discount Inside!",
      html: emailHtml,
    });

    return NextResponse.json(
      { message: "Abandoned cart email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending abandoned cart email:", error);
    return NextResponse.json(
      { error: "Failed to send abandoned cart email" },
      { status: 500 }
    );
  }
}
