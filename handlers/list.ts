interface IShoppingList {
    onListUpdate(callback: (data: ListData[], ids: string[]) => void): void
    onUsersUpdate(callback: (data: Member[], ids: string[]) => void): void
    addToList(item: ListData): Boolean;
    updateItemInList(item: ListData, id: string): Boolean;
    deleteFromList(id: string): Boolean;
    buyFromList(item: ListData, id?: string): Boolean;
}

class ShoppingListHandler implements IShoppingList {
    readonly gun: Gun;
    readonly user: UserGunDB;

    constructor(gun: Gun) {
        this.gun = gun;
        user = gun.user();
    }

    public onListUpdate(callback: (data: ListData[], ids: string[]) => void): void {
        let groupId = this.getUserGroupId()
        gun.get('groups').get(groupId.toString()).get('shoppingList').open((data: any) => {
            let list: ListData[] = []
            let ids: string[] = []
            for (const key in data)
            {
                if(this.isValidListData(data[key]))
                {
                    for (const userKey in data[key].data.users)
                    {
                        if(data[key].data.users[userKey] == null){
                            delete data[key].data.users[userKey]
                        } 
                    }
                    
                    ids.push(key)
                    list.push(data[key])
                }
            }
            callback(list, ids)
        })
    }

    public onUsersUpdate(callback: (data: Member[], ids: string[]) => void): void {
        let groupId = this.getUserGroupId()
        gun.get('groups').get(groupId.toString()).get('members').open((data: any) => {
            let ids: string[] = []
            let members: Member[] = []
            for (const key in data)
            {
                if(this.isValidMember(data[key]))
                {
                    ids.push(key)
                    members.push(data[key])
                }
            }
            callback(members, ids)
        })
    }

    public addToList(item: ListData): Boolean {
        let groupId = this.getUserGroupId()
        gun.get('groups').get(groupId.toString()).get('shoppingList').set(item)
        return true;
    }

    public updateItemInList(item: ListData, id: string): Boolean {
        let groupId = this.getUserGroupId()

        gun.get('groups').get(groupId.toString()).get('members').load((data: any) => {
            for (const key in data)
            {
                if(item.data.users[key] == null)
                {
                    gun.get('groups').get(groupId.toString()).get('shoppingList').get(id).get('data').get('users').get(key).put(null)
                }
            }
        })
        
        gun.get('groups').get(groupId.toString()).get('shoppingList').get(id).put(item)
        return true
    }

    public deleteFromList(id: string): Boolean {
        let groupId = this.getUserGroupId()    
        gun.get('groups').get(groupId.toString()).get('shoppingList').get(id).put(null)
        return true;
    }

    public buyFromList(item: ListData, id?: string): Boolean {
        item.data.bought!.user =  this.getUserName()
        let groupId = this.getUserGroupId()
        let group = gun.get('groups').get(groupId.toString())

        if(id)
        {
            gun.get('groups').get(groupId.toString()).get('shoppingList').get(id).put(null)
        }

        group.get('boughtList').set(item)
        
        return true;
    }  

    private getUserName = () : string => {
        user.get("fullName").once((data: string) => {
            return data
        })
        return ""
    }

    private getUserGroupId = () : number => {
        user.get("group").once(data => {
            return data?.id ?? 0
        })
        return 0
    }

    private isValidListData(item: ListData): Boolean {
        return item != null &&
        item.name != undefined &&
        item.data != undefined &&
        item.data.added != undefined &&
        item.data.users != null &&
        item.data.bought == null;
    }

    private isValidMember(member: Member): Boolean {
        return member != null &&
        member.key != null &&
        member.name != null;
    }
}

export function shoppingListHandler(gun: Gun): IShoppingList {
    return new ShoppingListHandler(gun);
}