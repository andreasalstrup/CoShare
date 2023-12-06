import moment from 'moment';

type DayMeals = {
    Mon: string;
    Tue: string;
    Wed: string;
    Thu: string;
    Fri: string;
    Sat: string;
    Sun: string;
} | undefined
  
type MealPlan = {
    [key: string]: DayMeals;
}

interface IMealPlan {
    setWeekCurrentMeals(dayMeals: DayMeals): void;
    getWeekCurrentMeals(): Promise<DayMeals>;
}

class MealPlanHandle implements IMealPlan {
    mealPlan: any;

    readonly currnetWeek = moment().week();
    readonly currentYear = moment().year();
    readonly setWeekKey = this.currnetWeek.toString() + this.currentYear.toString()

    constructor(private gun: Gun) {
        this.mealPlan = this.gun.get("groups").get("1337").get("mealplan");
        
    }

    public async setWeekCurrentMeals(newDayMeals: DayMeals): Promise<DayMeals> {
        let dayMeals: DayMeals = undefined;
        
        dayMeals = await this.mealPlan.get(this.setWeekKey).put(newDayMeals)

        return dayMeals;
    }
    
    public async getWeekCurrentMeals(): Promise<DayMeals> {
        let dayMeals: DayMeals = undefined;

        await this.mealPlan.open((mealPlan: MealPlan) => {
            dayMeals = mealPlan[this.setWeekKey]
        });

        return dayMeals;
    }
}

export function mealPlanHandle(gun: Gun): IMealPlan {
    return new MealPlanHandle(gun);
}