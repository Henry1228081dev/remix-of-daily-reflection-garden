import confetti from "canvas-confetti";

type CelebrationLevel = "small" | "medium" | "large" | "epic" | "legendary";

export const useConfetti = () => {
  const celebrate = (level: CelebrationLevel = "medium") => {
    const configs: Record<CelebrationLevel, () => void> = {
      small: () => {
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.7 },
          colors: ["#fbbf24", "#f59e0b", "#d97706"],
        });
      },
      medium: () => {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
        });
      },
      large: () => {
        const count = 100;
        const defaults = { origin: { y: 0.7 }, zIndex: 9999 };

        confetti({ ...defaults, particleCount: count, spread: 100 });
        
        setTimeout(() => {
          confetti({ ...defaults, particleCount: count / 2, spread: 60 });
        }, 150);
      },
      epic: () => {
        const duration = 2000;
        const end = Date.now() + duration;

        const frame = () => {
          confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ["#fbbf24", "#f59e0b", "#d97706", "#a855f7", "#ec4899"],
            zIndex: 9999,
          });
          confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ["#fbbf24", "#f59e0b", "#d97706", "#a855f7", "#ec4899"],
            zIndex: 9999,
          });

          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        };
        frame();
      },
      legendary: () => {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval = setInterval(() => {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          const particleCount = 50 * (timeLeft / duration);
          
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            colors: ["#fbbf24", "#f59e0b", "#d97706", "#a855f7", "#ec4899", "#06b6d4"],
          });
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            colors: ["#fbbf24", "#f59e0b", "#d97706", "#a855f7", "#ec4899", "#06b6d4"],
          });
        }, 250);
      },
    };

    configs[level]();
  };

  const celebrateMilestone = (cookieCount: number) => {
    if (cookieCount === 1) {
      celebrate("small");
    } else if (cookieCount === 5) {
      celebrate("medium");
    } else if (cookieCount === 10) {
      celebrate("large");
    } else if (cookieCount === 25) {
      celebrate("epic");
    } else if (cookieCount === 50 || cookieCount === 100) {
      celebrate("legendary");
    }
  };

  const celebratePurchase = () => {
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.5 },
      colors: ["#fbbf24", "#f59e0b", "#d97706"],
      shapes: ["circle"],
      zIndex: 9999,
    });
  };

  return { celebrate, celebrateMilestone, celebratePurchase };
};
