import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Alert, ScrollView, TouchableOpacity, Pressable, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API from '../apis.json';
import moment from 'moment';
import SubHeader from '../Shared/SubHeader';
import RazorpayCheckout from 'react-native-razorpay';

const Invoices = ({navigation}) => {

    const [load, setLoad] = useState(true);
    const [invoices, setInvoices] = useState([]);
    const [total, setTotal] = useState(0.0);
    const [ids, setIds] = useState([]);

    useEffect(()=>{ getInfo() }, [])

    const getInfo = async()=>{
        let id = await AsyncStorage.getItem('@vendor_id')
        await axios.get(API.getInvoices, {
            headers:{ id:`${id}` }
        }).then((x)=>{
            setInvoices(x.data)
            let amount = 0;
            let tempIds = [];
            x.data.forEach((x) => {
                tempIds.push(x.Invoices[0].id)
                amount = amount + parseFloat(x.Invoices[0].amount)
            });
            setTotal(amount);
            setIds(tempIds);
            setLoad(false);
        })
    }

    const getTotalCommission = (list) => {
        let price = 0;
        list.forEach((x)=>{
            price = price + parseInt(x.amount)
        })
        return price
    }

  return (
    <View style={{flex:1, backgroundColor:'#eceff8'}}>
    <SubHeader navigation={navigation}  title={'Weekly Invoices'} />

    {(!load && invoices.length==0) && <View style={{justifyContent:'center', alignItems:'center'}}>
    <Text style={{textAlign:'center', marginTop:20}}>Empty</Text></View>}
    {load &&  <View style={{flex:1, justifyContent:'center', alignItems:'center', alignContent:'center', justifyContent:'center'}}>
    <ActivityIndicator size={'large'} /><Text style={{marginBottom:55}}>Please Wait...</Text></View>}

    {!load && 
    <ScrollView>
    {invoices.map((x, index)=>{
    return(
    <View key={index} style={[styles.box, {backgroundColor:x.cost=='0'?'#f9c3c3':'white'}]}>
    <View style={styles.leftStrip}></View>
    <View style={{padding:10, flex:1}}>
        <View style={{justifyContent:'space-between', flexDirection:'row'}}>
        <Text style={{fontSize:18, fontWeight:'bold', color:'#1b1b1d', marginBottom:6}}>
            {x.customer}
        </Text>
        <Text style={{textAlign:'right'}}>{moment(x.Invoices.updatedAt).format('DD-MMM-YY')}</Text>
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
        <View style={{ marginBottom:2,flexDirection:'row', justifyContent:'space-between', marginTop:10}}>
        <View>
            <Text>Commission To Be Paid</Text>
        </View>
        <View>
            <Text>Rs. <Text style={{fontWeight:'500', color:'#1b1b1d'}}>{getTotalCommission(x.Invoices)}</Text></Text>
        </View>
        </View>
    </View>
    </View>
    )
    })}
    <View style={{minHeight:200}}></View>
    </ScrollView>
    }
    <View style={styles.bottomPayBtn}>
        <Text>Total Payble Commission</Text>
        <Text style={styles.pay}>Rs.{total}</Text>
        <Pressable onPress={async()=>{
            console.log(ids)
            var options = {
            description: 'Credits towards consultation',
            image: 'https://res.cloudinary.com/abdullah7c/image/upload/v1666553333/logo_rsalzt.png',
            currency: 'INR',
            key: 'rzp_live_rdufkOikPdiLiu', // Your api key
            amount: `${total}00`,
            name: 'DialLink',
            theme: {color: '#3a6df8'},
            };
            RazorpayCheckout.open(options)
            .then(async(data) => {
                // handle success
                await axios.post(API.payInvoices,{ ids:ids})
                alert(`Commission Paid Successfully!`);
                navigation.navigate('Home');
            })
            .catch(error => {
                // handle failure
                console.log(error.description)
                // alert(`Error: ${error.code} | ${error.description}`);
            });
        }}>
            <Text style={styles.btn}>Pay</Text>
        </Pressable>
    </View>
    </View>
  )
}

export default Invoices

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
    leftStrip:{width:10, backgroundColor:'#a9a447', opacity:0.7, borderTopLeftRadius:10, borderBottomLeftRadius:10},
    bottomPayBtn:{
        backgroundColor:'white',
        position:'absolute',
        height:'18%',
        width:'100%',
        bottom:0,
        alignContent:'center',
        justifyContent:'center',
        alignItems:'center',

        shadowColor: "#000000",
        shadowOffset: {
          width: 0,
          height: 7,
        },
        shadowOpacity:  0.21,
        shadowRadius: 7.68,
        elevation: 10
    },
    btn:{
        backgroundColor:'white',
        paddingLeft:'24%',
        paddingRight:'24%',
        paddingTop:'3%',
        paddingBottom:'3%',
        fontSize:20,
        borderRadius:25,
        borderWidth:2,
        borderColor:'#4987e4',

        shadowColor: "#000000",
        shadowOffset: {
          width: 0,
          height: 7,
        },
        shadowOpacity:  0.21,
        shadowRadius: 7.68,
        elevation: 10
    },
    pay:{
        fontSize:20,
        marginBottom:10
    }
})