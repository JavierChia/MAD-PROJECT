import React, { useState, useContext, useEffect } from "react";
import {
  Image,
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  SectionList,
  FlatList,
} from "react-native";
import CheckBox from "expo-checkbox";
import { EventRegister } from "react-native-event-listeners";
import { app as firebase } from "./firebase";
import {
  doc,
  updateDoc,
  getDoc,
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import themeContext from "../config/themeContext";
import theme from "../config/theme";

const auth = getAuth(firebase);
const db = getFirestore(firebase);

export default function NewHomeScreen() {
  const [tasksData, setTasksData] = useState([]);
  const [uid, setUid] = useState("");
  const theme = useContext(themeContext);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
        getTasks(user.uid);
      } else {
        return;
      }
    });
  }, []);

  const getTasks = async (uid) => {
    const ref = await collection(db, "users", uid, "Tasks");
    onSnapshot(ref, (tasks) => {
      const allTasks = tasks.docs.map((taskData) => ({
        id: taskData.id,
        name: taskData.data().name,
        desc: taskData.data().desc,
        done: taskData.data().done,
        taskID: taskData.data().taskID,
        listID: taskData.data().listID,
        deadline: new Date(taskData.data().deadline)//take out
      }));
      setTasksData(allTasks);
    });
  };

  const toggleCheckBox = async (id, isChecked, taskID, listID) => {
    try {
      const ref = doc(db, "users", uid, "Tasks", id);
      updateDoc(ref, {
        done: !isChecked,
      });
      const ref2 = doc(db, "users", uid, "Lists", listID, "Tasks", taskID);
      updateDoc(ref2, {
        done: !isChecked,
      });

      const ref3 = doc(db, "users", uid, "Lists", listID);
      const docSnap = await getDoc(ref3)
      if (!isChecked) {
        updateDoc(ref3, {TasksDone : (docSnap.data().TasksDone+1)})
      }
      else {
        updateDoc(ref3, {"TasksDone" : (docSnap.data().TasksDone-1)})
      }
    } catch (error) {
      alert(error);
    }
  };

  const Task = ({ title, done, id, deadline, taskID, listID }) => {
    const [isChecked, setChecked] = useState(done);
    return (
      <View
        style={[styles.tasks, { borderWidth: 2, borderColor: theme.color, backgroundColor: done ? '#36da45' : (new Date() - deadline > 0) ? '#fd3259' : theme.cardBackgroundColor }]}//fjahjwke
      >
        <Text style={[styles.tasksTitle, { color: theme.color }]}>{title}</Text>
        <CheckBox
          style={styles.checkBox}
          color={isChecked ? theme.c1 : theme.c2}
          value={isChecked}
          onValueChange={() => {
            setChecked, toggleCheckBox(id, isChecked, taskID, listID);
          }}
        />
      </View>
    );
  };

  const sections = [
    {
      title: "Today's Tasks",
      data: tasksData.filter(
        (task) =>
          !task.done &&
          task.deadline.toDateString() === new Date().toDateString() &&
          !(new Date() - task.deadline > 0) //fwahefleka
      ),
    },
    {
      title: "Overdue",
      data: tasksData.filter(
        (task) =>
          !task.done && task.deadline != new Date(null) &&
          new Date() - task.deadline > 0//fehwafiaew
      ),
    },
    {
      title: "Completed",
      data: tasksData.filter((task) => task.done && task.deadline.toDateString() === new Date().toDateString()), //fewfwe
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
      <View style={styles.headerContainer}>
        <Image
          style={{ width: "40%", height: "54%" }}
          source={require("./logoH.png")}
        />
      </View>

      <SectionList
        sections={sections.filter((section) => section.data.length > 0)}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.header}>
            <Text style={[styles.headerText, { color: title === "Overdue" ? '#fd3259' : (title === "Completed" ? '#36da45' : theme.color) }]}>
              {title}
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View>
            <Task title={item.name} done={item.done} id={item.id} deadline={item.deadline} taskID = {item.taskID} listID = {item.listID}/>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tasks: {
    padding: 20,
    borderRadius: 10,
    overflow: "hidden",
    marginHorizontal: 20,
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  taskRow: {
    color: "#000",
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom: 10,
  },
  tasksTitle: {
    fontSize: 24,
    fontWeight: '600'
  },

  headerContainer: {
    height: "11%",
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  checkBox: {
    alignItems: "center",
    tintColor: "pink",
  },
});
