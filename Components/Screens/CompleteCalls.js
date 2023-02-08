import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Alert, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API from '../apis.json';
import moment from 'moment';
import SubHeader from '../Shared/SubHeader';

const CompleteCalls = ({navigation}) => {

    const [load, setLoad] = useState(true);
    const [calls, setCalls] = useState([]);

    useEffect(() => {
      getInfo();
    }, [])

    const getInfo = async()=>{
        let id = await AsyncStorage.getItem('@vendor_id')
        await axios.get(API.getVendorCompletedCalls, {
            headers:{ id:`${id}` }
        }).then((x)=>{
            setCalls(x.data)
            setLoad(false);
        })
    }

  return (
    <View style={{flex:1, backgroundColor:'#eceff8'}}>
    <SubHeader navigation={navigation}  title={'Completed Calls'} />

    {(!load && calls.length==0) && <View style={{justifyContent:'center', alignItems:'center'}}>
    <Text style={{textAlign:'center', marginTop:20}}>Empty</Text></View>}
    {load &&  <View style={{flex:1, justifyContent:'center', alignItems:'center', alignContent:'center', justifyContent:'center'}}>
    <ActivityIndicator size={'large'} /><Text style={{marginBottom:55}}>Please Wait...</Text></View>}

    {!load && 
    <ScrollView>
    {calls.map((x, index)=>{
    return(
    <View key={index} style={[styles.box, {backgroundColor:x.cost=='0'?'#f9c3c3':'white'}]}>
    <View style={styles.leftStrip}></View>
    <View style={{padding:10, flex:1}}>
        <View style={{justifyContent:'space-between', flexDirection:'row'}}>
        <Text style={{fontSize:18, fontWeight:'bold', color:'#1b1b1d', marginBottom:6}}>
            {x.customer}
        </Text>
        <Text style={{textAlign:'right'}}>{moment(x.updatedAt).format('DD-MMM-YY')}</Text>
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
            <Text>Completed By <Text style={{fontWeight:'500'}}>{x.service_person_name}</Text></Text>
        </View>
        </View>
        {x.tasks!='Blood Test Lab'&&
        <View style={{ marginBottom:2,flexDirection:'row', justifyContent:'space-between', marginTop:10}}>
        <View>
            <Text>Charged Amount</Text>
            <Text>GST {"("}18%{")"}</Text>
            <Text style={{fontSize:16}}>Earnings</Text>
        </View>
        <View>
            <Text>Rs. <Text style={{fontWeight:'500', color:'#1b1b1d'}}>{parseFloat(x.cost).toFixed(1)}</Text></Text>
            <Text>Rs. <Text style={{fontWeight:'500', color:'#b42731'}}>{ ((((parseFloat(x.cost)/118)*100)/100)*18).toFixed(1) }</Text></Text>
            <Text>Rs. <Text style={{fontWeight:'500', color:'#178237', fontSize:16}}>{((parseFloat(x.cost)/118)*100).toFixed(1)}</Text></Text>
        </View>
        </View>
        }
        {x.tasks=='Blood Test Lab'&&
        <View style={{ marginBottom:2,flexDirection:'row', justifyContent:'space-between', marginTop:10}}>
        <View>
            <Text>Charged Amount</Text>
            <Text style={{fontSize:16}}>Earnings</Text>
        </View>
        <View>
            <Text>Rs. <Text style={{fontWeight:'500', color:'#1b1b1d'}}>{parseFloat(x.cost).toFixed(1)}</Text></Text>
            <Text>Rs. <Text style={{fontWeight:'500', color:'#178237', fontSize:16}}>{parseFloat(x.cost).toFixed(1)}</Text></Text>
        </View>
        </View>
        }
    </View>
    </View>
    )
    })}
    <View style={{height:20}}></View>
    </ScrollView>
    }
    </View>
  )
}

export default CompleteCalls

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
    leftStrip:{width:10, backgroundColor:'#46af4d', opacity:0.7, borderTopLeftRadius:10, borderBottomLeftRadius:10},
    heading:{ color:'grey', fontSize:16, width:75 },
    cntnt:{ color:'black', fontSize:16,  width:190 },

    headingv2:{ color:'#232323', fontSize:18, textAlign:'center' },
    cntntv2:{ color:'#232323', fontSize:20, fontWeight:'bold', textAlign:'center' },
    input: {
        height: 40,
        padding:0,
        paddingRight:20,
        borderRadius:5,
        width:100,
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