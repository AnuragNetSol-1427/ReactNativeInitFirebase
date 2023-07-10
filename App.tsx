import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';

export default function App() {
  // Below code is for firestore but only related to read the data
  // const [myData, setMyData] = useState(null)

  // useEffect(() => {
  //   getDatabase();
  // }, [])

  // const getDatabase = async () => {
  //   try {
  //     const data = await firestore().collection('testing').doc("jptagcnf2aqqtPrfjoDU").get();

  //     setMyData(data._data)
  //     console.log(data)
  //     console.log(data?._data)
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }

  // Below code is for realtime database
  // const [myData, setMyData] = useState(null)

  // useEffect(()=>{
  //   getDatabase();
  // }, [])

  // const getDatabase = async () => {
  //   try {
  //     const data = await database().ref('users/1').once("value")
  //     console.log(data)
  //     setMyData(data.val())

  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  // Now, creation of todo app in realtime database
  const [inputTextValue, setInputTextValue] = useState(null);
  const [list, setList] = useState(null);
  const [isUpdateData, setIsUpdateData] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [showError, setShowError] = useState(false);

  // Add data to firebase realtime database
  const handleAddData = async () => {
    try {
      if(inputTextValue.length > 0) {
        const index = list.length;
        const response = await database().ref(`todo/${index}`).set({
          value: inputTextValue,
        });
        console.log(response);
        setInputTextValue('');
        setShowError(false);
      }
      else {
        setShowError(true)
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Read data from firebase realtime database
  useEffect(() => {
    getDatabase();
  }, []);

  const getDatabase = async () => {
    try {
      // const data = await database().ref('todo').once('value');
      const data = await database()
        .ref('todo')
        .on('value', tempData => {
          console.log(data);
          setList(tempData.val());
        });
      // console.log(data);
      // setList(data.val());
    } catch (error) {
      console.log(error);
    }
  };

  // Update data to firebase realtime database
  const handleUpdateData = async () => {
    try {
     if(inputTextValue.length  > 0) {
      const response = await database().ref(`todo/${selectedCardIndex}`).update({
        value: inputTextValue
      })

      setInputTextValue("");
      setIsUpdateData(false)
      setShowError(false);

      console.log(response)
     }
     else{
      setShowError(true);
     }
    } catch (error) {
      console.log(error)
    }
  }

  const handleCardPress = async (cardIndex, cardValue) => {
    try {
      setIsUpdateData(true)
      setSelectedCardIndex(cardIndex)
      setInputTextValue(cardValue)
      console.log(cardIndex)

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <View>
        <Text style={{textAlign: 'center', fontSize: 20, fontWeight: 'bold'}}>
          Todo App
        </Text>
        <TextInput
          style={styles.inputBox}
          placeholder="Enter any value"
          value={inputTextValue}
          onChangeText={val => setInputTextValue(val)}
        />
        {
          showError ? <Text style={{fontSize: 12, color: 'red', marginBottom: 5}}>Enter some todo</Text> :  ""
        }
        {!isUpdateData ? (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              handleAddData();
            }}>
            <Text style={{color: 'white'}}>Add</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              handleUpdateData();
            }}>
            <Text style={{color: 'white'}}>Update</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.cardContainer}>
        <Text style={{marginVertical: 20, fontSize: 20, fontWeight: 'bold'}}>
          Todo List
        </Text>

        <FlatList
          data={list}
          renderItem={item => {
            // console.log(item);
            const cardIndex = item.index;

            if (item.item !== null) {
              return (
                <TouchableOpacity style={styles.card} onPress={() => handleCardPress(cardIndex, item.item.value)}>
                  <Text>{item.item.value}</Text>
                </TouchableOpacity>
              );
            }
          }}
        />
      </View>
    </View>
  );
}

const {height, width} = Dimensions.get('screen');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  inputBox: {
    width: width - 30,
    borderRadius: 15,
    borderWidth: 2,
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
  },
  addButton: {
    backgroundColor: 'blue',
    alignItems: 'center',
    padding: 10,
    borderRadius: 50,
  },
  cardContainer: {
    marginVertical: 20,
  },
  card: {
    backgroundColor: '#fff',
    width: width - 40,
    padding: 20,
    borderRadius: 30,
    marginVertical: 10,
  },
});
