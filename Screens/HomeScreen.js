import React, { useState, useContext, useEffect } from 'react';
import { Image, SafeAreaView, View, Text, StyleSheet, ScrollView, SectionList } from 'react-native';
import CheckBox from 'expo-checkbox';
import { EventRegister } from 'react-native-event-listeners';
import { app as firebase } from './firebase'
import { doc, updateDoc, getDoc, getFirestore, collection, query, where, getDocs, onSnapshot } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from "firebase/auth"
import themeContext from '../config/themeContext';
import theme from '../config/theme';

const auth = getAuth(firebase);
const user = auth.currentUser;
const db = getFirestore(firebase);

export default function NewHomeScreen() {
  const [uid, setUid] = useState('');
  const theme = useContext(themeContext)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
        getTasksAndListName(user.uid)
      }
    });

  }, []);

  const getTasksAndListName = (uid) => {
    var tasksAndListNames = [];
    var listsRef = collection(db, "users", uid, "lists");
    getDocs(listsRef).then(function (listsSnapshot) {
      listsSnapshot.forEach(function (listDoc) {
        var listName = listDoc.data().name;
        var tasksRef = listDoc.ref.collection("tasks");
        tasksRef.get().then(function (tasksSnapshot) {
          tasksSnapshot.forEach(function (taskDoc) {
            var task = taskDoc.data();
            tasksAndListNames.push({
              listName: listName,
              task: task
            });
          });
        });
      });
    });
  }

  // def get_tasks_and_list_names(user_id):
  //   tasks_and_list_names = []
  //   lists_ref = db.collection(u'users').document(user_id).collection(u'lists')
  //   lists = lists_ref.stream()
  //   for list_doc in lists:
  //       list_name = list_doc.to_dict()['name']
  //       tasks_ref = list_doc.reference.collection(u'tasks')
  //       tasks = tasks_ref.stream()
  //       for task_doc in tasks:
  //           task = task_doc.to_dict()
  //           tasks_and_list_names.append((list_name, task))
  //   return tasks_and_list_names

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
      <View style={styles.headerContainer}>
        <Image style={{ width: '40%', height: '54%' }} source={require('./logoH.png')}></Image>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tasks: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 20,
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom: 10,
  },
  tasksTitle: {
    fontSize: 20,
  },

  headerContainer: {
    height: '11%',
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkBox: {
    alignItems: 'center',
    tintColor: 'pink'
  }
});
