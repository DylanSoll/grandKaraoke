import { StatusBar } from 'expo-status-bar';
import { Button, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { styles } from '../static/styles/mainStyle';
export function Homepage({navigation}){
    return(
      <SafeAreaView style={styles.safeAreaView}>
      <Text style={styles.pageHeading}>Login</Text>

      <Button title = "Go To Login"  style = {styles.buttonSmall}
      onPress={()=>(navigation.navigate('Login'))}/>
      <StatusBar style="auto" />
    </SafeAreaView>
    )
  }