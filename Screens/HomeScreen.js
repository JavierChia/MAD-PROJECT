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
        deadline: taskData.data().deadline.toDate(),
      }));
      setTasksData(allTasks);
    });
    console.log(tasksData);
  };

  const toggleCheckBox = (id, isChecked) => {
    try {
      const ref = doc(db, "users", uid, "Tasks", id);
      updateDoc(ref, {
        done: !isChecked,
      });
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };

  const Task = ({ title, done, id, deadline }) => {
    const [isChecked, setChecked] = useState(done);
    return (
      <View
        style={[styles.tasks, { borderWidth: 2, borderColor: theme.color, backgroundColor: done ? '#36da45' : (deadline.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) ? '#fd3259' : theme.cardBackgroundColor }]}
      >
        <Text style={[styles.tasksTitle, { color: theme.color }]}>{title}</Text>
        <CheckBox
          style={styles.checkBox}
          color={isChecked ? theme.c1 : theme.c2}
          value={isChecked}
          onValueChange={() => {
            setChecked, toggleCheckBox(id, isChecked);
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
          task.deadline.toDateString() === new Date().toDateString()
      ),
    },
    {
      title: "Overdue",
      data: tasksData.filter(
        (task) =>
          !task.done &&
          task.deadline.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)
      ),
    },
    {
      title: "Completed",
      data: tasksData.filter((task) => task.done && task.deadline.toDateString() === new Date().toDateString()),
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
            <Task title={item.name} done={item.done} id={item.id} deadline={item.deadline} />
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
