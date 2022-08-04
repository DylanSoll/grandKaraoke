import React, { useEffect, useState } from "react";
import { Audio } from "expo-av";
import { Dimensions, SafeAreaView, Text, TextInput, View } from "react-native";
import { styles } from "../../static/styles/mainStyle";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import * as Sharing from 'expo-sharing';
import { ajax_handler, create_form_data } from "../../static/js/ajaxhandler";

function formatTime(timeInMS) {
  //formats the time (in milliseconds) to number of minutes 
  const currentTime = Math.floor(timeInMS / 1000); //time in seconds
  if (currentTime < 60) return `${currentTime.toFixed(1)}s`;
  //if not in minutes, rounds to nearest 1 decimal point
  const minutes = Math.floor(currentTime / 60); // total minutes
  const remainingSeconds = currentTime - minutes * 60; //remaining seconds
  return `${minutes}m${Math.floor(remainingSeconds)}s`
}
function getTimeSec() {
  const dateObj = new Date(); //creates a date object for that point in time
  const timeMS = dateObj.getTime(); //gets the epoch time (in ms)
  return Math.floor(timeMS / 1000); //gets the current time in seconds
}
function NewRecording(props) {
  const [name, updateName] = useState(`New Recording #${props.idNum}`)
  //The name of the variable
  return (
    <View style={{
      borderWidth: 2, borderRadius: 20, borderColor: 'gray',
      width: Dimensions.get('window').width * 0.8, padding: 5, alignSelf: 'center', marginVertical: 5
    }}>
      <TextInput style={[styles.input, { width: '95%', alignSelf: 'center' }]} value={name} onChangeText={text => {
        updateName(text)
      }} />
      <TouchableOpacity onPress={()=>{props.source.replayAsync()}/*ES6 arrow functions all for more control over functions*/}>
        <Text style={{ color: '#00a6ff', fontSize: 18, textAlign: 'center', margin: 5 }}>
          Play for {formatTime(props.duration) /*Anything contained in {} will be treated as JavaScript*/}
        </Text>
      </TouchableOpacity>
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <TouchableOpacity style={{ backgroundColor: '#0075eb', paddingVertical: 2, paddingHorizontal: 7, marginRight: 5, borderRadius: 10 }}
          onPress={() => { Sharing.shareAsync(props.uri) }}>
          <Text style={{ color: 'white', fontSize: 18, textAlign: 'center' } /*Styling similar to css*/}>
            Share
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ backgroundColor: '#009e1a', paddingVertical: 2, paddingHorizontal: 7, marginLeft: 3, borderRadius: 10 }}
          onPress={async () => {
            const blobToBase64 = (blob) => {
              const reader = new FileReader(); //creates an Object to read files from
              reader.readAsDataURL(blob); //reads the data as a URL
              return new Promise((resolve) => {
                reader.onloadend = () => {//asyncronous function for loading the file
                  resolve(reader.result);
                };
              });
            };

            // Fetch audio binary blob data

            const audioURI = props.uri; //gets the uri of the audio file
            const blob = await new Promise((resolve, reject) => {
              const xhr = new XMLHttpRequest(); //creates the blob from the URI by searching for the file
              xhr.onload = function () {
                resolve(xhr.response);
              };
              xhr.onerror = function (e) {
                reject(new TypeError("Network request failed"));
              };
              xhr.responseType = "blob";
              xhr.open("GET", audioURI, true);
              xhr.send(null);
            });

            const audioBase64 = await blobToBase64(blob); //converts the blob to base64 encoding
            const query = `INSERT INTO audio (creatorID, name, duration, file, creationTime) VALUES (?, "${name}", "${props.duration}", ${JSON.stringify(blob.data.name)}, "${getTimeSec()}")`
            //Generates the insert into query
            const form = create_form_data({ 'query': query });
            ajax_handler('https://dylansoll.pythonanywhere.com/upload-audio', props.saveAudio, form)
            //Sends the post request to the server
            props.deleteFunction() //if it is saved to the database, it needs to be removed from the display

          }}>
          <Text style={{ color: 'white', fontSize: 18, textAlign: 'center' }}>
            Save
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={{ backgroundColor: '#de101d', paddingVertical: 2, paddingHorizontal: 7, borderRadius: 10, margin: 5, alignSelf: 'center' }}
        onPress={props.deleteFunction}>
        <Text style={{ color: 'white', fontSize: 18, textAlign: 'center' }}>
          Delete
        </Text>
      </TouchableOpacity>
    </View>
  )
}
function OldRecording(props) {
  return (
    <View style={{
      borderWidth: 2, borderRadius: 20, borderColor: 'gray',
      width: Dimensions.get('window').width * 0.8, padding: 5, alignSelf: 'center', marginVertical: 5
    }}>
      <Text style={{ color: 'white', fontSize: 20, textAlign: 'center' }}>
        {props.name}
      </Text>
      <TouchableOpacity onPress={props?.source?.replayAsync}>
        <Text style={{ color: '#00a6ff', fontSize: 18, textAlign: 'center', margin: 5 }}>
          Play for {formatTime(props.duration)}
        </Text>
      </TouchableOpacity>
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <TouchableOpacity style={{ backgroundColor: '#0075eb', paddingVertical: 2, paddingHorizontal: 7, margin: 5, borderRadius: 10 }}
          onPress={() => { Sharing?.shareAsync(props?.uri) }}>
          <Text style={{ color: 'white', fontSize: 18, textAlign: 'center' }}>
            Share
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ backgroundColor: '#de101d', paddingVertical: 2, paddingHorizontal: 7, borderRadius: 10, margin: 5, alignSelf: 'center' }}
          onPress={props.deleteFunction}>
          <Text style={{ color: 'white', fontSize: 18, textAlign: 'center' }}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
