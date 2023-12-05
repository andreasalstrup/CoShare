import Gun from "gun/gun";
import SEA from 'gun/sea';
import { IGunInstance, IGunInstanceRoot, IGunUserInstance, ISEA } from 'gun/types';

const gun = Gun({
    radisk: true, 
    localStorage: false
});

type GunDB = {
    gun: IGunInstance<any>,
    user: IGunUserInstance<any, any, any, IGunInstanceRoot<any, IGunInstance<any>>>,
    SEA: ISEA,
}

const GunDB: GunDB = {
    gun: gun,
    user: gun.user(),
    SEA: SEA,
}

test('first GunDb test', async () => {
    GunDB.user.create('12345678', '12345678', (ack: any) => {
        expect(ack.err).toBe(ack.err !== "User already created!");
        expect(ack.err).toBe(ack.err !== "Password too short!");
    });
})