interface IAuth {
    create(fullName: string, email: string, phoneNumber: string, password: string, callback: (ack: any) => Boolean): void;
    login(phoneNumber: string, password: string, callback: (ack: any) => Boolean): void;
    logout() : void;
}

class UserHandle implements IAuth {
    readonly user: UserGunDB;
    readonly gun: Gun;

    constructor(db: Gun) {
        this.gun = db
        this.user = db.user();
    }

    public create(fullName: string, email: string, phoneNumber: string, password: string, callback: (ack: any) => Boolean): void {
        this.user.create(phoneNumber, password, (ack: any) => {
            if (ack.err != undefined) {
                callback(ack)
                return false;
            }
            const newUser = this.gun.user(ack.soul);
            newUser.get("fullName").put(fullName);
            newUser.get("email").put(email);
            this.login(phoneNumber,password, callback)         
        });
    }

    public login(phoneNumber: string, password: string, callback: (ack: any) => Boolean): void {        
        this.user.auth(phoneNumber, password, (ack: any) => {
            if (ack != undefined){
                userPub = ack.soul
            }
            callback(ack)  
        });
    }

    public logout() : void {
        this.user.leave()
    }
}

export function userHandle(db: Gun): IAuth {
    return new UserHandle(db);
}