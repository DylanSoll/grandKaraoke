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
import { Register } from './components/screens/register';
import { Login } from './components/screens/login';
import { CustomDrawer} from './components/navigation/drawerNavigation'
import { Homepage } from './components/screens/home';
//const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

navigationScreenOptions={
  headerShown: true,
  headerStyle: styles.navHeader,
  headerTitleStyle: {
    color: 'white'
  },
  drawerActiveBackgroundColor: '#0f0082',
  drawerActiveTintColor: '#fff',
  drawerInactiveTintColor: '#fff',
  drawerLabelStyle: {
    fontSize: 15,
  },
}

export default function App(){
  return (
    <NavigationContainer>
      
      <Drawer.Navigator  drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={navigationScreenOptions} initialRouteName="Register"> 
        <Drawer.Screen name="Login" component={Login} />
        <Drawer.Screen name="Register" component={Register} />
        <Drawer.Screen name="Home" component={Homepage} />
      </Drawer.Navigator>
    </NavigationContainer>
    
    
  );
}

/*<Tab.Navigator tabBar={(props) => <MyTabBar {...props} initialRouteName = "Login"/>}>
        <Tab.Screen name = "Login" component={Login} />
        <Tab.Screen name="Register" component={Register} />   
       </Tab.Navigator>*/