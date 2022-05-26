import { StatusBar } from 'expo-status-bar';
import { Button, SafeAreaView, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import {styles} from './static/styles/mainStyle'
import {Component, useState} from 'react'
import {create_form_data, ajax_handler} from './static/js/ajaxhandler'
import 'react-native-gesture-handler';

//NAVIGATION
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator} from '@react-navigation/drawer';
//Custom Components
import { Register } from './screens/register';
import { Login } from './screens/login';
import { CustomDrawer} from './screens/drawerNavigation'
//const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();



export default function App(){
  const [userid, updateUserID]= useState("");
  let startRoute = "Login"
  return (
    <NavigationContainer>
      <Drawer.Navigator  drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: true,
        headerStyle: styles.navHeader,
        headerTitleStyle: {
          color: 'white'
        },
        drawerActiveBackgroundColor: '#0f0082',
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#fff',
        drawerLabelStyle: {
          fontFamily: 'Roboto-Medium',
          fontSize: 15,
        },
      }}> 
        <Drawer.Screen name="Login" component={Login} />
        <Drawer.Screen name="Register" component={Register} />
      </Drawer.Navigator>
    </NavigationContainer>
    
    
  );
}

/*<Tab.Navigator tabBar={(props) => <MyTabBar {...props} initialRouteName = "Login"/>}>
        <Tab.Screen name = "Login" component={Login} />
        <Tab.Screen name="Register" component={Register} />   
       </Tab.Navigator>*/