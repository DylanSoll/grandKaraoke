import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, Keyboard, SafeAreaView, Dimensions, Modal, Linking, TouchableOpacity, KeyboardAvoidingView} from 'react-native';
import { FlatList, ScrollView, TouchableHighlight, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import {styles} from '../../static/styles/mainStyle'
import CustomButton from '../customElements/customButton';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
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
  const [showMoreDetail, updateShowMoreDetail] = useState(false);
  const [canCreateModal, updateCanCreateModal] = useState(true);
  const [inDepthEvent, updateInDepthEvent] = useState(null)
  const [canChooseLocation, updateCanChooseLocation] = useState(false)
  const [location, updateLocation] = useState({shortData: {'name': '', 'pos': {'lat':0, 'lng': 0}}, longData: []})
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
        <Modal animationType="slide" visible={canCreateModal} transparent={false}
          style={{justifyContent: 'center', alignItems: 'center', flex:1}}>
          

          
          <View style={{width:'100%', height: '100%', backgroundColor:'black'}}>
            <SafeAreaView style={{ 
                  backgroundColor: 'black', width: Dimensions.get('screen').width * 0.9, alignSelf: "center", 
                  borderRadius: 20, top: '25%', 
                  marginTop: Dimensions.get('screen').height * 0.05, borderColor: 'grey', borderWidth: 2,
                  }}>
                    <Text style = {{color: 'white', fontSize: 30, textAlign: 'center'}} onPress = {Keyboard.dismiss}>
                      New Event
                    </Text>
                <ScrollView automaticallyAdjustKeyboardInsets = {true} onPress = {Keyboard.dismiss}>

                
                <KeyboardAvoidingView>
                  <View style={styles.keyboardAvoidingInner}>
                    <View>
                      <Text style = {{color: 'white', fontSize: 22, textAlign: 'center'}}>
                        Event Name
                      </Text>
                      <TextInput style = {[styles.input, {width: '95%', alignSelf: 'center'}]} onChangeText={(formInput)=> {
                      console.log(formInput)
                    }}  />
                    </View>
                    <View>
                      <Text style = {{color: 'white', fontSize: 22, textAlign: 'center'}}>
                        Start Time
                      </Text>
                      <TextInput style = {[styles.input, {width: '95%', alignSelf: 'center'}]} onChangeText={(formInput)=> {
                      console.log(formInput)
                    }}  />
                    </View>
                    <View>
                      <Text style = {{color: 'white', fontSize: 22, textAlign: 'center'}}>
                        End Time
                      </Text>
                      <TextInput style = {[styles.input, {width: '95%', alignSelf: 'center'}]} onChangeText={(formInput)=> {
                      console.log(formInput)
                    }}  />
                    </View>
                    <View>
                      <Text style = {{color: 'white', fontSize: 22, textAlign: 'center'}}>
                        Location
                      </Text>
                      <TextInput style = {[styles.input, {width: '95%', alignSelf: 'center'}]} onPressOut = {()=>{
                        updateCanCreateModal(false); updateCanChooseLocation(true); 
                      }
                      
                        
                      } value = {location.shortData.name} />
                    </View>
                </View>
                </KeyboardAvoidingView>
                </ScrollView>




              <View style = {{flexDirection: 'row', justifyContent: 'center'}}>
                <TouchableOpacity onPress = {()=>{updateCanCreateModal(false)}} 
                  style = {[styles.button, {backgroundColor: 'red', paddingLeft: 25, paddingRight: 25}]}>
                  <Text style = {{fontSize: 20, color: 'white', textAlign: 'center'}}>
                    Cancel
                  </Text>
                  
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{
                  alert('Creating new event')
                }}
                style = {[styles.button, {backgroundColor: 'green', paddingLeft: 25, paddingRight: 25}]}>
                  <Text style = {{fontSize: 20, color: 'white', textAlign: 'center'}}>
                    Create
                  </Text>
                </TouchableOpacity>
              </View>

            </SafeAreaView>
          </View>
        </Modal>
        <Modal animationType="slide" visible={canChooseLocation} transparent={false}
          style={{justifyContent: 'center', alignItems: 'center', flex:1}}>

          <View style={{width:'100%', height: '100%', backgroundColor:'black'}}>
            <SafeAreaView>
              <Text style = {{color: 'white', fontSize:30, textAlign: 'center'}}>
                Choose Location
              </Text>
              <View style = {{flexDirection: 'row', justifyContent: 'center'}}>
                <TouchableOpacity onPress = {()=>{updateCanCreateModal(true); updateCanChooseLocation(false)}}
                style = {[styles.button, {backgroundColor: 'green', paddingLeft: 25, paddingRight: 25}]}>
                  <Text style = {{fontSize: 20, color: 'white', textAlign: 'center'}}>
                    Confirm
                  </Text>
                </TouchableOpacity>
              </View>
              <View style ={{height: '100%'}}>

              

              
              <GooglePlacesAutocomplete
          placeholder="Search"
          minLength={2} // minimum length of text to search
          autoFocus={false}
          returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
          listViewDisplayed="auto" // true/false/undefined
          fetchDetails={true}
          renderDescription={row => row.description} // custom description render
          onPress={(...data) => {
            const placeName = data[0]?.description;
            const position = data[1].geometry.location;
            console.log(placeName);
            console.log(position);
            var tempData = location;
            
            tempData.shortData.name = placeName
            tempData.shortData.pos = position
            tempData.longData = data
            updateLocation(tempData);

          }}
          getDefaultValue={() => {
            return ''; // text input default value
          }}
          query={{
            // available options: https://developers.google.com/places/web-service/autocomplete
            key: 'AIzaSyDaBRloUNbM3Q3smNh-2sXTKXtLJhdVVJE',
            language: 'en', // language of the results
          }}
          styles={{
            description: {
              fontWeight: 'bold',
            },
            predefinedPlacesDescription: {
              color: '#1faadb',
            },
          }}
          //currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
          currentLocationLabel="Current location"
          nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
          GoogleReverseGeocodingQuery={{
            // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
          }}
          GooglePlacesSearchQuery={{
            // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
            rankby: 'distance',
          }}
          // filterReverseGeocodingByTypes={[
          //   'locality',
          // ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
          debounce={200}
        />
        </View>
            </SafeAreaView>
            </View>
        </Modal>
        <View>
          <TouchableHighlight onPress={()=>{
            updateCanCreateModal(true)
          }}
          style = {{margin:10}}
          activeOpacity = {0.2}>
            <Text style={{color: 'white', fontSize: 25}}>
              Create New Event
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


