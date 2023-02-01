import React, { Fragment, useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  Switch,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function App({ route, navigation }) {
  const [taskName, setTaskName] = useState('');
  const [desc, setDesc] = useState('');

  const [deadlineEnabled, setDeadlineEnabled] = useState(false);
  const [isDisplayDate, showDate] = useState(false);
  const [date, setDate] = useState(new Date());
  const [isDisplayTime, showTime] = useState(false);
  const [time, setTime] = useState(new Date('Jan 1, 2023, 12:00:00'));

  function onTaskNameChange(newName) {
    setTaskName(newName);
  }

  function toggleDeadline() {
    setDeadlineEnabled((previousState) => !previousState);
  }

  const displayDate = () => {
    showDate(true);
  };

  const displayTime = () => {
    showTime(true);
  };

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

  const changeSelectedDate = (event, selectedDate) => {
    showDate(false);
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const changeSelectedTime = (event, selectedTime) => {
    showTime(false);
    const currentTime = selectedTime || time;
    setTime(currentTime);
  };

  function onDescChange(newDesc) {
    setDesc(newDesc);
  }

  handleCreate = async () => {
    try {
      if (taskName == '') {
        alert('Task name cannot be blank!');
      } else {
        const deadline = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          time.getHours(),
          time.getMinutes(),
          0,
          0
        );
        const taskInfo = {
          name: taskName,
          deadline: deadlineEnabled ? deadline : null,
          desc: desc,
          done: false
        };
        var tasks = JSON.parse(route.params.tasks);
        tasks.push(taskInfo)
        navigation.navigate(route.params.sender,{tasks: JSON.stringify(tasks), listID: route.params.listID});
      }
    } catch (error) {
      alert('create task failed' + error.message);
    }
  };

  useEffect(() => {
    setTaskName('');
    setDeadlineEnabled(false);
    setDate(new Date());
    setTime(new Date('Jan 1, 2023, 12:00:00'));
    setDesc('');
  }, []);

  return (
    <Fragment>
      <SafeAreaView style={{ backgroundColor: 'black' }} />
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(route.params.sender, {listID: route.params.listID});
            }}>
            <AntDesign name="leftcircleo" style={styles.returnIcon} />
          </TouchableOpacity>
          <Text style={styles.header}>New Task</Text>
        </View>
        <View style={styles.settings}>
          <View style={styles.titleInputContainer}>
            <TextInput
              style={styles.titleInput}
              placeholderTextColor="#888"
              placeholder="My Task..."
              value={taskName}
              onChangeText={onTaskNameChange}></TextInput>
          </View>

          <View style={styles.deadline}>
            <View>
              <Text style={styles.settingName}>Deadline</Text>
            </View>

            <View>
              <Switch
                trackColor={{ false: '#4C4C4C', true: '#03EF62' }}
                onValueChange={toggleDeadline}
                thumbColor="#FFFFFF"
                value={deadlineEnabled}
              />
            </View>
          </View>

          <View style={{ width: '100%', flex:0, flexDirection:"row" }}>
            <View style={{ width: '58%', marginRight:"2%" }}>
              <TouchableOpacity style={[styles.timePicker, {backgroundColor: (deadlineEnabled? "#58F" : "#777"), borderBottomLeftRadius:14, borderTopLeftRadius:14}]}
                disabled={!deadlineEnabled}
                onPress={displayDate}>
                <Text style={{fontSize:18, fontWeight:"500", color: (deadlineEnabled? "white":"black")}}>{date.toDateString()}</Text>
              </TouchableOpacity>
              {isDisplayDate && (
                <DateTimePicker
                  display="default"
                  mode="date"
                  value={date}
                  onChange={changeSelectedDate}
                />
              )}
            </View>

            <View style={{ width: '40%' }}>
              <TouchableOpacity style={[styles.timePicker, {backgroundColor: (deadlineEnabled? "#58F" : "#777"), borderBottomRightRadius:14, borderTopRightRadius:14}]}
                disabled={!deadlineEnabled}
                onPress={displayTime}>
                  <Text style={{fontSize:18, fontWeight:"500", color: (deadlineEnabled? "white":"black")}}>{formatTime(time)}</Text>
              </TouchableOpacity>
              {isDisplayTime && (
                <DateTimePicker
                  display="default"
                  mode="time"
                  value={time}
                  onChange={changeSelectedTime}
                />
                
              )}
            </View>
          </View>

          <View style={styles.desc}>
            <Text style={styles.settingName}>Description</Text>
            <View style={styles.descBox}>
              <TextInput
                multiline={true}
                style={styles.descText}
                placeholderTextColor="#888"
                placeholder="Enter text here..."
                value={desc}
                onChangeText={onDescChange}></TextInput>
            </View>
          </View>

          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreate}>
            <Text style={styles.buttonText}>Create</Text>
          </TouchableOpacity>
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
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  returnIcon: {
    color: 'white',
    fontSize: 30,
    marginLeft: 20,
  },
  settingName: {
    fontSize: 18,
    fontWeight: '500',
  },
  settings: {
    width: '86%',
    flex: 1,
    alignItems: 'center',
    margin: "7%"
  },
  titleInputContainer: {
    width: '100%',
    marginTop: "15%",
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    padding: 5,
    paddingTop: 10,
    paddingBottom: 10
  },
  titleInput: {
    textAlign: "center",
    fontSize: 28,
    color: 'white',
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 10,
  },
  deadline: {
    marginTop: "12%",
    flex: 0,
    flexDirection: 'row',
    width: '100%',
    alignItems: "center",
    justifyContent: "space-between"
  },
  timePicker: {
    width: '100%',
    height: 50,
    justifyContent: "center",
    alignItems: "center"
  },
  desc: {
    width: "100%",
    marginTop: "12%",
  },
  descBox: {
    marginTop: 5,
    width: '100%',
    backgroundColor: '#333333',
    borderRadius: 10,
    padding: 8,
    height: 150,
  },
  descText: {
    fontSize: 16,
    color: 'white',
  },
  createButton: {
    marginTop: "20%",
    width: '50%',
    flex: 0,
    backgroundColor: '#03EF62',
    borderRadius: 10,
    height: 60,
    justifyContent: "center"
  },
  buttonText: {
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 24
  },
});
