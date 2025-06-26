
export interface PregnancyInfo {
  currentWeek: number;
  currentDay: number;
  trimester: number;
  trimesterName: string;
  daysRemaining: number;
  progressPercentage: number;
  babySize: {
    name: string;
    emoji: string;
    size: string;
  };
}

export const babySizeData = {
  4: { name: "Poppy seed", emoji: "🌱", size: "2mm" },
  5: { name: "Sesame seed", emoji: "🌱", size: "3mm" },
  6: { name: "Lentil", emoji: "🌱", size: "4mm" },
  7: { name: "Blueberry", emoji: "🫐", size: "10mm" },
  8: { name: "Kidney bean", emoji: "🫘", size: "16mm" },
  9: { name: "Green olive", emoji: "🫒", size: "23mm" },
  10: { name: "Strawberry", emoji: "🍓", size: "31mm" },
  11: { name: "Lime", emoji: "🟢", size: "41mm" },
  12: { name: "Plum", emoji: "🟣", size: "54mm" },
  13: { name: "Lemon", emoji: "🍋", size: "74mm" },
  14: { name: "Apple", emoji: "🍏", size: "87mm" },
  15: { name: "Orange", emoji: "🍊", size: "10cm" },
  16: { name: "Avocado", emoji: "🥑", size: "11.6cm" },
  17: { name: "Turnip", emoji: "🥬", size: "13cm" },
  18: { name: "Bell pepper", emoji: "🫑", size: "14.2cm" },
  19: { name: "Mango", emoji: "🥭", size: "15.3cm" },
  20: { name: "Banana", emoji: "🍌", size: "16.4cm" },
  21: { name: "Carrot", emoji: "🥕", size: "26.7cm" },
  22: { name: "Papaya", emoji: "🟠", size: "27.8cm" },
  23: { name: "Grapefruit", emoji: "🍊", size: "28.9cm" },
  24: { name: "Corn", emoji: "🌽", size: "30cm" },
  25: { name: "Cauliflower", emoji: "🥬", size: "34.6cm" },
  26: { name: "Lettuce", emoji: "🥬", size: "35.6cm" },
  27: { name: "Eggplant", emoji: "🍆", size: "36.6cm" },
  28: { name: "Coconut", emoji: "🥥", size: "37.6cm" },
  29: { name: "Butternut squash", emoji: "🎃", size: "38.6cm" },
  30: { name: "Cabbage", emoji: "🥬", size: "39.9cm" },
  31: { name: "Pineapple", emoji: "🍍", size: "41.1cm" },
  32: { name: "Squash", emoji: "🎃", size: "42.4cm" },
  33: { name: "Celery", emoji: "🥬", size: "43.7cm" },
  34: { name: "Cantaloupe", emoji: "🍈", size: "45cm" },
  35: { name: "Honeydew", emoji: "🍈", size: "46.2cm" },
  36: { name: "Romaine lettuce", emoji: "🥬", size: "47.4cm" },
  37: { name: "Swiss chard", emoji: "🥬", size: "48.6cm" },
  38: { name: "Leek", emoji: "🥬", size: "49.8cm" },
  39: { name: "Watermelon", emoji: "🍉", size: "50.7cm" },
  40: { name: "Pumpkin", emoji: "🎃", size: "51.2cm" },
} as const;

/**
 * Calculate pregnancy week from due date
 */
export function calculatePregnancyWeek(today: Date, dueDate: Date): PregnancyInfo {
  const totalPregnancyDays = 280; // 40 weeks
  const dueDateObj = new Date(dueDate);
  const todayObj = new Date(today);
  
  // Calculate days remaining until due date
  const timeDiff = dueDateObj.getTime() - todayObj.getTime();
  const daysRemaining = Math.max(0, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)));
  
  // Calculate current pregnancy day and week
  const currentPregnancyDay = totalPregnancyDays - daysRemaining;
  const currentWeek = Math.max(1, Math.floor(currentPregnancyDay / 7));
  const currentDay = currentPregnancyDay % 7;
  
  // Calculate trimester
  let trimester: number;
  let trimesterName: string;
  if (currentWeek <= 12) {
    trimester = 1;
    trimesterName = "1st";
  } else if (currentWeek <= 26) {
    trimester = 2;
    trimesterName = "2nd";
  } else {
    trimester = 3;
    trimesterName = "3rd";
  }
  
  // Calculate progress percentage
  const progressPercentage = Math.min(100, (currentWeek / 40) * 100);
  
  // Get baby size info
  const babySize = babySizeData[Math.min(40, Math.max(4, currentWeek)) as keyof typeof babySizeData] || babySizeData[40];
  
  return {
    currentWeek,
    currentDay,
    trimester,
    trimesterName,
    daysRemaining,
    progressPercentage,
    babySize,
  };
}

/**
 * Calculate pregnancy info from current week
 */
export function calculatePregnancyFromWeek(currentWeek: number): PregnancyInfo {
  const totalWeeks = 40;
  const daysRemaining = Math.max(0, (totalWeeks - currentWeek) * 7);
  
  // Calculate trimester
  let trimester: number;
  let trimesterName: string;
  if (currentWeek <= 12) {
    trimester = 1;
    trimesterName = "1st";
  } else if (currentWeek <= 26) {
    trimester = 2;
    trimesterName = "2nd";
  } else {
    trimester = 3;
    trimesterName = "3rd";
  }
  
  // Calculate progress percentage
  const progressPercentage = Math.min(100, (currentWeek / 40) * 100);
  
  // Get baby size info
  const babySize = babySizeData[Math.min(40, Math.max(4, currentWeek)) as keyof typeof babySizeData] || babySizeData[40];
  
  return {
    currentWeek,
    currentDay: 2, // Default to 2 days
    trimester,
    trimesterName,
    daysRemaining,
    progressPercentage,
    babySize,
  };
}

/**
 * Calculate baby age for postpartum
 */
export function calculateBabyAge(birthDateStr: string): string {
  const birth = new Date(birthDateStr);
  const now = new Date();
  const diffTime = now.getTime() - birth.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks !== 1 ? 's' : ''}`;
  } else {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months !== 1 ? 's' : ''}`;
  }
}
