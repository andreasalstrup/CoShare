import { StyleSheet } from 'react-native';

import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View, } from '../../components/Themed';
import { TextInput } from 'react-native-gesture-handler';
import { Button } from 'react-native';
import { Component } from 'react';

import useGun from '../../hooks/useGun';
const { gun, app, user, SEA } = useGun();

// import { useLocalSearchParams } from 'expo-router';
// const { slug } = useLocalSearchParams();
// import { View } from 'react-native';
// import { Link } from 'expo-router';
import { router, useRootNavigation, Redirect } from 'expo-router';
import { Route } from 'expo-router/build/Route';
//const rootNavigation = useRootNavigation();

//import { Link, useRouter } from 'expo-router';
//const router = useRouter();

type Props = {
  text: any
}

type State = {
  text: string
  name: string,
  paste: string
}

export default class ListScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      text: 'Whats your name?',
      name: '',
      paste: '',
    };
  }

  $user = user.create('test', 'testtest', () => {})

  componentDidMount(): void {

    this.$user;
    app.on((data: any) => {
      console.log('data', data);
      this.setState({paste: data.paste});
    });
  }

  render() {
    return <Redirect href="/(tabs)/list" />;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>List</Text>
        <Text style={styles.title}>{this.state.paste}</Text>
        <Text style={styles.title}>Hello {this.state.name}</Text>
        <TextInput style={{height: 40, width: 200, borderColor: 'gray', borderWidth: 1, color: "white"}}
                   value={this.state.text} 
                   onChangeText={(text) => this.setState({text})}/>
        <Button title='Update' 
                onPress={()=>{
                app.put({paste:this.state.paste + "\n" + this.state.text})
                this.setState({text:''})
                }}/>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <EditScreenInfo path="app/(tabs)/index.tsx" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
