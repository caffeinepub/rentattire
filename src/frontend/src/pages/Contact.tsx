import {
  ChevronDown,
  ChevronUp,
  Clock,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { useState } from "react";

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <title>WhatsApp</title>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <title>Instagram</title>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "How does the rental process work?",
      a: "Browse our collection, select your outfit, choose your rental dates (3-10 days), add to cart, and checkout. Please arrange to collect and return the outfit to our store.",
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
      q: "What are your store hours?",
      a: "We are open Sunday to Friday from 11:00 AM to 5:00 PM. We are closed on Saturdays.",
    },
  ];

  const contactItems = [
    {
      icon: MapPin,
      title: "Our Store",
      info: ["Ganesh apartment 204,", "Near gate number 6, Birgunj."],
    },
    {
      icon: Phone,
      title: "Phone / WhatsApp",
      info: ["+977 9811254719", "+977 9817266196"],
      links: ["https://wa.me/9779811254719", "tel:+9779817266196"],
    },
    {
      icon: Mail,
      title: "Email",
      info: ["kavyanshkhemka@gmail.com"],
      links: ["mailto:kavyanshkhemka@gmail.com"],
    },
    {
      icon: Clock,
      title: "Working Hours",
      info: ["Sun–Fri: 11:00 AM – 5:00 PM", "Saturday: Holiday"],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-rose-700 text-black py-12 text-center">
        <h1 className="font-display text-4xl font-bold mb-2">Contact Us</h1>
        <p className="text-black">We're here to help you look your best</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Social Quick Links */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          <a
            href="https://wa.me/9779811254719"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-full font-semibold text-sm transition-colors"
          >
            <WhatsAppIcon size={16} />
            Chat on WhatsApp
          </a>
          <a
            href="https://www.instagram.com/khemka290"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 hover:opacity-90 text-white px-5 py-2.5 rounded-full font-semibold text-sm transition-opacity"
          >
            <InstagramIcon size={16} />
            Follow on Instagram
          </a>
          <a
            href="mailto:kavyanshkhemka@gmail.com"
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-full font-semibold text-sm transition-colors"
          >
            <Mail size={16} />
            Send Email
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-display text-2xl font-bold text-black mb-5">
              Send a Message
            </h2>
            {submitted ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-3">✅</div>
                <h3 className="font-semibold text-black mb-1">Message Sent!</h3>
                <p className="text-black text-sm">
                  We'll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="text-sm font-medium text-black block mb-1"
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
                      className="text-sm font-medium text-black block mb-1"
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
                    className="text-sm font-medium text-black block mb-1"
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
                    className="text-sm font-medium text-black block mb-1"
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
                  <item.icon size={18} className="text-rose-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-black text-sm mb-1">
                    {item.title}
                  </h3>
                  {item.info.map((line, idx) =>
                    item.links?.[idx] ? (
                      <a
                        key={line}
                        href={item.links[idx]}
                        target={
                          item.links[idx].startsWith("http")
                            ? "_blank"
                            : undefined
                        }
                        rel={
                          item.links[idx].startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className="text-sm text-rose-600 hover:underline block"
                      >
                        {line}
                      </a>
                    ) : (
                      <p key={line} className="text-sm text-black">
                        {line}
                      </p>
                    ),
                  )}
                </div>
              </div>
            ))}

            {/* Social media card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-semibold text-black text-sm mb-3">
                Follow Us
              </h3>
              <div className="flex gap-3">
                <a
                  href="https://wa.me/9779811254719"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                >
                  <WhatsAppIcon size={14} />
                  WhatsApp
                </a>
                <a
                  href="https://www.instagram.com/khemka290"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-pink-50 text-pink-600 border border-pink-200 hover:bg-pink-100 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                >
                  <InstagramIcon size={14} />
                  @khemka290
                </a>
                <a
                  href="mailto:kavyanshkhemka@gmail.com"
                  className="flex items-center gap-2 bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                >
                  <Mail size={14} />
                  Email
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="font-display text-2xl font-bold text-black mb-5">
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
                  <span className="font-medium text-black text-sm">
                    {faq.q}
                  </span>
                  {openFaq === i ? (
                    <ChevronUp size={16} className="text-black" />
                  ) : (
                    <ChevronDown size={16} className="text-black" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-black border-t border-gray-50">
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
