import {
  ChevronDown,
  ChevronUp,
  Clock,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "How does the rental process work?",
      a: "Browse our collection, select your outfit, choose your rental dates (3-10 days), add to cart, and checkout. We deliver 1 day before your start date and pickup after your event.",
    },
    {
      q: "Is the security deposit refundable?",
      a: "Yes, the security deposit is fully refundable within 5-7 business days after the outfit is returned in good condition.",
    },
    {
      q: "Can I get alterations done?",
      a: "Yes, minor alterations are available for free. Major alterations may incur a small fee. Please contact us after booking.",
    },
    {
      q: "What if the outfit gets damaged?",
      a: "Minor wear and tear is covered. For significant damage, charges will be deducted from the security deposit.",
    },
    {
      q: "Do you deliver pan-India?",
      a: "We currently deliver to 50+ cities across India. Enter your PIN code at checkout to check availability.",
    },
  ];

  const contactItems = [
    {
      icon: MapPin,
      title: "Our Office",
      info: ["Ganesh apartment 204,", "Near gate number 6, Birgunj."],
    },
    {
      icon: Phone,
      title: "Phone Support",
      info: ["+91 9811254719", "+91 9817266196"],
    },
    {
      icon: Mail,
      title: "Email Support",
      info: ["kavyanshkhemka@gmail.com", "Radhe Radhe Unique Collection"],
    },
    {
      icon: Clock,
      title: "Working Hours",
      info: ["Mon-Sat: 9:00 AM - 8:00 PM", "Sun: 10:00 AM - 5:00 PM"],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-rose-700 text-white py-12 text-center">
        <h1 className="font-display text-4xl font-bold mb-2">Contact Us</h1>
        <p className="text-rose-100">We're here to help you look your best</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-5">
              Send a Message
            </h2>
            {submitted ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-3">✅</div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Message Sent!
                </h3>
                <p className="text-gray-500 text-sm">
                  We'll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="text-sm font-medium text-gray-700 block mb-1"
                    >
                      Name
                    </label>
                    <input
                      id="contact-name"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-rose-400"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="text-sm font-medium text-gray-700 block mb-1"
                    >
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-rose-400"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="contact-subject"
                    className="text-sm font-medium text-gray-700 block mb-1"
                  >
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-rose-400"
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-message"
                    className="text-sm font-medium text-gray-700 block mb-1"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-rose-400 resize-none"
                    placeholder="Describe your query..."
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setSubmitted(true)}
                  className="w-full bg-rose-700 text-white py-3 rounded-full font-semibold hover:bg-rose-800 transition-colors"
                >
                  Send Message
                </button>
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            {contactItems.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl border border-gray-100 p-5 flex gap-4"
              >
                <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <item.icon size={18} className="text-rose-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">
                    {item.title}
                  </h3>
                  {item.info.map((line) => (
                    <p key={line} className="text-sm text-gray-500">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-5">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={faq.q}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center px-5 py-4 text-left"
                >
                  <span className="font-medium text-gray-900 text-sm">
                    {faq.q}
                  </span>
                  {openFaq === i ? (
                    <ChevronUp size={16} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={16} className="text-gray-400" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-gray-600 border-t border-gray-50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
