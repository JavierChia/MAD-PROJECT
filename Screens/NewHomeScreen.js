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
  const [allTasks, setAllTasks] = useState([]);
  const [uid, setUid] = useState('');
  const theme = useContext(themeContext)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      }
    });

  }, []);

  useEffect(() => {
    getAllLists(uid);
  }, []);
  
  useEffect(() => {
    // Re-render component when allTasks state changes
  }, [allTasks]);

  const getAllLists = async (uid) => {
    const allLists = [];
    const q = query(collection(db, "users", uid, "Lists"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      allLists.push(doc.id)
    });
    let allTasks = [];
    for (var i = 0; i < allLists.length; i++) {
      const ref = collection(db, "users", uid, "Lists", allLists[i], "Tasks");
      onSnapshot(ref, (tasks) => {
        const tasksAndDetails = tasks.docs.map((tasksData) => ({
          id: tasksData.id,
          deadline: tasksData.data().deadline.seconds,
          name: tasksData.data().name,
          done: tasksData.data().done,
        }))
        allTasks = allTasks.concat(tasksAndDetails);
        setAllTasks(allTasks);
      });
    }
  };


  const Task = ({ title, done }) => {
    const [isChecked, setChecked] = useState(false);
    return (
      <View style={[styles.tasks, { backgroundColor: theme.cardBackgroundColor }]}>
        <Text style={[styles.tasksTitle, { color: theme.color }]}>{title}</Text>
        <CheckBox
          style={[styles.checkBox, { color: theme.color }]}
          tintcolor={isChecked ? theme.c1 : theme.c2}
          value={done}
          onValueChange={setChecked}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
      <View style={styles.headerContainer}>
        <Image style={{ width: '40%', height: '54%' }} source={require('./logoH.png')}></Image>
      </View>
      <SectionList
      />
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