import React from 'react';
import { Text, View, StyleSheet, Image, Dimensions} from 'react-native';
import Constants from 'expo-constants';

export function SongContainer(props) {
  return (
    <View style={styles.resultContainer} >
        <View style = {styles.imageContainer}>
        <Image source={{
          uri: props.source,
        }} style={{width:64, height: 64}}/>
        </View>
        <View style = {styles.detailsContainer}>
          <Text style={styles.trackName} numberOfLines={1}>{props.trackName}</Text>
          <Text style={styles.artists} numberOfLines={1}>{props.artists}</Text>
          <Text style={styles.albumName} numberOfLines={1}>{props.albumName}</Text>
        </View>
        
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resultContainer: {
    position: "absolute",
    borderColor: 'black',
    width: '100%',
    borderWidth: 2,
    flexDirection: "row",
    
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
    width: Dimensions.get('window').width - 74, //74 is position + margin
    height: 64,
    overflow: "auto",
    left: 69,
  }
});
