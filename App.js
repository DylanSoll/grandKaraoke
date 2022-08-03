import {styles} from './static/styles/mainStyle'

//NAVIGATION
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator} from '@react-navigation/drawer';
//Custom Components
import { CustomDrawer} from './components/navigation/drawerNavigation'


import { CreateEvent } from './components/screens/CreateEvent';
import {ViewEvents} from './components/screens/viewEvents'
import {SearchForSongs} from './components/screens/songSearch';
import AudioScreen from './components/screens/AudioRecordings';
import Account from './components/screens/AccountScreen';
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
      screenOptions={navigationScreenOptions} initialRouteName="Account"> 
        <Drawer.Screen name = "Events" component={ViewEvents} />
        <Drawer.Screen name="Account" component={Account} />
        <Drawer.Screen name ="Create Event" component={CreateEvent} />
        <Drawer.Screen name = "Song Search" component={SearchForSongs} />
        <Drawer.Screen name = "Audio" component={AudioScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
    
    
  );
}
