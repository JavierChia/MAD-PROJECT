import React, { useState } from 'react';
import { Image, SafeAreaView, View, Text, StyleSheet, ScrollView, SectionList } from 'react-native';
import CheckBox from 'expo-checkbox';

const DATA = [
  {
    title: { name: "Today's Task", color: '#000' },
    data: ['Task 1', 'Task 2'],
  },
  {
    title: { name: 'Overdue', color: '#ff0000' },
    data: ['Task 3', 'Task 4'],
  },
  {
    title: { name: 'Completed!', color: '#03ef62' },
    data: ['Task 5', 'Task 6'],
  },

];

export default function HomeScreen() {
  const Task = ({ title }) => {
    const [isChecked, setChecked] = useState(false);
    return (
      <View style={styles.tasks}>
        <Text style={styles.tasksTitle}>{title}</Text>
        <CheckBox
          style={styles.checkBox}
          color={isChecked ? 'black' : 'black'}
          value={isChecked}
          onValueChange={setChecked}
        />
      </View>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#eaeaea' }}>
      <View style={styles.headerContainer}>
          <Image style={{width: '40%', height: '54%'}}source={require('./logoH.png')}></Image>
      </View>
      <SectionList
        sections={DATA}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => <Task title={item} />}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={[styles.header, { color: title.color }]}>{title.name}</Text>
        )}
        stickySectionHeadersEnabled={false}
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
  // imageContainer: {
  //   padding: 10,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: 'black',
  // },
  // image: {
  //   backgroundColor: 'black',
  //   width: 150,
  //   height: 50,
  // },
  checkBox: {
    alignItems: 'center'
  }
});
