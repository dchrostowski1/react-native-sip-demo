/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { registerGlobals } from 'react-native-webrtc';

// Override the global WebRTC objects


import React from 'react';
import { Inviter, SessionState, UserAgent, UserAgentOptions } from "sip.js";


import { useEffect, useState } from 'react'
import isotecBanner from './assets/isotec_banner.png'
const isotecBannerImgUri = Image.resolveAssetSource(isotecBanner).uri;




import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  Image,
  TouchableOpacity
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';



function App() {

  const [userAgent, setUserAgent] = useState(null)
  const [callSession, setCallSession] = useState(null)
  const [callInProgress, setCallInProgress] = useState(false)
  const [sessionState, setSessionState] = useState(null)

  useEffect(() => {
    registerGlobals()

    const ua = new UserAgent({
      uri: UserAgent.makeURI("sip:2000@192.168.90.158"),
      authorizationUsername: '2000',
      authorizationPassword: '1234',
      transportOptions: {
        server: "ws://192.168.90.158:8088/ws"
      },
    });

    ua.start().then(() => {
      setUserAgent(ua)
    })



  }, [])

  const hangUp = async () => {

    console.log(callSession)
    await callSession.bye()
    setSessionState(null)
  }

  const makeCall = async (targetExtension) => {
    setSessionState('init')

    const target = UserAgent.makeURI(`sip:${targetExtension}@192.168.2.158`)

    if (!target) {
      throw new Error("Failed to create target URI.");
    }

    // Create a user agent client to establish a session


    const inviter = new Inviter(userAgent, target, {
      sessionDescriptionHandlerOptions: {
        constraints: { audio: true, video: false }
      }
    });

    inviter.stateChange.addListener((newState) => {
      setSessionState(newState)
      switch (newState) {
        case SessionState.Establishing:
          console.log("session establishing...")

          break;
        case SessionState.Established:
          console.log("session established.")
          // Session has been established
          break;
        case SessionState.Terminated:
          console.log("session terminated")
          // Session has terminated
          break;
        default:
          break;
      }
    });

    inviter.invite()
      .then((session) => {

        console.log("invite sent")
        console.log("session?")
        console.log(session)
        setCallSession(inviter)
      })
      .catch((error) => {
        console.log("error on invite")
        console.log(error)
      });




  }


  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const renderCallButtons = () => {
    return (

      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <TouchableOpacity style={{ backgroundColor: '#2196f3', height: 100, width: '50%', marginTop: 25, marginBottom: 25, alignItems: 'center', justifyContent: 'center' }} onPress={() => makeCall('1000')}>
          <Text style={{ fontSize: 20 }}>Call EE Lab </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ backgroundColor: '#2196f3', height: 100, width: '50%', marginTop: 25, marginBottom: 25, alignItems: 'center', justifyContent: 'center' }} onPress={() => makeCall('1001')}>
          <Text style={{ fontSize: 20 }}>Call Demo Portal </Text>
        </TouchableOpacity>
      </View>
    )
  }

  const renderCallInProgress = () => {
    console.log("render call in progress")

    if (sessionState !== SessionState.Established || sessionState === 'init') {
      return (
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          
            <Text style={{ fontSize: 20 }}>Calling...</Text>
          
        </View>

      )
    }

    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <TouchableOpacity style={{ backgroundColor: 'red', height: 100, width: '50%', marginTop: 25, marginBottom: 25, alignItems: 'center', justifyContent: 'center' }} onPress={() => hangUp()}>
          <Text style={{ fontSize: 20 }}>End Call </Text>
        </TouchableOpacity>
      </View>
    )

  }

  return (
    <View style={{ flex: 1 }}>
      <Image style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: '5px' }} source={{ uri: isotecBannerImgUri }} height="20%" width="95%" />
      {sessionState === null ? renderCallButtons() : renderCallInProgress()}
    </View>
  )
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
