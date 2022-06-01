import { StatusBar } from 'expo-status-bar';
import { Button, SafeAreaView, StyleSheet, Text, TextInput, View, FlatList } from 'react-native';
import { styles } from '../../static/styles/mainStyle';
import { SongContainer } from '../customElements/songResultContainer';

export function Homepage({navigation}){

    return(
      <SafeAreaView style={styles.safeAreaView}>
        <FlatList data = {[{'uri': "https://i.scdn.co/image/ab67616d00004851fa258529452f4ed34cc961b1",
        'trackName': 'Track', 'albumName': 'Album', 'artists': 'Artists'
      }]} renderItem={({item})=> <SongContainer source = {item.uri} trackName = {item.trackName} albumName = {item.albumName} artists = {item.artists}/>}/>
        
      </SafeAreaView>
    )
  }