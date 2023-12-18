import 'gun/lib/mobile.js'
import {Button, TextInput, View} from 'react-native'
import {render, screen, fireEvent} from '@testing-library/react-native'
import { useRef, useState } from 'react'
import { userHandle } from '../../handlers/user'
import Gun from 'gun/gun'
import SEA from 'gun/sea'
import { IGunInstance, IGunInstanceRoot, IGunUserInstance, ISEA } from 'gun/types'

function UserHandlerTestScreen(props : {testDb : Gun, callback? : (ack : any) => Boolean}) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const user = useRef(userHandle(props.testDb));
  
  return (
    <View>
      <View>
        <TextInput value={username} onChangeText={setUsername} testID="username" />
        <TextInput value={name} onChangeText={setPassword} testID="password" />
        <TextInput value={name} onChangeText={setName} testID="name" />
        <TextInput value={email} onChangeText={setEmail} testID="email" />
        <Button
          title="createUser"
          onPress={() => {             
            user.current.create(name,email,username,password, props.callback)
            }
          }
        />
        <Button
          title="login"
          onPress={() => {             
            user.current.login(username,password, props.callback)
            }
          }
        />
        <Button
          title="logout"
          onPress={() => {             
            user.current.logout()
            }
          }
        />
      </View>            
    </View>
  )
}
const db = Gun({
    localStorage: true,
});


type GunDB = {
  gun: IGunInstance<any>,
  user: IGunUserInstance<any, any, any, IGunInstanceRoot<any, IGunInstance<any>>>,
  SEA: ISEA,
}

const GunDB: GunDB = {
  gun: db,
  user: db.user(),
  SEA: SEA,
}

describe('UserHandler', () => {
  it('should be able to create a user', (done) => {
    const expectedUsername = '12345678'
    const expectedPassword = 'password'
    const expectedEmail = ''
    const expectedName = 'canBeAnything'
    
    function callbackTest(ack : any) : Boolean{
      expect(ack.err).toBeUndefined() //There should be no errors during user creation
      expect(ack.soul).toBeDefined() //The user should have a public key
      expect(GunDB.user.is).toBeDefined() //The user should be logged in
      GunDB.gun.get('~@'+expectedUsername).once((data, key)=>{ //The created user should be able to be found in the database
        expect(data).toBeDefined()        
        done()
      })
      return (true)
    }
  
    render(<UserHandlerTestScreen testDb={GunDB.gun} callback={callbackTest} />)  
    fireEvent.changeText(screen.getByTestId('username'), expectedUsername)
    fireEvent.changeText(screen.getByTestId('password'), expectedPassword)
    fireEvent.changeText(screen.getByTestId('email'), expectedEmail)
    fireEvent.changeText(screen.getByTestId('name'), expectedName)
    fireEvent.press(screen.getByText('createUser'))
  });

  it('should be able to handle bad password input', (done) => {
    const expectedUsername = 'newUser'
    const expectedPassword = 'pass' //Pass needs to be 8 chars long
    const expectedEmail = ''
    const expectedName = 'canBeAnything'
    
    function callbackTest(ack : any) : Boolean{
      expect(ack.err).toBeDefined() //There should be no errors during user creation
      expect(ack.err).toBe("Password too short!")
      done()
      return (true)
    }
  
    render(<UserHandlerTestScreen testDb={GunDB.gun} callback={callbackTest} />)  
    fireEvent.changeText(screen.getByTestId('username'), expectedUsername)
    fireEvent.changeText(screen.getByTestId('password'), expectedPassword)
    fireEvent.changeText(screen.getByTestId('email'), expectedEmail)
    fireEvent.changeText(screen.getByTestId('name'), expectedName)
    fireEvent.press(screen.getByText('createUser'))
  });

  it('should be able to log in on an already created user', (done) => {
    const expectedUsername = 'testuser12345'
    const expectedPassword = 'password'
    
    GunDB.user.create("testuser12345","password",test) //We create a user directly with gun to not rely on our handler
    
    function test(ack: any) {
      if (ack.error != undefined){
        expect(false)
      }else{
        function callbackTest(ack : any) : Boolean{
          expect(ack.error).toBeUndefined() //There should be no errors during login
          expect(ack.soul).toBeDefined() //The logged in user should have a public key
          expect(GunDB.user.is).toBeDefined() //The user should be logged in
          done()
          return (true)
        }
        render(<UserHandlerTestScreen testDb={GunDB.gun} callback={callbackTest} />)  
        fireEvent.changeText(screen.getByTestId('username'), expectedUsername)
        fireEvent.changeText(screen.getByTestId('password'), expectedPassword)
        fireEvent.press(screen.getByText('login'))
      }
    }
  });

  it('should be able to log a user out', (done) => { 
    const username = 'newUser'
    const password = 'password'
    
    GunDB.user.create(username, password, () => {
      GunDB.user.auth(username,password, test)
    })

    function test() {
      expect(GunDB.user.is).toBeDefined() // The user should be logged in before doing anything      
      render(<UserHandlerTestScreen testDb={GunDB.gun}/>)
      fireEvent.press(screen.getByText('logout'))
      expect(GunDB.user.is).toBeUndefined() // The user should be logged out
      done()
    }    
  });
})