export default function AudioScreen({ navigation }) {
  const [recordings, updateRecordings] = useState([]) //use state stops the constants from being redefined every re-render
  const [oldRecordings, updateOldRecordings] = useState([]) //page rerenders whenever page is touched, changed etc.
  function getAudio() {
    const handleGetAudioResponse = (response) => {
      //creates a function to handle the response from get audio
      if (response === 'login') {
        navigation.navigate('Account'); //if 'login' is returned from the server, goes to the login page
        return
      }
      updateOldRecordings(response);

    }
    ajax_handler('https://dylansoll.pythonanywhere.com/get-audio', handleGetAudioResponse);
    //sends a request to the server, no data attached
  }
  useEffect(getAudio, []); //use effect with [] as the paramater will only fire once

  const [recording, setRecording] = React.useState();

  async function startRecording() {
    //async allows it to carry on the background
    try {
      updateRecordingColour('#c7002e');
      updateStartStopRecording('Stop');
      await Audio.requestPermissionsAsync(); //request the permission to record
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true, //settings required to record on IOS
        playsInSilentModeIOS: true,
      });//await requires a response from the promise before moving on
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY// Creates recording in high quality
      );
      setRecording(recording);
    } catch (err) {
      //if failed, dont crash the program
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    updateRecordingColour('#00870e');
    updateStartStopRecording('Start');
    setRecording(undefined);
    //clears the recording
    await recording.stopAndUnloadAsync(); //clears the recording from memory
    let tempRecordings = [...recordings]; //creates a local variable of all recordings to be modified
    const uri = recording.getURI(); //gets location of file on device
    const { sound, status } = await recording.createNewLoadedSoundAsync(); //creates the sound from recording
    tempRecordings.push({ sound: sound, duration: status.durationMillis, uri: uri })
    //includes it to be rendered for the new recordings
    updateRecordings(tempRecordings);
    
  }
  const [startStopRecording, updateStartStopRecording] = useState('Start')
  const [recordingColour, updateRecordingColour] = useState('#00870e')
  const [activePill, updateActivePill] = useState({ old: 'black', new: '#525252' });
  const [activeDisplay, updateActiveDisplay] = useState({ old: 'none', new: 'true' });
  //constants used for navigation between new and old recordings
  function deleteFromDatabase(index, audioID) {
    let tempRecordings = oldRecordings.filter((item, position) => {
      if (position === index) return false
      return true
    }) //filters out the deleted sound
    updateOldRecordings(tempRecordings);
    ajax_handler(`https://dylansoll.pythonanywhere.com/delete-audio`, (result) => {}, create_form_data({ 'id': audioID }))
    //sends POST request to server to delete the audio file by 'ID'
  }
  function deleteFromNewRecordings(index) {
    let tempRecordings = recordings.filter((item, position) => {
      if (position === index) return false
      return true //filters out the item to be deleted
    });
    updateRecordings(tempRecordings); //updates the recordings
  }
  function navigateTo(target) {
    
    let tempPill = {...activePill}; //gets the active pills function and creates a temporary object
    let tempDisplays = {...activeDisplay}; //repeats for active display
    const pillsVals = Object.keys(tempPill);
    pillsVals.forEach(key => {
      if (key === target) {
        tempPill[key] = '#525252'; //sets the target as highlighted and visible
        tempDisplays[key] = 'true';
        return
      }
      tempPill[key] = 'black'; //otherwise hide it and remove highlighting
      tempDisplays[key] = 'none';
    });
    updateActivePill(tempPill); //updates the navigation variables
    updateActiveDisplay(tempDisplays);
  }

  return (
    <SafeAreaView style={[styles.safeAreaView, { alignSelf: 'center' }]}>
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <TouchableOpacity style={{
          borderColor: 'gray', borderTopLeftRadius: 15, borderBottomRightRadius: 15, borderWidth: 2, marginLeft: 10, marginTop: 7,
          backgroundColor: activePill.new
        }}
          onPress={() => { navigateTo('new') /*navigates to the 'new' audio recordings*/}}> 

          <Text style={{ color: 'white', fontSize: 20, padding: 5 }}>
            Create New
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={{
          borderColor: 'gray', borderTopLeftRadius: 15, borderBottomRightRadius: 15, borderWidth: 2, marginLeft: 2, marginTop: 7,
          backgroundColor: activePill.old
        }}
          onPress={() => { navigateTo('old') }}>
          <Text style={{ color: 'white', fontSize: 20, padding: 5 }}>
            View Old
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ display: activeDisplay.new }}>
        <TouchableOpacity style={{ backgroundColor: recordingColour, paddingVertical: 2, paddingHorizontal: 7, borderRadius: 10, margin: 5, alignSelf: 'center' }}
          onPress={recording ? stopRecording : startRecording}>
          <Text style={{ color: 'white', fontSize: 20 }} >{startStopRecording} Recording</Text>

        </TouchableOpacity>
        <FlatList data={recordings} extraData={recordings} renderItem={({ item, index }) => {
          //Flatlists iterate through arrays and creates an element based on the contained object
          return (
            <NewRecording idNum={index + 1} duration={item.duration} source={item.sound} uri={item.uri}
              deleteFunction={()=>{deleteFromNewRecordings(index)}} saveAudio={getAudio} />)
        }} />
      </View>
      <View style={{ display: activeDisplay.old }}>
        <FlatList data={oldRecordings} extraData={oldRecordings} renderItem={({ item, index }) => {
          return (
            <OldRecording idNum={index + 1} duration={item?.duration} source={item?.sound} uri={item?.uri} name={item?.name}
              deleteFunction={() => {deleteFromDatabase(index, item.audioID)}}
            />) //The return (<OldRecording /> shows the function named OldRecording)
        }} />
      </View>

    </SafeAreaView>
  )
}