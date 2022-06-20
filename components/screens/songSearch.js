"use strict"
import {React, useState} from 'react';

import { View,TextInput, StyleSheet, Text, Keyboard, SafeAreaView, FlatList, Dimensions, Modal } from 'react-native';
import { ajax_handler, create_form_data, communicateWithSpotify } from '../../static/js/ajaxhandler';

import {styles} from '../../static/styles/mainStyle'
import CustomButton from '../customElements/customButton';
import { SongContainer } from '../customElements/songResultContainer';
import { LyricsModal } from '../customElements/lyricsModal';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

function simplifySearchResponse(data){
    const trackItems = data.tracks.items;
    let trackData = [];
    for (let i = 0; i < trackItems.length; i++){
        const track = trackItems[i].data;
        const trackName = track.name;
        const trackID = track.id
        const previewURL = track.preview_url;
        const duration = track.duration_ms;
        let artistLists = track.artists.items.map(data => {
            return data.name;
        });
        const artists = artistLists.join(', ')
        const albumName = track.albumOfTrack.name;
        const albumImage = track.albumOfTrack.coverArt.sources[0].url
        trackData.push(
            {'trackName': trackName, 'previewURL': previewURL, 'duration': duration,
            'artists': artists, 'albumName':albumName, 'source': albumImage, 'trackID': trackID}
        );
    }
    return trackData
}

export function SearchForSongs({navigation}){
    const [songResults, updateResults] = useState([]);
    const [queryString, updateQuery] = useState('');
    const [canSearch, updateCanSearch] = useState(true);
    const [lyricData, updateLyricsData] = useState(null)
    const [prevOpened, updatePrevOpened] = useState(null)
    const [modalVisible, updateVisibility] = useState(false)
    const handleSearchResponse = data => {
        updateResults(simplifySearchResponse(data));
    };
    if (lyricData !== null) console.log(lyricData)
    const handleLyricsReturn = (lyricDataInp) => {
        const lyrics = lyricDataInp.lyrics;
        const lines = lyrics.lines.map(data=>{
            return {'words':data.words}
        })
        updateLyricsData(lines)
    }
    const handleLyricsRequest = (trackID) => {
        communicateWithSpotify('track_lyrics', trackID, handleLyricsReturn);
    }
  return(
      <SafeAreaView style={styles.safeAreaView} onPress={()=>{console.log('intercept')}}>
        <Modal animationType="slide"
        visible={modalVisible}
        
        transparent={true}
        style={{justifyContent: 'center', //Centered vertically
        alignItems: 'center', // Centered horizontally
        flex:1}}
>
        <View style={{ backgroundColor: 'black', width: '90%', alignSelf: "center", height:'90%', borderRadius: 20, padding: 10, marginTop: '5%'}}>
          
          <FlatList data = {lyricData} extraData = {lyricData}
            renderItem={({item})=>{
                    return (
                        <Text onPress={()=> {
                            Speech.speak(item.words)
                        }}
                        style={{color: 'white', fontSize: 20}}>
                            {item.words}
                        </Text>
                    )
                }
          }/>
          <CustomButton onPress = {()=>{updateVisibility(!modalVisible)}} style={{fontSize: 20, width: '100%'}} label = {'Dismiss'}/>
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
                let queryStringToParse = queryString.trim().toLowerCase()
                let spaces = queryStringToParse.match(/[ ]/gmi)
                let numSpaces = 0
                if (spaces !== null) {
                    numSpaces = spaces.length
                }
                const searchData = {'q': queryStringToParse.trim().replace(/[ ]/g, '%20')};
                communicateWithSpotify('search', searchData, handleSearchResponse);
            }} fontSize = {18}
            disabled = {canSearch}/>
        </View>
        <TouchableWithoutFeedback onPress={()=>{
            Keyboard.dismiss()
            console.log('hitting here')
            }}>
        <FlatList data={songResults} extraData={songResults} style= {{flex: 1}}renderItem={({item, index}) =>{
            return (
                <TouchableWithoutFeedback onPress = {()=>{
                    handleLyricsRequest({'id':item.trackID});
                    updateVisibility(!modalVisible);
                    }}>
                    <View style={{width: Dimensions.get('window').width}} >
                        <SongContainer source = {item.source} previewURL = {item.previewURL} 
                        trackName = {item.trackName} artists = {item.artists} albumName = {item.albumName} />
                    </View>
                </TouchableWithoutFeedback>
                
                
            )
            } } />        
        </ TouchableWithoutFeedback>
      </SafeAreaView>
      
  )
}


//<SongContainer source = {"https://i.scdn.co/image/ab67757000003b822696da150dafe289126bd1ff"}
//trackName = "Track" artists = "Artists" albumName = "Album" />
//