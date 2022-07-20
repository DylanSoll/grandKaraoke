import {Dimensions, StyleSheet } from 'react-native';
const styleSheetConstants = {
  'backgroundColour':'#000000', 
  'primaryColour': '#3700CC',
  'successColour': '#00C208',
  'warningColour': '#FF8B04',
  'dangerColour': '#EB2C0D',
  'infoColour': '#0092FF',

  'textColour':'#fff',
  'linkColour':'#0039FF',
  
  'inputBackgroundColour':'#353535', 
}
const sSC = styleSheetConstants; //creates a shorthand version
export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: sSC.backgroundColour,
      alignItems: 'center',
      justifyContent: 'center',
      color: sSC.textColour,
    },
    keyboardAvoidingInner: {
      padding: 24,
      flex: 1,
      justifyContent: "space-around",
    },
    text: {
      color: sSC.textColour,
      fontSize: 20,
    },
    safeAreaView: {
        flex: 1,
        backgroundColor: sSC.backgroundColour,
        alignItems: 'center',
        color: sSC.textColour,
        height: '100%',
        width: '100%',
    },
    input: {
        width: Dimensions.get('window').width * .90,
        height: 35,
        backgroundColor: sSC.inputBackgroundColour,
        alignContent: 'center',
        borderRadius: 15,
        borderColor: 'grey',
        borderWidth: 1,
        color: sSC.textColour,
        padding: 5,
        fontSize: 20
    },
    pageHeading: {
      fontSize: 35,
      color: sSC.textColour,
    },
    navHeader: {
      backgroundColor: sSC.backgroundColour,
      borderBottomWidth: '0',
      elevation: 0, // remove shadow on Android
      shadowOpacity: 0, // remove shadow on iOS
    },
    label: {
        color: sSC.textColour,
        fontSize: 20,
        paddingBottom: 10,
        paddingTop: 10

    },
    button: {
      backgroundColor: sSC.primaryColour,
      padding: 5,
      paddingLeft: 10,
      paddingRight: 10,
      borderRadius: 10,
      textAlign: "center",
      alignSelf: "center",
      margin: 5
    },
    text: {color: 'white', textAlign: 'center'},
  });

