import React, {useState} from "react";
import { Audio } from "expo-av";
import { Dimensions, SafeAreaView, Text, View } from "react-native";
import { styles } from "../../static/styles/mainStyle";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
function NewRecording(props){
  return (
    <View style = {{borderWidth: 2, borderRadius: 20, borderColor: 'gray', 
    width: Dimensions.get('screen').width * 0.8, padding: 5}}>
      <Text style = {{color: 'white', fontSize: 20, textAlign: 'center'}}>
        New Recording #{ props.idNum }
      </Text>
      <TouchableOpacity onPress={()=>{console.log('PLAY')}}>
        <Text style = {{color: 'white', fontSize: 18, textAlign: 'center'}}>
          Play for {props.duration}
        </Text>
      </TouchableOpacity>
      <View style = {{flexDirection: 'row', justifyContent: 'center'}}>
        <TouchableOpacity onPress={()=>{console.log('SHARE')}}>
          <Text style = {{color: 'white', fontSize: 18, textAlign: 'center'}}>
            Share
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{console.log('SHARE')}}>
          <Text style = {{color: 'white', fontSize: 18, textAlign: 'center'}}>
            Upload
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={()=>{console.log('DELETE')}}>
        <Text style = {{color: 'white', fontSize: 18, textAlign: 'center'}}>
          Delete
        </Text>
      </TouchableOpacity>
      
      
    </View>
  )
}
export default function AudioScreen({navigation}){
    const [recordings, updateRecordings] = useState([{uri: 'gsaga', duration: '1111', source: 'source'}])
    async function playSound(location) {
        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync({localUri: location});
        //setSound(sound);
        //sound.set

        await sound.playAsync(); }
    
        const [recording, setRecording] = React.useState();

  async function startRecording() {
    try {
      console.log('Requesting permissions..');
      updateStartStopRecording('Stop')
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      }); 
      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(
         Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    updateStartStopRecording('Start');
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    let tempRecordings = recordings;
    const uri = recording.getURI(); 
    const {sound, status} = await recording.createNewLoadedSoundAsync();
    tempRecordings.push({sound: sound, duration: status.durationMillis, uri: uri})
    updateRecordings(tempRecordings);
    //sound.playAsync()
    console.log('Recording stopped and stored at', uri);
  }
  const [startStopRecording, updateStartStopRecording] = useState('Start')
    return (
        <SafeAreaView  style={[styles.safeAreaView, { alignSelf: 'center' }]}>
            <Text style = {{color: 'white', fontSize: 20}} onPress = {recording ? stopRecording : startRecording}>{startStopRecording} Recording</Text>
            <FlatList data = {recordings} extraData = {recordings} renderItem = {({item, index})=>{return(
              <NewRecording idNum = {index + 1} duration = {item.duration} source = {item.source}/>)
            }}/>
        </SafeAreaView>
    )
}
/*

                <Text style = {{color: 'white', fontSize: 20}} onPress = {()=>{
                    item.sound.replayAsync()
                }}>Play {index} for {item.duration}</Text>
*/