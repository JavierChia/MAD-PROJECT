import React, { Fragment } from 'react';
import { useState } from 'react';
import { Text, View, SafeAreaView, StyleSheet, SectionList, Alert, Button, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons, FontAwesome, MaterialIcons, AntDesign } from '@expo/vector-icons';

const TASKS = [
  { title: 'Mon 9 Jan', data: ['Bake Cake', 'Eat Cake'] },
  { title: 'Wed 11 Jan', data: ['Do Homework'] },
  { title: 'Thu 12 Jan', data: ['Get a Haircut'] },
];



export default function App({ navigation }) {
  const Bar = () => {
    return (
      <View style={[styles.bar, { flex: 1, flexDirection: "row" }]}>
        <View style={[styles.backButton, { flex: 3 }]}>
          <TouchableOpacity onPress={() => { navigation.navigate('NavigationBar') }}><AntDesign name="leftcircleo" style={styles.returnIcon} /></TouchableOpacity>
          <Text style={styles.barText}>
            List 1's Tasks
          </Text>
        </View>

        <View style={{ flex: 1 }} />
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Ionicons name="settings-outline" style={styles.returnIcon} />
        </View>
      </View>
    )
  }
  return (
    <Fragment>
      <SafeAreaView style={{ flex: 0, backgroundColor: 'black' }} />
      <StatusBar barStyle='light-content' />
      <SafeAreaView style={styles.container}>

        <View style={styles.headerContainer}>
          <View style={styles.titleandback}>
            <TouchableOpacity onPress={() => { navigation.navigate('NavigationBar') }}>
              <AntDesign name="leftcircleo" style={styles.returnIcon} />
            </TouchableOpacity>
            <Text style={styles.header}>List 1's Tasks</Text>
          </View>
          <Ionicons name="settings-outline" style={styles.returnIcon} />
        </View>

        <Tasks />
      </SafeAreaView>
    </Fragment>
  );
}




const Tasks = () => {
  return (
    <View style={{ flex: 9 }}>
      <SectionList
        sections={TASKS}
        renderItem={renderTask}
        renderSectionHeader={renderDay}>
      </SectionList>
    </View>

  )
}

//Functions
const renderDay = ({ section }) => {
  return (
    <Text style={[styles.day, { color: section.title == "Wed 11 Jan" ? "#03EF62" : "#888888" }, styles.day]}>{section.title}</Text>
  )
}

const renderTask = ({ item }) => {
  return (
    <View style={styles.task}>
      <Text style={styles.taskText}>
        {item}
      </Text>
      <View style={[styles.button, { color: "black" }]}>
        <Button title="" onPress={() => alert(item + " Task Done!")} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    height: '10.1%',
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  titleandback: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    
  },
  container: {
    flex: 1,
    flexDirection: "column"
  },

  //Top Bar Styles
  bar: {
    justifyContent: "center",
    backgroundColor: "black",
    marginBottom: 10
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center"
  },
  barText: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    paddingTop: 2,
    paddingLeft: 10
  },
  returnIcon: {
    color: "white",
    fontSize: 30,
    marginHorizontal: 20,
  },

  day: {
    textAlign: "center",
    fontSize: 18,
    backgroundColor: "black",
    fontWeight: "bold",
    marginTop: 1, /////////////
  },

  //Styles of all the tasks
  task: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  button: {
    width: 24,
    border: "solid 1px black",
    borderRadius: 4,
    height: 24,
    backgroundColor: "black",
  },

  taskText: {
    fontSize: 20
  },
});
