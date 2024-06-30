import { useState } from "react";
import {View, Text} from 'react-native'
import { RegisterStatus, CONNECT_STATUS, useSIPProvider } from "react-native-sipjs";
import { CallSessionItem } from "./CallSessionItem";



export const CallCenter = () => {
  const {
    connectAndRegister,
    sessionManager,
    sessions,
    registerStatus,
    connectStatus,
  } = useSIPProvider();
  const [username, setUsername] = useState<string>("2000");
  const [password, setPassword] = useState<string>("1234");

  const [callTo, setCallTo] = useState<string>("1000");

  return (
    <View>
        <Text>hello</Text>
    </View>

   
  );
};
