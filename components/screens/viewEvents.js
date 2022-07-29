import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Keyboard, SafeAreaView, Dimensions, Modal, Linking, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { FlatList, ScrollView, TouchableHighlight, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { styles } from '../../static/styles/mainStyle'
import CustomButton from '../customElements/customButton';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import DateTimePicker from '@react-native-community/datetimepicker';
import { create_form_data, ajax_handler } from '../../static/js/ajaxhandler'
import MapView, { Marker } from 'react-native-maps';
function shortenTimeToDate(epoch_time) {
  const time = String(new Date(epoch_time * 1000)).split(' ').slice(0, 4).join(" ");
  return time
}
function shortenTimeToTime(epoch_time) {
  const time = String(new Date(epoch_time * 1000)).split(' ')[4];
  return time
}
function convertISOToEpoch(ISOString) {
  const dateObj = new Date(ISOString);
  const epochMs = dateObj.getTime();
  return Math.floor(epochMs / 1000)
}
const exampleData = {
  'startTime': 1655726334, 'endTime': 1655727514,
  'creatorUsername': 'Dylan Soll', 'location': { 'address': '72 Pickering Street, Enogerra', 'position': { 'lat': -27, 'lng': 152 } },
  'contact': 'email', 'title': 'Catchy Title'
}
var today = new Date();

function createTimeSQLString(field, inpTime) {

  const inpTimeModifier = Object.keys(inpTime).filter(key => {
    if (inpTime[key] != 'black') return true
  });

  let inpTimeStatement = ''

  if ((inpTimeModifier.length !== 0) && (inpTime.time !== 0)) {
    let symbol = '<'
    if (inpTimeModifier[0].includes('After')) {
      symbol = '>'
    } else if (inpTimeModifier[0].includes('On')) {
      symbol = '='
    }
    inpTimeStatement = ` AND ${field} ${symbol} ${inpTime.time}`
  }
  return inpTimeStatement
}

function getDegreesPerKmLong(latitude) {
  const kmsPerDegreeLong = 111.320 * Math.cos(latitude / 180)
  return 1 / kmsPerDegreeLong;
}

function findMinMaxDegrees(lat, long, numKm) {
  const degreesPerKmLat = 0.00904371732;
  const degreesPerKmLong = getDegreesPerKmLong(lat);
  const latBounds = [lat - degreesPerKmLat * numKm, lat + degreesPerKmLat * numKm];
  const longBounds = [long - degreesPerKmLong * numKm, long + degreesPerKmLong * numKm];
  return { 'lat': latBounds, 'long': longBounds }
}

function createLocationSQLString(location) {
  if (location.withinKm === -1) return ''
  let bounds = findMinMaxDegrees(location.coordinates.latitude, location.coordinates.longitude, location.withinKm);
  const lat = bounds.lat;
  const long = bounds.long;
  return ` AND latitude > ${lat[0]} and latitude < ${lat[1]} AND longitude > ${long[0]} and longitude < ${long[1]}`
}
function createUsernameSQLString(username) {
  if (username === '') return ''

  return ` AND username LIKE '%${username}%'`
}

function createAdvancedSQLQuery(advancedSettings) {
  let baseQuery = "SELECT events.*, username, email FROM events INNER JOIN users ON events.organiserID = users.userid"
  const startTimeQuery = createTimeSQLString('startTime', advancedSettings.startTime);
  const endTimeQuery = createTimeSQLString('startTime', advancedSettings.finishTime);
  const locationQuery = createLocationSQLString(advancedSettings.location);
  const usernameQuery = createUsernameSQLString(advancedSettings.username);
  const allQueries = [startTimeQuery, endTimeQuery, locationQuery, usernameQuery];
  const filteredQueries = allQueries.filter(query => query.length !== 0)
  filteredQueries.forEach(query => {
    baseQuery += query
  });
  baseQuery += 'ORDER BY startTime ASC LIMIT 15'
  return baseQuery.replace('AND ', 'WHERE ', 1)
}
function createGenericQuery(searchTerm) {
  return `SELECT events.*, username, email FROM events INNER JOIN users ON events.organiserID = users.userid WHERE (username LIKE '%${searchTerm}%' OR title LIKE '%${searchTerm}%' OR address LIKE '%${searchTerm}%' OR latitude LIKE '%${searchTerm}%' OR longitude LIKE '%${searchTerm}%') LIMIT 15`
}

function createSQLQuery(queryInp) {
  if (typeof queryInp === 'string') return createGenericQuery(queryInp);

  return createAdvancedSQLQuery(queryInp)
}
function updateAdvancedSearchStatus(advancedSearchDetails){
  const blankSettings = {status: false, startTime: {
    time: 0, before: 'black', on: 'black', after: 'black'
  }, finishTime: {
    time: 0, before: 'black', on: 'black', after: 'black'
  }, location: {
    coordinates: {
      latitude: undefined, longitude: undefined
    }, withinKm: -1
  }, username: ''}
  const result = Object.keys(blankSettings).filter(key => {
    if (key === 'status') return false

    if (key === 'location'){
      if (advancedSearchDetails.location.latitude === undefined || advancedSearchDetails.location.longitude === undefined) return false

      if (advancedSearchDetails.location.withinKm === -1) return false

      return true
      
    }
    if (['finishTime', 'startTime'].includes(key)){
      const timeResult = Object.keys(blankSettings[key]).filter(key2 => {
        if (blankSettings[key][key2] === advancedSearchDetails[key][key2]) return false
        return true
      })
      if (timeResult.length === 0) return false

      return true
    }
  })
  if (result.length === 0){
    advancedSearchDetails.status = false
  }else{
    advancedSearchDetails.status = true
  }
  return advancedSearchDetails

}
updateAdvancedSearchStatus({status: false, startTime: {time: 0, before: 'black', on: 'black', after: 'black'}, 
finishTime: {time: 0, before: 'black', on: 'black', after: 'black'},
location: {coordinates: {latitude: undefined, longitude: undefined}, withinKm: -1}, username: ''})
export function ViewEvents({ navigation }) {
  const [topEvents, updateTopEvents] = useState([]);
  const [showMoreDetail, updateShowMoreDetail] = useState(false);
  const [advancedSearchModal, updateAdvancedSearchModal] = useState(false);
  const [mapModal, updateMapModal] = useState(false);
  const [canSearch, updateCanSearch] = useState(false)
  const [mapModalData, updateMapModalData] = useState(
    {
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
      marker: { title: 'Title', description: 'Karaoke event', position: { latitude: 0, longitude: 0 } }
    }
  );
  const [advancedModalNav, updateAdvancedModal] = useState({ location: 'true', locationColour: '#525252', time: 'none', timeColour: 'black', user: 'none', userColour: 'black' })
  const [startBeforeSelectors, updateStartBeforeSelectors] = useState({ startBefore: 'black', startOn: 'black', startAfter: 'black' })
  const [finishBeforeSelectors, updateFinishBeforeSelectors] = useState({ finishBefore: 'black', finishOn: 'black', finishAfter: 'black' })

  const [inDepthEvent, updateInDepthEvent] = useState(null);
  const [query, updateQuery] = useState('');
  const [advancedSearchSettings, updateAdvancedSearchSettings] = useState({status: false, startTime: {time: 0, before: 'black', on: 'black', after: 'black'}, 
  finishTime: {time: 0, before: 'black', on: 'black', after: 'black'},
  location: {coordinates: {latitude: undefined, longitude: undefined}, withinKm: -1}, username: ''});
  const eventSearchResponse = (response) => {
    if (response.length === 0) {
      alert('No Results');
    }
    const mappedResponse = response.map(value => {
      const newObject = {
        startTime: value.startTime, 
        endTime: value.endTime, 
        creatorUsername: value.username, location: {
          address: value.address,
          position: {
            lat: value.latitude,
            lng: value.longitude
          }
        }, 
        contact: value.email, title: value.title}
      return newObject
    });
    updateTopEvents(mappedResponse);
  
}
  useEffect(()=>{
    const finalQuery = 'SELECT events.*, username, email FROM events INNER JOIN users ON events.organiserID = users.userid ORDER BY startTime ASC LIMIT 15'
    
  ajax_handler('http://dylansoll.pythonanywhere.com/search-events', eventSearchResponse, create_form_data({'query': finalQuery}));
  },[])
  return (
    <SafeAreaView style={[styles.safeAreaView, { alignSelf: 'center' }]}>
      <Modal animationType="slide" visible={advancedSearchModal} transparent={false}
        style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <View style={{ width: '100%', height: '100%', backgroundColor: 'black' }}>
          <SafeAreaView style={{
            backgroundColor: 'black', width: Dimensions.get('screen').width * 0.9, alignSelf: "center",
            borderRadius: 20, top: '15%',
            marginTop: Dimensions.get('screen').height * 0.05, borderColor: 'grey', borderWidth: 2
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <TouchableOpacity style={{
                borderColor: 'gray', borderTopLeftRadius: 15, borderBottomRightRadius: 15, borderWidth: 2, marginLeft: 10, marginTop: 7,
                backgroundColor: advancedModalNav.locationColour
              }}
                onPress={() => {
                  updateAdvancedModal({
                    location: 'true', locationColour: '#525252',
                    time: 'none', timeColour: 'black', user: 'none', userColour: 'black'
                  });
                  Keyboard.dismiss();
                }}>

                <Text style={{ color: 'white', fontSize: 20, padding: 5 }}>
                  Location
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={{
                borderColor: 'gray', borderTopLeftRadius: 15, borderBottomRightRadius: 15, borderWidth: 2, marginLeft: 2, marginTop: 7,
                backgroundColor: advancedModalNav.timeColour
              }}

                onPress={() => {
                  updateAdvancedModal({
                    location: 'none', locationColour: 'black',
                    time: 'true', timeColour: '#525252', user: 'none', userColour: 'black'
                  });
                  Keyboard.dismiss();
                }}>
                <Text style={{ color: 'white', fontSize: 20, padding: 5 }}>
                  Time
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={{
                borderColor: 'gray', borderTopLeftRadius: 15, borderBottomRightRadius: 15, borderWidth: 2, marginLeft: 2, marginTop: 7,
                backgroundColor: advancedModalNav.userColour
              }}
                onPress={() => {
                  updateAdvancedModal({
                    location: 'none', locationColour: 'black',
                    time: 'none', timeColour: 'black', user: 'true', userColour: '#525252'
                  });
                  Keyboard.dismiss();
                }}>
                <Text style={{ color: 'white', fontSize: 20, padding: 5 }}>
                  User
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ display: advancedModalNav.location }}>
              <View>
                <Text style={{ color: 'white', fontSize: 20, textAlign: 'center', padding: 5 }}>
                  Within (km)
                </Text>
                <TextInput keyboardType='numeric' onChangeText={number => {
                  let advancedSearchDetails = advancedSearchSettings;
                  
                  if (number === ''){
                    advancedSearchDetails.location.withinKm = -1
                  }else{
                    advancedSearchDetails.location.withinKm = number
                  }
                  advancedSearchDetails = updateAdvancedSearchStatus(advancedSearchDetails);
                  
                  updateAdvancedSearchSettings(advancedSearchDetails);
                }} style={[styles.input, { width: '95%', alignSelf: 'center', marginBottom: 10 }]} />
              </View>
              <Text style={{ color: 'white', fontSize: 20, textAlign: 'center', padding: 5 }}>
                Location
              </Text>
              <View style={{ height: 300 }}>
                <View style={{ height: '100%', width: '95%', alignSelf: 'center' }}>


                  <GooglePlacesAutocomplete
                    textInputProps={{
                      onFocus: () => {
                        //updateSearchHeight('60%');
                      },
                      onBlur: () => {
                        //updateSearchHeight('8%');
                        Keyboard.dismiss();
                      }
                    }}
                    placeholder="Location..."
                    minLength={2} // minimum length of text to search
                    autoFocus={false}

                    returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                    listViewDisplayed="auto" // true/false/undefined
                    fetchDetails={true}
                    renderDescription={row => row.description} // custom description render
                    onPress={(...data) => {
                      const position = data[1].geometry.location;
                      let advancedSearchDetails = advancedSearchSettings;
                      const number = true
                      if (number === ''){
                        advancedSearchDetails.location.coordinates.latitude = undefined;
                        advancedSearchDetails.location.coordinates.longitude = undefined;
                      }else{
                        advancedSearchDetails.location.coordinates.latitude = position.lat;
                        advancedSearchDetails.location.coordinates.longitude = position.lng;
                      }
                      advancedSearchDetails = updateAdvancedSearchStatus(advancedSearchDetails);
                      
                      updateAdvancedSearchSettings(advancedSearchDetails);
                    }}
                    getDefaultValue={() => { return '' }}
                    query={{ key: 'AIzaSyDaBRloUNbM3Q3smNh-2sXTKXtLJhdVVJE', language: 'en', }}
                    styles={{
                      description: { fontWeight: 'bold', }, predefinedPlacesDescription: { color: '#1faadb', },
                    }}
                    currentLocationLabel="Current location"
                    nearbyPlacesAPI="GooglePlacesSearch"

                    GooglePlacesSearchQuery={{ rankby: 'distance' }}
                    debounce={200}
                  /></View>
              </View>
            </View>


            <View style={{ display: advancedModalNav.time, maxHeight: Dimensions.get('screen').height * 0.45 }}>
              <ScrollView>


                <Text style={{ color: 'white', fontSize: 20, textAlign: 'center', margin: 5 }}>
                  Start Time
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <TouchableOpacity style={{
                    borderColor: 'gray', borderWidth: 2, borderRadius: '50%', padding: 5,
                    backgroundColor: startBeforeSelectors.startBefore
                  }}
                    onPress={() => { 
                      let advancedSearchDetails = advancedSearchSettings;
                      advancedSearchDetails.startTime.before = '#525252';
                      advancedSearchDetails.startTime.on = 'black';
                      advancedSearchDetails.startTime.after = 'black';
                      advancedSearchDetails = updateAdvancedSearchStatus(advancedSearchDetails);
                      updateAdvancedSearchSettings(advancedSearchDetails);

                      updateStartBeforeSelectors({ startBefore: '#525252', startOn: 'black', startAfter: 'black' }) 
                      }}>
                    <Text style={{ color: 'white', fontSize: 15, textAlign: 'center' }}>
                      Before
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{
                    borderColor: 'gray', borderWidth: 2, borderRadius: '50%', padding: 5,
                    backgroundColor: startBeforeSelectors.startOn
                  }}
                    onPress={() => { 
                      let advancedSearchDetails = advancedSearchSettings;
                      advancedSearchDetails.startTime.before = 'black';
                      advancedSearchDetails.startTime.on = '#525252';
                      advancedSearchDetails.startTime.after = 'black';
                      advancedSearchDetails = updateAdvancedSearchStatus(advancedSearchDetails);
                      updateAdvancedSearchSettings(advancedSearchDetails);
                      updateStartBeforeSelectors({ startBefore: 'black', startOn: '#525252', startAfter: 'black' }) 
                      }}>
                    <Text style={{ color: 'white', fontSize: 15, textAlign: 'center' }}>
                      On
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{
                    borderColor: 'gray', borderWidth: 2, borderRadius: '50%', padding: 5,
                    backgroundColor: startBeforeSelectors.startAfter
                  }}
                    onPress={() => { let advancedSearchDetails = advancedSearchSettings;
                      advancedSearchDetails.startTime.before = 'black';
                      advancedSearchDetails.startTime.on = 'black';
                      advancedSearchDetails.startTime.after = '#525252';
                      advancedSearchDetails = updateAdvancedSearchStatus(advancedSearchDetails);
                      updateAdvancedSearchSettings(advancedSearchDetails);
                      updateStartBeforeSelectors({ startBefore: 'black', startOn: 'black', startAfter: '#525252' }) 
                      }}>
                    <Text style={{ color: 'white', fontSize: 15, textAlign: 'center' }}>
                      After
                    </Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker style={{ width: '80%', marginBottom: 10, alignSelf: 'center', height: 150 }}
                  display='spinner' textColor='white'

                  mode="datetime" placeholder="Select Time"
                  value={today} minimumDate={today}
                  onChange={(event, date) => {
                    const epochStart = convertISOToEpoch(date);
                    let advancedSearchDetails = advancedSearchSettings;
                    advancedSearchDetails.startTime.time = epochStart;
                    advancedSearchDetails = updateAdvancedSearchStatus(advancedSearchDetails);
                    updateAdvancedSearchSettings(advancedSearchDetails);
                  }} />



                <Text style={{ color: 'white', fontSize: 20, textAlign: 'center', margin: 5 }}>
                  End Time
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <TouchableOpacity style={{
                    borderColor: 'gray', borderWidth: 2, borderRadius: '50%', padding: 5,
                    backgroundColor: finishBeforeSelectors.finishBefore
                  }}
                    onPress={() => { 
                      let advancedSearchDetails = advancedSearchSettings;
                      advancedSearchDetails.finishTime.before = '#525252';
                      advancedSearchDetails.finishTime.on = 'black';
                      advancedSearchDetails.finishTime.after = 'black';
                      advancedSearchDetails = updateAdvancedSearchStatus(advancedSearchDetails);
                      updateAdvancedSearchSettings(advancedSearchDetails);
                      updateFinishBeforeSelectors({ finishBefore: '#525252', finishOn: 'black', finishAfter: 'black' }); 
                      }}>
                    <Text style={{ color: 'white', fontSize: 15, textAlign: 'center' }}>
                      Before
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{
                    borderColor: 'gray', borderWidth: 2, borderRadius: '50%', padding: 5,
                    backgroundColor: finishBeforeSelectors.finishOn
                  }}
                    onPress={() => { 
                      let advancedSearchDetails = advancedSearchSettings;
                      advancedSearchDetails.finishTime.before = 'black';
                      advancedSearchDetails.finishTime.on = '#525252';
                      advancedSearchDetails.finishTime.after = 'black';
                      advancedSearchDetails = updateAdvancedSearchStatus(advancedSearchDetails);
                      updateAdvancedSearchSettings(advancedSearchDetails);
                      updateFinishBeforeSelectors({ finishBefore: 'black', finishOn: '#525252', finishAfter: 'black' });
                       }}>
                    <Text style={{ color: 'white', fontSize: 15, textAlign: 'center' }}>
                      On
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{
                    borderColor: 'gray', borderWidth: 2, borderRadius: '50%', padding: 5,
                    backgroundColor: finishBeforeSelectors.finishAfter
                  }}
                    onPress={() => { 
                      let advancedSearchDetails = advancedSearchSettings;
                      advancedSearchDetails.finishTime.before = 'black';
                      advancedSearchDetails.finishTime.on = 'black';
                      advancedSearchDetails.finishTime.after = '#525252';
                      advancedSearchDetails = updateAdvancedSearchStatus(advancedSearchDetails);
                      updateAdvancedSearchSettings(advancedSearchDetails);
                      updateFinishBeforeSelectors({ finishBefore: 'black', finishOn: 'black', finishAfter: '#525252' }); 
                      }}>
                    <Text style={{ color: 'white', fontSize: 15, textAlign: 'center' }}>
                      After
                    </Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker style={{ width: '80%', marginBottom: 10, alignSelf: 'center', height: 150 }}
                  display='spinner' textColor='white'

                  mode="datetime" placeholder="Select Time"
                  value={today} minimumDate={today}
                  onChange={(event, date) => {
                    const epochFinish = convertISOToEpoch(date);
                    let advancedSearchDetails = advancedSearchSettings;
                    advancedSearchDetails.finishTime.time = epochFinish;
                    advancedSearchDetails = updateAdvancedSearchStatus(advancedSearchDetails);
                    updateAdvancedSearchSettings(advancedSearchDetails);
                  }} />
              </ScrollView>
            </View>



            <View style={{ display: advancedModalNav.user }}>
              <Text style={{ color: 'white', fontSize: 20, textAlign: 'center', margin: 5 }}>
                Created By
              </Text>
              <TextInput keyboardType='numeric' onChangeText={text => {
                let advancedSearchDetails = advancedSearchSettings;
                advancedSearchDetails.username = text;
                advancedSearchDetails = updateAdvancedSearchStatus(advancedSearchDetails);
                updateAdvancedSearchSettings(advancedSearchDetails);
              }} style={[styles.input, { width: '95%', alignSelf: 'center', marginBottom: 10 }]} />
            </View>
            <View style = {{flexDirection: 'row', justifyContent: 'center'}}>
              <TouchableOpacity style = {[styles.button, {backgroundColor: '#ff521f'}]} onPress={()=>{
                updateAdvancedSearchSettings({status: false, startTime: {time: 0, before: 'black', on: 'black', after: 'black'}, 
                finishTime: {time: 0, before: 'black', on: 'black', after: 'black'},
                location: {coordinates: {latitude: undefined, longitude: undefined}, withinKm: -1}, username: ''})
                
                }}>
                <Text style = {{fontSize: 20, color: 'white', textAlign: 'center'}}>
                  Reset All
                </Text>
              </TouchableOpacity>
              <CustomButton onPress={() => { updateAdvancedSearchModal(false) }} label={'Close'} fontSize={20} />
            </View>
            
            
          </SafeAreaView>
        </View>
      </Modal>
      <Modal animationType="slide" visible={showMoreDetail} transparent={false}
        style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>

        <View style={{ width: '100%', height: '100%', backgroundColor: 'black' }}>
          <SafeAreaView style={{
            backgroundColor: 'black', width: Dimensions.get('screen').width * 0.9, alignSelf: "center",
            borderRadius: 20, top: '25%',
            marginTop: Dimensions.get('screen').height * 0.05, borderColor: 'grey', borderWidth: 2,
          }}>
            <Text style={{ color: 'white', textAlign: 'center', fontSize: 30, paddingBottom: 5, paddingTop: 10 }}>
              {inDepthEvent?.title}
            </Text>
            <Text style={{ color: 'white', textAlign: 'center', fontSize: 25, paddingBottom: 5 }}>
              Created by '{inDepthEvent?.creatorUsername}''
            </Text>
            <Text style={{ color: 'white', textAlign: 'center', fontSize: 19, paddingBottom: 5 }}>
              Starting on {shortenTimeToDate(inDepthEvent?.startTime)} at {shortenTimeToTime(inDepthEvent?.startTime)}
            </Text>
            <Text style={{ color: 'white', textAlign: 'center', fontSize: 19, paddingBottom: 5 }}>
              Finishes on {shortenTimeToDate(inDepthEvent?.endTime)} at {shortenTimeToTime(inDepthEvent?.endTime)}
            </Text>
            <TouchableOpacity onPress={() => {
              let tempMapData = mapModalData;
              if (inDepthEvent?.location?.position?.lat === undefined) {
                tempMapData.region.latitude = 0;
                tempMapData.marker.position.latitude = 0;
              } else {
                tempMapData.region.latitude = inDepthEvent?.location?.position?.lat;
                tempMapData.marker.position.latitude = inDepthEvent?.location?.position?.lat;
              }

              if (inDepthEvent?.location?.position?.lng === undefined) {
                tempMapData.region.longitude = 0;
                tempMapData.marker.position.longitude = 0;
              } else {
                tempMapData.region.longitude = inDepthEvent?.location?.position?.lng;
                tempMapData.marker.position.longitude = inDepthEvent?.location?.position?.lng;
              }
              tempMapData.marker.title = inDepthEvent?.title
              tempMapData.marker.description = inDepthEvent?.location?.address;
              updateMapModalData(tempMapData)
              updateMapModal(true);
              updateShowMoreDetail(false);
            }}>
              <Text style={{ color: '#006ae3', textAlign: 'center', fontSize: 19, paddingBottom: 5 }}>
                Located at {`${inDepthEvent?.location?.address} \n${inDepthEvent?.location?.position?.lat}, ${inDepthEvent?.location?.position?.lng}`}
              </Text>
            </TouchableOpacity>


            <TouchableHighlight onPress={() => { Linking.openURL(`mailto:${inDepthEvent?.contact}`) }}>
              <Text style={{ color: '#006ae3', fontSize: 19, textAlign: 'center' }}>
                {inDepthEvent?.contact}
              </Text>
            </TouchableHighlight>
            <CustomButton onPress={() => { updateShowMoreDetail(false) }} label={'Dismiss'} fontSize={20} />
            <Text style={{ fontSize: 5 }}>{"\n"}</Text>
          </SafeAreaView>
        </View>

      </Modal>
      <Modal animationType="slide" visible={mapModal} transparent={false}
        style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>

        <View style={{ width: '100%', height: '100%', backgroundColor: 'black' }}>
          <SafeAreaView style={{
            backgroundColor: 'black', width: Dimensions.get('screen').width * 0.9, alignSelf: "center",
            borderRadius: 20, top: '25%',
            marginTop: Dimensions.get('screen').height * 0.05, borderColor: 'grey', borderWidth: 2,
          }}>
            <MapView
              style={{ width: '90%', height: 300, alignSelf: 'center', marginVertical: 15, borderRadius: 20 }}
              region={{
                latitude: mapModalData.region.latitude, longitude: mapModalData.region.longitude,
                latitudeDelta: mapModalData.region.latitudeDelta, longitudeDelta: mapModalData.region.longitudeDelta
              }}>
              <Marker coordinate={{
                latitude: mapModalData.marker.position.latitude,
                longitude: mapModalData.marker.position.longitude
              }}
                pinColor='violet'
                title={mapModalData.marker.title} description={mapModalData.marker.description}
                tappable={true}
                onPress={e => {
                  console.log(e.nativeEvent)
                }}
              />
            </MapView>
            <CustomButton onPress={() => {
              updateMapModal(false);
              updateShowMoreDetail(true);
            }} label={'Dismiss'} fontSize={20} />
            <Text style={{ fontSize: 5 }}>{"\n"}</Text>
          </SafeAreaView>
        </View>

      </Modal>

      <View style={{ flexDirection: 'row', marginBottom: 5 }}>
        <TextInput style={{ width: Dimensions.get('screen').width * .75, backgroundColor: 'white', borderRadius: 12 }} placeholder="Search..." onChangeText={text=>{
          updateQuery(text);
          if (text ===''){
            updateCanSearch(true);
          }else{
            updateCanSearch(false);
          }
          let advancedSearchDetails = advancedSearchSettings;
          advancedSearchDetails.status = false;
          updateAdvancedSearchSettings(advancedSearchDetails);
        }}/>
        <TouchableOpacity style={{ backgroundColor: 'blue', padding: 8, borderRadius: 10 }} onPress = {()=>{
          let finalQuery = 'SELECT events.*, username, email FROM events INNER JOIN users ON events.organiserID = users.userid ORDER BY startTime ASC LIMIT 15'
          if (advancedSearchSettings.status === false){
            finalQuery = createSQLQuery(query);
          }else{
            finalQuery = createSQLQuery(advancedSearchSettings);
          }
          
          ajax_handler('http://dylansoll.pythonanywhere.com/search-events', eventSearchResponse, create_form_data({'query': finalQuery}));
      }
        
        } disabled = {canSearch}>
          <Text style={{ color: 'white', fontSize: 20 }}>
            Search
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={{ marginBottom: 10 }} onPress={() => { updateAdvancedSearchModal(true) }}>
        <Text style={{ color: '#006ae3', fontSize: 20 }}>
          Advanced Search
        </Text>
      </TouchableOpacity>
      <FlatList data={topEvents} extraData={topEvents} renderItem={
        ({ item, index }) => {
          return (
            <TouchableOpacity onPress={() => {
              updateInDepthEvent(item);
              updateShowMoreDetail(true);
            }}>
              <View style={{
                width: Dimensions.get('screen').width * 0.8,
                borderRadius: 15,
                borderColor: 'grey',
                borderWidth: 2,
                padding: 8,
                margin: 5
              }}>
                <Text style={{ color: 'white', fontSize: 25, textAlign: 'center', paddingBottom: 5 }}>{item.title}</Text>
                <Text style={{ color: 'white', fontSize: 22, textAlign: 'center', paddingBottom: 5 }}>By: {item.creatorUsername}</Text>
                <Text style={{ color: 'white', fontSize: 18, paddingBottom: 5 }}>{'Date >>> '} {shortenTimeToDate(item.startTime)} -- {shortenTimeToDate(item.endTime)}</Text>
                <Text style={{ color: 'white', fontSize: 18, paddingBottom: 5 }}>{'Time >>> '} {shortenTimeToTime(item.startTime)} -- {shortenTimeToTime(item.endTime)}</Text>
                <Text style={{ color: 'white', fontSize: 18, paddingBottom: 5 }}>{item?.location?.address}</Text>
              </View>
            </TouchableOpacity>


          )
        }
      } />
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