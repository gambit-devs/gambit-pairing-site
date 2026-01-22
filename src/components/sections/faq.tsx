const faqs = [
  {
    question: "Is Gambit Pairing free?",
    answer: "Yes, Gambit Pairing is completely free and open-source software released under the GPLv3."
  },
  {
    question: "What operating systems are supported?",
    answer: "Gambit Pairing is built with cross-platform technologies and runs on Windows, macOS, and Linux."
  },
  {
    question: "How do I report a bug?",
    answer: "Please report any issues or feature requests on our GitHub repository's Issues page."
  },
  {
    question: "Can I export the tournament data?",
    answer: "Yes, you can export standings and pairings to PDF for printing or sharing."
  }
];

export function FAQ() {
  return (
    <section id="faq" className="py-20 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-background p-6 rounded-lg border shadow-sm">
              <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
              <p className="text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
