import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/sections/hero";
import { Features } from "@/components/sections/features";
import { Screenshots } from "@/components/sections/screenshots";
import { FAQ } from "@/components/sections/faq";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <Hero />
      <Features />
      <Screenshots />
      <FAQ />
      <Footer />
    </main>
  );
}
