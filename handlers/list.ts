import { Expense } from "../helpers/calculateExpenses";

interface IShoppingList {
    onListUpdate(callback: (data: ListData[], ids: string[]) => void): void
    onBoughtListUpdate(callback: (data: ListData[], ids: string[]) => void): void
    onUsersUpdate(callback: (data: string) => void): void
    addToList(item: ListData): void;
    updateItemInList(item: ListData, id: string): void;
    deleteFromList(id: string): void;
    deleteFromBoughtList(item: ListData, id: string): void;
    buyFromList(item: ListData, id?: string): void;
}

class ShoppingListHandler implements IShoppingList {
    readonly gun: Gun;
    readonly user: UserGunDB;
    
    userName: string = '';
    groupId: string = '';
    

    constructor(gun: Gun) {
        this.gun = gun;
        this.user = gun.user(userPub);
        this.user.get("group").on((data: { groupId: string }) => {
            this.groupId = data?.groupId.toString()
        })
        this.user.get("fullName").on((data: string) => {
            this.userName = data
        })
    }

    public onListUpdate(callback: (data: ListData[], ids: string[]) => void): void {
        this.gun.get('groups').get('groupId').get(this.groupId).get('shoppingList').open((data: any) => {
            let list: ListData[] = []
            let ids: string[] = []
            for (const key in data)
            {
                if(this.isValidListData(data[key]))
                {
                    ids.push(key)
                    list.push(data[key])
                }
            }
            callback(list, ids)
        })
    }

    public onBoughtListUpdate(callback: (data: ListData[], ids: string[]) => void): void {
        this.gun.get('groups').get('groupId').get(this.groupId).get('boughtList').open((data: any) => {
            let list: ListData[] = []
            let ids: string[] = []
            for (const key in data)
            {
                if(this.isValidBoughtListData(data[key]))
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

    public onUsersUpdate(callback: (data: string) => void): void {
        this.gun.get('groups').get('groupId').get(this.groupId).get('members').open((data: any) => {
            for (const key in data)
            {
                if(data[key].members != undefined)
                {
                    this.gun.user(data[key].members).get('fullName').once((name: string) => {
                        callback(name)
                    })
                }
            }
        })
    }

    public addToList(item: ListData): void {
        this.gun.get('groups').get('groupId').get(this.groupId).get('shoppingList').set(item)
    }

    public updateItemInList(item: ListData, id: string): void {
        let group = this.gun.get('groups').get('groupId').get(this.groupId)
        
        group.get('shoppingList').get(id).put(item)
    }

    public deleteFromList(id: string): void {  
        this.gun.get('groups').get('groupId').get(this.groupId).get('shoppingList').get(id).put(null)
    }

    public deleteFromBoughtList(item: ListData, id: string): void {  
        item.data.bought = null
        let group = this.gun.get('groups').get('groupId').get(this.groupId)

        if(id)
        {
            group.get('boughtList').get(id).put(null)
        }

        group.get('shoppingList').set(item)
    }

    public buyFromList(item: ListData, id?: string): void {
        item.data.bought!.user = this.userName
        let group = this.gun.get('groups').get('groupId').get(this.groupId)

        if(id)
        {
            this.deleteFromList(id);
        }

        group.get('boughtList').set(item)

        this.gun.get('groups').get('groupId').get(this.groupId).get('expenses').set(new Expense(this.userName, item.data.bought!.price, item.data.users));
    }

    private isValidListData(item: ListData): Boolean {
        return item != null &&
        item.name != undefined &&
        item.data != undefined &&
        item.data.added != undefined &&
        item.data.users != null &&
        item.data.bought == null;
    }

    private isValidBoughtListData(item: ListData): Boolean {
        return item != null &&
        item.name != undefined &&
        item.data != undefined &&
        item.data.added != undefined &&
        item.data.users != null &&
        item.data.bought != null;
    }

}

export function shoppingListHandler(gun: Gun): IShoppingList {
    return new ShoppingListHandler(gun);
}