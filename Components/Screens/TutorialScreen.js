import { StyleSheet, Text, View, TouchableOpacity, Image, StatusBar } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FoundationIcon from 'react-native-vector-icons/Foundation';
import IonIcon from 'react-native-vector-icons/Ionicons';

const TutorialScreen = ({navigation}) => {

    const [load, setLoad] = useState(true)

    useEffect(() => {
        check()
    }, [])
    
    const check = async() => { 
        await AsyncStorage.setItem('@tutorial','done')
    }

  return (
       <View style={styles.container}>
        <StatusBar barStyle = "dark-content" hidden = {false} backgroundColor = "#ffffff" translucent = {true}/>
        <IonIcon name="information-circle-outline" size={105} color={'#4278de'} />
        <Text style={{fontSize:25, textAlign:'center', fontWeight:'500', color:'#0b1932', opacity:0.8, marginBottom:0}}>Info</Text>
        <Image source={require('../../Assets/info.png')} style={{height:300, width:310, opacity:0.8}} />
        
        <TouchableOpacity onPress={()=>navigation.navigate("Home")} style={styles.btn}><Text style={styles.font}>Continue</Text></TouchableOpacity>
      </View>
    
  )
}
export default TutorialScreen;

const styles = StyleSheet.create({
    container:{
        flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'white', padding:50
    },
    btn:{
        backgroundColor:'#4278de', paddingLeft:25, paddingRight:25, paddingTop:12, paddingBottom:12, borderRadius:25, color:'white',
        position:'absolute', bottom:50
    },
    font:{color:'white', paddingLeft:30, paddingRight:30, fontWeight:'500'}
})