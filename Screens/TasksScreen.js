import React, { Fragment } from 'react';
import { useState, useEffect } from 'react';
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

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app as firebase } from './firebase';
import { collection, getFirestore, doc, getDoc, getDocs } from "firebase/firestore";

const db = getFirestore(firebase)
const auth = getAuth();

export default function App({ navigation }) {
  const [tasksList, setTasksList] = useState([]);
  const [listName, setListName] = useState('');
  const [listID,setListID] = useState("VGhiRyHBnIygTLZxuMGP");

  const [listRef,setListRef] = useState(null);
  const [tasksRef,setTasksRef] = useState(null);

  const getUser = () => {
    onAuthStateChanged(auth, (user) => {
      const uid = user.uid;
      alert("User ID:" + uid);
      setTasksRef(doc(db,"/users/" + uid))
      setListRef(collection(db,`/users/${uid}/Lists/${listID}/Tasks`))
    });
  }

  const readData = async () => {
    try {
      list = await getDoc(listRef);
      setListName(list.data().listName);
      const tasks = await getDocs(tasksRef);
      var tasksData = tasks.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      tasksData.sort((a, b) => {
        if (!a.deadline) {
          return 1;
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
      alert(error);
    }
  };

  useEffect(() => {
    readData();
    getUser();
  }, []);

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
    const [isChecked, setChecked] = useState(false);

    const formatTime = (date) => {
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0' + minutes : minutes;
      var strTime = hours + ':' + minutes + ' ' + ampm;
      return strTime;
    };

    return (
      <View style={styles.task}>
        <View style={{flex: 0, flexDirection: "column"}}>
        <Text style={styles.taskText}>{taskInfo.name}</Text>
        <Text style={styles.taskTime}>
          {taskInfo.deadline ? formatTime(new Date(taskInfo.deadline)) : ''}
        </Text>
        </View>

        <CheckBox
          color={isChecked ? 'black' : 'black'}
          value={isChecked}
          onValueChange={setChecked}
        />
      </View>
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
          <Ionicons name="settings-outline" style={styles.returnIcon} />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginBottom: 14,
    marginLeft: '5%',
    borderRadius: 10,
  },
  taskText: {
    fontSize: 20,
  },
  taskTime: {
    border: 'black 2 solid',
  },
});
