import { Resend } from "resend";
import Welcome from "../../../emails/Welcome";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  await resend.emails.send({
    from: "you@example.com",
    to: "user@gmail.com",
    subject: "hello world",
    react: Welcome(),
  });
}
