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

// const Task = require("./TaskComponent")
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app as firebase } from './firebase';
import { collection, getFirestore, doc, getDoc, getDocs, updateDoc, where, query, setDoc } from "firebase/firestore";
import { useIsFocused } from '@react-navigation/core';

const db = getFirestore(firebase)
const auth = getAuth();

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

export default function App({ route, navigation }) {

  const isFocused = useIsFocused();
  var listID = "";
  var [uid,setUID] = useState(auth.currentUser.uid)

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
      if(user) {
        setUID(user.uid)
      listID = route.params.listID;
      readData()
      } else {
        return;
      }
      
      
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
  const toggleCheckBox = async (id, isChecked) => {
    try {
      const ref = doc(db, "users", uid, "Lists", route.params.listID, "Tasks", id);
      updateDoc(ref, {
        done: !isChecked
      });
      const q = query(collection(db, "users", uid, "Tasks"), where("taskID", "==", id));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((docu) => {
        const ref2 = doc(db, "users", uid, "Tasks", docu.id);
        updateDoc(ref2, {
          done: !isChecked,
        });
      });
      const ref3 = doc(db, "users", uid, "Lists",route.params.listID);
      const docSnap = await getDoc(ref3)
      if (!isChecked) {
        await updateDoc(ref3, {"TasksDone" : (docSnap.data().TasksDone+1)})
      }
      else {
        await updateDoc(ref3, {"TasksDone" : (docSnap.data().TasksDone-1)})
      }
    } catch (error) {
      alert(error);
    }
  };
  
  const renderTask = ({ item }) => {
    
    const taskInfo = JSON.parse(item);
    const [isChecked, setChecked] = useState(taskInfo.done);
    return (
      <View style={styles.task}>
      <View style={{width: "87%", justifyContent: "center"}}>
        
        <Text style={{fontSize:20,fontWeight:"bold"}}>{taskInfo.name}</Text>
        {taskInfo.desc != "" && (
        <Text style={{fontSize:14, marginBottom:5}}>{taskInfo.desc}</Text>)}
        {taskInfo.deadline && (
        <Text style={{fontWeight:"500",fontSize:14, color: "#58F"}}>
          {formatTime(new Date(taskInfo.deadline))}
        </Text>)}
      </View>
      <View style={{width: "8%"}}>
      <CheckBox
        color={isChecked ? 'black' : 'black'}
        value={isChecked}
        onValueChange={() => {
          toggleCheckBox(taskInfo.id,isChecked)
          setChecked(!isChecked)
        }}
      />
      </View>
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
