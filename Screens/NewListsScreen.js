import React, { useState, useEffect, Fragment } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Switch,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  StatusBar,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useIsFocused } from "@react-navigation/native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app as firebase } from './firebase';
import { collection, getFirestore, addDoc, setDoc, doc } from "firebase/firestore";

const db = getFirestore(firebase)
const auth = getAuth();

const formatTime = (deadline) => {
  if (deadline) {
    const date = new Date(deadline);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return date.toLocaleDateString() + " "  + strTime;
  }
  else return "[No Deadline]"
};

export default function App({ route, navigation }) {

  const isFocused = useIsFocused();

  const [listName,setListName] = useState("");

  const handleListNameChange = (name) => {
    setListName(name);
  }

  const [taskList,setTasks] = useState([])
  const [starred, setStarred] = useState(false);

  const toggleStarred = () => {
    setStarred((previousState) => !previousState);
  };

  const [uid,setUID] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      const uid = user.uid;
      setUID(uid)
    });
    if (isFocused) {
      if (route.params) {
        setTasks(JSON.parse(route.params.tasks))
      }
    }
  },[isFocused]);

  const handleCreate = async () => {
    try {
      if (listName == "") {
        alert("List name cannot be blank!")
      } else if (taskList == "") {
        alert("There must at least be one task in the list!")
      }
      else {
        const docRef = await addDoc(collection(db,`users/${uid}/Lists`), {
          listName: listName,
          starred: starred,
          NumberOfTasks: taskList.length,
          TasksDone: 0,
          Overdue: false,
        })
        taskList.forEach( async (task, i) =>  {
          await setDoc(doc(db,`users/${uid}/Lists/${docRef.id}/Tasks/Task${i}`),{
            name: task.name,
            deadline: task.deadline,
            desc: task.desc,
            done: "false"
          }).catch((error)=> {
            alert(error)
          })
        });

        navigation.navigate("Lists")
      }
    } catch (error) {
      alert("Error while creating list" + error)
    }
  };

  const removeTask = (index) => {
    const tasks = []
    for (let i in taskList) {
      if (i != index) {
        tasks.push(taskList[i])
      }
    }
    setTasks(tasks)
  }

  const editTask =  (index) => {
    navigation.navigate("EditTaskScreen",{sender:"NewListsScreen", index: index, tasks: JSON.stringify(taskList)});
  }

  const renderTask = ({ item,index }) => {
    return (
      <View key={index} >
          <TouchableOpacity style={styles.task} onPress={() => {editTask(index)}}>
            <View style={{width: "70%"}}>
              <Text style={styles.taskText}>{item.name}</Text>
              <Text>{formatTime(item.deadline)}</Text>
            </View>
            <TouchableOpacity style={styles.remove} onPress={() => {removeTask(index)}}>
              <MaterialCommunityIcons style={{fontSize:50}} color="white" name='cancel'/>
            </TouchableOpacity>
          </TouchableOpacity>
      </View>
    );
  };
  return (
    <Fragment>
      <SafeAreaView style={{ flex: 0, backgroundColor: 'black' }} />
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('NavigationBar');
            }}>
            <AntDesign name="leftcircleo" style={styles.returnIcon} />
          </TouchableOpacity>
          <Text style={styles.header}>NewList</Text>
        </View>

        <View style={[styles.settings, { flex: 8 }]}>
          <View style={[styles.titleBox, { flex: 1 }]}>
            <TextInput
              style={styles.titleInput}
              placeholderTextColor="#888"
              onChangeText={handleListNameChange}
              placeholder="Untitled List..."
              value={listName}></TextInput>
          </View>

          <View style={[styles.starredSection, { flex: 1 }]}>
            <View style={{ justifyContent: 'center' }}>
              <Text style={styles.settingName}>Starred List</Text>
            </View>

            <View>
              <Switch
                trackColor={{ false: '#4C4C4C', true: '#03EF62' }}
                onValueChange={toggleStarred}
                thumbColor="#FFFFFF"
                value={starred}
              />
            </View>
          </View>

          <View style={{ width: '100%', paddingBottom:5 }}>
            <View style={{ backgroundColor: 'black' }}>
              <Text style={styles.tasks}>Tasks</Text>
            </View>
          </View>
          <View style={{ flex: 4, width: '100%' }}>
            <View style={{ flex: 1 }}>
              <FlatList
                style={{ flex: 1 }}
                data={taskList}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => {
                  return renderTask({ item, index });
                }}
              />
            </View>
            <View></View>
          </View>
          <View style={{ flex: 1, width: '100%', alignItems: 'center' }}>
            <TouchableOpacity
              style={styles.newTask}
              onPress={async() => {
                navigation.navigate('NewTaskScreen',{sender:"NewListsScreen", tasks:JSON.stringify(taskList)});
              }}>
              <Text style={styles.newTaskText}>+</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }} />
          <View
            style={[
              { flex: 1.2, alignItems: 'center', width: '100%' },
              styles.settingSection,
            ]}>
            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreate}>
              <Text style={styles.buttonText}>Create</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 0.2 }} />
        </View>
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
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    margin: 20,
  },
  returnIcon: {
    color: 'white',
    fontSize: 30,
    marginLeft: 20,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  settings: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  titleBox: {
    backgroundColor: '#333333',
    width: '75%',
    marginTop: 40,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  titleInput: {
    textAlign: "center",
    fontSize: 28,
    color: 'white',
  },
  starredSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '75%',
    marginBottom: 20,
  },
  settingName: {
    fontSize: 20,
    fontWeight: '500',
  },
  tasks: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    padding: 8,
    paddingLeft: 20,
  },
  task: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#E2E2E2',
    margin: 20,
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 10,
  },
  taskText: {
    fontSize: 24,
    color: 'black',
    fontWeight: '500'
  },
  remove: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: "center"
  },
  newTask: {
    backgroundColor: "#58F",
    width: '90%',
    borderRadius: 10,
    marginTop: 10,
  },
  newTaskText: {
    color: "white",
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 30,
  },
  createButton: {
    backgroundColor: '#03EF62',
    width: '40%',
    height: 60,
    justifyContent: "center",
    borderRadius: 10
  },
  buttonText: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 6,
  },
});
