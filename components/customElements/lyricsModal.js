import {React, useState} from 'react';
import { View, Text, FlatList, Modal} from 'react-native';
import {CustomButton} from './customButton';
import * as Speech from 'expo-speech'
export default function LyricsModal(props){
  const [modalVisible, updateVisibility] = useState(false)
  return(
     <Modal animationType="slide"
        visible={modalVisible}
        transparent={true}
        style={{justifyContent: 'center', //Centered vertically
        alignItems: 'center', // Centered horizontally
        flex:1}}>

        <View style={{ backgroundColor: 'black', width: '90%', alignSelf: "center", height:'90%', borderRadius: 20, padding: 10, marginTop: '5%'}}>
          
          <FlatList data = {props.lyrics} 
            renderItem={({item})=>{
                    return (
                        <Text onPress={()=> {
                            Speech.speak(item.words)
                        }}
                        style={{color: 'white', fontSize: 20}}>
                            {item.words}
                        </Text>
                    )
                }
          }/>
          <CustomButton onPress = {()=>{updateVisibility(!modalVisible)}} style={{fontSize: 20, width: '100%'}} label = {'Dismiss'}/>
        </View>
      </Modal>
    
      
  )
}

