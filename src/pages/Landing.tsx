import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart, BookOpen, Cookie, Ban, RefreshCw, Bell, TrendingDown } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-background">
      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full px-6 py-4 flex items-center justify-between max-w-6xl mx-auto"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold text-foreground">🌿 Reflect</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/auth" className="text-muted-foreground hover:text-foreground transition-colors">
            Log In
          </Link>
          <Link to="/auth">
            <Button className="rounded-full px-6">Break Free Today</Button>
          </Link>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 pt-16 pb-24 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive text-sm font-medium">
            <Ban className="w-4 h-4" />
            BAD HABITS BREAKER
          </span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl md:text-7xl font-serif font-bold text-foreground mb-8 leading-tight"
        >
          Break bad habits.<br />
          <span className="text-primary">Build better ones.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
        >
          Smoking. Doomscrolling. Stress eating. Nail biting. Whatever habit is holding you back, 
          Reflect helps you <strong className="text-foreground">replace it</strong> with something healthier—one tiny step at a time.
        </motion.p>

        {/* Social proof / positioning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="bg-card border border-border/50 rounded-2xl p-4 max-w-xl mx-auto mb-10"
        >
          <p className="text-sm text-muted-foreground">
            <span className="text-primary font-semibold">Why it works:</span> Apps like Fume prove that 
            providing <em>alternatives</em> to harmful habits is the key to lasting change. 
            We don't just tell you to stop—we help you <strong className="text-foreground">replace, track, and celebrate</strong> your progress.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/auth">
            <Button size="lg" className="rounded-full px-8 py-6 text-lg">
              Start Breaking Free
            </Button>
          </Link>
          <Link to="/demo">
            <Button variant="ghost" size="lg" className="rounded-full px-8 py-6 text-lg text-muted-foreground">
              See How It Works
            </Button>
          </Link>
        </motion.div>
      </main>

      {/* How It Works Section */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
            Replace, Don't Just Resist
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Willpower alone isn't enough. Reflect gives you healthier alternatives and tracks your journey to freedom.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <StepCard
            number="1"
            title="Identify Your Triggers"
            description="Tell us the bad habits hurting your mental health. We'll help you understand when and why they happen."
          />
          <StepCard
            number="2"
            title="Get Smart Replacements"
            description="AI suggests healthier alternatives. Smoking? Try deep breathing or fidget tools. Doomscrolling? Try a 2-minute journal entry."
          />
          <StepCard
            number="3"
            title="Track & Celebrate"
            description="Log your wins, handle urges with check-ins, and watch your cookie jar fill with every victory."
          />
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-32">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
            Everything You Need to Break Free
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            More than a habit tracker—a complete mental wellness toolkit.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Ban className="w-6 h-6 text-destructive" />}
            title="Bad Habit Tracking"
            description="Log the habits you want to break. See patterns, triggers, and your progress over time."
            highlight
          />
          <FeatureCard
            icon={<RefreshCw className="w-6 h-6 text-primary" />}
            title="Smart Replacements"
            description="AI-powered suggestions for healthier alternatives based on your specific habits."
            highlight
          />
          <FeatureCard
            icon={<Bell className="w-6 h-6 text-primary" />}
            title="Urge Check-Ins"
            description="Get gentle notifications asking how you're doing. Feeling urges? We'll help you through."
          />
          <FeatureCard
            icon={<Heart className="w-6 h-6 text-primary" />}
            title="Mood Tracking"
            description="Check in with how you're feeling. Understand how habits affect your mental state."
          />
          <FeatureCard
            icon={<BookOpen className="w-6 h-6 text-primary" />}
            title="Journaling"
            description="Reflect on your thoughts without judgment. Process emotions and celebrate wins."
          />
          <FeatureCard
            icon={<Sparkles className="w-6 h-6 text-primary" />}
            title="Tiny Steps"
            description="Build new habits one small win at a time. Sustainable change, not overnight miracles."
          />
          <FeatureCard
            icon={<Cookie className="w-6 h-6 text-primary" />}
            title="Cookie Jar"
            description="Collect cookies for every win. A visual reminder of how far you've come."
          />
          <FeatureCard
            icon={<TrendingDown className="w-6 h-6 text-primary" />}
            title="Progress Insights"
            description="See your bad habit frequency drop week over week. Real data, real motivation."
          />
        </div>
      </section>

      {/* Testimonial / Use Cases */}
      <section className="bg-secondary/30 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-serif font-bold text-foreground text-center mb-12">
            What Habits Can You Break?
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              "🚬 Smoking",
              "📱 Doomscrolling", 
              "🍕 Stress eating",
              "💅 Nail biting",
              "☕ Too much caffeine",
              "🛒 Impulse shopping",
              "😴 Revenge bedtime",
              "📺 Binge watching"
            ].map((habit) => (
              <motion.div
                key={habit}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-card border border-border/50 rounded-xl p-4 text-center text-sm font-medium text-foreground"
              >
                {habit}
              </motion.div>
            ))}
          </div>
          <p className="text-center text-muted-foreground">
            ...and any other habit that's holding you back from being your best self.
          </p>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto text-center px-6">
          <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
            Ready to break free?
          </h2>
          <p className="text-muted-foreground mb-8">
            Start your journey today. Replace one bad habit with something better.
          </p>
          <Link to="/auth">
            <Button size="lg" className="rounded-full px-8">
              Get Started Free
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

const StepCard = ({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="text-center p-6"
  >
    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
      {number}
    </div>
    <h3 className="font-semibold text-foreground mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </motion.div>
);

const FeatureCard = ({
  icon,
  title,
  description,
  highlight = false,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight?: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className={`p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
      highlight 
        ? "bg-primary/5 border-primary/30" 
        : "bg-card border-border/50"
    }`}
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
      highlight ? "bg-primary/20" : "bg-primary/10"
    }`}>
      {icon}
    </div>
    <h3 className="font-semibold text-foreground mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </motion.div>
);

export default Landing;
