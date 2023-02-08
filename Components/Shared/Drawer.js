import React from 'react';
import { StyleSheet, Text, View, Animated, TouchableOpacity } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import MenuIcon from 'react-native-vector-icons/SimpleLineIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OneSignal from 'react-native-onesignal';

const Drawer = ({translation, name, navigation}) => {
  return (
    <>
    <Animated.View style={{ position:'absolute',zIndex:1,height:'100%', width:'80%', transform:[{translateX:translation}], left:-400, backgroundColor:'white' }}>
        <View style={{backgroundColor:'#4278de'}}> 
            <View style={{paddingLeft:15, paddingTop:140, paddingRight:50}}>
                <Text style={{ color:'white',fontSize:20, fontFamily:'Inter-Black', fontWeight:'bold' }}>
                    {name}
                </Text>
            </View>
            <View style={{marginTop:10, borderBottomColor: 'white', borderBottomWidth: 1 }} />
        </View>
        <View style={{marginTop:30, paddingLeft:20, backgroundColor:'white'}}>
        <TouchableOpacity onPress={async()=>{
            await AsyncStorage.removeItem('@vendor_id')
            await AsyncStorage.removeItem('@token')
            await AsyncStorage.removeItem('@username');
            await AsyncStorage.removeItem('@device_id');
            await AsyncStorage.removeItem('@tutorial');
            navigation.navigate('Login');
        }} 
            style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom:15}}>
            <MenuIcon  name="logout" style={styles.menuIconSettings} />
            <Text style={styles.menuFonts}>Logout</Text>
        </TouchableOpacity>

        </View>
    </Animated.View>
    </>
  )
}

export default Drawer

const styles = StyleSheet.create({
    menuFonts:{
        color:'grey',
        fontSize:16,
        marginTop:9,
        fontFamily:'Inter-Medium'
    },
    menuIconSettings:{
        marginTop:7,
        marginRight:20,
        fontSize:25,
        color:'#4278de'
    },
})