import React, { useEffect, useState } from 'react'
import SplashScreen from 'react-native-splash-screen';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators  } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import OneSignal from 'react-native-onesignal';

import Login from './Components/Screens/Login';
import Home from './Components/Screens/Home';
import SignUp from './Components/Screens/SignUp';
import IncomingCalls from './Components/Screens/IncomingCalls';
import CompleteCalls from './Components/Screens/CompleteCalls';
import ActiveCalls from './Components/Screens/ActiveCalls';
import Invoices from './Components/Screens/Invoices';
import TutorialScreen from './Components/Screens/TutorialScreen';
import Welcome from './Components/Screens/Welcome';

const Stack = createStackNavigator();

const App = () => {

  useEffect(() => {
    SplashScreen.hide();
    OneSignal.setAppId('2a3582c3-ff83-4037-8d6b-2193f205a418');
    OneSignal.setNotificationOpenedHandler(notification => {
      //console.log("OneSignal: notification opened:", notification);
    });
  }, [])

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
      <Stack.Navigator
        initialRouteName={'Welcome'}
        screenOptions={{
       }}
      >
        <Stack.Screen name="Welcome" component={Welcome}
          options={{
            headerShown:false,
            cardStyleInterpolator:CardStyleInterpolators.forFadeFromBottomAndroid,
          }}
        />
        <Stack.Screen name="TutorialScreen" component={TutorialScreen}
          options={{
            headerShown:false,
            cardStyleInterpolator:CardStyleInterpolators.forFadeFromBottomAndroid,
          }}
        />
        <Stack.Screen name="Login" component={Login}
          options={{
            headerShown:false,
            cardStyleInterpolator:CardStyleInterpolators.forFadeFromBottomAndroid,
          }}
        />
        <Stack.Screen name="SignUp" component={SignUp}
          options={{
            headerShown:false,
            //title: 'Already Have An Account?',
            cardStyleInterpolator:CardStyleInterpolators.forFadeFromBottomAndroid,
          }}
        />
        <Stack.Screen name="Home" component={Home}
          options={{
            headerShown:false,
            //cardStyleInterpolator:CardStyleInterpolators.forFadeFromBottomAndroid,
          }}
        />
        <Stack.Screen name="IncomingCalls" component={IncomingCalls}
          options={{
            headerShown:false,
            cardStyleInterpolator:CardStyleInterpolators.forFadeFromBottomAndroid,
          }}
        />
        <Stack.Screen name="ActiveCalls" component={ActiveCalls}
          options={{
            headerShown:false,
            cardStyleInterpolator:CardStyleInterpolators.forFadeFromBottomAndroid,
          }}
        />
        <Stack.Screen name="Invoices" component={Invoices}
          options={{
            headerShown:false,
            cardStyleInterpolator:CardStyleInterpolators.forFadeFromBottomAndroid,
          }}
        />
        <Stack.Screen name="CompleteCalls" component={CompleteCalls}
          options={{
            headerShown:false,
            cardStyleInterpolator:CardStyleInterpolators.forFadeFromBottomAndroid,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </GestureHandlerRootView>
  )
}

export default App