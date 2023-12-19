import 'gun/lib/mobile.js'
import {Button, TextInput, View} from 'react-native'
import {render, screen, fireEvent} from '@testing-library/react-native'
import { useRef, useState } from 'react'
import Gun from 'gun/gun'
import SEA from 'gun/sea'
import 'gun/lib/open.js'
import { IGunChain, IGunInstance, IGunInstanceRoot, IGunUserInstance, ISEA } from 'gun/types'
import { groupHandle } from '../../handlers/group'

function GroupHandlerTestScreen(props : {testDb : Gun, callback? : (ack : any) => void, createCallback? : () => void}) {
  const [groupName, setGroupName] = useState('')
  const [uuid, setUuid] = useState('')
  const group = useRef(groupHandle(props.testDb));
  
  return (
    <View>
      <View>
        <TextInput value={groupName} onChangeText={setGroupName} testID="groupName" />
        <TextInput value={uuid} onChangeText={setUuid} testID="uuid" />        
        <Button
          title="createGroup"
          onPress={() => {          
            group.current.create(groupName, props.createCallback)
            }
          }
        />
        <Button
          title="joinGroup"
          onPress={() => {          
            group.current.join(uuid, props.callback)
            }
          }
        />
        <Button
          title="inGroup"
          onPress={() => {          
            group.current.checkIfInGroup(props.callback)
            }
          }
        />
        <Button
          title="getUuid"
          onPress={() => {          
            group.current.getUUID(props.callback)
            }
          }
        />
        <Button
          title="getGName"
          onPress={() => {          
            group.current.getGName(props.callback)
            }
          }
        />
        <Button
          title="leaveGroup"
          onPress={() => {          
            group.current.leave()
            }
          }
        />
        <Button
          title="checkIfInGroup"
          onPress={() => {      
            group.current.checkIfInGroup(props.callback)
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
// For these tests we persist the database and save values we need

let testData = {
  user1: {username: "testUser1", password: "password", soul: ""},
  user2: {username: "testUser2", password: "password", soul: ""},
  user3: {username: "testUser3", password: "password", soul: ""},
  groupId: "",
  groupName: "",
}

beforeAll((done) => {
  GunDB.user.create(testData.user1.username, testData.user2.password, (ack : any) => { 
    testData.user1.soul = ack.pub
    GunDB.user.create(testData.user2.username,testData.user2.password, (ack : any) => {
      testData.user2.soul = ack.pub
      GunDB.user.create(testData.user3.username, testData.user3.password, (ack : any) => {
        testData.user3.soul = ack.pub
        done()
      })
    })} )
});
describe('GroupHandler', () => {
  it('should be able to create a group', (done) => {
  GunDB.user.auth(testData.user1.username,testData.user1.password, () => {test()})
    
  function test (){
    global.userPub = testData.user1.soul //We do this because it is required in the group handler
    const expectedGroupName = 'Test group'
    
    function callbackTest() : boolean{
      function checkIfUserInGroup(){
        GunDB.gun.user(userPub).get("groupId").once((id: string) => {        
          expect(id).toBeDefined() //The logged in user should now have a groupId
          testData.groupId = id
          checkIfGroupExists(GunDB.gun.get("groups").get("groupId").get(id))
        })
      }
      function checkIfGroupExists(context : any){
        expect(context).toBeDefined() //The group should be in the gun groups
        checkIfGroupHasMember(context)
      }
      function checkIfGroupHasMember(context : any){
        context.get("members").map().once((memberId : string) => {
          expect(memberId).toBe(userPub) //The group should have the current user listed as a member
          checkIfGroupHasName(context)
        })
      }
      function checkIfGroupHasName(context : any){
        context.get("name").once((name : string) => {
          expect(name).toBe(expectedGroupName) //The group should have the given name
          testData.groupName = expectedGroupName
          done()
        })
      }
      
      checkIfUserInGroup() //Initiate all checks
      return true
    }

    render(<GroupHandlerTestScreen testDb={GunDB.gun} createCallback={callbackTest} />)  
    fireEvent.changeText(screen.getByTestId('groupName'), expectedGroupName)    
    fireEvent.press(screen.getByText('createGroup'))
  }
});

  it('should be able to make a user join a group', (done) => {
    GunDB.user.auth(testData.user2.username,testData.user2.password, () => {test()})
    const groupIdToJoin = testData.groupId
    global.userPub = testData.user2.soul
      
      function test(){
        function callbackTest(bool : boolean) : void{
          function checkIfUserInGroup(){
            GunDB.gun.user(userPub).get("groupId").once((id: string) => {          
              expect(id).toBeDefined() //The logged in user should now have a groupId
              expect(id).toBe(groupIdToJoin) //The id should be the same as the group we wanted to join
              checkIfGroupHasMember(GunDB.gun.get("groups").get("groupId").get(id))
            })
          }        
          function checkIfGroupHasMember(context : any){
            context.get("members").open((data : any) => {
              const expectedMembers = [testData.user1.soul, testData.user2.soul]
              let actualMembers = []
              for (const key in data){
                actualMembers.push(data[key])
              }
              expect(expectedMembers).toEqual(actualMembers) //The group should have the first and second user as members of the group
            done()
            })
          }        
          checkIfUserInGroup() //Initiate all checks
        }
    
        render(<GroupHandlerTestScreen testDb={GunDB.gun} callback={callbackTest} />)  
        fireEvent.changeText(screen.getByTestId('uuid'), groupIdToJoin)    
        fireEvent.press(screen.getByText('joinGroup'))
      }
  });

  it('should not be possible to join a group that does not exist', (done) => {
    GunDB.user.auth(testData.user3.username,testData.user3.password, () => {test()})
    const groupIdToJoin = "1235654.213125" //No groups with this id exist  
    global.userPub = testData.user3.soul
      
      function test(){
        function callbackTest(bool : boolean) : void{
          function checkIfUserInGroup(){
            GunDB.gun.user(userPub).get("groupId").once((id: string) => {          
              expect(id).toBeUndefined() //The logged in user should now have a groupId            
              checkIfGroupExistsInGun()
            })
          } 
          function checkIfGroupExistsInGun(){
            const context = GunDB.gun.get("groups").get("groupId").get(groupIdToJoin)
            context.once((data : string) => {
              expect(data).toBeUndefined() //The group id should still not exist
              done()
            })
          }        
          checkIfUserInGroup() //Initiate all checks
        }
    
        render(<GroupHandlerTestScreen testDb={GunDB.gun} callback={callbackTest} />)  
        fireEvent.changeText(screen.getByTestId('uuid'), groupIdToJoin)    
        fireEvent.press(screen.getByText('joinGroup'))
      }
  });

  it('should be able to get the id of a group that exists', (done) => {
    GunDB.user.auth(testData.user2.username,testData.user2.password, () => {test()})
    global.userPub = testData.user2.soul
      
      function test(){
        function callbackTest(ack : string) : void{
          expect(ack).toBe(testData.groupId)
          done()
        }
    
        render(<GroupHandlerTestScreen testDb={GunDB.gun} callback={callbackTest} />)  
        fireEvent.press(screen.getByText('getUuid'))
      }
  });

  it('should not be able to get the id of a group that does not exist', (done) => {
    GunDB.user.auth(testData.user3.username,testData.user3.password, () => {test()})
    global.userPub = testData.user3.soul
      
      function test(){
        function callbackTest(ack : string) : void{
          expect(ack).toBe('') //Empty string is returned if no group is found
          done()
        }
    
        render(<GroupHandlerTestScreen testDb={GunDB.gun} callback={callbackTest} />)  
        fireEvent.press(screen.getByText('getUuid'))
      }
  });

  it('should be able to get the name of a group that exists', (done) => {
    GunDB.user.auth(testData.user2.username,testData.user2.password, () => {test()})
    global.userPub = testData.user2.soul
      
      function test(){
        function callbackTest(ack : string) : void{
          expect(ack).toBe(testData.groupName)
          done()
        }
    
        render(<GroupHandlerTestScreen testDb={GunDB.gun} callback={callbackTest} />)  
        fireEvent.press(screen.getByText('getGName'))
      }
  });

  it('should not be able to get the name of a group that does not exist', (done) => {
    GunDB.user.auth(testData.user3.username,testData.user3.password, () => {test()})
    global.userPub = testData.user3.soul
      
      function test(){
        function callbackTest(ack : string) : void{
          expect(ack).toBe('') //Returned value if the name does not exist
          done()
        }
    
        render(<GroupHandlerTestScreen testDb={GunDB.gun} callback={callbackTest} />)  
        fireEvent.press(screen.getByText('getGName'))
      }
  });

  it('should see if someone is in a group', (done) => {
    GunDB.user.auth(testData.user2.username,testData.user2.password, () => {test()})
    global.userPub = testData.user2.soul
      
      function test(){
        function callbackTest(ack : boolean) : void{
          expect(ack).toBe(true) //Returned value if the name does not exist
          done()
        }
    
        render(<GroupHandlerTestScreen testDb={GunDB.gun} callback={callbackTest} />)  
        fireEvent.press(screen.getByText('checkIfInGroup'))
      }
  });

  it('should see if someone is not in a group', (done) => {
    GunDB.user.auth(testData.user3.username,testData.user3.password, () => {test()})
    global.userPub = testData.user3.soul
      
      function test(){
        function callbackTest(ack : boolean) : void{
          expect(ack).toBe(false) //Returned value if the name does not exist
          done()
        }
    
        render(<GroupHandlerTestScreen testDb={GunDB.gun} callback={callbackTest} />)  
        fireEvent.press(screen.getByText('checkIfInGroup'))
      }
  });

  it('should be able to create a group with same name as existing group', (done) => {
    GunDB.user.auth(testData.user3.username,testData.user3.password, () => {test()})
      
    function test (){
      global.userPub = testData.user3.soul //We do this because it is required in the group handler
      const expectedGroupName = 'Test group' //Same name as our first group
      
      function callbackTest() : boolean{
        function checkIfUserInGroup(){
          GunDB.gun.user(userPub).get("groupId").once((id: string) => {        
            expect(id).toBeDefined() //The logged in user should now have a groupId
            checkIfGroupExists(GunDB.gun.get("groups").get("groupId").get(id))
          })
        }

        function checkIfGroupExists(context : any){
          expect(context).toBeDefined() //The group should be in the gun groups
          checkIfGroupHasMember(context)
        }

        function checkIfGroupHasMember(context : any){
          context.get("members").open((data : any) => {
            const expectedMembers = [userPub]
            let actualMembers = []
            for (const key in data){
              actualMembers.push(data[key])
            }
            expect(expectedMembers).toEqual(actualMembers) //The group should only have the one member
            checkIfOldGroupHasMembers(context)
          })
        }

          function checkIfOldGroupHasMembers(context : any){
            GunDB.gun.get("groups").get("groupId").get(testData.groupId).get("members").open((data : any) => {
              const expectedMembers = [testData.user1.soul, testData.user2.soul]
              let actualMembers = []
              for (const key in data){
                actualMembers.push(data[key])
              }
              expect(expectedMembers).toEqual(actualMembers) //The old group should have only the same members as before
              checkIfGroupHasName(context)
            })
          }
        
        function checkIfGroupHasName(context : any){
          context.get("name").once((name : string) => {
            expect(name).toBe(expectedGroupName) //The group should have the given name
            GunDB.gun.get("groups").get("groupId").get(testData.groupId).get("name").once((oldName : any) => {
              expect(oldName).toBe(expectedGroupName)
            })
            done()
          })
        }
        
        checkIfUserInGroup() //Initiate all checks
        return true
      }

      render(<GroupHandlerTestScreen testDb={GunDB.gun} createCallback={callbackTest} />)  
      fireEvent.changeText(screen.getByTestId('groupName'), expectedGroupName)    
      fireEvent.press(screen.getByText('createGroup'))
    }
  });
})