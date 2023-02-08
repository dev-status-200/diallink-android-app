import React, { useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, StatusBar } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign';

const SubHeader = ({navigation, title}) => {

  useEffect(() => {
    //console.log(navigation.getState().routes[1].name)
  }, [])

  return (
    <>
    <StatusBar barStyle = "dark-content" hidden = {false} backgroundColor = "#eceff8" translucent = {true}/>
    <View style={{backgroundColor:'#eceff8', flexDirection:'row', paddingTop:40, paddingBottom:18}}>
      <TouchableOpacity style={{marginRight:'auto'}} onPress={()=>navigation.navigate('Home')}>
        <AntDesign name="arrowleft" size={30} color="#1e5ca9" style={{marginLeft:20}} />
      </TouchableOpacity>
        {/* <Text style={{
          marginRight:'auto', marginLeft:'auto', fontFamily:'Inter-Bold', color:'#1e5ca9', fontWeight:'bold',
          fontSize:18, marginTop:0
          }}>Back To {navigation.getState().routes[1].name} Page</Text> */}
        <Text style={{
          marginRight:'auto', marginLeft:'auto', fontFamily:'Inter-Bold', color:'#1e5ca9', fontWeight:'bold',
          fontSize:18, marginTop:6
          }}>{title}</Text>
        <View style={{marginLeft:'auto', width:45}}></View>
    </View>
    </>
  )
}
export default SubHeader