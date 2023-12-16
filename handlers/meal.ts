interface IMealPlan {
    getWeekMealPlan(weekKey: string): Promise<WeekTexts>;
    setWeekMealPlan(weekKey: string, dayMeals: WeekTexts): Promise<WeekTexts>;
}

class MealPlanHandle implements IMealPlan {
    readonly user: UserGunDB;
    groupId: string = "";

    constructor(private gun: Gun) {
            this.user = gun.user();
            this.user.get("groupId").on((data: any) => {
                console.log("hello")
                this.groupId = data
            });
    }

    public async getWeekMealPlan(weekKey: string): Promise<WeekTexts> {
        await this.waitForId();

        let dayMeals: WeekTexts = undefined;

        const waitForweekText = async (): Promise<void> => {
            return new Promise<void>((resolve) => {
                this.gun.get("groups").get("groupId").get(this.groupId).get("mealplan").get(weekKey).open((data: WeekTexts) => {
                    const check = () => {
                        if (data || dayMeals) {
                            dayMeals = data
                            resolve();
                        } else {
                            dayMeals = {
                                Mon: "",
                                Tue: "",
                                Wed: "",
                                Thu: "",
                                Fri: "",
                                Sat: "",
                                Sun: ""
                            };
                            setTimeout(check, 100);
                        };
                    };
                    check();
                });
            });
        };
    
        await waitForweekText();
        return dayMeals;
    }

    public async setWeekMealPlan(weekKey: string, newDayMeals: WeekTexts): Promise<WeekTexts> {
        await this.waitForId();
        return await this.gun.get("groups").get("groupId").get(this.groupId).get("mealplan").get(weekKey).put(newDayMeals);
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