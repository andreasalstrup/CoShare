interface INotice {
    onHouseRulesUpdate(callback: (data: string) => void): void
    onUsersUpdate(callback: (data: User) => void): void 
    updateHouseRules(rules: string): void
}

class NoticeHandle implements INotice {
    readonly gun: Gun;
    readonly user: UserGunDB;
    
    userName: string = '';
    groupId: string = '';
    

    constructor(gun: Gun) {
        this.gun = gun;
        this.gun.user(userPub).get("groupId").on((data: string) => {
            this.groupId = data
        })
    }

    public onHouseRulesUpdate(callback: (data: string) => void): void {
        this.gun.get('groups').get('groupId').get(this.groupId).get('rules').on((data: string) => {
            callback(data)
        })
    }

    public onUsersUpdate(callback: (data: User) => void): void {
        this.gun.get('groups').get('groupId').get(this.groupId).get('members').open((data: any) => {
            for (const key in data)
            {
                if(data[key].members != undefined)
                {
                    this.gun.get('~' + data[key].members).once((user: User) => {
                        if(this.isValidUser(user)){
                            callback(user)
                        }
                    })
                }
            }
        })
    }

    public updateHouseRules(rules: string): void {
        this.gun.get('groups').get('groupId').get(this.groupId).get('rules').put(rules)
    }

    private isValidUser(user: User): Boolean {
        return user != null &&
        user.fullName != null &&
        user.email != null &&
        user.phoneNumber != null;
    }
}

export function noticeHandle(gun: Gun): INotice {
    return new NoticeHandle(gun);
}