import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, Keyboard, SafeAreaView, Dimensions, Modal, Linking, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { styles } from '../../static/styles/mainStyle'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import DateTimePicker from '@react-native-community/datetimepicker';
import { create_form_data, ajax_handler } from '../../static/js/ajaxhandler'

function convertISOToEpoch(ISOString) {
  const dateObj = new Date(ISOString);
  const epochMs = dateObj.getTime();
  return Math.floor(epochMs / 1000)
}

let today = new Date();
export function CreateEvent({ navigation }) {
  const [searchHeight, updateSearchHeight] = useState('8%')
  const [eventName, updateEventName] = useState('')
  const [location, updateLocation] = useState({ shortData: { 'name': '', 'pos': { 'lat': 0, 'lng': 0 } }, longData: [] })
  const [startTime, updateStartTime] = useState(today)
  const [endTime, updateEndTime] = useState(today)
  const [newEventData, updateNewEventData] = useState({
    start: undefined, end: undefined, title: undefined, location: {
      address: undefined, position: undefined, fullData: []
    }
  });
  return (<SafeAreaView style={{
    backgroundColor: 'black', alignSelf: "center", width: '100%', height: '100%'
  }}>
    <TouchableWithoutFeedback onPressOut={() => {
      Keyboard.dismiss();
    }}><Text style={{ color: 'white', fontSize: 22, textAlign: 'center' }}>
        Location
      </Text>
      <View style={{ height: searchHeight, width: '90%', alignSelf: 'center' }} >
        <View style={{ height: '100%' }}>

          <GooglePlacesAutocomplete
            textInputProps={{
              onFocus: () => {
                updateSearchHeight('60%');
              },
              onBlur: () => {
                updateSearchHeight('8%');
                Keyboard.dismiss();
              }
            }}
            placeholder="Location..."
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
              updateLocation(tempData)

              let eventData = newEventData;
              eventData.location.address = placeName;
              eventData.location.position = position;
              eventData.location.fullData = data;
              updateNewEventData(eventData);
            }}
            getDefaultValue={() => { return '' }}
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
      </View></TouchableWithoutFeedback>


    <View >
      <View>
        <Text style={{ color: 'white', fontSize: 22, textAlign: 'center' }}>
          Event Name
        </Text>
        <TextInput style={[styles.input, { width: '95%', alignSelf: 'center', marginBottom: 10 }]} value={eventName} onChangeText={(formInput) => {
          updateEventName(formInput);
          let data = newEventData;
          data.title = formInput;
          updateNewEventData(data)
        }} placeholder="Event Name..."
          onBlur={Keyboard.dismiss}
        />
      </View>
      <View>
        <Text style={{ color: 'white', fontSize: 22, textAlign: 'center' }}>
          Start Time
        </Text>
        <DateTimePicker style={{ width: '80%', marginBottom: 10, alignSelf: 'center', height: 150 }}
          display='spinner' textColor='white'

          mode="datetime" placeholder="Select Time"
          value={startTime} minimumDate={today}
          onChange={(event, date) => {
            updateStartTime(date)
            let data = newEventData;
            data.start = date;
            updateNewEventData(data);
          }} />
      </View>
      <View>
        <Text style={{ color: 'white', fontSize: 22, textAlign: 'center' }}>
          End Time
        </Text>
        <DateTimePicker style={{ width: '80%', marginBottom: 10, alignSelf: 'center', height: 150 }}
          display='spinner' textColor='white'
          mode="datetime" placeholder="Select Time"
          value={endTime} minimumDate={startTime}
          onChange={(event, date) => {
            updateEndTime(date)
            let data = newEventData;
            data.end = date;
            updateNewEventData(data);
          }} />

      </View>

    </View>




    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
      <TouchableOpacity onPress={() => {
        navigation.navigate('Events');
        updateSearchHeight('8%');
        updateEventName('');
        updateLocation({ shortData: { 'name': '', 'pos': { 'lat': 0, 'lng': 0 } }, longData: [] });
        updateStartTime(today);
        updateEndTime(today);
        updateNewEventData({
          start: undefined, end: undefined, title: undefined, location: {
            address: undefined, position: undefined, fullData: []
          }
        });
      }}
        style={[styles.button, { backgroundColor: 'red', paddingLeft: 25, paddingRight: 25 }]}>
        <Text style={{ fontSize: 20, color: 'white', textAlign: 'center' }}>
          Reset
        </Text>

      </TouchableOpacity>
      <TouchableOpacity onPress={() => {
        const eventForm = create_form_data({
          'address': newEventData.location.address,
          'latitude': newEventData.location.position.lat,
          'longitude': newEventData.location.position.lng,
          'eventName': newEventData.title,
          'start': convertISOToEpoch(newEventData.start),
          'end': convertISOToEpoch(newEventData.end)
        }); // creates a form with the required data for event creation
        const eventCreationResponse = (response) => {
          if (response === 'login') {
            navigation.navigate('Login')
            return
          }
        }
        navigation.navigate('Events')
        ajax_handler('http://dylansoll.pythonanywhere.com/create-event', eventCreationResponse, eventForm);
      }}
        style={[styles.button, { backgroundColor: 'green', paddingLeft: 25, paddingRight: 25 }]}>
        <Text style={{ fontSize: 20, color: 'white', textAlign: 'center' }}>
          Create
        </Text>
      </TouchableOpacity>
    </View>

  </SafeAreaView>)
}