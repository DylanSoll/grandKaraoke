import React, {useEffect, useState} from "react";
import { Audio } from "expo-av";
import { Dimensions, SafeAreaView, Text, TextInput, View } from "react-native";
import { styles } from "../../static/styles/mainStyle";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import * as Sharing from 'expo-sharing';
import { ajax_handler, create_form_data } from "../../static/js/ajaxhandler";

function formatTime(timeInMS){
  const currentTime = Math.floor(timeInMS) / 1000;
  //in seconds
  if (currentTime < 60) return `${currentTime.toFixed(1)}s`
  
  const minutes = Math.floor(currentTime / 60);
  const remainingSeconds = currentTime - minutes * 60;
  return `${minutes}m${Math.floor(remainingSeconds)}s`
}
function getTimeSec(){
	const dateObj = new Date();
  const timeMS = dateObj.getTime();
	return Math.floor(timeMS/1000);
}
function NewRecording(props){
  const [name, updateName] = useState(`New Recording #${props.idNum}`)
  return (
    <View style = {{borderWidth: 2, borderRadius: 20, borderColor: 'gray', 
    width: Dimensions.get('window').width * 0.8, padding: 5, alignSelf: 'center', marginVertical: 5}}>
      <TextInput style = {[styles.input, {width: '95%', alignSelf: 'center'}]} value = {name} onChangeText = {text => {
        updateName(text)
      }}/>
      <TouchableOpacity onPress={()=>{
        props.source.replayAsync();
        }}>
        <Text style = {{color: '#00a6ff', fontSize: 18, textAlign: 'center', margin: 5}}>
          Play for {formatTime(props.duration)}
        </Text>
      </TouchableOpacity>
      <View style = {{flexDirection: 'row', justifyContent: 'center'}}>
        <TouchableOpacity style = {{backgroundColor: '#0075eb', paddingVertical: 2, paddingHorizontal: 7, marginRight: 5, borderRadius: 10}} 
        onPress={()=>{
          Sharing.shareAsync(props.uri)
        }}> 
          <Text style = {{color: 'white', fontSize: 18, textAlign: 'center'}}>
            Share
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style = {{backgroundColor: '#009e1a', paddingVertical: 2, paddingHorizontal: 7, marginLeft: 3, borderRadius: 10}} 
        onPress={async ()=>{
          const blobToBase64 = (blob) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            return new Promise((resolve) => {
              reader.onloadend = () => {
                resolve(reader.result);
              };
            });
          };
        
          // Fetch audio binary blob data
        
          const audioURI = props.uri;
          const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
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
        
          const audioBase64 = await blobToBase64(blob);
          const query = `INSERT INTO audio (creatorID, name, duration, file, creationTime) VALUES (?, "${name}", "${props.duration}", ${JSON.stringify(blob.data.name)}, "${getTimeSec()}")`
          const form = create_form_data({'query': query})
          ajax_handler('https://dylansoll.pythonanywhere.com/upload-audio', props.saveAudio, form)
          props.deleteFunction()
          
        }}>
          <Text style = {{color: 'white', fontSize: 18, textAlign: 'center'}}>
            Save
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style = {{backgroundColor: '#de101d', paddingVertical: 2, paddingHorizontal: 7,borderRadius: 10, margin: 5, alignSelf: 'center'}} 
      onPress={props.deleteFunction}>
        <Text style = {{color: 'white', fontSize: 18, textAlign: 'center'}}>
          Delete
        </Text>
      </TouchableOpacity>
      
      
    </View>
  )
}
function OldRecording(props){
  return (
    <View style = {{borderWidth: 2, borderRadius: 20, borderColor: 'gray', 
    width: Dimensions.get('window').width * 0.8, padding: 5, alignSelf: 'center', marginVertical: 5}}>
      <Text style = {{color: 'white', fontSize: 20, textAlign: 'center'}}>
        {props.name}
      </Text>
      <TouchableOpacity onPress={()=>{
        props?.source?.replayAsync();
        }}>
        <Text style = {{color: '#00a6ff', fontSize: 18, textAlign: 'center', margin: 5}}>
          Play for {formatTime(props.duration)}
        </Text>
      </TouchableOpacity>
      <View style = {{flexDirection: 'row', justifyContent: 'center'}}>
        <TouchableOpacity style = {{backgroundColor: '#0075eb', paddingVertical: 2, paddingHorizontal: 7, margin: 5, borderRadius: 10}} 
        onPress={()=>{
          Sharing?.shareAsync(props?.uri)
        }}> 
          <Text style = {{color: 'white', fontSize: 18, textAlign: 'center'}}>
            Share
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style = {{backgroundColor: '#de101d', paddingVertical: 2, paddingHorizontal: 7,borderRadius: 10, margin: 5, alignSelf: 'center'}} 
      onPress={props.deleteFunction}>
        <Text style = {{color: 'white', fontSize: 18, textAlign: 'center'}}>
          Delete
        </Text>
      </TouchableOpacity>
      </View>
      
      
      
    </View>
  )
}
export default function AudioScreen({navigation}){
  const [recordings, updateRecordings] = useState([])
  const [oldRecordings, updateOldRecordings] = useState([])
  useEffect(()=>{
    const handleResponse = (response) => {
      if (response === 'login'){
        navigation.navigate('Account')
        return
      }
      updateOldRecordings(response)
    }
    ajax_handler('https://dylansoll.pythonanywhere.com/get-audio', handleResponse);
  }, []);
  
  const [recording, setRecording] = React.useState();
  
  async function startRecording() {
  try {
    updateRecordingColour('#c7002e');
    updateStartStopRecording('Stop');
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    }); 
    const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
    );
    setRecording(recording);
  } catch (err) {
    console.error('Failed to start recording', err);
  }
  }

  async function stopRecording() {
    updateRecordingColour('#00870e');
    updateStartStopRecording('Start');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    let tempRecordings = [...recordings];
    const uri = recording.getURI(); 
    const {sound, status} = await recording.createNewLoadedSoundAsync();
    tempRecordings.push({sound: sound, duration: status.durationMillis, uri: uri})
    updateRecordings(tempRecordings);
  }
  const [startStopRecording, updateStartStopRecording] = useState('Start')
  const [recordingColour, updateRecordingColour] = useState('#00870e')
  const [activePill, updateActivePill] = useState({old: 'black', new: '#525252'});
  const [activeDisplay, updateActiveDisplay] = useState({old: 'none', new: 'true'});
    return (
        <SafeAreaView  style={[styles.safeAreaView, { alignSelf: 'center' }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <TouchableOpacity style={{
                borderColor: 'gray', borderTopLeftRadius: 15, borderBottomRightRadius: 15, borderWidth: 2, marginLeft: 10, marginTop: 7,
                backgroundColor: activePill.new
              }}
                onPress={() => {
                  updateActivePill({new: '#525252', old: 'black'});
                  updateActiveDisplay({old: 'none', new: false})
                }}>

                <Text style={{ color: 'white', fontSize: 20, padding: 5 }}>
                  Create New
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={{
                borderColor: 'gray', borderTopLeftRadius: 15, borderBottomRightRadius: 15, borderWidth: 2, marginLeft: 2, marginTop: 7,
                backgroundColor: activePill.old
              }}
                onPress={() => {
                  updateActivePill({new: 'black', old: '#525252'});
                  updateActiveDisplay({old: 'true', new: 'none'})
                }}>
                <Text style={{ color: 'white', fontSize: 20, padding: 5 }}>
                  View Old
                </Text>
              </TouchableOpacity>
            </View>
            <View style = {{display: activeDisplay.new}}>
            <TouchableOpacity style = {{backgroundColor: recordingColour, paddingVertical: 2, paddingHorizontal: 7,borderRadius: 10, margin: 5, alignSelf: 'center'}}
          onPress = {recording ? stopRecording : startRecording}>
            <Text style = {{color: 'white', fontSize: 20}} >{startStopRecording} Recording</Text>

          </TouchableOpacity>
            <FlatList data = {recordings} extraData = {recordings} renderItem = {({item, index})=>{return(
              <NewRecording idNum = {index + 1} duration = {item.duration} source = {item.sound} uri = {item.uri}
              deleteFunction = {()=>{
                let tempRecordings = recordings.filter((item, index2) => {
                  if (index2 === index) return false
                  return true
                })
                updateRecordings(tempRecordings);
              }}
              
              saveAudio = {()=>{
                const handleResponse = (response) => {
                  if (response === 'login'){
                    navigation.navigate('Account');
                    return
                  }
                  updateOldRecordings(response);
                  
                }
                ajax_handler('https://dylansoll.pythonanywhere.com/get-audio', handleResponse);
              }}
              />)
            }}/>
            </View>
            <View style = {{display: activeDisplay.old}}>
              <FlatList data = {oldRecordings} extraData = {oldRecordings} renderItem = {({item, index})=>{return(
                <OldRecording idNum = {index + 1} duration = {item.duration} source = {item.sound} uri = {item.uri} name = {item.name}
                deleteFunction = {()=>{
                  let tempRecordings = oldRecordings.filter((item, index2) => {
                    if (index2 === index) return false
                    return true
                  })

                  updateOldRecordings(tempRecordings);
                  ajax_handler(`https://dylansoll.pythonanywhere.com/delete-audio`, (result)=>{}, create_form_data({'id':item.audioID}))
                }}
                />)
              }}/>
            </View>
          
        </SafeAreaView>
    )
}
/*
SELECT audio.* FROM audio WHERE audio.creatorID = 1


                <Text style = {{color: 'white', fontSize: 20}} onPress = {()=>{
                    item.sound.replayAsync()
                }}>Play {index} for {item.duration}</Text>
*/