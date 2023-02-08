import { StyleSheet, Text, View, TouchableOpacity, StatusBar  } from 'react-native';
import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/Ionicons'

const Header = ({openDrawer, navigation}) => {
  return (
    <>
    <StatusBar barStyle = "dark-content" hidden = {false} backgroundColor = "#eceff8" translucent = {true}/>
      <View style={styles.headerTop}>
        <View style={styles.header}>
        <TouchableOpacity style={styles.icon} onPress={()=>openDrawer()}>
          <Icon name="reorder-three-outline" size={40} color="#1e5ca9" />
        </TouchableOpacity>
        <Text style={
          { marginRight:'auto', marginLeft:'auto', fontFamily:'Inter-Bold', color:'#1e5ca9', fontSize:20, paddingTop:24, fontWeight:'700' }
        }>
          Dashboard
        </Text>
        <TouchableOpacity style={[styles.icon, {marginTop:20, opacity:0.7}]} onPress={()=>navigation.navigate('Invoices')}>
          <Icon name="notifications-outline" size={30} color="#1e5ca9" />
        </TouchableOpacity>
        {/* <View style={{marginLeft:'auto', width:45, marginRight:20}}>
          <MaterialIcons name='clipboard-list-outline' size={10} color="red" />
        </View> */}
      </View>
        <Text style={{textAlign:'center', marginTop:0, marginBottom:12, lineHeight:14}}>Calls Status</Text>
      </View>
      </>
  )
}

export default Header

const styles = StyleSheet.create({
    header:{
      padding:0,
      flexDirection:'row',
    },
    icon:{
      marginRight:'auto',  marginTop:15, marginLeft:20,
      borderRadius:10, paddingLeft:3, paddingRight:3
    },
    headerTop:{
    backgroundColor:'#eceff8',
    paddingBottom:0,
    paddingTop:20,
    borderBottomLeftRadius:20,
    borderBottomRightRadius:20
    }
})