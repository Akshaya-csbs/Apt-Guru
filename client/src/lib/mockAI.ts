export const getMockAIResponse = async (message: string, isImage: boolean, isExplainLike10: boolean = false): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lowerMsg = message.toLowerCase();

      // Hint Mode
      if (lowerMsg.includes('hint')) {
        resolve("💡 **Hint:** Don't try to calculate everything at once. Think about what happens in just *one single hour*. If A paints a house in 10 hours, how much does he paint in 1 hour?");
        return;
      }

      // Explain Like I'm 10 Mode
      if (isExplainLike10 || lowerMsg.includes('10')) {
        resolve(`📖 **Let me tell you a story...**\n\nImagine you and your best friend are eating a giant pizza. You can eat a whole pizza in 10 minutes (you're super hungry!). Your friend takes 15 minutes.\nIf you both eat the SAME pizza together, will it take more or less time? Less time, right! Because you're helping each other.\n\n**Step 1:** In 1 minute, you eat 1/10th of the pizza.\n**Step 2:** Your friend eats 1/15th of the pizza.\n**Step 3:** Together, in 1 minute you eat (1/10 + 1/15) = 1/6th of the pizza!\n\nSo together, it only takes **6 minutes** to finish the whole thing! 🍕\n\n**Why other options are wrong:**\n- *25 minutes:* That would mean you are slowing each other down! You ADD speeds, not times.\n- *12.5 minutes:* That's the average, but since you are working together, it must be faster than the fastest person (less than 10 mins).`);
        return;
      }

      // Fun Concept teaching mode
      if (lowerMsg.includes('teach') || lowerMsg.includes('concept')) {
        resolve(`🧠 **1 Concept → 2 Problems → 1 Shortcut**\n\n**Topic: Probability (Coin Tosses)**\n\nProbability is just "What you want" divided by "What can happen".\n\n**Problem 1:** Toss 1 coin. What's the chance of Heads?\n*What can happen:* Heads or Tails (2). *What you want:* Heads (1). Answer: 1/2.\n\n**Problem 2:** Toss 2 coins. Chance of exactly 1 Head and 1 Tail?\n*What can happen:* HH, HT, TH, TT (4 outcomes). *What you want:* HT, TH (2 outcomes). Answer: 2/4 = 1/2.\n\n💡 **Shortcut:** Every time you add a coin, just multiply the total total possible outcomes by 2. (1 coin = 2, 2 coins = 4, 3 coins = 8).`);
        return;
      }

      // Image / Generic Responses
      if (isImage) {
        resolve("I see you uploaded an image! It looks like a Data Interpretation chart regarding company revenues.\n\n**Analysis:** The blue bar is 2023 (₹450 Cr) and the orange bar is 2024 (₹520 Cr).\n\n**Step 1:** The percentage growth formula is (New - Old)/Old × 100\n**Step 2:** Plug in the numbers: (520 - 450) / 450 × 100\n**Step 3:** 70/450 × 100 ≈ 15.55%\n\n**Why other options are wrong:**\n- *13.5%: Did dividing by 520 (the new value) instead of 450 (the base year). Remember to always divide by the starting point!*\n\nLet me know if you want a hint for the next chart!");
        return;
      } 
      
      resolve("Let's break this down step-by-step! 🧠\n\n**Step 1:** Analyze the key variables. If train A is 60km/h and train B is 80km/h going the opposite way...\n**Step 2:** Formulate the relative speed. 60 + 80 = 140km/h.\n**Step 3:** Calculate time (Distance / Speed).\n\n💡 **Shortcut:** When two objects travel in opposite directions, always **ADD** their speeds to find the relative speed. It saves writing two separate equations!\n\n**Why other options are wrong:**\n- *20km/h: This happens if you subtracted the speeds. You only subtract if they are moving in the SAME direction!*");

    }, 400 + Math.random() * 300); // 400 - 700ms delay
  });
};
