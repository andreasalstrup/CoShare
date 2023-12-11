import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import {Image, View, Text} from 'react-native';

export function LogoAndName(
  props: Omit<React.ComponentProps<typeof Image>,'source'> )
{
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require("../assets/images/coshareLogo.png")} />
      <Text style={styles.title}> Co-Living </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 0.3 * Dimensions.get('window').width,
    resizeMode: 'contain'
  },
  title: {
    fontSize: 50,
    color: "white",//Could use different font but it is hard to import in Expo
  },
  container: {    
    alignItems: 'center',
    gap: -40,   
    top: -40,
  }
});