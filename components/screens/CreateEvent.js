import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, Keyboard, SafeAreaView, Dimensions, Modal, Linking, TouchableOpacity, KeyboardAvoidingView} from 'react-native';
import { FlatList, ScrollView, TouchableHighlight, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import {styles} from '../../static/styles/mainStyle'
import CustomButton from '../customElements/customButton';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import DateTimePicker from '@react-native-community/datetimepicker';
import {create_form_data, ajax_handler} from '../../static/js/ajaxhandler'
function shortenTimeToDate(epoch_time){
  const time = String(new Date(epoch_time*1000)).split(' ').slice(0,4).join(" ");
  return time
}
function shortenTimeToTime(epoch_time){
  const time = String(new Date(epoch_time*1000)).split(' ')[4];
  return time
}
function convertISOToEpoch(ISOString){
  const dateObj = new Date(ISOString);
  const epochMs = dateObj.getTime();
  return Math.floor(epochMs/1000)
}
const exampleData = {
  'startTime': 1655726334, 'endTime': 1655727514,
  'createrUsername': 'Dylan Soll', 'location': {'address': '72 Pickering Street, Enogerra', 'position': {'lat': -27, 'lng': 152}},
  'contact': 'email', 'title': 'Catchy Title'
}
var today = new Date();
export function CreateEvent({navigation}){
  const [topEvents, updateTopEvents] = useState([exampleData]);
  const [showMoreDetail, updateShowMoreDetail] = useState(false);
  const [canCreateModal, updateCanCreateModal] = useState(true);
  const [inDepthEvent, updateInDepthEvent] = useState(null)
  const [canChooseLocation, updateCanChooseLocation] = useState(false)
  const [eventName, updateEventName] = useState('')
  const [location, updateLocation] = useState({shortData: {'name': '', 'pos': {'lat':0, 'lng': 0}}, longData: []})
  const [startTime, updateStartTime] = useState(today)
  const [endTime, updateEndTime] = useState(today)
  const [newEventData, updateNewEventData] = useState({
    start: undefined, end: undefined, title: undefined,location: {
      address: undefined, position: undefined, fullData: []
    }
  });
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
                Located at {`inDepthEvent?.location?.address \n${inDepthEvent?.location?.position?.lat}, ${inDepthEvent?.location?.position?.lng}`}
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
                      <TextInput style = {[styles.input, {width: '95%', alignSelf: 'center', marginBottom: 10}]} value = {eventName}onChangeText={(formInput)=> {
                      updateEventName(formInput);
                      let data = newEventData;
                      data.title = formInput;
                      updateNewEventData(data)
                    }}  />
                    </View>
                    <View>
                      <Text style = {{color: 'white', fontSize: 22, textAlign: 'center'}}>
                        Start Time
                      </Text>
                      <DateTimePicker style={{width: '80%', marginBottom: 10, alignSelf: 'center'}}
                      mode="datetime" placeholder="Select Time"
                      value = {startTime} minimumDate = {today}
                      onChange = {(event, date) => { updateStartTime(date) 
                      let data = newEventData;
                      data.start = date;
                      updateNewEventData(data);}}/>
                    </View>
                    <View>
                      <Text style = {{color: 'white', fontSize: 22, textAlign: 'center'}}>
                        End Time
                      </Text>
                      <DateTimePicker style={{width: '80%', marginBottom: 10, alignSelf: 'center'}}
                      mode="datetime" placeholder="Select Time"
                      value = {endTime} minimumDate = {startTime}
                      onChange = {(event, date) => { updateEndTime(date)
                        let data = newEventData;
                        data.end = date;
                        updateNewEventData(data); }}/>

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
                  const eventForm = create_form_data({ 
                    'address': newEventData.location.address,
                    'latitude': newEventData.location.position.lat,
                    'longitude': newEventData.location.position.lng,
                    'eventName': newEventData.title,
                    'start': convertISOToEpoch(newEventData.start),
                    'end': convertISOToEpoch(newEventData.end)
                  }); // creates a form with the required data for event creation
                  const eventCreationResponse = (response) => {
                    if (response === 'login'){
                      navigation.navigate('Login')
                      return
                    }
                    updateCanCreateModal(false)
                  }
                  ajax_handler('http://dylansoll.pythonanywhere.com/create-event', eventCreationResponse, eventForm);
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
            var tempData = location;
            
            tempData.shortData.name = placeName
            tempData.shortData.pos = position
            tempData.longData = data
            let eventData = newEventData;
            eventData.location.address = placeName;
            eventData.location.position = position;
            eventData.location.fullData = data;
            updateNewEventData(eventData);
          }}
          getDefaultValue={() => {return ''}}
          query={{
            key: 'AIzaSyDaBRloUNbM3Q3smNh-2sXTKXtLJhdVVJE',
            language: 'en', 
          }}
          styles={{
            description: {
              fontWeight: 'bold',
            },
            predefinedPlacesDescription: {
              color: '#1faadb',
            },
          }}
          currentLocationLabel="Current location"
          nearbyPlacesAPI="GooglePlacesSearch"

          GooglePlacesSearchQuery={{
            rankby: 'distance',
          }}
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
              <TouchableOpacity onPress={()=>{
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
                  <Text style={{color: 'white', fontSize: 18, paddingBottom: 5}}>{item?.location?.address}</Text>
                </View>
              </TouchableOpacity>
              
              
            )
          }
        }/>
      </SafeAreaView>
      
  )
}


/*
SELECT * FROM events
WHERE latitude > -28 and latitude < -26
AND longitude > 151 and longitude < 153
ORDER BY startTime ASC

//latitude: 1 deg = 110.574 km
const degreesPerKmLat = 0.00904371732;
function getDegreesPerKmLong(latitude){
	const kmsPerDegreeLong = 111.320 * Math.cos(latitude/180)
  //longitude: 1 deg = 111.320*cos(degrees in latitude) km
	return 1 / kmsPerDegreeLong;
}

function findMinMaxDegrees(lat, long, numKm){
	const degreesPerKmLong = getDegreesPerKmLong(lat);
  const latBounds = [lat - degreesPerKmLat * numKm, lat + degreesPerKmLat * numKm];
  const longBounds = [long - degreesPerKmLong * numKm, long + degreesPerKmLong * numKm];
  return {'lat':latBounds, 'long': longBounds}
}

INSERT INTO events (organiserID, title, startTime, endTime, address, latitude, longitude, creationTime)
VALUES (1, 'Test event', '1658725576', '1658725576', 'Marist College Ashgrove, Frasers Road, Ashgrove QLD, Australia', '-27.4393279', '152.9779273', '1658725610')
*/