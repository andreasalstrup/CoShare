
import { Expense } from '../helpers/calculateExpenses';
import { v4 as uuid } from 'uuid'
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
    constructor(db: Gun) {
        this.gun = db
    }

    public create(groupName: string, callback : () => void): void {
        let user = this.gun.user(userPub)
        const groupId : string = uuid();
        this.gun.get("groups").get("groupId").set(groupId)
        let context = this.gun.get("groups").get("groupId").get(groupId)
        context.get("members").set(userPub)
        context.get("name").put(groupName)
        user.get("groupId").put(groupId)
        user.get('fullName').once((data: any) => {
            if (data != undefined){
                this.gun.get('groups').get("groupId").get(groupId).get('expenses').set(new Expense(data, 0, JSON.stringify([data])));
            }            
            callback()
        });
        
    }

    public join(uuid: string, callback : (ack: Boolean) => void): void {
        let context = this.gun.get("groups").get("groupId").get(uuid)   
        context.once((d : string) => {
                if (d == undefined){
                    callback(false)
                }else{
                    let user = this.gun.user(userPub)
                    context.get("members").set(userPub)
                    user.get("groupId").put(uuid)                      
                    user.get('fullName').once((data: any) => {
                        if (data != undefined){
                            this.gun.get('groups').get("groupId").get(uuid).get('expenses').set(new Expense(data, 0, JSON.stringify([data])));
                        }
                        callback(true)
                    });
                    
                }
            }
        )
    }

    public getUUID(callback : (ack : string) => void) : void {
        let user = this.gun.user(userPub)
        user.get("groupId").once((d : string) => {
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
        user.get("groupId").once((ack: any) => {
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