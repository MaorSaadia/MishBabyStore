import { NextResponse } from "next/server";
import { Resend } from "resend";

import CustomerService from "@/emails/CustomerService";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { name, email, orderNumber, issueType, message } = await request.json();

  try {
    await resend.emails.send({
      from: `${name} <onboarding@resend.dev>`,
      to: "aecom024@gmail.com",
      replyTo: email,
      subject: `New Support Ticket: ${issueType} - Order ${orderNumber}`,
      react: CustomerService({
        name,
        email,
        orderNumber,
        issueType,
        message,
      }),
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
