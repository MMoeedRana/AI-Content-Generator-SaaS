import confetti from 'canvas-confetti';

export const useCelebration = () => {
  
  // 1. Light Welcome Confetti (Signup ke liye)
  const fireWelcome = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4F46E5', '#60A5FA', '#A78BFA'] // Premium Blues/Purples
    });
  };

  // 2. Grand Subscription Confetti (Stripe Success ke liye)
  const fireSubscription = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // Do jagah se explode hoga
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  return { fireWelcome, fireSubscription };
};