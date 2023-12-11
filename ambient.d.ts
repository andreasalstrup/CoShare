type Gun = IGunInstance<any>
type UserGunDB = IGunUserInstance<any, any, any, IGunInstanceRoot<any, IGunInstance<any>>>

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

//Temp model until I know how to get all users properly
type Member = {
    id: string,
    key: string,
    name: string
}
// type Ack = { ok: 0; pub: string; } | { err: string; }