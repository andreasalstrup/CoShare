type Gun = IGunInstance<any>
type UserGunDB = IGunUserInstance<any, any, any, IGunInstanceRoot<any, IGunInstance<any>>>

// Meal Plan Types
type WeekTexts = {
    Mon: string;
    Tue: string;
    Wed: string;
    Thu: string;
    Fri: string;
    Sat: string;
    Sun: string;
    [key: string]: string;
  } | undefined

type MealPlan = {
    [key: string]: WeekTexts;
}

