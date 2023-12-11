interface IShoppingList {
    onListUpdate(callback: (data: ListData[], ids: string[]) => void): void
    onUsersUpdate(callback: (data: Member[], ids: string[]) => void): void
    addToList(item: ListData): void;
    updateItemInList(item: ListData, id: string): void;
    deleteFromList(id: string): void;
    buyFromList(item: ListData, id?: string): void;
}

class ShoppingListHandler implements IShoppingList {
    readonly gun: Gun;
    readonly user: UserGunDB;
    
    userName: string = '';
    groupId: string = '';
    

    constructor(gun: Gun) {
        this.gun = gun;
        this.user = gun.user();
        user.get("group").on(data => {
            this.groupId = data?.groupId.toString()
        })
        user.get("fullName").on((data: string) => {
            this.userName = data
        })
    }

    public onListUpdate(callback: (data: ListData[], ids: string[]) => void): void {
        this.gun.get('groups').get(this.groupId).get('shoppingList').open((data: any) => {
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
        this.gun.get('groups').get(this.groupId).get('members').open((data: any) => {
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

    public addToList(item: ListData): void {
        this.gun.get('groups').get(this.groupId).get('shoppingList').set(item)
    }

    public updateItemInList(item: ListData, id: string): void {
        let group = this.gun.get('groups').get(this.groupId)

        group.get('members').load((data: any) => {
            for (const key in data)
            {
                if(item.data.users[key] == null)
                {
                    group.get('shoppingList').get(id).get('data').get('users').get(key).put(null)
                }
            }
        })
        
        group.get('shoppingList').get(id).put(item)
    }

    public deleteFromList(id: string): void {  
        this.gun.get('groups').get(this.groupId).get('shoppingList').get(id).put(null)
    }

    public buyFromList(item: ListData, id?: string): void {
        item.data.bought!.user =  this.userName
        let group = this.gun.get('groups').get(this.groupId)

        if(id)
        {
            group.get('shoppingList').get(id).put(null)
        }

        group.get('boughtList').set(item)
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