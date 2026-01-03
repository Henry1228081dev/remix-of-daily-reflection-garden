import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScreenTimeCard } from "@/components/ui/screen-time-card";
import { GradientBackground } from "@/components/ui/gradient-background";
import { ArrowLeft, Heart, BookOpen, Sparkles, Cookie, TrendingUp, Calendar, Target, PenLine } from "lucide-react";

const Demo = () => {
  // Sample data for the activity chart
  const activityData = [
    20, 15, 10, 8, 12, 25, 35, 45, 60, 75, 80, 85,
    70, 65, 55, 50, 60, 75, 80, 90, 85, 75, 60, 50
  ];

  const topActivities = [
    {
      icon: <PenLine className="w-4 h-4" />,
      name: "Journaling",
      duration: "2h 15m",
      color: "bg-primary/20 text-primary"
    },
    {
      icon: <Heart className="w-4 h-4" />,
      name: "Mood Check-ins",
      duration: "45m",
      color: "bg-rose-500/20 text-rose-500"
    },
    {
      icon: <Target className="w-4 h-4" />,
      name: "Habits",
      duration: "1h 30m",
      color: "bg-amber-500/20 text-amber-500"
    },
    {
      icon: <Cookie className="w-4 h-4" />,
      name: "Celebrations",
      duration: "20m",
      color: "bg-orange-500/20 text-orange-500"
    },
  ];

  return (
    <GradientBackground>
      {/* Navigation */}
      <nav className="w-full px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <Link to="/" className="flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        <Link to="/auth">
          <Button className="rounded-full px-6 shadow-lg">Get Started</Button>
        </Link>
      </nav>

      {/* Hero */}
      <header className="max-w-4xl mx-auto px-6 pt-12 pb-8 text-center">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/60 backdrop-blur-sm text-primary text-sm font-medium mb-6 border border-primary/20">
          <Sparkles className="w-4 h-4" />
          DEMO / PREVIEW
        </span>
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-4">
          See Reflect in Action
        </h1>
        <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
          Here's a preview of how Reflect helps you track your wellness journey with beautiful, 
          insightful visualizations.
        </p>
      </header>

      {/* Main Activity Card */}
      <section className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex justify-center">
          <ScreenTimeCard
            totalHours={4}
            totalMinutes={50}
            barData={activityData}
            timeLabels={["Mon", "Wed", "Fri", "Sun"]}
            topApps={topActivities}
            className="w-full"
          />
        </div>
        <p className="text-center text-foreground/60 text-sm mt-4">
          Your weekly wellness activity overview
        </p>
      </section>

      {/* Features Overview */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-card/80 backdrop-blur-xl rounded-3xl border border-border/50 p-8 md:p-12 shadow-xl">
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
        <div className="bg-card/80 backdrop-blur-xl rounded-3xl border border-border/50 p-8 shadow-xl">
          <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
            Ready to try it yourself?
          </h2>
          <p className="text-foreground/70 mb-8">
            Explore the full app experience in demo mode, or create an account to save your progress.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/demo/app">
              <Button size="lg" variant="outline" className="rounded-full px-8 bg-background/50 backdrop-blur-sm">
                Try Demo Mode
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" className="rounded-full px-8 shadow-lg">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-foreground/60 text-sm">
        <p>Made with 💚 for your mental wellness</p>
      </footer>
    </GradientBackground>
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
