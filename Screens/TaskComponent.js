import { useState, useEffect } from 'react';
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
import { collection, getFirestore, doc, getDoc, getDocs } from "firebase/firestore";
import CheckBox from 'expo-checkbox';

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

const Task = (props) => {
    const [isChecked, setChecked] = useState(false);
    return (
        <View style={styles.task}>
        <View style={{width: "87%", justifyContent: "center"}}>
          <Text style={{fontSize:20,fontWeight:"bold"}}>{props.name}</Text>
          {props.desc != "" && (
          <Text style={{fontSize:14, marginBottom:5}}>{props.desc}</Text>)}
          {props.deadline && (
          <Text style={{fontWeight:"500",fontSize:14, color: "#58F"}}>
            {formatTime(new Date(props.deadline))}
          </Text>)}
        </View>
        <View style={{width: "8%"}}>
        <CheckBox
          color={isChecked ? 'black' : 'black'}
          value={isChecked}
          onValueChange={() => {
            const ref = doc(db, "users", uid, "Lists", listID, "Tasks", props.id);
            updateDoc(ref, {
              done: !isChecked,
            });
            setChecked()
          }}
        />
        </View>
      </View>
    )
}

const styles = StyleSheet.create({
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
})

module.exports = Task;