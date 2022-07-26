import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, Keyboard, SafeAreaView, Dimensions, Modal, Linking, TouchableOpacity, KeyboardAvoidingView} from 'react-native';
import { FlatList, ScrollView, TouchableHighlight, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import {styles} from '../../static/styles/mainStyle'
import CustomButton from '../customElements/customButton';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import DateTimePicker from '@react-native-community/datetimepicker';
import {create_form_data, ajax_handler} from '../../static/js/ajaxhandler'
import MapView, { Marker } from 'react-native-maps';
function shortenTimeToDate(epoch_time){
  const time = String(new Date(epoch_time*1000)).split(' ').slice(0,4).join(" ");
  return time
}
function shortenTimeToTime(epoch_time){
  const time = String(new Date(epoch_time*1000)).split(' ')[4];
  return time
}
function convertISOToEpoch(ISOString){
  const dateObj = new Date(ISOString);
  const epochMs = dateObj.getTime();
  return Math.floor(epochMs/1000)
}
const exampleData = {
  'startTime': 1655726334, 'endTime': 1655727514,
  'createrUsername': 'Dylan Soll', 'location': {'address': '72 Pickering Street, Enogerra', 'position': {'lat': -27, 'lng': 152}},
  'contact': 'email', 'title': 'Catchy Title'
}
var today = new Date();
export function ViewEvents({navigation}){
  const [topEvents, updateTopEvents] = useState([exampleData]);
  const [showMoreDetail, updateShowMoreDetail] = useState(false);
  const [mapModal, updateMapModal] = useState(false);
  const [mapModalData, updateMapModalData] = useState(
    {region: {latitude: 0,
      longitude: 0,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421},
    marker: {title: 'Title', description: 'Karaoke event', position: {latitude: 0, longitude: 0}}
  }
    );
  const [inDepthEvent, updateInDepthEvent] = useState(null);
  return(
      <SafeAreaView style={[styles.safeAreaView, {alignSelf: 'center'}]}>
        <Modal animationType="slide" visible={showMoreDetail} transparent={false}
          style={{justifyContent: 'center', alignItems: 'center', flex:1}}>

          <View style={{width:'100%', height: '100%', backgroundColor:'black'}}>
            <SafeAreaView style={{ 
                  backgroundColor: 'black', width: Dimensions.get('screen').width * 0.9, alignSelf: "center", 
                  borderRadius: 20, top: '25%', 
                  marginTop: Dimensions.get('screen').height * 0.05, borderColor: 'grey', borderWidth: 2,
                  }}>
              <Text style={{color: 'white', textAlign: 'center', fontSize: 30, paddingBottom: 5, paddingTop: 10}}>
                {inDepthEvent?.title}
              </Text>
              <Text style={{color: 'white', textAlign: 'center', fontSize: 25, paddingBottom: 5}}>
                Created by {inDepthEvent?.createrUsername}
              </Text>
              <Text style={{color: 'white', textAlign: 'center', fontSize: 19, paddingBottom: 5}}>
                Starting on {shortenTimeToDate(inDepthEvent?.startTime)} at {shortenTimeToTime(inDepthEvent?.startTime)}
              </Text>
              <Text style={{color: 'white', textAlign: 'center', fontSize: 19, paddingBottom: 5}}>
                Finishes on {shortenTimeToDate(inDepthEvent?.endTime)} at {shortenTimeToTime(inDepthEvent?.endTime)}
              </Text>
              <TouchableOpacity onPress={()=>{
                let tempMapData = mapModalData;
                if (inDepthEvent?.location?.position?.lat === undefined){
                  tempMapData.region.latitude = 0;
                  tempMapData.marker.position.latitude = 0;
                }else{
                  tempMapData.region.latitude = inDepthEvent?.location?.position?.lat;
                  tempMapData.marker.position.latitude = inDepthEvent?.location?.position?.lat;
                }
                
                if (inDepthEvent?.location?.position?.lng === undefined){
                  tempMapData.region.longitude = 0;
                  tempMapData.marker.position.longitude = 0;
                }else{
                  tempMapData.region.longitude = inDepthEvent?.location?.position?.lng;
                  tempMapData.marker.position.longitude = inDepthEvent?.location?.position?.lng;
                }
                tempMapData.marker.title = inDepthEvent?.title
                tempMapData.marker.description = inDepthEvent?.location?.address;
                console.log(tempMapData)
                updateMapModalData(tempMapData)
                updateMapModal(true);
                updateShowMoreDetail(false);
              }}>
                <Text style={{color: '#006ae3', textAlign: 'center', fontSize: 19, paddingBottom: 5}}>
                  Located at {`${inDepthEvent?.location?.address} \n${inDepthEvent?.location?.position?.lat}, ${inDepthEvent?.location?.position?.lng}`}
                </Text>
              </TouchableOpacity>
              

              <TouchableHighlight onPress={()=>{Linking.openURL(`mailto:${inDepthEvent?.contact}`)}}>
                <Text style={{color: '#006ae3', fontSize: 19, textAlign: 'center'}}>
                  {inDepthEvent?.contact}
                </Text>
              </TouchableHighlight>
              <CustomButton onPress = {()=>{updateShowMoreDetail(false)}} label = {'Dismiss'} fontSize = {20}/>
              <Text style={{fontSize: 5}}>{"\n"}</Text>
            </SafeAreaView>
          </View>

        </Modal>
        <Modal animationType="slide" visible={mapModal} transparent={false}
          style={{justifyContent: 'center', alignItems: 'center', flex:1}}>

          <View style={{width:'100%', height: '100%', backgroundColor:'black'}}>
            <SafeAreaView style={{ 
                  backgroundColor: 'black', width: Dimensions.get('screen').width * 0.9, alignSelf: "center", 
                  borderRadius: 20, top: '25%', 
                  marginTop: Dimensions.get('screen').height * 0.05, borderColor: 'grey', borderWidth: 2,
                  }}>
              <MapView 
              style = {{width: '90%', height: 300, alignSelf: 'center', marginVertical: 15, borderRadius: 20}} 
              region = {{latitude: mapModalData.region.latitude, longitude: mapModalData.region.longitude, 
              latitudeDelta: mapModalData.region.latitudeDelta, longitudeDelta: mapModalData.region.longitudeDelta}}>
                <Marker coordinate = {{
                  latitude: mapModalData.marker.position.latitude, 
                  longitude: mapModalData.marker.position.longitude
                }}
                pinColor = 'violet'
                title= {mapModalData.marker.title} description = {mapModalData.marker.description}
                tappable = {true}
                onPress = {e=>{
                  console.log(e.nativeEvent)
                }}
                />
              </MapView>
              <CustomButton onPress = {()=>{
                updateMapModal(false);
                updateShowMoreDetail(true);
                }} label = {'Dismiss'} fontSize = {20}/>
              <Text style={{fontSize: 5}}>{"\n"}</Text>
            </SafeAreaView>
          </View>

        </Modal>
        
        <View style={{flexDirection: 'row', marginBottom: 5}}>
            <TextInput style = {{width: Dimensions.get('screen').width*.75, backgroundColor: 'white', borderRadius: 12}} placeholder = "Text..."/>
            <TouchableOpacity style= {{backgroundColor: 'blue', padding: 8, borderRadius: 10}}>
                <Text style={{color:'white', fontSize: 20}}>
                    Search
                </Text>
            </TouchableOpacity>
        </View>
        <TouchableOpacity style = {{marginBottom: 10}}>
            <Text style={{color: '#006ae3', fontSize: 20}}>
                Advanced Search
            </Text>
        </TouchableOpacity>
        <FlatList data={topEvents} extraData={topEvents} renderItem = {
          ({item, index}) => {
            return (
              <TouchableOpacity onPress={()=>{
                updateInDepthEvent(item);
                updateShowMoreDetail(true);
              }}>
                <View style={{
                  width: Dimensions.get('screen').width * 0.8,
                  borderRadius: 15,
                  borderColor: 'grey',
                  borderWidth: 2,
                  padding: 8
                }}>
                  <Text style={{color: 'white', fontSize: 25, textAlign: 'center', paddingBottom: 5}}>{item.title}</Text>
                  <Text style={{color: 'white', fontSize: 22, textAlign: 'center', paddingBottom: 5}}>{item.createrUsername}</Text>
                  <Text style={{color: 'white', fontSize: 18, paddingBottom: 5}}>{'Date >>> '} {shortenTimeToDate(item.startTime)} -- {shortenTimeToDate(item.endTime)}</Text>
                  <Text style={{color: 'white', fontSize: 18, paddingBottom: 5}}>{'Time >>> '} {shortenTimeToTime(item.startTime)} -- {shortenTimeToTime(item.endTime)}</Text>
                  <Text style={{color: 'white', fontSize: 18, paddingBottom: 5}}>{item?.location?.address}</Text>
                </View>
              </TouchableOpacity>
              
              
            )
          }
        }/>
      </SafeAreaView>
      
  )
}


/*
const degreesPerKmLat = 0.00904371732;
function getDegreesPerKmLong(latitude){
	const kmsPerDegreeLong = 111.320 * Math.cos(latitude/180)
	return 1 / kmsPerDegreeLong;
}
function findMinMaxDegrees(lat, long, numKm){
	const degreesPerKmLong = getDegreesPerKmLong(lat);
  const latBounds = [lat - degreesPerKmLat * numKm, lat + degreesPerKmLat * numKm];
  const longBounds = [long - degreesPerKmLong * numKm, long + degreesPerKmLong * numKm];
  return {'lat':latBounds, 'long': longBounds}
}
function createQuery(boundsObj){
  const lat = boundsObj.lat;
  const long = boundsObj.long;
  const currentTimeMs = new Date().getTime();
  const currentTime = Math.floor(currentTimeMs/1000);
  const query = `SELECT * FROM events
WHERE latitude > ${lat[0]} and latitude < ${lat[1]}
AND longitude > ${long[0]} and longitude < ${long[1]}
AND startTime > ${currentTime}
ORDER BY startTime ASC`;
  return query
}

*/