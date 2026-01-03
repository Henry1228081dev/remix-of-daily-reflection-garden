import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScreenTimeCard } from "@/components/ui/screen-time-card";
import { TexturedBackground } from "@/components/ui/textured-background";
import { ArrowLeft, Heart, BookOpen, Sparkles, Cookie, TrendingUp, Calendar, Target, PenLine } from "lucide-react";

const Demo = () => {
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
    <TexturedBackground>
      {/* Navigation */}
      <nav className="w-full px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        <Link to="/auth">
          <Button className="rounded-full px-6 shadow-lg shadow-primary/20">Get Started</Button>
        </Link>
      </nav>

      {/* Hero */}
      <header className="max-w-4xl mx-auto px-6 pt-12 pb-8 text-center">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 shadow-sm">
          <Sparkles className="w-4 h-4" />
          DEMO / PREVIEW
        </span>
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-6 drop-shadow-sm">
          See Reflect in Action
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
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
            className="w-full shadow-xl shadow-primary/10"
          />
        </div>
        <p className="text-center text-muted-foreground text-sm mt-4 font-medium">
          Your weekly wellness activity overview
        </p>
      </section>

      {/* Features Overview */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-card rounded-3xl border border-border p-8 md:p-12 shadow-xl shadow-black/5">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-8 text-center">
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
        <div className="bg-card rounded-3xl border border-border p-8 shadow-xl shadow-black/5">
          <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
            Ready to try it yourself?
          </h2>
          <p className="text-muted-foreground mb-8">
            Explore the full app experience in demo mode, or create an account to save your progress.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/demo/app">
              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-full px-8 font-semibold"
                onClick={() => {
                  // Request notification permission when clicking demo
                  if ("Notification" in window && Notification.permission === "default") {
                    Notification.requestPermission();
                  }
                }}
              >
                Try Demo Mode
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20 font-semibold">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-muted-foreground text-sm font-medium">
        <p>Made with 💚 for your mental wellness</p>
      </footer>
    </TexturedBackground>
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
  <div className="flex gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center text-primary shadow-sm">
      {icon}
    </div>
    <div>
      <h3 className="font-bold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  </div>
);

export default Demo;
