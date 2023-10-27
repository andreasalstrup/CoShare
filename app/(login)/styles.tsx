import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    error: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    descriptiveText: {
      fontSize: 10,
      justifyContent: 'space-between',
    },
    separator: {
      marginVertical: 30,
      height: 1,
      width: '80%',
    },
    inputField: {
      height: 40, 
      width: 200, 
      borderColor: 'gray', 
      borderWidth: 1, 
      color: "white"
    },
    eye: {
      marginLeft: -24,
      color:"#aaa",
    },
    passwordBox: {
      flexDirection: 'row', 
      alignItems: 'center',       
    }
  });

  export default styles