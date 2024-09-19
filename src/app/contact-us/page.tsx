"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { MapPin, Phone, Mail, Send } from "lucide-react";

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
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Contact Us
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            We&apos;d love to hear from you! Get in touch with any questions or
            concerns.
          </p>
        </div>

        <div className="mt-16 bg-white rounded-lg shadow-xl overflow-hidden lg:grid lg:grid-cols-2 lg:gap-4">
          <div className="p-6 bg-cyan-600 lg:col-span-1">
            <h3 className="text-2xl font-bold text-white">
              Contact Information
            </h3>
            <p className="mt-2 text-base text-cyan-200">
              Fill out the form and we&apos;ll get back to you as soon as
              possible.
            </p>
            <dl className="mt-8 space-y-6">
              <dt className="sr-only">Address</dt>
              <dd className="flex text-base text-cyan-50">
                <MapPin
                  className="flex-shrink-0 w-6 h-6 text-cyan-200"
                  aria-hidden="true"
                />
                <span className="ml-3">
                  123 Dropship Lane, E-commerce City, 12345
                </span>
              </dd>
              <dt className="sr-only">Phone number</dt>
              <dd className="flex text-base text-cyan-50">
                <Phone
                  className="flex-shrink-0 w-6 h-6 text-cyan-200"
                  aria-hidden="true"
                />
                <span className="ml-3">+1 (555) 123-4567</span>
              </dd>
              <dt className="sr-only">Email</dt>
              <dd className="flex text-base text-cyan-50">
                <Mail
                  className="flex-shrink-0 w-6 h-6 text-cyan-200"
                  aria-hidden="true"
                />
                <span className="ml-3">support@yourdropship.com</span>
              </dd>
            </dl>
          </div>

          <div className="py-6 px-4 sm:px-6 lg:col-span-1 lg:py-8 lg:px-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
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
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
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
                <textarea
                  name="message"
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
                  required
                ></textarea>
              </div>
              <div>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                >
                  Send Message
                  <Send className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
