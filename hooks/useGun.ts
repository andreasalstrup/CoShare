import initiateGun from './initiateGun'
const { gun, user, SEA} = initiateGun();

export const useGun = () => {    
    return {gun, user, SEA}
}

export default useGun;