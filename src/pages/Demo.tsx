import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MiniChart } from "@/components/ui/mini-chart";
import { ArrowLeft, Heart, BookOpen, Sparkles, Cookie, TrendingUp, Calendar } from "lucide-react";

const Demo = () => {
  // Sample data for different charts
  const moodData = [
    { label: "Mon", value: 75 },
    { label: "Tue", value: 90 },
    { label: "Wed", value: 60 },
    { label: "Thu", value: 85 },
    { label: "Fri", value: 70 },
    { label: "Sat", value: 95 },
    { label: "Sun", value: 80 },
  ];

  const habitData = [
    { label: "Mon", value: 100 },
    { label: "Tue", value: 66 },
    { label: "Wed", value: 33 },
    { label: "Thu", value: 100 },
    { label: "Fri", value: 66 },
    { label: "Sat", value: 100 },
    { label: "Sun", value: 66 },
  ];

  const journalData = [
    { label: "Mon", value: 85 },
    { label: "Tue", value: 0 },
    { label: "Wed", value: 90 },
    { label: "Thu", value: 75 },
    { label: "Fri", value: 0 },
    { label: "Sat", value: 95 },
    { label: "Sun", value: 80 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-background">
      {/* Navigation */}
      <nav className="w-full px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        <Link to="/auth">
          <Button className="rounded-full px-6">Get Started</Button>
        </Link>
      </nav>

      {/* Hero */}
      <header className="max-w-4xl mx-auto px-6 pt-12 pb-8 text-center">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          DEMO / PREVIEW
        </span>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
          See Reflect in Action
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Here's a preview of how Reflect helps you track your wellness journey with beautiful, 
          insightful visualizations.
        </p>
      </header>

      {/* Activity Charts Grid */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8 justify-items-center">
          {/* Mood Tracking */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-foreground font-medium">
              <Heart className="w-5 h-5 text-primary" />
              Mood Tracking
            </div>
            <MiniChart data={moodData} title="Weekly Mood" />
            <p className="text-sm text-muted-foreground text-center max-w-xs">
              Track how you're feeling each day and spot patterns in your emotional wellness.
            </p>
          </div>

          {/* Habit Completion */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-foreground font-medium">
              <TrendingUp className="w-5 h-5 text-primary" />
              Habit Streaks
            </div>
            <MiniChart data={habitData} title="Habits Done" />
            <p className="text-sm text-muted-foreground text-center max-w-xs">
              Build momentum with daily habits and celebrate your consistency.
            </p>
          </div>

          {/* Journal Activity */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-foreground font-medium">
              <BookOpen className="w-5 h-5 text-primary" />
              Journal Entries
            </div>
            <MiniChart data={journalData} title="Reflections" />
            <p className="text-sm text-muted-foreground text-center max-w-xs">
              Capture your thoughts and watch your reflection practice grow.
            </p>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-card rounded-3xl border border-border/50 p-8 md:p-12">
          <h2 className="text-2xl font-serif font-bold text-foreground mb-8 text-center">
            Everything you need for mindful growth
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <FeatureItem 
              icon={<Heart className="w-5 h-5" />}
              title="Daily Mood Check-ins"
              description="Quick, gentle prompts to help you tune into how you're feeling."
            />
            <FeatureItem 
              icon={<BookOpen className="w-5 h-5" />}
              title="Guided Journaling"
              description="Thoughtful prompts that make reflection easy and meaningful."
            />
            <FeatureItem 
              icon={<Calendar className="w-5 h-5" />}
              title="Tiny Steps Tracker"
              description="Break big goals into small, achievable daily actions."
            />
            <FeatureItem 
              icon={<Cookie className="w-5 h-5" />}
              title="Cookie Jar Rewards"
              description="Celebrate your wins and build a collection of achievements."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
          Ready to start your journey?
        </h2>
        <p className="text-muted-foreground mb-8">
          Join thousands who are building better mental wellness habits.
        </p>
        <Link to="/auth">
          <Button size="lg" className="rounded-full px-8">
            Get Started Free
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-muted-foreground text-sm">
        <p>Made with 💚 for your mental wellness</p>
      </footer>
    </div>
  );
};

const FeatureItem = ({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) => (
  <div className="flex gap-4 p-4 rounded-xl hover:bg-secondary/50 transition-colors">
    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
      {icon}
    </div>
    <div>
      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);

export default Demo;
