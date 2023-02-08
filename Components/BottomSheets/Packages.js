import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, Button, TouchableHighlight } from 'react-native';
import React, { useState } from 'react';
import RazorpayCheckout from 'react-native-razorpay';
import axios from 'axios';
import API from '../apis.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Packages = ({setSheetIndex}) => {

    const [vendorPackage, setVendorPackage] = useState(1);

  return (
    <ImageBackground source={require('../../Assets/bg.jpg')} style={styles.container}>
        <Text style={{fontSize:35, color:'white', marginBottom:10}}>Choose Your Plan</Text>
        <TouchableOpacity 
            style={[styles.pkgBox, vendorPackage==1?styles.selected:null]} onPress={()=>setVendorPackage(1)}
        >
            <View style={{flexDirection:'row', marginBottom:7}}>
                <View style={styles.silver}></View><Text style={{fontSize:22, color:'black'}}>Basic</Text>
            </View>
            <View style={{flexDirection:'row'}}>
                <View style={styles.point}></View><Text style={{fontSize:16}}>Unlimited Calls !</Text>
            </View>
            <View style={{flexDirection:'row'}}>
                <View style={styles.point}></View><Text style={{fontSize:16}}>Commission Fee on Each Call</Text>
            </View>
            <View style={{flexDirection:'row'}}>
                <View style={styles.point}></View><Text style={{fontSize:16}}>Rs.1020 {"("}Upgradable Anytime{")"}</Text>
            </View>
        </TouchableOpacity>
        <TouchableOpacity 
            style={[styles.pkgBox, vendorPackage==2?styles.selected:null]} onPress={()=>setVendorPackage(2)}
        >
            <View style={{flexDirection:'row',  marginBottom:7}}>
                <View style={styles.gold}></View><Text style={{fontSize:22, color:'black'}}>Premium</Text>
            </View>
            <View style={{flexDirection:'row'}}>
                <View style={styles.point}></View><Text style={{fontSize:16}}>Unlimited Calls !</Text>
            </View>
            <View style={{flexDirection:'row'}}>
                <View style={styles.point}></View><Text style={{fontSize:16}}>No Commission Fee on Calls!</Text>
            </View>
            <View style={{flexDirection:'row'}}>
                <View style={styles.point}></View><Text style={{fontSize:16}}>Rs.4999 {"("}6 Months Totally Free{")"}</Text>
            </View>
        </TouchableOpacity>
        <View>
          <TouchableHighlight style={styles.btn} 
            onPress={() => {
                var options = {
                  description: 'Credits towards consultation',
                  image: 'https://res.cloudinary.com/abdullah7c/image/upload/v1666553333/logo_rsalzt.png',
                  currency: 'INR',
                  key: 'rzp_live_rdufkOikPdiLiu', // Your api key
                  amount: vendorPackage==1?'102000':'499999',
                  name: 'DialLink',
                  theme: {color: '#3a6df8'},
                };
                RazorpayCheckout.open(options)
                  .then(async(data) => {
                    // handle success
                    await axios.post(API.approveVendor,{ id:await AsyncStorage.getItem('@vendor_id')})
                    alert(`Subscription Bought Successfully!`);
                    setSheetIndex(0);
                  })
                  .catch(error => {
                    // handle failure
                    console.log(error.description)
                    // alert(`Error: ${error.code} | ${error.description}`);
                  });
              }}
          ><Text style={{color:'white', fontSize:16}}>Confirm</Text></TouchableHighlight>
        </View>
    </ImageBackground>
  )
}
export default Packages

const styles = StyleSheet.create({
    container:{
        flex:1, justifyContent:'center', alignItems:'center',
        paddingLeft:30, paddingRight:30, opacity:0.9
    },
    pkgBox:{
        padding:18,
        marginTop:12,
        backgroundColor:'white',
        height:160,
        width:'100%',
        borderRadius:15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,

        elevation: 7,
        opacity:0.6
    },
    selected:{
        opacity:1
    },
    silver:{
        backgroundColor:'silver',
        height:15,
        width:15,
        borderRadius:20,
        marginTop:8,
        marginRight:10
    },
    gold:{
        backgroundColor:'orange',
        height:15,
        width:15,
        borderRadius:20,
        marginTop:8,
        marginRight:10
    },
    point:{
        marginLeft:4,
        marginTop:10,
        marginRight:10,
        backgroundColor:'black',
        height:7,
        width:7,
        borderRadius:500,

    },
    btn:{
      alignItems:'center', backgroundColor:'#4a8033', width:200, alignSelf:'center', padding:15, borderRadius:15,
      margin:20,
      shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,

        elevation: 7,
    }
})