import React, { Fragment, useState, useEffect } from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  SectionList,
  Alert,
  Button,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {
  Ionicons,
  FontAwesome,
  MaterialIcons,
  AntDesign,
} from '@expo/vector-icons';
import CheckBox from 'expo-checkbox';

const Task = require("./TaskComponent")
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app as firebase } from './firebase';
import { collection, getFirestore, doc, getDoc, getDocs } from "firebase/firestore";
import { useIsFocused } from '@react-navigation/core';

const db = getFirestore(firebase)
const auth = getAuth();

export default function App({ route, navigation }) {

  const isFocused = useIsFocused();
  var listID = "";
  var uid = "";

  const [tasksList, setTasksList] = useState([]);
  const [listName, setListName] = useState('');

  const readData = async () => {
    try {
      const listRef = doc(db,"users",uid,"Lists",listID);
      const list = await getDoc(listRef);
      setListName(list.data().listName);
      const tasks = await getDocs(collection(db,"users",uid,"Lists",listID,"Tasks"));
      var tasksData = tasks.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      tasksData.sort((a, b) => {
        if (!a.deadline) {
          return 1;
        }
        if (!b.deadline) {
          return -1;
        }
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      });
      var TASKS = [];
      for (let i in tasksData) {
        const task = tasksData[i];
        var day = 'No Deadline :)';
        if (task.deadline) {
          day = new Date(task.deadline).toDateString();
        }
        var dayExists = false;
        for (let x = 0; x < TASKS.length; x++) {
          if (TASKS[x].title == day) {
            dayExists = true;
            TASKS[x].data.push(JSON.stringify(task));
          }
        }
        if (!dayExists) {
          TASKS.push({ title: day, data: [JSON.stringify(task)] });
        }
      }
      setTasksList(TASKS);
    } catch (error) {
      // alert(error + "je");
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      uid = user.uid;
      listID = route.params.listID;
      readData()
      
    });
  }, [isFocused]);

  const Tasks = () => {
    return (
      <View style={{ flex: 9 }}>
        <SectionList
          sections={tasksList}
          renderItem={renderTask}
          renderSectionHeader={renderDay}></SectionList>
      </View>
    );
  };

  const renderDay = ({ section }) => {
    return (
      <Text
        style={[
          styles.day,
          {
            color:
              section.title == new Date().toDateString()
                ? '#03EF62'
                : '#888888',
          },
        ]}>
        {section.title}
      </Text>
    );
  };

  const renderTask = ({ item }) => {
    const taskInfo = JSON.parse(item);

    return (
      <Task name={taskInfo.name} desc={taskInfo.desc} deadline={taskInfo.deadline}/>
    );
  };

  return (
    <Fragment>
      <SafeAreaView style={{ flex: 0, backgroundColor: 'black' }} />
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.titleandback}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('NavigationBar');
              }}>
              <AntDesign name="leftcircleo" style={styles.returnIcon} />
            </TouchableOpacity>
            <Text style={styles.header}>{listName}</Text>
          </View>
          <TouchableOpacity onPress={() => {
            navigation.navigate("EditListScreen",{listID: route.params.listID})}}>
            <Ionicons name="settings-outline" style={styles.returnIcon} />
          </TouchableOpacity>
        </View>

        <Tasks />
      </SafeAreaView>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: '10.1%',
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleandback: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#eaeaea',
  },
  returnIcon: {
    color: 'white',
    fontSize: 30,
    marginHorizontal: 20,
  },
  day: {
    textAlign: 'center',
    fontSize: 18,
    backgroundColor: 'black',
    fontWeight: 'bold',
    marginTop: 1,
    marginBottom: 14,
  },

  //Styles of all the tasks
  task: {
    padding: 16,
    width: '90%',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginBottom: 14,
    marginLeft: '5%',
    borderRadius: 10,
  }
});
