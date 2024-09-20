"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Mail, Send, Clock, MessageSquare } from "lucide-react";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
    // Reset form after submission
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="m-8 bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Customer Service
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            We&apos;re here to help! Reach out with any questions or concerns.
          </p>
        </div>

        <div className="mt-16 lg:grid lg:grid-cols-2 lg:gap-8">
          <Card className="bg-cyan-600 text-white">
            <CardHeader>
              <h3 className="text-2xl font-bold">Customer Support</h3>
              <p className="text-cyan-200">
                We&apos;re committed to providing excellent service to our
                customers.
              </p>
            </CardHeader>
            <CardContent>
              <dl className="space-y-6">
                <div className="flex items-center">
                  <Clock
                    className="flex-shrink-0 w-6 h-6 text-cyan-200"
                    aria-hidden="true"
                  />
                  <span className="ml-3">24/6 Support Available</span>
                </div>
                <div className="flex items-center">
                  <MessageSquare
                    className="flex-shrink-0 w-6 h-6 text-cyan-200"
                    aria-hidden="true"
                  />
                  <span className="ml-3">Quick Response Times</span>
                </div>
                <div className="flex items-center">
                  <Mail
                    className="flex-shrink-0 w-6 h-6 text-cyan-200"
                    aria-hidden="true"
                  />
                  <span className="ml-3">support@yourdropship.com</span>
                </div>
              </dl>
              <p className="mt-6 text-cyan-200">
                Our dedicated team is ready to assist you with any inquiries
                about your order, our products. We strive to respond to all
                messages within 24 hours.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-2xl font-bold">Send us a message</h3>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Message
                  </label>
                  <Textarea
                    name="message"
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Button type="submit" className="w-full">
                    Send Message
                    <Send className="ml-2 h-5 w-5" aria-hidden="true" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
