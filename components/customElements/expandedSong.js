import { Text, Image, Linking } from "react-native"
import { ScrollView, TouchableHighlight } from "react-native-gesture-handler"
import { styles } from "../../static/styles/mainStyle"
export function ExpandedSong(props){
    return (
        <ScrollView>
            <TouchableHighlight onPress={()=>{Linking.openURL(props.trackURL)}}>
                <Text style={[styles.text, {fontSize: 28, marginBottom: 5, marginTop: 5}]}>{props.trackName}</Text>
            </TouchableHighlight>

            <Text style={[styles.text, {fontSize: 23, marginBottom: 5, marginTop: 5}]}>By {props.artists}</Text>
            
            <TouchableHighlight onPress={()=>{Linking.openURL(props.albumURL)}}>
                <Text style={[styles.text, {fontSize: 23, marginBottom: 5, marginTop: 5}]}>{props.albumName}</Text>
            </TouchableHighlight>
            
            <TouchableHighlight onPress={()=>{Linking.openURL(props.imageURI)}}>
                <Image source={{uri: props.imageURI}} style={{width:192, height: 192, alignSelf: 'center'}}/>

            </TouchableHighlight>
        </ScrollView>
    )
}