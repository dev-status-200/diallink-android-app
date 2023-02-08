import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, Text, View, ActivityIndicator, ScrollView, Alert, Animated, BackHandler, TextInput, Modal } from 'react-native'
import { Form, FormItem, Label } from 'react-native-form-component';
import CheckBox from '@react-native-community/checkbox';
import API from '../apis.json';
import axios from 'axios';
import Icon from 'react-native-vector-icons/AntDesign'
import { TouchableOpacity } from 'react-native-gesture-handler';
import Terms from '../Docs/Terms';
import Privacy from '../Docs/Privacy';

const SignUp = ({navigation}) => {

    const [text, setText] = React.useState('');
    const hasUnsavedChanges = Boolean(text);

    const fadeAnim = useRef(new Animated.Value(0)).current
    useEffect(()=>{ Animated.timing(fadeAnim,{toValue: 1, duration: 1000, useNativeDriver:true}).start() }, [fadeAnim])

    const [visible, setVisible] = useState(false);
    const [privacy, setPrivacy] = useState(false);
    const [term, setTerms] = useState(false);

    const [load, setLoad] = useState(false);
    const [success, setSuccess] = useState(false);

    const [fName, setFname] = useState('');
    const [lName, setLname] = useState('');
    const [num, setNum] = useState('');
    const [pass, setPass] = useState('');
    const [address, setAddress] = useState('');
    const [ShopName, setShopName] = useState('');
    const [gst, setGst] = useState('');
    const [email, setEmail] = useState('');
    const [city, setCity] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [services, setServices] = useState([{id:'', title:'', check:false}]);
    const [privacyCheck, setPrivacyCheck] = useState(false);
    const [termsCheck, setTermsCheck] = useState(false);

    useEffect(() => {
        const backAction = () => {
          Alert.alert("Hold on!", "Are You Sure To Leave App?", [
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
    
        return () => backHandler.remove();
      }, []);

    useEffect(() => {
        axios.get(API.getServices).then((x) => {
            let tempState = [];
            x.data.forEach((y) => {
                tempState.push({id:y.id, title:y.name, check:false})
            })
            setServices(tempState);
        })
      return () => { };
    }, [])
    const handleSubmit = async() => {
        let count = 0;
        let selectedService = []
            services.forEach((x)=>{
                if(x.check==true){
                    count=count+1;
                    selectedService.push({id:x.id})
                }
            })
        if(fName.length>2 && ShopName.length>1 && lName.length>2 && address.length>3 && pass.length>4 && email.length>5 && num.length==10 && count>0 && city.length>3 &&termsCheck==true && privacyCheck==true ){
            setLoad(true)
            axios.post(API.vendorSignUp,{
                f_name:fName,
                l_name:lName,
                contact:num,
                password:pass,
                device_id:null,
                address_line:address,
                business_name:ShopName,
                gst_number:gst,
                email:email,
                city:city,
                postal_code:zipCode,
                services:selectedService
            }).then((x)=>{
                console.log(x.data)
                if(x.data.status=='Number Already Exists'){
                    setLoad(false)
                    Alert.alert('Invalid Data', 'The Provided Number Already Exists!')
                }else if(x.data.status=="success"){
                    setSuccess(true)
                }else{
                    Alert.alert("Server Error", "A Problem Occured Please Try Again Later")
                }
            })
        }
        console.log(address.length>4)
        if(!privacyCheck){
            Alert.alert("Missing Check!","Privacy Policy Must Be Agreed!");
            return
        }
        if(!termsCheck){
            Alert.alert("Missing Check!","Terms & Policy Must Be Agreed!");
            return
        }
        if(fName.length<3){
            Alert.alert("Invalid Input","Atleast 3 Letters in First Name!");
            return
        }
        if(lName.length<3){
            Alert.alert("Invalid Input",'Atleast 3 Letters in Last Name!')
            return
        }
        if(email.length<5){
            Alert.alert("Invalid Input",'Invalid Email!');
            return
        }
        if(num.length!==10){
            Alert.alert("Invalid Input",'Invalid Number!');
            return
        }
        if(city.length<4){
            Alert.alert("Attention",'City is required!');
            return
        }
        if(address.length<4){
            Alert.alert("Attention",'Address is required!');
            return
        }
        if(ShopName.length<2){
            Alert.alert("Attention",'Address is required!');
            return
        }
        if(pass.length<6){
            Alert.alert("Invalid Input",'Atleast 6 Letters in Password!')
            return
        }
        if(count<1){
            Alert.alert("Not Sufficient",'Select atleast 1 service!')
            return
        }
    }

  return (
    <ScrollView style={{backgroundColor:'#ffffff'}}>
    {(!load && !success) &&
    <View style={{flex:1, alignItems:'center', paddingTop:50}}>
        <Text style={{fontSize:40, fontWeight:'bold', color:'#171111' }}>Sign Up</Text>
        <Text style={{fontWeight:'normal', color:'#171111', marginTop:0, lineHeight:50, marginBottom:10 }}>To Diallink Network</Text>

        <View>
        <Label text="First Name" textStyle={{color:'grey'}}  asterik />
        <TextInput style={styles.input}  placeholder="First Name" isRequired value={fName} onChangeText={(x)=>setFname(x)} />
        
        <Label text="Last Name" textStyle={{color:'grey'}}  asterik />
        <TextInput style={styles.input}   value={lName}  placeholder="Last Name" onChangeText={(x)=>setLname(x)} />
        
        <Label text="Mobile No" textStyle={{color:'grey'}}  asterik />
        <Text style={{position:'relative', top:'1.75%', left:23, color:'grey', zIndex:1, width:35}}>+ 91</Text>
        <TextInput style={[styles.input, {paddingLeft:55}]} placeholder="Mobile" value={num} keyboardType='decimal-pad' onChangeText={(x) =>setNum(x)} />
        
        <Label text="Email" textStyle={{color:'grey'}}  />
        <TextInput style={[styles.input]} placeholder="Email" value={email} onChangeText={(x)=>setEmail(x)} />
        
        <Label text="Password" textStyle={{color:'grey'}} asterik />
        <TextInput style={[styles.input]} value={pass} onChangeText={(x)=>setPass(x)} placeholder="Password" secureTextEntry={true} />
        
        <Label text="Business Name" textStyle={{color:'grey'}} asterik />
        <TextInput style={[styles.input]} value={ShopName} onChangeText={(x)=>setShopName(x)} placeholder="Business Name"  />
        
        <Label text="Address" textStyle={{color:'grey'}} asterik />
        <TextInput style={[styles.input]} value={address} onChangeText={(x)=>setAddress(x)} placeholder="Address" />
        
        <Label text="City" textStyle={{color:'grey'}} asterik />
        <TextInput style={[styles.input]} value={city} onChangeText={(x)=>setCity(x)} placeholder="City" />
        
        <Label text="Zip Code" textStyle={{color:'grey'}} asterik />
        <TextInput style={[styles.input]} value={zipCode} onChangeText={(x)=>setZipCode(x)} placeholder="ZIP" />

        <Label text="Services" textStyle={{color:'grey'}} asterik />
            <View style={{height:2}}></View>
            {
            services.map((service, index)=>{
                return(
                <View style={{marginTop:2}} key={service.id}>
                    {(index==0) && <View style={styles.category}><Text style={{fontSize:18, color:'#4278de'}}>Electronics Repair</Text></View>}
                    {(index==11) && <View style={styles.category}><Text style={{fontSize:18, color:'#4278de'}}>Automobile Repair</Text></View>}
                    {(index==14) && <View style={styles.category}><Text style={{fontSize:18, color:'#4278de'}}>Real Estate</Text></View>}
                    {(index==15) && <View style={styles.category}><Text style={{fontSize:18, color:'#4278de'}}>Laboratory</Text></View>}
                    <View style={{flexDirection:'row', paddingTop:8}}>
                    <CheckBox 
                        tintColors={{true: '#4278de'}}
                        key={service.id}
                        value={service.check}
                        onChange={()=>{
                            let tempState = [...services]
                            tempState[index].check=!tempState[index].check;
                            setServices(tempState);
                        }}
                    />
                    <Text style={{marginTop:7}}>{service.title}</Text>
                    </View>
                </View>
                )
            })
            }
            <View style={{marginTop:20}}>
                <Label text="Privacy Policy" textStyle={{color:'grey'}} asterik />
            </View>

            <View style={{flexDirection:'row'}}>
                <CheckBox 
                    tintColors={{true: '#4278de'}}
                    value={privacyCheck}
                    onChange={()=> setPrivacyCheck(!privacyCheck)}
                />
                <Text style={{fontSize:15, marginTop:5}}>Agree Our{" "}
                    <Text style={{fontSize:15, color:'#4278de', fontWeight:'bold'}} onPress={()=>{setPrivacy(true); setVisible(true)}}>
                        Privacy Policy
                    </Text>
                </Text>
            </View>

            <View style={{marginTop:20}}>
                <Label text="Terms & Conditions" textStyle={{color:'grey'}} asterik />
            </View>
            <View style={{flexDirection:'row'}}>
                <CheckBox 
                    tintColors={{true: '#4278de'}}
                    value={termsCheck}
                    onChange={()=> setTermsCheck(!termsCheck)}
                />
                <Text style={{fontSize:15, marginTop:5}}>Agree Our{" "}
                    <Text style={{fontSize:15, color:'#4278de', fontWeight:'bold'}} onPress={()=>{setTerms(true); setVisible(true)}}>
                        Terms & Conditions
                    </Text>
                </Text>
            </View>

            <TouchableOpacity onPress={()=>handleSubmit()}><Text style={styles.btn}>Submit</Text></TouchableOpacity>
        
        </View>
            
        <View style={{flexDirection:'row', marginBottom:40, marginTop:30}}>
            <Text style={{fontSize:16}}>Already Have An Account?</Text>
            <TouchableOpacity onPress={()=>navigation.navigate("Login")}><Text style={{fontSize:16, color:'#4278de', fontWeight:'bold'}}> Login</Text></TouchableOpacity>
        </View>


    </View>
    }

    <Modal
        animationType="fade"
        transparent={true}
        visible={privacy}
        onRequestClose={() => {
          setPrivacy(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {privacy&& <Privacy/>}
            
          </View>
        </View>
      </Modal>
    <Modal
        animationType="fade"
        transparent={true}
        visible={term}
        onRequestClose={() => {
          setTerms(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {term&& <Terms/>}
            
          </View>
        </View>
      </Modal>

    {(load && !success) &&
    <View style={{alignItems:'center', justifyContent:'center', paddingTop:'60%'}}>
        <ActivityIndicator size={'large'} color={'#409AE5'}/>
        <Text>Loading Please Wait...</Text>
    </View>
    }
    {success &&
        <Animated.View style={{ opacity: fadeAnim}}>
        <View style={{flex:1, alignItems:'center', backgroundColor:'white', paddingTop:120}}>
            <Icon name='checkcircle' size={100} color="green" style={{marginTop:130, marginBottom:20}} />
            <Text style={{fontSize:20}}>Account Successfully Created!</Text>
            <View style={{flexDirection:'row'}}>
            <Text style={{fontSize:20}}>Go Back To</Text>
            <TouchableOpacity onPress={()=>navigation.navigate("Login")}><Text style={{fontSize:20, color:'#409AE5', fontWeight:'bold'}}> Login</Text></TouchableOpacity>
        </View>
        </View>
        </Animated.View>
    }
    </ScrollView>
  )
}

export default SignUp

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
    category:{
        borderBottomColor:'grey', borderBottomWidth:1, paddingBottom:10, paddingTop:10
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
})