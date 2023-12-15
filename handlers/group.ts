import {randomUUID} from 'expo-crypto';
import { Expense } from '../helpers/calculateExpenses';
interface IGroup {
    create(groupName: string, callback : () => void): void;
    join(uuid: string, callback : (ack: Boolean) => void): void;
    checkIfInGroup(callback : (ack: Boolean) => void): void ;
    getUUID(callback : (ack : string) => void) : void;
    getGName(callback : (ack : string) => void) : void;
    leave() : Boolean;    
}

class GroupHandle implements IGroup {
    readonly gun: Gun
    constructor(private db: Gun) {
        this.gun = db
    }

    public create(groupName: string, callback : () => void): void {
        let user = this.gun.user(userPub)
        let groupId : string = randomUUID();        
        this.gun.get("groups").get("groupId").set({groupId: groupId})
        let context = this.gun.get("groups").get("groupId").get(groupId)
        context.get("members").set({members: userPub})
        context.get("name").put(groupName)
        user.get("group").put({groupId: groupId}) 
        gun.user(userPub).get('fullName').open((data: any) => {
            gun.get('groups').get('groupId').get(groupId).get('expenses').set(new Expense(data, 0, JSON.stringify([data])));
        });        
        callback()
    }

    public join(uuid: string, callback : (ack: Boolean) => void): void {
        let context = this.gun.get("groups").get("groupId").get(uuid)
        context.once(
            function(d : string){
                if (d == undefined){
                    callback(false)
                }else{                 
                    let user = gun.user(userPub)
                    context.get("members").set({members: userPub})
                    user.get("group").put({groupId: uuid})  
                    gun.user(userPub).get('fullName').open((data: any) => {
                        console.log(new Expense(data, 0, JSON.stringify([data])))
                        gun.get('groups').get('groupId').get(uuid).get('expenses').set(new Expense(data, 0, JSON.stringify([data])));
                    });              
                    callback(true)
                }                
            }
        )
    }

    public getUUID(callback : (ack : string) => void) : void {
        let user = this.gun.user(userPub)
        user.get("group").get("groupId").once((d : string) => {
            if (d == undefined){
                callback('')
            }else{
                callback(d)
            }
        })
    }

    public getGName(callback : (ack : string) => void) : void {
        this.getUUID((id : string) => {
            let groupContext = this.gun.get("groups").get("groupId").get(id)
            groupContext.once(
                function(idData : string){
                    if (idData == undefined){
                        callback('')
                    }else{
                        groupContext.get("name").once(
                            function(nameData : string){
                                if (nameData == undefined){
                                    callback('')
                                }else{
                                    callback(nameData)
                                }
                            }
                        )
                    }
                }
            )
        } )
    }

    public checkIfInGroup(callback : (ack: Boolean) => void): void {
        let user = this.gun.user(userPub)
        user.get("group").once((ack: any) => {            
            if (ack == undefined || ack == null) callback(false)
            else callback(true)
        })
    }

    public leave() : Boolean {
        let user = this.gun.user(userPub)
        user.get("group").put(null)
        return true
    }
}

export function groupHandle(db: Gun): IGroup {
    return new GroupHandle(db);
}