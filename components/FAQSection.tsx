interface FAQSectionProps {
  faqs: { question: string; answer: string }[]
}

export function FAQSection({ faqs }: FAQSectionProps) {
  if (!faqs || faqs.length === 0) return null

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <details key={i} className="group border rounded-lg">
            <summary className="px-4 py-3 cursor-pointer font-medium text-sm hover:text-sports-green transition-colors list-none flex items-center justify-between">
              {faq.question}
              <span className="text-muted-foreground group-open:rotate-180 transition-transform ml-2">▼</span>
            </summary>
            <div className="px-4 pb-3 text-sm text-muted-foreground leading-relaxed">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}
