"use strict"
import {React, useState} from 'react';
import { View,TextInput, Text, Keyboard, SafeAreaView, FlatList, Dimensions, Modal, Image, Linking, StyleSheet, TouchableOpacity } from 'react-native';
import { communicateWithSpotify } from '../../static/js/ajaxhandler';
import * as Speech from 'expo-speech'
import {styles} from '../../static/styles/mainStyle'
import CustomButton from '../customElements/customButton';
import { SongContainer } from '../customElements/songResultContainer';
import { TouchableWithoutFeedback, TouchableHighlight } from 'react-native-gesture-handler';
import { ExpandedSong } from '../customElements/expandedSong';
let currentTrackID = null;
function getPreviewURL(data){
    const trackItems = data.tracks;//select only the tracks
    let trackData = trackItems.map(track=>{
        return {songID: track.id, previewURL: track.preview_url} //maps the results to only the essentials
    });
    return trackData
}
function simplifySearchResponse(data){
    const trackItems = data.tracks.items; //reduces the data to only the tracks array
    let trackData = []; 
    for (let i = 0; i < trackItems.length; i++){
        const track = trackItems[i].data; //gets all the variables for the simplified array
        const trackName = track.name; //while yes, forEach() or map() can be used, it through an error for some reason
        const trackURL = track.uri;
        const trackID = track.id;
        const duration = track.duration_ms;
        let artistLists = track.artists.items.map(data => {
            return data.profile.name; //maps the old array to only include the artists name
        });
        const artists = artistLists.join(', ') //joins the artists by a comma
        const albumName = track.albumOfTrack.name;
        const albumURL = track.albumOfTrack.uri;
        const albumImage = track.albumOfTrack.coverArt.sources[0].url
        trackData.push( //adds all the info to trackData
            {'trackName': trackName, 'duration': duration, trackURL: trackURL,
            'artists': artists, 'albumName':albumName, 'source': albumImage, 'trackID': trackID, albumURL: albumURL}
        );
    }
    return trackData
}
export function SearchForSongs({navigation}){
    const [songResults, updateResults] = useState([]);
    const [specificSong, updateSpecificSong] = useState({});
    const [queryString, updateQuery] = useState('');
    const [canSearch, updateCanSearch] = useState(true);
    const [lyricData, updateLyricsData] = useState(null);
    const [prevOpened, updatePrevOpened] = useState(null);
    const [modalVisible, updateVisibility] = useState(false);
    const [songDetailsVisible, updateSongDetailsVisible] = useState(false);
    const [currentSound, updateCurrentSound] = useState(undefined);
    const [cantPlay, updateCantPlay] = useState(true);
    //all the use state variables 
    const getPreviews = (data, results) =>{
        const urls = getPreviewURL(data);
        urls.forEach((item, index) => {
            results[index].previewURL = item.previewURL;
        });
        updateResults(results);
        updateCantPlay(false);
        //gets all the preivews and updates the songs, with the preview links
    }
    const handleSearchResponse = data => {
        updateCantPlay(true); //stops the user from playing songs
        let initialResponseData = simplifySearchResponse(data); //simplifies the data and updates it
        updateResults(initialResponseData);
        const idsArray = initialResponseData.map(obj => {return obj.trackID});
        //gets all the ids, and sends them to the spotify api server (using rapid api) to get the tracks (it has preview)
        communicateWithSpotify('tracks', {ids: idsArray.join(',')}, (data) => {getPreviews(data, initialResponseData)})

    };
    const handleLyricsReturn = (lyricDataInp) => {
        const lyrics = lyricDataInp.lyrics;
        const lines = lyrics.lines.map(data=>{
            return {'words':data.words} //handles the returns of lyrics, and maps the ata to just the words
        });
        let prevOpenedLocal = []; 
        if (prevOpened !== null){
            prevOpenedLocal = prevOpened; //adds to lyrics to the previously opened to reduce API calls
            prevOpenedLocal[currentTrackID] = lines;
        }
        updatePrevOpened(prevOpenedLocal);//update the useStates
        updateLyricsData(lines);
        return
    }
    const handleLyricsRequest = (trackID) => {
        if (prevOpened === null){
            currentTrackID = trackID.id; //if there is no previous lyric, search for them
            communicateWithSpotify('track_lyrics', trackID, handleLyricsReturn); //search for the lyrics
            return
        }
        const keys = Object.keys(prevOpened) //if there is a previous opened one
        if (keys.includes(trackID.id)){
            updateLyricsData(prevOpened[trackID.id]); //update the lyrics with the data
        }else{//if that fails, search for the lyrics
            currentTrackID = trackID.id
            communicateWithSpotify('track_lyrics', trackID, handleLyricsReturn);
        }
    }
    
    const showMoreFunc = (newData) => {
        updateSongDetailsVisible(true); //toggle the modals
        updateVisibility(false);
        updateSpecificSong(newData); //update the use state with the data
    }
  return(
      <SafeAreaView style={styles.safeAreaView}>
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
                            Speech.volume = 100; //set settings to make the speech work
                            Speech.stop();
                            Speech.VoiceQuality.Enhanced;
                            Speech.speak(item.words); //speak the line if clicked
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
          <CustomButton onPress = {()=>{updateVisibility(!modalVisible)/*Hide the modal*/}} style={{fontSize: 20, width: '100%'}} label = {'Dismiss'}/>
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
                    <ExpandedSong trackName = {specificSong?.trackName} artists = {specificSong?.artists} 
                    albumName = {specificSong?.albumName} trackURL = {specificSong?.trackURL}
                    albumURL = {specificSong?.source}
                    imageURI = {specificSong?.source}/>
                    
                <CustomButton onPress = {()=>{updateSongDetailsVisible(false)}} fontSize={20} label = {'Close'}/>
            </SafeAreaView>
        </View>
      </Modal>
        <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
            <TextInput placeholder='Search...' onChangeText={
                (query) => {
                    updateQuery(query); //search query must be updated
                    if (query !== ''){updateCanSearch(false)}
                    else{updateCanSearch(true)} //whether the user can search or not
                }
                } style={[styles.input, {width: Dimensions.get('window').width * .70, left: 0}]}/>
            <CustomButton label = "Search" onPress = {()=>{
                Keyboard.dismiss();//hides keyboard
                let queryStringToParse = queryString.trim().toLowerCase(); //gets query

                const searchData = {'q': queryStringToParse.trim().replace(/[ ]/g, '%20')}; //replaces space with %20
                communicateWithSpotify('search', searchData, handleSearchResponse); //search for the songs
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
                            handleLyricsRequest({'id':item.trackID});
                            updateVisibility(!modalVisible);   //makes the modal visible and gets the lyrics
                            }}
                        updateSong = {(sound)=>{
                            updateCurrentSound(sound); //updates the current song
                        }}
                        oldSound = {currentSound}
                        showMore = {()=>{
                            showMoreFunc(item); //run show more function
                        }}
                        trackName = {item.trackName} artists = {item.artists} albumName = {item.albumName} />
                    </View>
                </TouchableWithoutFeedback>
            )
            } } />        
        </ TouchableWithoutFeedback>
      </SafeAreaView>
  )
}
