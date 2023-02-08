import { StyleSheet, Text, View, TouchableOpacity, BackHandler, Alert, Animated, Easing, ActivityIndicator } from 'react-native';
import React, {useState, useEffect, useCallback, useMemo, useRef} from 'react';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import EnyptoIcon from 'react-native-vector-icons/Entypo';
import MUI from 'react-native-vector-icons/MaterialIcons'
import axios from 'axios';
import API from '../apis.json';
import BottomSheet from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../Shared/Header';
import Drawer from '../Shared/Drawer';
import Packages from '../BottomSheets/Packages';
import LinearGradient from 'react-native-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';

const Home = ({navigation}) => {

  const [name, setName] = useState('');

  const [incomingLoad, setIncomingLoad] = useState(true);
  const [activeLoad, setActiveLoad] = useState(true);
  const [completeLoad, setCompleteLoad] = useState(true);

  const [statusLoad, setStatusLoad] = useState(true);
  const [accountStatus, setAccountStatus] = useState(true);

  const [activeCallsLength, setActiveCallsLength] = useState(0);
  const [incomingCallsLength, setIncomingCallsLength] = useState(0);
  const [completedCallsLength, setCompletedCallsLength] = useState(0);

  const translation = useRef(new Animated.Value(0)).current;

  const [drawer, setDrawer] = useState(false);

    const openDrawer = () => {
      setDrawer(true)
        Animated.timing(translation,{
            toValue:400,
            duration: 450,
            easing: Easing.in,
            useNativeDriver:true
        }).start();
    }
    const closeDrawer = () => {
      setDrawer(false)
        Animated.timing(translation,{
            toValue:-580,
            duration: 400,
            useNativeDriver:true
        }).start();
    }

    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ['1%', '98%'], []);
    const [sheetIndex, setSheetIndex] = useState(0);
    const handleSheetChanges = useCallback((index) => { setSheetIndex(index) }, []);

    useFocusEffect(
      React.useCallback(() => {
      accountInfo();

      const backAction = () => {
        Alert.alert("Exit App!", "Are You Sure?", [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel"
          },
          { text: "YES", onPress: () => BackHandler.exitApp() }
        ]);
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );
  
        return () => { }
      }, [sheetIndex])
    );

    async function accountInfo() {
      let id = await AsyncStorage.getItem('@vendor_id')
      let tempName = await AsyncStorage.getItem('@username')
      setName(tempName)
      await axios.get(API.getVendorActiveCalls,{headers:{id:`${id}`}}).then((x)=>{ setActiveCallsLength(x.data.length); setActiveLoad(false) });
      await axios.get(API.AccountStatus,{headers:{id:`${id}`}}).then((x)=>{if(x.data==1){ setAccountStatus(true) }else{ setAccountStatus(false)} setStatusLoad(false)});
      await axios.get(API.getIncomingCalls,{headers:{id:`${id}`}}).then((x)=>{ setIncomingCallsLength(x.data.length); setIncomingLoad(false) });
      await axios.get(API.getVendorCompletedCalls,{headers:{id:`${id}`}}).then((x)=>{ setCompletedCallsLength(x.data.length); setCompleteLoad(false) });
    }

  return (
    <>
    <View style={{flex:1, backgroundColor:'#eceff8'}} onTouchStart={closeDrawer}>
    {drawer && <View style={{position:'absolute', zIndex:1, backgroundColor:'black', opacity:0.6, height:'100%', width:'100%'}}></View>}
    <Drawer style={{zIndex:2}} translation={translation} name={name} navigation={navigation} />
      <Header openDrawer={openDrawer} navigation={navigation} />

      <View style={{flexDirection:'row', justifyContent:'space-around', marginTop:25, marginLeft:10, marginRight:10}}>

      <TouchableOpacity onPress={()=>navigation.navigate('IncomingCalls')}>
      <LinearGradient colors={['#7094f3','#84a2f5', '#6389f2', '#4271f0']} style={styles.option}>
        <View style={styles.circle}>
          <MaterialIcon name='call-received' color={'white'} size={20}/>
        </View>
        <Text style={styles.calls}>Calls</Text>
        <Text style={styles.optionName}>Incoming</Text>
        <View style={[styles.optionBtm, {backgroundColor:'#89a6f5'}]}>
          <Text style={{color:'white', fontSize:20}}>{incomingLoad?<ActivityIndicator color={'white'} size='large' />:(incomingCallsLength==0?'__':incomingCallsLength)}</Text>
        </View>
      </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity onPress={()=>navigation.navigate("ActiveCalls")}>
      <LinearGradient colors={['#4f4dae','#6f6ebf', '#5655b4', '#4f4eb1']} style={styles.option}>
        <View style={styles.circle}>
          <EnyptoIcon name='time-slot' color={'white'} size={20} />
        </View>
        <Text style={styles.calls}>Calls</Text>
        <Text style={styles.optionName}>Ongoing</Text>
        <View style={[styles.optionBtm, {backgroundColor:"#6c6abe"}]}>
          <Text style={{color:'white', fontSize:20}}>{activeLoad?<ActivityIndicator color={'white'} size='large' />:(activeCallsLength==0?'__':activeCallsLength)}</Text>
        </View>
      </LinearGradient>
      </TouchableOpacity>
      </View>

      <View style={{flexDirection:'row', justifyContent:'space-around', marginTop:22, marginLeft:10, marginRight:10}}>

      <TouchableOpacity onPress={()=>navigation.navigate('CompleteCalls')}>
      <LinearGradient colors={['#62c068','#8fcc93', '#6cbc72', '#6cbc72']} style={styles.option}>
        <View style={styles.circle}>
          <IonIcon name='checkmark-done' color={'white'} size={20}/>
        </View>
        <Text style={styles.calls}>Calls</Text>
        <Text style={styles.optionName}>Complete</Text>
        <View style={[styles.optionBtm, {backgroundColor:'#8cca90'}]}>
          <Text style={{color:'white', fontSize:20}}>{completeLoad?<ActivityIndicator color={'white'} size='large' />:(completedCallsLength==0?'__':completedCallsLength)}</Text>
        </View>
      </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity >
      <LinearGradient colors={['#c34841','#ce6964', '#c96e69', '#c15853']} style={styles.option}>
        <View style={styles.circle}>
          <AntIcon name='user' color={'white'} size={20}/>
        </View>
        <Text style={styles.calls}>Profile</Text>
        <Text style={styles.optionName}>Rating</Text>
        <View style={[styles.optionBtm, {backgroundColor:"#c15853"}]}>
          <Text style={{color:'white', fontSize:15, fontWeight:'bold'}}>Coming Soon</Text>
        </View>
      </LinearGradient>
      </TouchableOpacity>
      </View>

      {(!accountStatus && !statusLoad) && 
      <View style={{justifyContent:'flex-end',alignSelf:'center', marginTop:20,}}>
        <Text style={{margin:10,  width:300, textAlign:'center', opacity:0.6}}>
          Account Not Activated!
        </Text>
        <TouchableOpacity onPress={()=>setSheetIndex(1)} style={styles.AccBtn}>
          <Text style={{color:'white', fontSize:18 }}>
            Activate <FontAwesomeIcon name='check-circle' size={20} style={{marginTop:9}} color={'white'} />
          </Text>
        </TouchableOpacity>
        <Text style={{margin:10, width:300, textAlign:'center', opacity:0.7}}>
          Upgrade Yout Account to start recieving Calls!
        </Text>
      </View>
      }
      {(accountStatus&& !statusLoad) &&
        <View style={{justifyContent:'flex-end',alignSelf:'center', marginTop:40, alignItems:'center'}}>
          <MUI name='verified' size={50} color='silver' />
          <Text style={{marginTop:5}}>Subscribed Account!</Text>
        </View>
      }
      {statusLoad &&
        <View style={{justifyContent:'flex-end',alignSelf:'center', marginTop:70, alignItems:'center'}}>
          <ActivityIndicator color={'#306bdd'} size='large' />
          <Text style={{marginTop:10}}>Fetching Profile Status...</Text>
        </View>
      }
    </View>
    {(!accountStatus && !statusLoad) &&
    <BottomSheet
        ref={bottomSheetRef}
        index={sheetIndex}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        <Packages setSheetIndex={setSheetIndex} />
    </BottomSheet>}
    </>
  )
}

export default Home

const styles = StyleSheet.create({
  option:{
    height:200,
    width:150,
    borderRadius:15,
    paddingTop:30,
    alignItems:'center',
  },
  calls:{color:'white',marginTop:20, fontSize:17},
  optionName:{color:'white',marginTop:0, fontWeight:'bold', fontSize:20, lineHeight:20},
  optionBtm:{
    width:'100%', height:55, marginTop:17, borderBottomLeftRadius:15, borderBottomRightRadius:15,
    justifyContent:'center', alignItems:'center', borderTopRightRadius:5, borderTopLeftRadius:5,
  },
  circle:{
    borderColor:'white', borderWidth:2,
    justifyContent:'center',
    height:35, width:35,
    alignItems:'center',
    borderRadius:50
  },
  AccBtn:{
    alignItems:'center', backgroundColor:'#4a8033', width:140, alignSelf:'center', padding:10, borderRadius:8, opacity:0.9
  }
})