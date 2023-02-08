import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Alert, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IonIcons from 'react-native-vector-icons/Ionicons'
import AntIcons from 'react-native-vector-icons/AntDesign'
import axios from 'axios';
import API from '../apis.json';
import moment from 'moment';
import SubHeader from '../Shared/SubHeader';

const ActiveCalls = ({navigation}) => {

    const [decline, setDecline] = useState(false);
    const [callComplete, setCallComplete] = useState(false);
    const [confirmSubmit, setConfirmSubmit] = useState(false);
    const [load, setLoad] = useState(true);
    const [submitLoad, setSubmitLoad] = useState(false);
    const [name, setName] = useState("");
    const [contact, setContact] = useState("");
    const [calls, setCalls] = useState([]);
    const [selectedCall, setelectedCall] = useState({tasks:''});
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
      getInfo();
    }, [])

    const getInfo = async()=>{
        let id = await AsyncStorage.getItem('@vendor_id')
        await axios.get(API.getIncomingCalls, {
            headers:{ id:`${id}` }
          }).then((x)=>{
            setCalls(x.data)
            setLoad(false);
          })
    }
    const handleSubmit = async()=>{
        setSubmitLoad(true);
        let id = await AsyncStorage.getItem('@vendor_id')
        await axios.post(API.acceptCall, {
            callId:selectedCall.id, name:name, contact:contact, vendorId:id, email:selectedCall.email
        }).then((x)=>{
            if(x.data[0]==1){
                let tempState = [...calls];
                tempState=tempState.filter((x)=>{
                    return x.id!=selectedCall.id
                })
                setCalls(tempState);
                setSubmitLoad(false);
                setConfirmSubmit(false);
                setCallComplete(true);
                setName("");
                setContact("");
            }
        })
    }

    const recjectCall = async()=>{
        setSubmitLoad(true);
        await axios.post(API.rejectCall, {
            id:selectedCall.id
        }).then((x)=>{
            if(x.data[0]==1){
                let tempState = [...calls];
                tempState=tempState.filter((x)=>{
                    return x.id!=selectedCall.id
                })
                setCalls(tempState);
                setSubmitLoad(false);
                setConfirmSubmit(false);
                setCallComplete(true);
            }
            console.log(x.data);
        })
    }

  return (
    <View style={{flex:1, backgroundColor:'#eceff8'}}>
    <SubHeader navigation={navigation} title={'Incoming Calls'} />

    {(!load && calls.length==0) && <View style={{justifyContent:'center', alignItems:'center'}}>
    <Text style={{textAlign:'center', marginTop:20}}>Empty</Text></View>}
    {load &&  <View style={{flex:1, justifyContent:'center', alignItems:'center', alignContent:'center', justifyContent:'center'}}>
    <ActivityIndicator size={'large'} /><Text style={{marginBottom:55}}>Please Wait...</Text></View>}

    {!load && 
    <ScrollView>
    {calls.map((x, index)=>{
    return(
    <TouchableOpacity key={index} style={styles.box} onPress={() => {setelectedCall(x); setModalVisible(true)}}>
    <View style={styles.leftStrip}></View>
    <View style={{padding:10,flex:1}}>
        <View style={{justifyContent:'space-between', flexDirection:'row'}}>
        <Text style={{fontSize:18, fontWeight:'bold', color:'#1b1b1d', marginBottom:6}}>
            {x.customer}
        </Text>
        <Text style={{textAlign:'right'}}>{moment(x.createdAt).fromNow(true)}</Text>
        </View>
        <Text style={{borderBottomWidth:1, borderBottomColor:'silver', marginBottom:8}}>{x.address}</Text>
        <View style={{ marginBottom:2,flexDirection:'row', justifyContent:'space-between'}}>
        <View>
            {x.tasks.split(', ').map((y, indexTwo)=>{
                return(
                <Text key={indexTwo} style={{color:'#1e5ca9', fontWeight:'500'}}>
                {y}
                </Text>
                )
            })}
        </View>
        <View>
        </View>
        </View>
    </View>
    </TouchableOpacity>
    )
    })}
    <View style={{height:20}}></View>
    </ScrollView>
    }
    {modalVisible&&<View style={{height:'100%', width:'100%', backgroundColor:'black', opacity:0.6, position:'absolute'}}></View>}
    <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
    >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity onPress={()=>{setModalVisible(false); setDecline(false)}} style={{position:'absolute', right:'-1%', top:'-1%'}}><AntIcons name={'closecircle'} size={30} color={'#b42731'} /></TouchableOpacity>
            <Text style={{fontSize:20, fontWeight:'700', color:'#1b1b1d', borderBottomColor:'silver', borderBottomWidth:1, paddingBottom:5}}>Call Info</Text>
            {(!confirmSubmit && !submitLoad && !callComplete&& !decline) && 
            <View style={{marginTop:0}}>
                <View style={styles.info}>
                    <Text style={{alignSelf:'center'}}>Customer:</Text>
                    <Text style={{}}>{selectedCall.customer}</Text>
                </View>
                <View style={styles.info}>
                    <Text style={{alignSelf:'center'}}>Address:</Text>
                    <Text style={{ textAlign:'right', width:200}}>{selectedCall.address}</Text>
                </View>
                <View style={styles.info}>
                    <Text style={{alignSelf:'center'}}>Contact:</Text>
                    <Text style={{ textAlign:'right', width:200}}>{selectedCall.contact}</Text>
                </View>
                <View style={styles.info}>
                <Text style={{alignSelf:'center'}}>Services:</Text>
                <View>
                {selectedCall.tasks.split(', ').map((y, indexTwo)=>{
                    return(
                    <Text key={indexTwo} style={{textAlign:'right', lineHeight:16, color:'#1e5ca9'}}>{y} -</Text>
                    )
                })}
                </View>
                </View>
                <View style={styles.info}>
                    <View style={{ textAlign:'right'}}>
                        <Text>{selectedCall.description}</Text>
                    </View>
                </View>
                <View style={styles.info}>
                    <Text style={{alignSelf:'center'}}>Assign To:</Text>
                    <View style={{ textAlign:'right', flexDirection:'row'}}>
                        <TextInput style={styles.input} value={name} onChangeText={(x)=>setName(x)}  />
                    </View>
                </View>
                <View style={styles.info}>
                    <Text style={{alignSelf:'center'}}>Assignee Cell:</Text>
                    <View style={{ textAlign:'right', flexDirection:'row'}}>
                        <TextInput style={styles.input} value={contact} onChangeText={(x)=>setContact(x)} keyboardType="numeric" />
                    </View>
                </View>
                <View style={{justifyContent:'space-around', flexDirection:'row', padding:10}}>
                    <TouchableOpacity
                        onPress={load?()=>console.log('null'):()=>{if(name.length<1){}else{setConfirmSubmit(true)}}}
                    ><Text style={[styles.btn, {backgroundColor:'#178237'}]}>Accept</Text></TouchableOpacity>
                    <TouchableOpacity onPress={()=>setDecline(true)}><Text style={[styles.btn, {backgroundColor:'#b42731'}]}>Decline</Text></TouchableOpacity>
                </View>
            </View>
            }
            {(confirmSubmit && !submitLoad && !callComplete && !decline) && 
            <View style={{justifyContent:'center', paddingTop:50, paddingBottom:30}}>
                <Text style={{textAlign:'center', fontSize:25, fontWeight:'bold'}}>Are You Sure?</Text>
                <Text style={{textAlign:'center', marginTop:0, fontSize:18}}>Accept This Call</Text>
                <View style={{justifyContent:'space-around', marginTop:30, flexDirection:'row'}}>
                    <TouchableOpacity onPress={()=>handleSubmit()}><Text style={[styles.btn, {backgroundColor:'#178237', color:'white'}]}>Confirm</Text></TouchableOpacity>
                    <TouchableOpacity onPress={()=>{setConfirmSubmit(false); setDecline(false)}}><Text style={[styles.btn, {backgroundColor:'#b42731', color:'white'}]}>No</Text></TouchableOpacity>
                </View>
            </View>
            }
            {(!confirmSubmit && !submitLoad && !callComplete&& decline) && 
            <View style={{justifyContent:'center', paddingTop:50, paddingBottom:30}}>
                <Text style={{textAlign:'center', fontSize:25, fontWeight:'bold'}}>Are You Sure?</Text>
                <Text style={{textAlign:'center', marginTop:0, fontSize:18}}>Decline This Call</Text>
                <View style={{justifyContent:'space-around', marginTop:30, flexDirection:'row'}}>
                    <TouchableOpacity onPress={()=>recjectCall()}><Text style={[styles.btn, {backgroundColor:'#178237', color:'white'}]}>Confirm</Text></TouchableOpacity>
                    <TouchableOpacity onPress={()=>{setConfirmSubmit(false); setDecline(false)}}><Text style={[styles.btn, {backgroundColor:'#b42731', color:'white'}]}>No</Text></TouchableOpacity>
                </View>
            </View>
            }
            {(submitLoad && !callComplete) &&
                <View style={{margin:50}}><ActivityIndicator size={'large'} /><Text style={{textAlign:'center'}}>Please wait...</Text></View>
            }
            {(callComplete && !submitLoad&& !decline) &&
            <View style={{alignItems:'center', marginTop:30, marginBottom:15}}>
                <IonIcons name='checkmark-done-circle' color={'green'} size={70} />
                <Text style={{fontSize:18}}>Call Accepted!</Text>
                <TouchableOpacity onPress={()=>{setSubmitLoad(false); setCallComplete(false); setModalVisible(false)}}>
                    <Text style={[styles.btn, {backgroundColor:'green', color:'white', marginTop:30, opacity:0.8}]}>Continue</Text>
                </TouchableOpacity>
            </View>
            }
            {(callComplete && !submitLoad&& decline) &&
            <View style={{alignItems:'center', marginTop:30, marginBottom:15}}>
                <IonIcons name='checkmark-done-circle' color={'#b42731'} size={70} />
                <Text style={{fontSize:18}}>Call Declined!</Text>
                <TouchableOpacity onPress={()=>{setSubmitLoad(false); setCallComplete(false); setModalVisible(false); setDecline(false);}}>
                    <Text style={[styles.btn, {backgroundColor:'green', color:'white', marginTop:30, opacity:0.8}]}>Continue</Text>
                </TouchableOpacity>
            </View>
            }
          </View>
        </View>
    </Modal>

    </View>
  )
}

