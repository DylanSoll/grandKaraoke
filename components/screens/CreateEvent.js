import React from 'react';
import { View, KeyboardAvoidingView, TextInput, StyleSheet, Text, Platform, Button, Keyboard, SafeAreaView, ScrollView } from 'react-native';
import {styles} from '../../static/styles/mainStyle'
import CustomButton from '../customElements/customButton';
export function CreateEvent({navigation}){
  return(
      <SafeAreaView style={styles.safeAreaView} onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView>
          <ScrollView>
            <View style={styles.keyboardAvoidingInner}>
              <View style={{alignSelf: 'center'}}>
                <Text style={styles.label}>Event Name</Text>
              </View>

              <DatePicker
            style={styles.datePickerStyle}
            date={date}
            mode="date"
            placeholder="select date"
            format="DD-MM-YYYY"
            minDate="01-01-2016"
            maxDate="01-01-20900"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                //display: 'none',
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0,
              },
              dateInput: {
                marginLeft: 36,
              },
            }}
          />              
              <CustomButton label = {"Create Event"} onPress={()=>{console.log('create')}} disabled = {true} fontSize={20}/>
              <CustomButton label = {"Clear"} onPress={()=>{console.log('Clear')}}/>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

      </SafeAreaView>
      
  )
}


