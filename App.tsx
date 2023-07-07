import { View, Text } from 'react-native'
import React, {useEffect, useState} from 'react'
import firestore from '@react-native-firebase/firestore';

export default function App() {
  const [myData, setMyData] = useState(null)

  useEffect(() => {
    getDatabase();
  }, [])

  const getDatabase = async () => {
    try {
      const data = await firestore().collection('testing').doc("jptagcnf2aqqtPrfjoDU").get();

      setMyData(data._data)
      console.log(data)
      console.log(data?._data)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <View>
      <Text>Name: {myData ? myData?.name : "Loading..."}</Text>
      <Text>Age: {myData ? myData?.age : "Loading..."}</Text>
    </View>
  )
}