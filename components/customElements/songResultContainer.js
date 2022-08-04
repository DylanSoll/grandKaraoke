import React from 'react';
import { Text, View, StyleSheet, Image, Dimensions} from 'react-native';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Audio } from 'expo-av'; //audio used for playing snippets
export function SongContainer(props) {
  async function playSong(location) {
    //this logic prevents multiple songs from being played at once, and allows user to pause songs
    let oldSoundData = {} //creates a variable here to avoid scoping issue / object key issues
    await Audio.setAudioModeAsync({playsInSilentModeIOS: true}); //play when phone is on silent
    const { sound } = await Audio.Sound.createAsync({uri: location}); //creates sound
    if (props.oldSound === undefined){
      //if there is no song
      props.updateSong(sound) //updates the song playing
      sound.ion
      await sound.playAsync();// plays the new song 
    }else{
      oldSoundData = await props.oldSound?.getStatusAsync();//gets the data of the old song
      const newSoundData = await sound.getStatusAsync(); // gets the data of current song
      props.oldSound?.pauseAsync(); //pauses the old song
      if (newSoundData.uri !== oldSoundData?.uri){ //if they aren't the same song
        props.updateSong(sound) //plays new song, and updates it
        await sound.playAsync(); 
      }else if (oldSoundData.isPlaying === false){
        props.oldSound.playAsync(); //if it is not playing, play it (continue or restart)
    }
    }

  }
  return (
      
      <View style={styles.resultContainer}>
        <View style = {styles.imageContainer}>
          <TouchableWithoutFeedback onPress={props.showMore}>
            <Image source={{uri: props.source}} style={{width:64, height: 64}}/>
          </TouchableWithoutFeedback>
        </View>

        
        <View style = {styles.detailsContainer}>
          <TouchableWithoutFeedback onPress={props.showLyrics}>
            <Text style={styles.trackName} numberOfLines={1}>{props.trackName}</Text>
            <Text style={styles.artists} numberOfLines={1}>{props.artists}</Text>
            <Text style={styles.albumName} numberOfLines={1}>{props.albumName}</Text>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.moreInfo} >
          <TouchableOpacity onPress={()=>{
            playSong(props.previewURL) //plays the song, and associated logic
          }} disabled = {props.canPlay}>
            <Text style={{color: 'white', fontSize: 30, top: '25%'}}>{'|>'/*Dodgy play/pause symbol */} </Text>
          </TouchableOpacity>
        </View>

      </View>
  );
}

const styles = StyleSheet.create({ //styles uses throughout
  resultContainer: {
    position: "relative",
    width: Dimensions.get('window').width ,
    flexDirection: "row",
    margin: 7
    
  }, trackName:{
    fontSize: 18,
    color: 'white'
  }, artists: {
    fontSize: 14,
    color: 'white'
  }
  , albumName: {
    fontSize: 14,
    color: 'white'    
  },
  imageContainer: {
    position: "relative",
    height: 64,
    width: 64,
    marginLeft: -1,
    marginTop: -1,
    marginBottom: -1,
    marginRight: 5,
  },
  detailsContainer: {
    position: "absolute",
    width: Dimensions.get('window').width - 117, //74 is position + margin
    height: 64,
    overflow: "auto",
    left: 69
  },
  moreInfo: {
    position: 'absolute',
    right: 25,
    height: '100%'
  }
});
