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
const user = auth.currentUser;
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

  const Task = ({ title, done, id }) => {
    const [isChecked, setChecked] = useState(done);
    return (
      <View
        style={[styles.tasks, { backgroundColor: theme.cardBackgroundColor }]}
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
      <View style={styles.headerContainer}>
        <Image
          style={{ width: "40%", height: "54%" }}
          source={require("./logoH.png")}
        ></Image>
      </View>

      {tasksData.filter(
        (task) =>
          !task.done &&
          task.deadline.toDateString() === new Date().toDateString()
      ).length > 0 && (
        <View style={styles.header}>
          <Text style={[styles.headerText, { color: theme.color }]}>
            Today's Tasks
          </Text>
        </View>
      )}
      {tasksData
        .filter(
          (task) =>
            !task.done &&
            task.deadline.toDateString() === new Date().toDateString()
        )
        .map((task) => (
          <View>
            <Task title={task.name} done={task.done} id={task.id} />
          </View>
        ))}

      {tasksData.filter(
        (task) =>
          !task.done &&
          task.deadline.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)
      ).length > 0 && (
        <View style={styles.header}>
          <Text style={[styles.headerText, { color: theme.color }]}>
            Overdue
          </Text>
        </View>
      )}
      {tasksData
        .filter(
          (task) =>
            !task.done &&
            task.deadline.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)
        )
        .map((task) => (
          <View>
            <Task title={task.name} done={task.done} id={task.id} />
          </View>
        ))}

      {tasksData.filter((task) => task.done).length > 0 && (
        <View style={styles.header}>
          <Text style={[styles.headerText, { color: theme.color }]}>
            Completed
          </Text>
        </View>
      )}
      {tasksData
        .filter((task) => task.done)
        .map((task) => (
          <View>
            <Task title={task.name} done={task.done} id={task.id} />
          </View>
        ))}
    </SafeAreaView>
  );
}

{
  /* <SectionList
                style={[styles.sectionList, { backgroundColor: theme.backgroundColor }]}
                stickySectionHeadersEnabled={false}
                sections={[
                    { title: 'Today\'s Tasks', data: taskData.filter(item => !item.deadline == new Date()) },
                    { title: 'Overdue', data: taskData.filter(item => item.Overdue) }, //compare deadline to current dead, if its less/more == overdue
                    { title: 'Completed', data: taskData.filter(item => item.done === true) },
                ]}
                renderItem={({ item, index }) => (
                    <Pressable key={index}>
                      
                        
                    </Pressable>
                )}
                renderSectionHeader={({ section: { title } }) => (

                    <Text style={[styles.sectionHeader, { color: theme.color }]}>{title}</Text>
                )}
                keyExtractor={(item, index) => item + index}
            /> */
}

// const tasksAndListNames = [];
// for (const list of listsData) {
//   const tasksRef = query(collection(db, "users", uid, "Lists", list.id, "Tasks"));
//   const tasks = await getDocs(tasksRef);
//   const taskData = tasks.map((task) => {
//     return { taskId: task.id, ...task.data() };
//   });

//   for (const task of taskData) {
//     tasksAndListNames.push({
//       listId: list.id,
//       listName: list.name,
//       taskId: task.taskId,
//       task: task.data(),
//     });
//   }
// }

// return tasksAndListNames;

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

const styles = StyleSheet.create({
  tasks: {
    padding: 20,
    borderRadius: 10,
    overflow: "hidden",
    marginHorizontal: 20,
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
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
    fontSize: 20,
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

//useEffect(() => {
//   onAuthStateChanged(auth, (user) => {
//     if (user) {
//       setUid(user.uid);
//       ListName(user.uid);
//       taskData(user.uid, allLists);
//       test();
//     }
//   });

// }, []);

// const ListName = async (uid) => {
//   const listsRef = collection(db, "users", uid, "Lists");
//   onSnapshot(listsRef, (lists) => {
//     const listsIDs = lists.docs
//       .map((listData) => ({
//         id: listData.id,
//       }))
//     setAllLists(listsIDs)
//   })
// }

// const querySnapshot =  getDocs(collection(db, "cities"));
// querySnapshot.forEach((doc) => {
//   // doc.data() is never undefined for query doc snapshots
//   console.log(doc.id, " => ", doc.data());
// });

// const taskData = async (uid, lists) => {
//   let allTasksData = [];
//   for (let i = 0; i < lists.length; i++) {
//     const tasksRef = collection(db, "users", uid, "Lists", lists[i].id, "Tasks")
//     onSnapshot(tasksRef, (tasks) => {
//       const tasksData = tasks.docs
//         .map((allTaskData) => ({
//           listsID: lists[i].id,
//           id: allTaskData.id,
//           deadline: allTaskData.data().deadline.nanoseconds,
//           desc: allTaskData.data().desc,
//           done: allTaskData.data().done,
//           name: allTaskData.data().name,
//         }))
//       allTasksData = allTasksData.concat(tasksData);
//     })
//   }
//   setAllTasksData(allTasksData);
// }
