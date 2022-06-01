import React from 'react';
import {View, Text} from 'react-native'
import {DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

//NAVIGATION


export const CustomDrawer = (props) => {
    return (
        <View style = {{flex: 1}}>
            <DrawerContentScrollView {...props} contentContainerStyle={{backgroundColor: '#03011a', height: '100%'}}>
                <DrawerItemList {...props} style={{position: "absolute", right: '0'}}/>
            </DrawerContentScrollView>

        </View>
      
    )
  }

