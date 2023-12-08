interface IAuth {
    create(fullName: string, email: string, phoneNumber: string, password: string, callback: (ack: any) => Boolean): void;
    login(phoneNumber: string, password: string, callback: (ack: any, user: UserGunDB) => Boolean): void;
    logout() : void;
}

class UserHandle implements IAuth {
    readonly user: UserGunDB;

    constructor(private gun: Gun) {
        this.user = this.gun.user();
    }

    public create(fullName: string, email: string, phoneNumber: string, password: string, callback: (ack: any, user: UserGunDB) => Boolean): void {
        user.create(phoneNumber, password, (ack: any) => {
            if (ack.err != undefined) {
                callback(ack,undefined)
                return false;
            }
            const newUser = gun.user(ack.soul);
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
            callback(ack, user)  
        });
        
    }

    public logout() : void {
        this.user.leave()
    }
}

export function userHandle(gun: Gun): IAuth {
    return new UserHandle(gun);
}