import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cookie } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CookieItem {
  id: string;
  description: string;
  earned_at: string;
  source: string;
}

interface DemoCookieJarCardProps {
  cookies: CookieItem[];
}

const DemoCookieJarCard = ({ cookies }: DemoCookieJarCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Cookie className="w-5 h-5 text-primary" />
            Cookie Jar
          </CardTitle>
          <span className="text-2xl font-bold text-primary">{cookies.length}</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Your collection of wins and achievements! 🎉
        </p>
        
        <div className="space-y-2 max-h-48 overflow-y-auto">
          <AnimatePresence>
            {cookies.slice().reverse().map((cookie, index) => (
              <motion.div
                key={cookie.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-2 rounded-lg bg-secondary/50"
              >
                <span className="text-lg">🍪</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{cookie.description}</p>
                  <p className="text-xs text-muted-foreground capitalize">{cookie.source}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {cookies.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <p>Complete tasks to earn cookies!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DemoCookieJarCard;
