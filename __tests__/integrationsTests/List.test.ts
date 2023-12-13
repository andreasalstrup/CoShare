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

type ListData = {
    name: string,
    data: {
        added: { 
            user: string, 
            date: string
        }, 
        users: { 
            [key: string]: {
                key: string,
                name: string
            } 
        },
        bought: { 
            user: string, 
            date: string, 
            price: number
        } | null
    }
}

test('Can other users see created list products?', () => {
    GunDB.user.create('11111111', 'password1', (ack1: any) => {
        gun.user('11111111').get('fullName').put('User1');
        expect(ack1.err).toBe(ack1.err !== "User already created!");
        expect(ack1.err).toBe(ack1.err !== "Password too short!");
    });
    // Check if user is created:
    GunDB.gun.user('11111111').get('fullName').on((data: any) => {
        console.log('User1 full name:', data);
    });



    /*
    GunDB.user.create('22222222', 'password2', (ack2: any) => {
        gun.user('22222222').get('fullName').put('User2');
        expect(ack2.err).toBe(ack2.err !== "User already created!");
        expect(ack2.err).toBe(ack2.err !== "Password too short!");
    });

    console.log('Creating group...');
    let group = gun.get('groups').get('1337');
    group.get('name').put('Test Group');

    console.log('Adding users to group...');
    group.get('members').get('11111111').put({
        id: '11111111',
        key: '11111111',
        name: 'User1'
    });

    group.get('members').get('22222222').put({
        id: '22222222',
        key: '22222222',
        name: 'User2'
    });

    group.get('members').once((data: any) => {
        console.log('Users in group:');
        for (const key in data)
        {
            console.log(data[key]);
        }
    });*/


});