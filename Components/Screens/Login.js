import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TextInput, Alert, ActivityIndicator, Image, StatusBar } from 'react-native'
import { Form, FormItem, Label } from 'react-native-form-component';

import { TouchableOpacity } from 'react-native-gesture-handler';
import OneSignal from 'react-native-onesignal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../apis.json';
import axios from 'axios';
import jwt_decode from "jwt-decode";

const Login = ({navigation}) => {

  const [accCheck, setAccCheck] = useState(true);

  const [num, setNum] = useState('');
  const [pass, setPass] = useState('');
  const [load, setLoad] = useState(false);

    useEffect(() => {
      name();
      return () => { setNum(''); setPass('') }
    }, [])

    async function name() {
      let token = await AsyncStorage.getItem('@token')
      await axios.get(API.verifyAccount,{
        headers:{
          "x-access-token":`${token}`
        }
      }).then((x)=>{
        if(x.data.isLoggedIn==true){
          setAccCheck(false);
          navigation.navigate("Home")
        }else{
          setAccCheck(false);
        }
      })
    }

  const handleSubmit = async () => {
    let value;
    try {
      value = await AsyncStorage.getItem('@device_id')
      console.log(`Device id ${value===null?'Dosen\'t Exist':'Exists = ' }` , value)
      if(value === null) {
        
        OneSignal.getDeviceState().then(async(x)=>{
          console.log(x)
          await AsyncStorage.setItem('@device_id', x.userId)
          value = x.userId
        })
      }
    } catch(e) { console.log(e) }

    if(num.length==10 && pass.length>5 && value!==null){
      setLoad(true)
      console.log(num, pass, value)
      axios.post(API.vendorLogin,{
        contact:num,
        password:pass,
        device_id:value
      }).then((x)=>{
          console.log(x.data)
          if(x.data.status=="Success"){
            setValues(x.data.token)
          }else{
            setLoad(false)
            Alert.alert("Error Signing In", "Invalid Number or Password")
          }
      })
    }
    if(value===null){ handleSubmit(); }
    if(num.length!=10){
        Alert.alert("Invalid Input","Contact Required");
        return
    }
    if(pass.length<5){
        Alert.alert("Invalid Input",'Atleast 6 Letters in Password!')
        return
    }
  }

  const setValues = async(token) => {
    let values = jwt_decode(token)
    console.log(values)
    await AsyncStorage.setItem('@vendor_id', values.loginId)
    await AsyncStorage.setItem('@token', token)
    await AsyncStorage.setItem('@username', values.username)
    
    let check = await AsyncStorage.getItem('@tutorial')

    setLoad(false)
    if(check==null){
      navigation.navigate("TutorialScreen")
    }else{
      navigation.navigate("Home")
    }
  }

  return (
    <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#ffffff'}}>
    <StatusBar barStyle = "dark-content" hidden = {false} backgroundColor = "#ffffff" translucent = {true}/>
    <View><Image source={require('../../Assets/logo.png')} height={50} width={50} /></View>
      {/* <Text style={{fontSize:50, fontWeight:'bold', color:'#171111', borderBottomColor:'grey', borderBottomWidth:1 }}>Dial Link</Text>
      <Text style={{fontWeight:'normal', fontSize:50, color:'#171111', marginTop:0, lineHeight:55 }}>Network</Text>
      <Text style={{fontWeight:'normal', color:'grey', marginBottom:0, marginBottom:20, marginTop:10 }}>Please sign to continue</Text> */}
      <Text style={{fontWeight:'normal', color:'grey', marginBottom:0, marginBottom:20, marginTop:10 }}>Please sign to continue</Text>
      {!accCheck && 
      <View>
          <Text style={{position:'relative', top:'12.5%', left:15, color:'grey', zIndex:1, width:35}}>+ 91</Text>
          <TextInput style={[styles.input, {paddingLeft:50}]} value={num} placeholder='Mobile No.' keyboardType='numeric' onChangeText={(x)=>setNum(x)}  />
          <TextInput style={styles.input}  value={pass} placeholder='Password' onChangeText={(x)=>setPass(x)} secureTextEntry={true} />
          <TouchableOpacity onPress={handleSubmit}><Text style={styles.btn}>{load?<ActivityIndicator color={'white'} />:'Submit'}</Text></TouchableOpacity>
          <View>
            <Text style={{fontSize:15, textAlign:"center", marginTop:20}}>Don't have an account?{" "}
              <Text style={{fontSize:15, color:'#4278de', fontWeight:'bold'}} onPress={()=>navigation.navigate("SignUp")}>
                Sign Up
              </Text>
             
            </Text>
          </View>
      </View>
      }
      {
        accCheck && <ActivityIndicator size={'large'} color={'#4278de'} />
      }
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
    input: {
      width:250,
      marginBottom:20,
      paddingLeft:30,
      borderRadius:35,
      alignSelf:'center',
      borderColor:'white',
      borderWidth: 1,
      backgroundColor:'white',
      shadowColor: "#000",
      shadowOffset: {
          width: 0,
          height: 6,
      },
      shadowOpacity: 0.37,
      shadowRadius: 7.49,
      elevation: 5,
    },
    btn:{
      backgroundColor:'#4278de',
      color:"white",
      paddingTop:15,
      paddingBottom:15,
      paddingLeft:65,
      paddingRight:65,
      marginTop:30,
      borderRadius:35,
      alignSelf:'center'
    }
})