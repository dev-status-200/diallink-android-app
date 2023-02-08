import { StyleSheet, Text, View, TouchableOpacity, Image, StatusBar } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FoundationIcon from 'react-native-vector-icons/Foundation'

const Welcome = ({navigation}) => {

    const [load, setLoad] = useState(true)

    useEffect(() => {
        check()
    }, [])
    
    const check = async() =>{ 
        let token = await AsyncStorage.getItem('@vendor_id')
        console.log(token)
        if(token==null){
        }else{
            navigation.navigate("Login")
        }
    }

  return (
       <View style={styles.container}>
        <StatusBar barStyle = "dark-content" hidden = {false} backgroundColor = "#ffffff" translucent = {true}/>
        <Text style={{fontSize:35, textAlign:'center', fontWeight:'500', color:'#0b1932', opacity:0.8, marginBottom:20}}>Welcome</Text>
        <Image source={require('../../Assets/vendor.png')} style={{height:300, width:310, opacity:0.8}} />
        <Text style={{fontSize:20, textAlign:'center', fontWeight:'500', color:'#0b1932', opacity:0.8}}>To The Way Of Growth <FoundationIcon name='lightbulb' size={30} color={'silver'} /></Text>
        
        <TouchableOpacity onPress={()=>navigation.navigate("Login")} style={styles.btn}><Text style={styles.font}>Continue</Text></TouchableOpacity>
      </View>
    
  )
}
export default Welcome;

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