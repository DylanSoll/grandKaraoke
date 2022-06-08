import * as React from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';
import { styles } from '../../static/styles/mainStyle';
// You can import from local files

// or any pure javascript modules available in npm

export default function CustomButton(props) {
  return (
    <TouchableOpacity 
    style= {styles.button} 
    onPress={props.onPress} 
    activeOpacity = {0.5} 
    disabled={props.disabled}>
      <Text style={{fontSize:props.fontSize, color: 'white'}}>
        {props.label}
      
      </Text>
      

    </TouchableOpacity>
  );
}
