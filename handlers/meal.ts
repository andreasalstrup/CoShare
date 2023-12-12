interface IMealPlan {
    getWeekMealPlan(weekKey: string): Promise<WeekTexts>;
    setWeekMealPlan(weekKey: string, dayMeals: WeekTexts): Promise<WeekTexts>;
}

class MealPlanHandle implements IMealPlan {
    readonly user: UserGunDB;
    groupId: string = "";

    constructor(private gun: Gun) {
            this.user = gun.user();
            this.user.get("group").on((data: any) => {
                this.groupId = data?.groupId.toString()     
            });
    }

    public async getWeekMealPlan(weekKey: string): Promise<WeekTexts> {
        await this.waitForId();

        let dayMeals: WeekTexts = {
            Mon: "",
            Tue: "",
            Wed: "",
            Thu: "",
            Fri: "",
            Sat: "",
            Sun: ""
        };

        await this.gun.get("groups").get(this.groupId).get("mealplan").get(weekKey).open((data: WeekTexts) => {
            dayMeals = data
        });
        
        return dayMeals;
    }

    public async setWeekMealPlan(weekKey: string, newDayMeals: WeekTexts): Promise<WeekTexts> {
        this.waitForId();
        return await this.gun.get("groups").get(this.groupId).get("mealplan").get(weekKey).put(newDayMeals);
    }

    private async waitForId(): Promise<void> {
        return new Promise<void>((resolve) => {
            const checkId = () => {
                if (this.groupId !== "") {
                    resolve();
                } else {
                    setTimeout(checkId, 100);
                }
            };
            checkId();
        });
    }
}

export function mealPlanHandle(gun: Gun): IMealPlan {
    return new MealPlanHandle(gun);
}