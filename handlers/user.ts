interface IAuth {
    create(fullName: string, email: string, phoneNumber: string, password: string, login: (ack: any) => Boolean): void;
    login(phoneNumber: string, password: string, success: (ack: any, user: UserGunDB) => Boolean): void;
    logout() : void;
}

class UserHandle implements IAuth {
    readonly user: UserGunDB;

    constructor(private gun: Gun) {
        this.user = this.gun.user();
    }

    public create(fullName: string, email: string, phoneNumber: string, password: string, login: (ack: any, user: UserGunDB) => Boolean): void {
        user.create(phoneNumber, password, (ack: any) => {
            if (ack.err != undefined) {
                login(ack,undefined)
                return false;
            }

            const newUser = gun.user(ack.pub);
            newUser.get("fullName").put(fullName);
            newUser.get("email").put(email);
            this.login(phoneNumber,password, login)         
        });        
    }

    public login(phoneNumber: string, password: string, success: (ack: any, user: UserGunDB) => Boolean): void {
        this.user.auth(phoneNumber, password, (ack: any) => {
            success(ack, user)            
        });
        
    }

    public logout() : void {
        this.user.leave()
    }

    private isLoggedIn(): boolean {
        return this.user.is;
    }
}

export function userHandle(gun: Gun): IAuth {
    return new UserHandle(gun);
}