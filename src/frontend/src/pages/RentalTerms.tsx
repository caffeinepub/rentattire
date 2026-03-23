interface RentalTermsProps {
  onNavigate?: (page: string) => void;
}

export default function RentalTerms({ onNavigate }: RentalTermsProps) {
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
            <span>Rental Terms</span>
          </nav>
        )}

        <h1 className="font-display text-4xl font-bold text-black mb-3">
          Rental Terms & Conditions
        </h1>
        <p className="text-sm text-gray-500 mb-10">Last updated: March 2026</p>

        <div className="space-y-8 text-black">
          <section>
            <h2 className="text-xl font-bold text-black mb-3">
              1. Rental Agreement
            </h2>
            <p className="text-sm leading-relaxed">
              By renting any outfit from Radhey Radhey Unique Collection, you
              agree to these terms and conditions. The rental agreement is
              between you (the customer) and Radhey Radhey Unique Collection
              (the business). All rentals are subject to availability and must
              be confirmed in person at our store.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black mb-3">
              2. Rental Period
            </h2>
            <p className="text-sm leading-relaxed">
              The standard rental period is 3 to 10 days. The rental period
              begins on the agreed collection date and ends on the agreed return
              date. Extensions may be granted at the discretion of the
              management, subject to availability and additional charges.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black mb-3">
              3. Security Deposit
            </h2>
            <p className="text-sm leading-relaxed">
              A refundable security deposit is required for all rentals. The
              deposit amount is listed on each product page and must be paid at
              the time of collection. The deposit will be refunded in full upon
              timely return of the outfit in its original condition, free from
              damage, stains, or loss.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black mb-3">
              4. Care of Outfit
            </h2>
            <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside">
              <li>Handle the outfit with care throughout the rental period.</li>
              <li>
                Do not attempt to wash, dry-clean, or alter the outfit yourself.
              </li>
              <li>
                Store the outfit in a clean, dry place away from direct
                sunlight.
              </li>
              <li>
                Keep the outfit away from sharp objects, food, and liquids.
              </li>
              <li>
                Return the outfit in the same packaging provided at collection.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black mb-3">
              5. Damage & Loss Policy
            </h2>
            <p className="text-sm leading-relaxed">
              Normal wear is expected and will not attract any penalty. However,
              the following situations may result in deductions from the
              security deposit or additional charges:
            </p>
            <ul className="text-sm leading-relaxed space-y-2 list-disc list-inside mt-3">
              <li>
                Significant stains that cannot be removed by professional
                cleaning.
              </li>
              <li>
                Tears, cuts, or structural damage to the outfit or
                embellishments.
              </li>
              <li>Loss of accessories, dupatta, or any part of the outfit.</li>
              <li>
                Loss of the entire outfit — full replacement cost will be
                charged.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black mb-3">
              6. Late Returns
            </h2>
            <p className="text-sm leading-relaxed">
              Outfits must be returned by the agreed date and time. Late returns
              will attract a daily penalty equivalent to the daily rental rate
              until the outfit is returned. Repeated or extended delays may
              result in forfeiture of the security deposit.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black mb-3">
              7. Cancellation Policy
            </h2>
            <p className="text-sm leading-relaxed">
              Cancellations made more than 48 hours before the rental start date
              will receive a full refund of any advance payment. Cancellations
              within 48 hours of the rental start date may be subject to a
              cancellation fee. No-shows will forfeit any advance payments made.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black mb-3">
              8. Collection & Return
            </h2>
            <p className="text-sm leading-relaxed">
              All outfits must be collected and returned directly from our
              store. We do not offer delivery or pickup services. Our store
              hours are Sunday to Friday, 11:00 AM to 5:00 PM. We are closed on
              Saturdays. Please plan your collection and return accordingly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black mb-3">
              9. Hygiene & Sanitization
            </h2>
            <p className="text-sm leading-relaxed">
              All outfits are professionally dry-cleaned and sanitized after
              each rental. We maintain strict hygiene standards to ensure every
              garment is fresh, clean, and ready for the next customer.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black mb-3">
              10. Contact Us
            </h2>
            <p className="text-sm leading-relaxed">
              If you have any questions about these terms, please contact us:
            </p>
            <ul className="text-sm leading-relaxed space-y-1 mt-3">
              <li>
                <strong>WhatsApp:</strong>{" "}
                <a
                  href="https://wa.me/9779811254719"
                  className="text-rose-700 hover:underline"
                >
                  +977 9811254719
                </a>
              </li>
              <li>
                <strong>Phone:</strong> +977 9817266196
              </li>
              <li>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:kavyanshkhemka@gmail.com"
                  className="text-rose-700 hover:underline"
                >
                  kavyanshkhemka@gmail.com
                </a>
              </li>
              <li>
                <strong>Hours:</strong> Sunday to Friday, 11:00 AM – 5:00 PM
                (Closed Saturday)
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