export default ActiveCalls

const styles = StyleSheet.create({
    box:{
        flexDirection:'row',
        marginLeft:17,
        marginRight:17,
        marginTop:20,
        borderRadius:10,
        backgroundColor:'white',
        shadowColor: "#000000",
        shadowOffset: {
          width: 0,
          height: 7,
        },
        shadowOpacity:  0.21,
        shadowRadius: 7.68,
        elevation: 10
    },
    leftStrip:{width:10, backgroundColor:'#4271f0', opacity:0.7, borderTopLeftRadius:10, borderBottomLeftRadius:10},
    heading:{ color:'grey', fontSize:16, width:75 },
    cntnt:{ color:'black', fontSize:16,  width:190 },

    headingv2:{ color:'#232323', fontSize:18, textAlign:'center' },
    cntntv2:{ color:'#232323', fontSize:20, fontWeight:'bold', textAlign:'center' },
    input: {
        height: 40,
        padding:0,
        paddingRight:20,
        borderRadius:5,
        width:170,
        borderColor:'white',
        borderWidth: 1,
        textAlign:'right',
        borderWidth:1,
        borderColor:'silver'
    },
    btn:{
        marginTop:10,
        borderRadius:8,
        width:100,
        textAlign:'center',
        alignItems:'center',
        padding:10,
        color:'white',
        fontWeight:'500'
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        margin: 22
    },
    modalView: {
        width:'100%',
        padding:22,
        backgroundColor: "white",
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    info:{
        flexDirection:'row', justifyContent:'space-between', borderBottomColor:'silver', borderBottomWidth:1,
        paddingBottom:10, paddingTop:10
    }
})