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




import type { PropsWithChildren } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
  title: string;
}>;


function App(): React.JSX.Element {

  const [userAgent, setUserAgent] = useState(null)

  useEffect(() => {
    registerGlobals()
    
    const ua = new UserAgent({
      uri: UserAgent.makeURI("sip:2000@192.168.2.150"),
      authorizationUsername: '2000',
      authorizationPassword: '1234',
      transportOptions: {
        server: "ws://192.168.2.150:8088/ws"
      },
    });

    setUserAgent(ua)

  }, [])

  const makeCall = async () => {

    const target = UserAgent.makeURI('sip:2001@192.168.2.150')

    if (!target) {
      throw new Error("Failed to create target URI.");
    }
  
    // Create a user agent client to establish a session
    userAgent.start().then(() => {

      const inviter = new Inviter(userAgent, target, {
        sessionDescriptionHandlerOptions: {
          constraints: { audio: true, video: false }
        }
      });
  
      inviter.stateChange.addListener((newState) => {
        switch (newState) {
          case SessionState.Establishing:
            // Session is establishing
            break;
          case SessionState.Established:
            // Session has been established
            break;
          case SessionState.Terminated:
            // Session has terminated
            break;
          default:
            break;
        }
      });
  
      inviter.invite()
      .then(() => {
        console.log("invite sent")
      })
      .catch((error: Error) => {
        console.log("error on invite")
        console.log(error)
      });

    })
    


    // const socket = new WebSocketInterface('ws://192.168.2.150:8088/ws');
    // console.log("log socket:")
    // console.log(socket)

    // const config = {
    //   sockets: [socket],
    //   uri: 'sip:2000@192.168.2.150',
    //   password: '1234'
    // }

    // console.log("log config")
    // console.log(config)

    // const ua = new UA(config)
    // console.log("log ua")
    // console.log(ua)

    // ua.start()
    // console.log("ua after start()")
    // console.log(ua)

    // const eventHandlers = {
    //   'progress': function (e) {
    //     console.log('call is in progress');
    //   },
    //   'failed': function (e) {
    //     console.log('call failed with cause: ' + e.data.cause);
    //   },
    //   'ended': function (e) {
    //     console.log('call ended with cause: ' + e.data.cause);
    //   },
    //   'confirmed': function (e) {
    //     console.log('call confirmed');
    //   }
    // };

    // const options = {
    //   'eventHandlers': eventHandlers,
    //   'mediaConstraints': { 'audio': true, 'video': false }
    // };

    // await userAgent.call('sip:1000@192.168.2.150')

  }











  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <View style={{ justifyContent: 'center', flex: 1 }}>
      <Button title="Call" onPress={makeCall} />
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
