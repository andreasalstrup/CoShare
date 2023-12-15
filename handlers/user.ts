interface IAuth {
    create(fullName: string, email: string, phoneNumber: string, password: string, callback: (ack: any) => Boolean): void;
    login(phoneNumber: string, password: string, callback: (ack: any, user: UserGunDB) => Boolean): void;
    logout() : void;
}

class UserHandle implements IAuth {
    readonly user: UserGunDB;
    readonly gun: Gun;

    constructor(db: Gun) {
        this.gun = db
        this.user = db.user();
    }

    public create(fullName: string, email: string, phoneNumber: string, password: string, callback: (ack: any, user: UserGunDB) => Boolean): void {
        this.user.create(phoneNumber, password, (ack: any) => {
            if (ack.err != undefined) {
                callback(ack,undefined)
                return false;
            }
            this.login(phoneNumber,password, callback, fullName, email);         
        });   
    }

    public login(phoneNumber: string, password: string, callback: (ack: any, user: UserGunDB) => Boolean, fullName?: string, email?: string): void {        
        this.user.auth(phoneNumber, password, (ack: any) => {
            if (ack != undefined){
                userPub = ack.soul
                if(fullName != undefined && email != undefined) {
                  this.addCredentials(fullName, email);
                }
            }
            callback(ack, this.user)  
        });
    }

    private addCredentials(fullName: string, email: string) : void {
        gun.user(userPub).get('fullName').put(fullName);
        gun.user(userPub).get('email').put(email);
    }

    public logout() : void {
        this.user.leave()
    }
}

export function userHandle(db: Gun): IAuth {
    return new UserHandle(db);
}