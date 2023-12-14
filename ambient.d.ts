type Gun = IGunInstance<any>
type UserGunDB = IGunUserInstance<any, any, any, IGunInstanceRoot<any, IGunInstance<any>>>

type ListData = {
    name: string,
    data: {
        added: { 
            user: string, 
            date: string
        }, 
        users: string,
        bought: { 
            user: string, 
            date: string, 
            price: number
        } | null
    }
}

// type Ack = { ok: 0; pub: string; } | { err: string; }