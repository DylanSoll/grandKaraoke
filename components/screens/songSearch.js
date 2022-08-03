"use strict"
import {React, useState} from 'react';

import { View,TextInput, Text, Keyboard, SafeAreaView, FlatList, Dimensions, Modal, Image, Linking, StyleSheet, TouchableOpacity } from 'react-native';
import { ajax_handler, create_form_data, communicateWithSpotify } from '../../static/js/ajaxhandler';
import * as Speech from 'expo-speech'
import { Audio } from 'expo-av';
import {styles} from '../../static/styles/mainStyle'
import CustomButton from '../customElements/customButton';
import { SongContainer } from '../customElements/songResultContainer';
import Spinner from 'react-native-loading-spinner-overlay';
import { TouchableWithoutFeedback, TouchableHighlight, ScrollView } from 'react-native-gesture-handler';
import { ExpandedSong } from '../customElements/expandedSong';
let currentTrackID = null;
function getPreviewURL(data){
    const trackItems = data.tracks;
    let trackData = [];
    for (let i = 0; i < trackItems.length; i++){
        const track = trackItems[i];
        const trackID = track.id;
        const previewURL = track.preview_url;
        trackData.push({songID: trackID, previewURL: previewURL});
    }
    return trackData
}
function simplifySearchResponse(data){
    const trackItems = data.tracks.items;
    let trackData = [];
    for (let i = 0; i < trackItems.length; i++){
        const track = trackItems[i].data;
        const trackName = track.name;
        const trackURL = track.uri;
        const trackID = track.id;
        const duration = track.duration_ms;
        let artistLists = track.artists.items.map(data => {
            return data.profile.name;
        });
        const artists = artistLists.join(', ')
        const albumName = track.albumOfTrack.name;
        const albumURL = track.albumOfTrack.uri;
        const albumImage = track.albumOfTrack.coverArt.sources[0].url
        trackData.push(
            {'trackName': trackName, 'duration': duration, trackURL: trackURL,
            'artists': artists, 'albumName':albumName, 'source': albumImage, 'trackID': trackID, albumURL: albumURL}
        );
    }
    return trackData
}
export function SearchForSongs({navigation}){
    const [songResults, updateResults] = useState([]);
    const [queryString, updateQuery] = useState('');
    const [canSearch, updateCanSearch] = useState(true);
    const [lyricData, updateLyricsData] = useState(null);
    const [prevOpened, updatePrevOpened] = useState(null);
    const [modalVisible, updateVisibility] = useState(false);
    const [songDetailsVisible, updateSongDetailsVisible] = useState(false);
    const [currentSound, updateCurrentSound] = useState(undefined);
    const [showActivityIndicator, updateActivityIndicator] = useState(false);
    const [cantPlay, updateCantPlay] = useState(true);
    const getPreviews = (data, results) =>{
        const urls = getPreviewURL(data);
        urls.forEach((item, index) => {
            results[index].previewURL = item.previewURL;
        });
        updateResults(results)
        updateCantPlay(false)

    }
    const handleSearchResponse = data => {
        updateCantPlay(true)
        let initialResponseData = simplifySearchResponse(data);
        updateResults(initialResponseData);
        const idsArray = initialResponseData.map(obj => {return obj.trackID});
        communicateWithSpotify('tracks', {ids: idsArray.join(',')}, (data) => {getPreviews(data, initialResponseData)})

    };
    const handleLyricsReturn = (lyricDataInp) => {
        const lyrics = lyricDataInp.lyrics;
        const lines = lyrics.lines.map(data=>{
            return {'words':data.words}
        });

        let prevOpenedLocal = [];
        if (prevOpened !== null){
            prevOpenedLocal = prevOpened;
            prevOpenedLocal[currentTrackID] = lines;
        }
        
        updatePrevOpened(prevOpenedLocal);
        //updateActivityIndicator(false);
        updateLyricsData(lines);
    }
    const handleLyricsRequest = (trackID) => {
        if (prevOpened === null){
            currentTrackID = trackID.id
            communicateWithSpotify('track_lyrics', trackID, handleLyricsReturn);
            return
        }
        const keys = Object.keys(prevOpened)
        if (keys.includes(trackID.id)){
            updateLyricsData(prevOpened[trackID.id]);
            //updateActivityIndicator(false);
        }else{
            currentTrackID = trackID.id
            communicateWithSpotify('track_lyrics', trackID, handleLyricsReturn);
        }
    }
    

  return(
      <SafeAreaView style={styles.safeAreaView}>
        <Spinner
            visible={showActivityIndicator}
            textContent={'Loading Lyrics'}
            textStyle={{color: 'white'}}
            animation = "slide"
          />
        <Modal animationType="slide"
        visible={modalVisible}
        
        transparent={false}
        style={{justifyContent: 'center', //Centered vertically
        alignItems: 'center', // Centered horizontally
        flex:1}}>
        <View style={{width:'100%', height: '100%', backgroundColor:'black'}}>
        <SafeAreaView style={{ 
            backgroundColor: 'black', width: Dimensions.get('screen').width * 0.9, alignSelf: "center", 
            height:'90%', borderRadius: 20, 
            marginTop: Dimensions.get('screen').height * 0.05, borderColor: 'grey', borderWidth: 2,
            }}>
          
          <FlatList data = {lyricData} extraData = {lyricData}
            renderItem={({item})=>{
                    return (
                        <TouchableHighlight onPress={()=>{
                            Speech.volume = 100
                            Speech.stop();
                            Speech.VoiceQuality.Enhanced
                            Speech.speak(item.words);
                            
                        }}>
                            
                            <Text
                            style={{color: 'white', fontSize: 20, paddingLeft: Dimensions.get('screen').width*0.05,
                            paddingRight: Dimensions.get('screen').width*0.05, paddingBottom: 10, fontSize: 25}}>
                                {item.words}
                            </Text>
                        </TouchableHighlight>
                    )
                }
          }/>
          <CustomButton onPress = {()=>{updateVisibility(!modalVisible)}} style={{fontSize: 20, width: '100%'}} label = {'Dismiss'}/>
        </SafeAreaView>
        </View>
      </Modal>
      <Modal animationType="slide"
        visible={songDetailsVisible}  
        transparent={true}
        style={{justifyContent: 'center', //Centered vertically
        alignItems: 'center', // Centered horizontally
        flex:1}}>
        <View style={{width:'100%', height: '100%', backgroundColor:'black'}}>
            <SafeAreaView style={{ backgroundColor: 'black',  alignSelf: "center", 
                borderRadius: 20, borderColor: 'grey', borderWidth: 2,
                marginTop: Dimensions.get('screen').height * 0.05,height:'90%', width: Dimensions.get('screen').width * 0.9,
                }}>
                    <ExpandedSong trackName = {songResults?.currentTrackIndex?.name} artists = "Arists 1, artist 2" albumName = "Album" trackURL = "spotify:track:4WNcduiCmDNfmTEz7JvmLv"
                    albumURL = "spotify:album:1B68g8b4wpedNDvvQLAoCe"
                    imageURI = "https://i.scdn.co/image/ab67757000003b822696da150dafe289126bd1ff"/>
                    
                <CustomButton onPress = {()=>{updateSongDetailsVisible(false)}} fontSize={20} label = {'Close'}/>
            </SafeAreaView>
        </View>
      </Modal>
        <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
            <TextInput placeholder='Search...' onChangeText={
                (query) => {
                    updateQuery(query);
                    if (query !== ''){updateCanSearch(false)}
                    else{updateCanSearch(true)}
                }
                } style={[styles.input, {width: Dimensions.get('window').width * .70, left: 0}]}/>
            <CustomButton label = "Search" onPress = {()=>{
                Keyboard.dismiss();
                let queryStringToParse = queryString.trim().toLowerCase();
                let spaces = queryStringToParse.match(/[ ]/gmi);
                let numSpaces = 0;
                if (spaces !== null) {
                    numSpaces = spaces.length;
                }
                const searchData = {'q': queryStringToParse.trim().replace(/[ ]/g, '%20')};
                communicateWithSpotify('search', searchData, handleSearchResponse);
            }} fontSize = {18}
            disabled = {canSearch}/>
        </View>
        <TouchableWithoutFeedback onPress={()=>{
            Keyboard.dismiss()
            }}>
        <FlatList data={songResults} extraData={songResults} style= {{flex: 1}}renderItem={({item, index}) =>{
            return (
                <TouchableWithoutFeedback >
                    <View style={{width: Dimensions.get('window').width}} >
                        <SongContainer source = {item.source} previewURL = {item.previewURL} 
                        canPlay = {cantPlay}
                        showLyrics = {()=>{
                            updateActivityIndicator(true);
                            handleLyricsRequest({'id':item.trackID});
                            updateVisibility(!modalVisible);  
                            }}
                        updateSong = {(sound)=>{
                            updateCurrentSound(sound)
                        }}
                        oldSound = {currentSound}
                        trackName = {item.trackName} artists = {item.artists} albumName = {item.albumName} />
                    </View>
                </TouchableWithoutFeedback>
                
                
            )
            } } />        
        </ TouchableWithoutFeedback>
        
      </SafeAreaView>
      
  )
}
