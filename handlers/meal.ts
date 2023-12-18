interface IMealPlan {
    getWeekMealPlan(weekKey: string, callback: (weekTexts: WeekTexts) => void): void;
    setWeekMealPlan(weekKey: string, dayMeals: WeekTexts): void;
}

class MealPlanHandle implements IMealPlan {
    readonly user: UserGunDB;
    groupId: string = "";

    constructor(private gun: Gun) {
            this.user = this.gun.user(userPub);
            this.user.get("groupId").once((data: string) => {
                this.groupId = data
            });
    }

    public getWeekMealPlan(weekKey: string, callback: (weekTexts: WeekTexts) => void): void {
        this.gun.get("groups").get("groupId").get(this.groupId).get("mealplan").get(weekKey).open((data: WeekTexts) => {
            callback(data);
        });

        callback({
            Mon: "",
            Tue: "",
            Wed: "",
            Thu: "",
            Fri: "",
            Sat: "",
            Sun: ""
        });
    }

    public setWeekMealPlan(weekKey: string, weekTexts: WeekTexts): void {
        this.gun.get("groups").get("groupId").get(this.groupId).get("mealplan").get(weekKey).put(weekTexts);
    }
}

export function mealPlanHandle(gun: Gun): IMealPlan {
    return new MealPlanHandle(gun);
}