import React from 'react';
import { Text, View, StyleSheet, Image, Dimensions} from 'react-native';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Audio } from 'expo-av';
export function SongContainer(props) {
  async function playSound(location) {
    let oldSoundData = {}
    const { sound } = await Audio.Sound.createAsync({uri: location});
    if (props.oldSound === undefined){
      
      props.updateSong(sound)
      await sound.playAsync(); 
    }else{
      oldSoundData = await props.oldSound?.getStatusAsync();
      const newSoundData = await sound.getStatusAsync();
      props.oldSound?.pauseAsync();
      if (newSoundData.uri !== oldSoundData?.uri){
        props.updateSong(sound)
        await sound.playAsync(); 
      }else if (oldSoundData.isPlaying === false){
        props.oldSound.playAsync();
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
            playSound(props.previewURL)
          }} disabled = {props.canPlay}>
            <Text style={{color: 'white', fontSize: 30, top: '25%'}}>{'|>'} </Text>
          </TouchableOpacity>
        </View>

      </View>
  );
}

const styles = StyleSheet.create({
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
