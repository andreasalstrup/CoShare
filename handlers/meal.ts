interface IMealPlan {
    getWeekMealPlan(weekKey: string): Promise<WeekTexts>;
    setWeekMealPlan(weekKey: string, dayMeals: WeekTexts): Promise<void>;
}

class MealPlanHandle implements IMealPlan {
    readonly mealPlan: any;

    constructor(private gun: Gun) {
        this.mealPlan = this.gun.get("groups").get("1337").get("mealplan");        
    }

    public async getWeekMealPlan(weekKey: string): Promise<WeekTexts> {
        let dayMeals: WeekTexts = undefined;

        await this.mealPlan.open((mealPlan: MealPlan) => {
            dayMeals = mealPlan[weekKey]
        });

        return dayMeals;
    
    }

    public async setWeekMealPlan(weekKey: string, newDayMeals: WeekTexts): Promise<void> {
        await this.mealPlan.get(weekKey).put(newDayMeals)
    }
}

export function mealPlanHandle(gun: Gun): IMealPlan {
    return new MealPlanHandle(gun);
}