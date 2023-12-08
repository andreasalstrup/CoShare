import {randomUUID} from 'expo-crypto';
import { IGunChain } from 'gun/types';
interface IGroup {
    create(groupName: string, callback : () => void): void;
    join(uuid: string, callback : (ack: Boolean) => void): void;
    checkIfInGroup(callback : (ack: Boolean) => void): void ;
    leave() : Boolean;    
}

class GroupHandle implements IGroup {
    readonly gun: Gun
    constructor(private db: Gun) {
        this.gun = db
    }

    public create(groupName: string, callback : () => void): void {
        let user = gun.user(userPub)
        let groupId : string = randomUUID();        
        gun.get("groups").get("groupId").set({groupId: groupId})
        let context = gun.get("groups").get("groupId").get(groupId)
        context.get("members").set({members: userPub})
        context.get("name").put(groupName)
        user.get("group").put({groupId: groupId})
        callback()
    }

    public join(uuid: string, callback : (ack: Boolean) => void): void {
        let context = gun.get("groups").get("groupId").get(uuid)
        context.once(
            function(d){
                if (d == undefined){
                    callback(false)
                }else{
                    console.log(userPub)                    
                    user = gun.user(userPub)
                    context.get("members").set({members: userPub})
                    user.get("group").put({groupId: uuid})                    
                    callback(true)
                }                
            }
        )
    }

    public checkIfInGroup(callback : (ack: Boolean) => void): void {
        user = gun.user(userPub)
        user.get("group").once((ack: any) => {            
            if (ack == undefined || ack == null) callback(false)
            else callback(true)
        })
    }

    public leave() : Boolean {
        user.get("group").put(null)
        return true
    }
}

export function groupHandle(db: Gun): IGroup {
    return new GroupHandle(db);
}