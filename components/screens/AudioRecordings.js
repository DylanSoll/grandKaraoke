import React, {useState} from "react";
import { Audio } from "expo-av";
import { SafeAreaView, Text } from "react-native";
import { styles } from "../../static/styles/mainStyle";
import { FlatList } from "react-native-gesture-handler";
export default function AudioScreen({navigation}){
    const [recordings, updateRecordings] = useState([])
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
    const uri = recording.getURI(); 
    let tempRecordings = recordings;
    tempRecordings.push({uri:uri});
    updateRecordings(tempRecordings);
    console.log('Recording stopped and stored at', uri);
  }
  const [startStopRecording, updateStartStopRecording] = useState('Start')
    return (
        <SafeAreaView  style={[styles.safeAreaView, { alignSelf: 'center' }]}>
            <Text style = {{color: 'white', fontSize: 20}} onPress = {recording ? stopRecording : startRecording}>{startStopRecording} Record</Text>
            <FlatList data = {recordings} extraData = {recordings} renderItem = {({item})=>{return(
                <Text style = {{color: 'white', fontSize: 20}} onPress = {()=>{
                    playSound(item.uri)
                }}>Play</Text>)
            }}/>
        </SafeAreaView>
    )
}