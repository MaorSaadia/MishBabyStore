import React from "react";
import { NextResponse } from "next/server";
import { render } from "@react-email/render";

import CustomerService from "@/emails/CustomerService";
import { mailOptions, transporter } from "@/app/config/nodemailer";

interface SupportTicketData {
  name: string;
  email: string;
  orderNumber: string;
  issueType: string;
  message: string;
}

export async function POST(request: Request) {
  const { name, email, orderNumber, issueType, message }: SupportTicketData =
    await request.json();

  try {
    const emailHtml = await render(
      React.createElement(CustomerService, {
        name,
        email,
        orderNumber,
        issueType,
        message,
      })
    );

    await transporter.sendMail({
      ...mailOptions,
      subject: `New Support Ticket: ${issueType} - Order ${orderNumber}`,
      html: emailHtml,
      replyTo: email,
    });

    return NextResponse.json(
      { message: "Support ticket email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending support ticket email:", error);
    return NextResponse.json(
      { error: "Failed to send support ticket email" },
      { status: 500 }
    );
  }
}
