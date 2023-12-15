import 'gun/lib/mobile.js'
// import 'react-native-webview-crypto';
import {Button, TextInput, View, Text} from 'react-native'
import {render, screen, fireEvent} from '@testing-library/react-native'
import { useRef, useState } from 'react'
import { userHandle } from '../../handlers/user'
import Gun from 'gun/gun'
import SEA from 'gun/sea'
import { IGunInstance, IGunInstanceRoot, IGunUserInstance, ISEA } from 'gun/types'
import WebviewCrypto from 'react-native-webview-crypto';
// import 'react-native-crypto'

// import { Crypto } from "@peculiar/webcrypto"

// global.crypto = new Crypto()



function CreateUserScreenTest(props : {testDb : Gun, callback : (ack : any) => Boolean}) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const user = useRef(userHandle(props.testDb));
  
  return (
    <View>      
      <WebviewCrypto/>
      <View>
        <TextInput value={username} onChangeText={setUsername} testID="username" />
        <TextInput value={name} onChangeText={setPassword} testID="password" />
        <TextInput value={name} onChangeText={setName} testID="name" />
        <TextInput value={email} onChangeText={setEmail} testID="email" />
        <Button
          title="createUser"
          onPress={() => {       
            console.log("create user called")          
            user.current.create(name,email,username,password, props.callback)
            }
          }
        />
      </View>            
    </View>
  )
}
const db = Gun({
    radisk: false,
    localStorage: true,
    file: './db/data.json',
});

type GunDB = {
  gun: IGunInstance<any>,
  user: IGunUserInstance<any, any, any, IGunInstanceRoot<any, IGunInstance<any>>>,
  SEA: ISEA,
}

const GunDB: GunDB = {
  gun: db,
  user: db.user(),//Tror hverken vi vil have user eller SEA herfra
  SEA: SEA,    
}


test('examples of some things', (done) => {
  const expectedUsername = '12345678'
  const expectedPassword = 'password'
  const expectedEmail = ''
  const expectedName = 'canBeAnything'  
  
  function callbackTest(ack : any){
    console.log("Done")
    expect(true).toBe(true)
    done()
    return true
  }    

  render(<CreateUserScreenTest testDb={db} callback={callbackTest} />)

  fireEvent.changeText(screen.getByTestId('username'), expectedUsername)
  fireEvent.changeText(screen.getByTestId('password'), expectedPassword)
  fireEvent.changeText(screen.getByTestId('name'), expectedEmail)
  fireEvent.changeText(screen.getByTestId('name'), expectedName)

  // const usernameOutput = await screen.findByTestId('username')
  // expect(usernameOutput).toHaveTextContent(expectedUsername)
  // expect(screen.getByTestId('password').toHaveTextContent(expectedPassword))
  // expect(screen.getByTestId('email').toHaveTextContent(expectedEmail))
  // expect(screen.getByTestId('name')).toHaveTextContent(expectedName)
  fireEvent.press(screen.getByText('createUser'))
})