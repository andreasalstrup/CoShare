import {randomUUID} from 'expo-crypto';
interface IGroup {
    create(groupName: string, callback : () => void): void;
    join(uuid: string, callback : (ack: Boolean) => void): void;
    checkIfInGroup(callback : (ack: Boolean) => void): void ;
    leave() : Boolean;    
}

class GroupHandle implements IGroup {

    constructor(private gun: Gun) {        
    }

    public create(groupName: string, action : () => void): void {
        let user = gun.user(userPub)
        let groupId : string = randomUUID();        
        let context = gun.get("groups").set({groupId: groupId})
        context.get("members").set({members: userPub})
        context.get("name").set({groupName: groupName})        
        user.get("group").put({groupId: groupId})
        action()
    }

    public join(uuid: string, action : (ack: Boolean) => void): void {           
        gun.get("groups").once(
            function(data, key) {
                if (data != uuid){
                    user = gun.user(userPub)
                    gun.get("groups").get(data).set({members: userPub})
                    user.get("group").put({groupId: uuid})
                    action(true)
                }else{
                    action(false)
                }
        })
    }
    public checkIfInGroup(action : (ack: Boolean) => void): void {
        user = gun.user(userPub)
        user.get("group").once((ack: any) => {            
            if (ack == undefined || ack == null) action(false)
            else action(true)
        })
    }

    public leave() : Boolean {
        user.get("group").put(null)
        return true
    }
}

export function groupHandle(gun: Gun): IGroup {
    return new GroupHandle(gun);
}