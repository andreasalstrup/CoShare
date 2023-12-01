interface IAuth {
    create(fullName: string, email: string, phoneNumber: string, password: string, login: (ack: any) => Boolean): Boolean;
    login(phoneNumber: string, password: string, success: (ack: any, user: UserGunDB) => Boolean): Boolean;
}

class UserHandle implements IAuth {
    readonly user: UserGunDB;

    constructor(private gun: Gun) {
        this.user = this.gun.user();
    }

    public create(fullName: string, email: string, phoneNumber: string, password: string, login: (ack: any) => Boolean): Boolean {
        user.create(phoneNumber, password, (ack: any) => {
            if (ack.err != undefined) {
                return false;
            }

            const newUser = gun.user(ack.pub);
            newUser.get("fullName").put(fullName);
            newUser.get("email").put(email);
            this.user.auth(phoneNumber, password, login);
        });

        return true;
    }

    public login(phoneNumber: string, password: string, success: (ack: any, user: UserGunDB) => Boolean): Boolean {
        this.user.auth(phoneNumber, password, (ack: any) => {
            if (this.isLoggedIn()) {
                success(ack, this.user);
                return true;
            }
        });

        return false;
    }

    private isLoggedIn(): boolean {
        return this.user.is;
    }
}

export function userHandle(gun: Gun): IAuth {
    return new UserHandle(gun);
}