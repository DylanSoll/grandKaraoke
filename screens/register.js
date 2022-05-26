import { StatusBar } from 'expo-status-bar';
import { Button, SafeAreaView, StyleSheet, Text, TextInput, Touchable, View } from 'react-native';
import { styles } from '../static/styles/mainStyle';
import {Component, useState} from 'react'

export function Register({navigation}){
    return(
        <SafeAreaView style={styles.safeAreaView}>
            <Button title = "Login" onPress={()=>(navigation.navigate('Login'))}/>
        </SafeAreaView>
    )
}