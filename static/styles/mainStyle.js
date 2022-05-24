import {StyleSheet } from 'react-native';
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
    text: {
      color: sSC.textColour,
      fontSize: '20pt',
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
        width: '90%',
        height: '5%',
        backgroundColor: sSC.inputBackgroundColour,
        alignContent: 'center',
        borderRadius: '10vh',
        borderColor: 'grey',
        borderWidth: '1vh',
        color: sSC.textColour,
    },
    pageHeading: {
      fontSize: '35pt',
      color: sSC.textColour,
      justifyContent: 'start',
    },
    buttonPrimary: {
      backgroundColor: sSC.primaryColour,
      color: sSC.textColour,
    }

  });

