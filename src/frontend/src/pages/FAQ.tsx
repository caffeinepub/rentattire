import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface FAQProps {
  onNavigate?: (page: string) => void;
}

const faqs = [
  {
    question: "How does the rental process work?",
    answer:
      "Browse our collection, choose an outfit you love, visit our store to try it on and confirm your selection, then collect it on your agreed date. Return it after your event and we take care of the rest.",
  },
  {
    question: "What are the available sizes?",
    answer:
      "We stock sizes XS, S, M, L, XL, XXL, and Free Size options. Many outfits can also be adjusted slightly for a better fit. Contact us to confirm availability for your size.",
  },
  {
    question: "How long can I rent an outfit?",
    answer:
      "Standard rental periods range from 3 to 10 days. If you need a longer duration, please contact us directly and we will try to accommodate your request based on availability.",
  },
  {
    question: "Is a security deposit required?",
    answer:
      "Yes, a refundable security deposit is collected at the time of rental. The deposit amount varies by outfit and is listed on each product page. It is fully refunded when the outfit is returned in good condition.",
  },
  {
    question: "What happens if the outfit is damaged?",
    answer:
      "Minor wear is expected and covered. However, significant damage, stains, or loss may result in partial or full deduction from the security deposit. We assess each case fairly.",
  },
  {
    question: "Do you offer delivery or pickup?",
    answer:
      "Currently, customers are required to collect and return outfits directly from our store. We do not offer delivery or pickup services at this time.",
  },
  {
    question: "Can I cancel or change my booking?",
    answer:
      "Please contact us as soon as possible if you need to cancel or modify your rental. Cancellation policies depend on how close to the rental date you notify us. Early notice is appreciated.",
  },
  {
    question: "Are the outfits cleaned before rental?",
    answer:
      "Yes, every outfit is professionally dry-cleaned and sanitized after each rental. We follow strict hygiene standards to ensure all garments are fresh and ready for you.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept cash and digital payments at the store. Online payments via card are also available during checkout on our website.",
  },
  {
    question: "How do I contact you for more information?",
    answer:
      "You can reach us on WhatsApp at +977 9811254719, by email at kavyanshkhemka@gmail.com, or visit us during our working hours: Sunday to Friday, 11:00 AM to 5:00 PM. We are closed on Saturdays.",
  },
];

export default function FAQ({ onNavigate }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Breadcrumb */}
        {onNavigate && (
          <nav className="text-sm text-black mb-8">
            <button
              type="button"
              onClick={() => onNavigate("home")}
              className="hover:underline"
            >
              Home
            </button>
            <span className="mx-2">/</span>
            <span>FAQ</span>
          </nav>
        )}

        <h1 className="font-display text-4xl font-bold text-black mb-3">
          Frequently Asked Questions
        </h1>
        <p className="text-black mb-10">
          Everything you need to know about renting from Radhey Radhey Unique
          Collection.
        </p>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={faq.question}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex justify-between items-center px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-black pr-4">
                  {faq.question}
                </span>
                {openIndex === idx ? (
                  <ChevronUp
                    size={18}
                    className="flex-shrink-0 text-rose-600"
                  />
                ) : (
                  <ChevronDown
                    size={18}
                    className="flex-shrink-0 text-gray-400"
                  />
                )}
              </button>
              {openIndex === idx && (
                <div className="px-6 pb-5 text-black text-sm leading-relaxed bg-gray-50">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-rose-50 rounded-2xl p-6 text-center">
          <p className="font-semibold text-black mb-1">Still have questions?</p>
          <p className="text-sm text-black mb-4">
            Our team is happy to help. Reach us on WhatsApp or email.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/9779811254719"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-green-700 transition-colors"
            >
              WhatsApp Us
            </a>
            <a
              href="mailto:kavyanshkhemka@gmail.com"
              className="bg-rose-700 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-rose-800 transition-colors"
            >
              Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
