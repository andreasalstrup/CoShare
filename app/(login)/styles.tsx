import { StyleSheet } from 'react-native';
import {Dimensions} from 'react-native';
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
    error: {
      fontSize: 14,
      fontWeight: 'bold',
      color: "red",
    },
    descriptiveText: {
      fontSize: 13,    
      color: "white",
    },
    separator: {
      marginVertical: 30,
      height: 1,
      width: '80%',      
    },
    inputField: {
      height: 40, 
      width: 200, 
      
      justifyContent: 'center',
      color: "white",      
    },
    eye: {
      marginLeft: -24,
      color:"#aaa",      
    },
    inputBox: {
      flexDirection: 'row', 
      alignItems: 'center',    
      backgroundColor: 'black',
      opacity: 0.7,
      borderRadius: 4,
      color: "white",      
    },
    backgroundImage: {    
      justifyContent: 'center',
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      alignItems: 'center',  
      resizeMode: 'cover',
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 4,
      elevation: 3,
      width: 0.6 * Dimensions.get('window').width,      
      backgroundColor: '#5CBCA9',
    },
    disabledButton: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 4,
      elevation: 3,
      width: 0.6 * Dimensions.get('window').width,      
      backgroundColor: 'grey',
    },
    buttonText: {
      color: "white",
      fontSize: 15,
      fontWeight: "bold",
    },    
  });

  export default styles