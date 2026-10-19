import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { FAQ_ITEMS } from "@/lib/site/faq"

export function FAQ() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="flex w-full justify-center px-6"
    >
      <div className="w-full max-w-3xl">
        <div className="text-center">
          <h2
            id="faq-heading"
            className="text-3xl leading-tight font-black tracking-tight sm:text-4xl"
          >
            FAQ
          </h2>
        </div>

        <Accordion
          hiddenUntilFound
          variant="default"
          className="mt-10"
          aria-label="Frequently asked questions"
        >
          {FAQ_ITEMS.map((item) => (
            <AccordionItem key={item.slug} value={item.slug}>
              <AccordionTrigger indicatorType="chevron">
                {item.question}
              </AccordionTrigger>
              <AccordionContent>
                <p>{item.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
