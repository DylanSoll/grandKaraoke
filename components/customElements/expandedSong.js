import { Text, Image, Linking, TouchableOpacity } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { styles } from "../../static/styles/mainStyle"
export function ExpandedSong(props){
    return (
        <ScrollView /*Allows the user to scroll on the page*/> 
            <TouchableOpacity onPress={()=>{Linking.openURL(props.trackURL)}} /*Linking.openURL use to open links in the browser*/>
                <Text style={[styles.text, {fontSize: 28, marginBottom: 5, marginTop: 5, color: '#03adfc'}]}>{props.trackName}</Text>
            </TouchableOpacity>

            <Text style={[styles.text, {fontSize: 23, marginBottom: 5, marginTop: 5, color: '#03adfc'}]}>By {props.artists}</Text>
            
            <TouchableOpacity onPress={()=>{Linking.openURL(props.albumURL)}}>
                <Text style={[styles.text, {fontSize: 23, marginBottom: 5, marginTop: 5, color: '#03adfc'}]}>{props.albumName}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={()=>{Linking.openURL(props.imageURI)}} /*The image will open it in google*/>
                <Image source={{uri: props.imageURI}} style={{width:192, height: 192, alignSelf: 'center'}}/>

            </TouchableOpacity>
        </ScrollView>
    )
}