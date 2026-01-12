import { CheckCircle2, Users, Trophy, Printer, Settings, Zap, Github, WifiOff } from "lucide-react";

const features = [
  {
    title: "Swiss System Pairing",
    description: "Automated pairing algorithm based on FIDE rules for Swiss tournaments.",
    icon: Zap,
  },
  {
    title: "Player Management",
    description: "Easy to add, edit, and manage players. Support for ratings and titles.",
    icon: Users,
  },
  {
    title: "Standings & Tiebreaks",
    description: "Real-time standings with multiple tiebreak systems (Buchholz, Sonneborn-Berger, etc.).",
    icon: Trophy,
  },
  {
    title: "Printable Reports",
    description: "Generate and print pairings, standings, and cross-tables directly from the app.",
    icon: Printer,
  },
  {
    title: "Cross-Platform",
    description: "Runs smoothly on Windows, macOS, and Linux.",
    icon: Settings,
  },
  {
    title: "User Friendly",
    description: "Clean and intuitive interface designed for tournament directors.",
    icon: CheckCircle2,
  },
  {
    title: "Open Source",
    description: "100% free and open source. Inspect the code, contribute features, or build your own version.",
    icon: Github,
  },
  {
    title: "Offline First",
    description: "No internet connection required. Run your tournament anywhere, anytime.",
    icon: WifiOff,
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Key Features
          </h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Everything you need to run a successful chess tournament.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="p-3 bg-primary/10 rounded-full mb-4">
                <feature.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
