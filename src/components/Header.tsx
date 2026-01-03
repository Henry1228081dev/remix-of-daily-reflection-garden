import { Leaf } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full py-6 px-4 animate-fade-in">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        <div className="flex items-center gap-2 mb-2">
          <Leaf className="w-8 h-8 text-primary animate-gentle-bounce" />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Reflect
          </h1>
          <span className="text-2xl">🌿</span>
        </div>
        <p className="text-muted-foreground text-lg">
          A gentle daily check-in for your mind.
        </p>
      </div>
    </header>
  );
};

export default Header;
