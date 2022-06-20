import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, Keyboard, SafeAreaView, Dimensions, Modal, Linking} from 'react-native';
import { FlatList, TouchableHighlight, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import {styles} from '../../static/styles/mainStyle'
import CustomButton from '../customElements/customButton';
function shortenTimeToDate(epoch_time){
  const time = String(new Date(epoch_time*1000)).split(' ').slice(0,4).join(" ");
  return time
}
function shortenTimeToTime(epoch_time){
  const time = String(new Date(epoch_time*1000)).split(' ')[4];
  return time
}
const exampleData = {
  'startTime': 1655726334, 'endTime': 1655727514,
  'createrUsername': 'Dylan Soll', 'Location': 'My House',
  'contact': 'email', 'title': 'Catchy Title'
}
export function CreateEvent({navigation}){
  const [topEvents, updateTopEvents] = useState([exampleData]);
  const [showMoreDetail, updateShowMoreDetail] = useState(true);
  const [inDepthEvent, updateInDepthEvent] = useState(null)
  return(
      <SafeAreaView style={[styles.safeAreaView, {alignSelf: 'center'}]}>
        <Modal animationType="slide" visible={showMoreDetail} transparent={false}
          style={{justifyContent: 'center', alignItems: 'center', flex:1}}>

          <View style={{width:'100%', height: '100%', backgroundColor:'black'}}>
            <SafeAreaView style={{ 
                  backgroundColor: 'black', width: Dimensions.get('screen').width * 0.9, alignSelf: "center", 
                  borderRadius: 20, top: '25%', 
                  marginTop: Dimensions.get('screen').height * 0.05, borderColor: 'grey', borderWidth: 2,
                  }}>
              <Text style={{color: 'white', textAlign: 'center', fontSize: 30, paddingBottom: 5, paddingTop: 10}}>
                {inDepthEvent?.title}
              </Text>
              <Text style={{color: 'white', textAlign: 'center', fontSize: 25, paddingBottom: 5}}>
                Created by {inDepthEvent?.createrUsername}
              </Text>
              <Text style={{color: 'white', textAlign: 'center', fontSize: 19, paddingBottom: 5}}>
                Starting on {shortenTimeToDate(inDepthEvent?.startTime)} at {shortenTimeToTime(inDepthEvent?.startTime)}
              </Text>
              <Text style={{color: 'white', textAlign: 'center', fontSize: 19, paddingBottom: 5}}>
                Finishes on {shortenTimeToDate(inDepthEvent?.endTime)} at {shortenTimeToTime(inDepthEvent?.endTime)}
              </Text>
              <Text style={{color: 'white', textAlign: 'center', fontSize: 19, paddingBottom: 5}}>
                Located at {inDepthEvent?.Location}
              </Text>

              <TouchableHighlight onPress={()=>{Linking.openURL(`mailto:${inDepthEvent?.contact}`)}}>
                <Text style={{color: '#006ae3', fontSize: 19, textAlign: 'center'}}>
                  {inDepthEvent?.contact}
                </Text>
              </TouchableHighlight>
              <CustomButton onPress = {()=>{updateShowMoreDetail(false)}} label = {'Dismiss'} fontSize = {20}/>
              <Text style={{fontSize: 5}}>{"\n"}</Text>
            </SafeAreaView>
          </View>

        </Modal>
        <View>
          <TouchableHighlight>
            <Text style={{color: 'white'}}>
              INSERT CREATE BAR
            </Text>
          </TouchableHighlight>
        </View>
        <FlatList data={topEvents} extraData={topEvents} renderItem = {
          ({item, index}) => {
            return (
              <TouchableWithoutFeedback onPress={()=>{
                updateInDepthEvent(item);
                updateShowMoreDetail(true);
              }}>
                <View style={{
                  width: Dimensions.get('screen').width * 0.8,
                  borderRadius: 15,
                  borderColor: 'grey',
                  borderWidth: 2,
                  padding: 8
                }}>
                  <Text style={{color: 'white', fontSize: 25, textAlign: 'center', paddingBottom: 5}}>{item.title}</Text>
                  <Text style={{color: 'white', fontSize: 22, textAlign: 'center', paddingBottom: 5}}>{item.createrUsername}</Text>
                  <Text style={{color: 'white', fontSize: 18, paddingBottom: 5}}>{'Date >>> '} {shortenTimeToDate(item.startTime)} -- {shortenTimeToDate(item.endTime)}</Text>
                  <Text style={{color: 'white', fontSize: 18, paddingBottom: 5}}>{'Time >>> '} {shortenTimeToTime(item.startTime)} -- {shortenTimeToTime(item.endTime)}</Text>
                </View>
              </TouchableWithoutFeedback>
              
              
            )
          }
        }/>
      </SafeAreaView>
      
  )
}


