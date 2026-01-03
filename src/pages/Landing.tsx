import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart, BookOpen, Cookie } from "lucide-react";
import RotatingText from "@/components/RotatingText";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-background">
      {/* Navigation */}
      <nav className="w-full px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold text-foreground">🌿 Reflect</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/auth" className="text-muted-foreground hover:text-foreground transition-colors">
            Log In
          </Link>
          <Link to="/auth">
            <Button className="rounded-full px-6">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 pt-20 pb-32 text-center">
        <div className="mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            WELLNESS APP / DAILY REFLECTION
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground mb-8 leading-tight">
          Stop crying over{" "}
          <RotatingText />
          <span className="text-foreground">.</span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
          Reflect is your gentle companion for daily check-ins, mood tracking, and celebrating tiny wins. 
          No judgment. Just growth.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/auth">
            <Button size="lg" className="rounded-full px-8 py-6 text-lg">
              Get Started Free
            </Button>
          </Link>
          <Link to="/demo">
            <Button variant="ghost" size="lg" className="rounded-full px-8 py-6 text-lg text-muted-foreground">
              How it works
            </Button>
          </Link>
        </div>
      </main>

      {/* Features Preview */}
      <section className="max-w-5xl mx-auto px-6 pb-32">
        <div className="grid md:grid-cols-4 gap-6">
          <FeatureCard
            icon={<Heart className="w-6 h-6 text-primary" />}
            title="Mood Tracking"
            description="Check in with how you're feeling each day"
          />
          <FeatureCard
            icon={<BookOpen className="w-6 h-6 text-primary" />}
            title="Journaling"
            description="Reflect on your thoughts without judgment"
          />
          <FeatureCard
            icon={<Sparkles className="w-6 h-6 text-primary" />}
            title="Tiny Steps"
            description="Build habits one small win at a time"
          />
          <FeatureCard
            icon={<Cookie className="w-6 h-6 text-primary" />}
            title="Cookie Jar"
            description="Celebrate achievements and stay motivated"
          />
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-secondary/30 py-20">
        <div className="max-w-2xl mx-auto text-center px-6">
          <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
            Ready to start your reflection journey?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join thousands who are building better mental wellness habits, one day at a time.
          </p>
          <Link to="/auth">
            <Button size="lg" className="rounded-full px-8">
              Start Reflecting Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-muted-foreground text-sm">
        <p>Made with 💚 for your mental wellness</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="p-6 rounded-2xl bg-card border border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="font-semibold text-foreground mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

export default Landing;
