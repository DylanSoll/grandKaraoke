"use strict"
import {React, useState} from 'react';

import { View, KeyboardAvoidingView, TextInput, StyleSheet, Text, Keyboard, SafeAreaView, ScrollView, FlatList, Dimensions } from 'react-native';
import { ajax_handler, create_form_data } from '../../static/js/ajaxhandler';
import {styles} from '../../static/styles/mainStyle'
import CustomButton from '../customElements/customButton';
import { SongContainer } from '../customElements/songResultContainer';
function handleSongDataResponse(data){
    const searchResults = data.results;
    const trackItems = searchResults.tracks
    let trackData = [];
    for (let i = 0; i < trackItems.length; i++){
        const track = trackItems[i];
        const trackName = track.name;
        const previewURL = track.preview_url;
        const duration = track.duration_ms;
        const artists = track.artists.map(artist => {return artist.name}).join(', ');
        const albumName = track.album.name;
        const albumImage = track.album.images[0].url;
        trackData.push(
            {'trackName': trackName, 'previewURL': previewURL, 'duration': duration, 
            'artists': artists, 'albumName':albumName, 'source': albumImage}
        );
    }
    return
}
function requestSongData(search, advancedSearch = null){

    
}
export function SearchForSongs({navigation}){
    const [songResults, updateResults] = useState([]);
    const [queryString, updateQuery] = useState('');
    const [canSearch, updateCanSearch] = useState(true)
  return(
      <SafeAreaView style={styles.safeAreaView}>
        <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
            <TextInput placeholder='Search...' onChangeText={
                (query) => {
                    updateQuery(query);
                    if (query !== ''){
                        updateCanSearch(false)
                    }else{
                        updateCanSearch(true)
                    }
                }
                } style={[styles.input, {width: Dimensions.get('window').width * .70, left: 0}]}/>
            <CustomButton label = "Search" onPress = {()=>{
                const url = 'https://dylansoll.pythonanywhere.com/get-song-from-search';
                const searchData = create_form_data({'searchString': queryString.trim(), 'advancedOptions': null});
                ajax_handler(url, updateResults, searchData);
            }} fontSize = {18}
            disabled = {canSearch}/>
        </View>

        <FlatList data={songResults} extraData={songResults} onPress={Keyboard.dismiss} style= {{flex: 1}}renderItem={({item, index}) =>{
            console.log(item)
            return (
                <View style={{width: Dimensions.get('window').width}}>
                    <SongContainer source = {item.source}
                trackName = {item.trackName} artists = {item.artists} albumName = {item.albumName} />
                </View>
                
            )
            } } />
        <CustomButton label = "click"onPress={()=>{console.log(songResults)}}/>
            
      </SafeAreaView>
      
  )
}


//<SongContainer source = {"https://i.scdn.co/image/ab67757000003b822696da150dafe289126bd1ff"}
//trackName = "Track" artists = "Artists" albumName = "Album" />
//