interface IAuth {
    create(fullName: string, email: string, phoneNumber: string, password: string, callback: (ack: any) => Boolean): void;
    login(phoneNumber: string, password: string, callback: (ack: any, user: UserGunDB) => Boolean): void;
    logout() : void;
}

class UserHandle implements IAuth {
    readonly user: UserGunDB;
    readonly gun: Gun;

    constructor(db: Gun) {
        this.user = db.user();
        this.gun = db
    }

    public create(fullName: string, email: string, phoneNumber: string, password: string, callback: (ack: any, user: UserGunDB) => Boolean): void {
        console.log(this.gun)
        this.user.create(phoneNumber, password, (ack: any) => {
            console.log("User created callback")
            if (ack.err != undefined) {
                callback(ack,undefined)
                return false;
            }
            const newUser = this.gun.user(ack.soul);
            newUser.get("fullName").put(fullName);
            newUser.get("email").put(email);
            this.login(phoneNumber,password, callback)         
        });   
    }

    public login(phoneNumber: string, password: string, callback: (ack: any, user: UserGunDB) => Boolean): void {        
        this.user.auth(phoneNumber, password, (ack: any) => {
            if (ack != undefined){
                userPub = ack.soul
            }
            callback(ack, this.user)  
        });
    }

    public logout() : void {
        this.user.leave()
    }
}

export function userHandle(gun: Gun): IAuth {
    return new UserHandle(gun);
}