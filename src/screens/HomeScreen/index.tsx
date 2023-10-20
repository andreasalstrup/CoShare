import React, {Component} from 'react';
import {TouchableOpacity, Text, View, ScrollView} from 'react-native';
import styles from './styles';

type HelloProps = {
    name: string;
    lastName: string;
};

class HomeScreen extends Component<HelloProps> {
    constructor(props : any) {
        super(props);
    }

    state = {
      count: 0,
    };
  
    onPress = () => {
      this.setState({
        count: this.state.count + 1,
      });
    };
  
    render() {
      return (
        <ScrollView style={{backgroundColor: "#000"}}> 
          <View style={styles.container}>
          <Text>Hello, {this.props.name} {this.props.lastName}</Text>
          <TouchableOpacity style={styles.button} onPress={this.onPress}>
            <Text>Click me {this.props.name}</Text>
          </TouchableOpacity>
          <View>
            <Text>You clicked {this.state.count} times</Text>
          </View>
        </View>
        </ScrollView>
      );
    }
  }

  export default HomeScreen;