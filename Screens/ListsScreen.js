import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Pressable, TouchableOpacity, SectionList } from 'react-native';
import IAD from 'react-native-vector-icons/AntDesign'
import II from 'react-native-vector-icons/Ionicons'
import { app as firebase } from './firebase'
import CircularProgress from 'react-native-circular-progress-indicator';
import { doc, updateDoc, getDoc, getFirestore, collection, query, where, onSnapshot, setDoc } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { EventRegister } from 'react-native-event-listeners';
import themeContext from '../config/themeContext';

const auth = getAuth(firebase);
const user = auth.currentUser;
const db = getFirestore(firebase)

export default function ListsScreen({ navigation }) {
    const [listNames, setListNames] = useState([]);
    const [uid, setUid] = useState('');
    const theme = useContext(themeContext);

    //Get User ID from Firebase, as well as display all the user's task lists
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUid(user.uid);
                getListName(user.uid);
            }
        });

    }, []);


    function AddList({ navigation }) {
        return (
            <TouchableOpacity
                style={styles.addButtonStyle}
                onPress={() => navigation.navigate('NewListsScreen')}
            ><II name="add" size={50} color='#fff' />
            </TouchableOpacity>
        );
    }

    //function to display all the user's task lists
    const getListName = async (uid) => {
        const ref = collection(db, "users", uid, "Lists");
        onSnapshot(ref, (lists) => {
            const sortedListNames = lists.docs
                .map((listData) => ({
                    id: listData.id,
                    listName: listData.data().listName,
                    starred: listData.data().starred,
                    NumberOfTasks: listData.data().NumberOfTasks,
                    TasksDone: listData.data().TasksDone,
                    Overdue: listData.data().Overdue,
                }))
                .sort((a, b) => b.starred - a.starred);
            setListNames(sortedListNames);
        });
    };

    //function to toggle on/off starred, as well s update the data base
    const toggleStar = async (id, oStarred) => {
        try {
            const ref = doc(db, "users", uid, "Lists", id);
            updateDoc(ref, {
                starred: !oStarred,
            })
        } catch (error) {
            alert('Error toggling' + error);
        }
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Task Lists</Text>
                <AddList navigation={navigation} />
            </View>
            <SectionList
                style={[styles.sectionList, { backgroundColor: theme.backgroundColor }]}
                stickySectionHeadersEnabled={false}
                sections={[
                    { title: 'Pending', data: listNames.filter(item => !item.Overdue && item.NumberOfTasks !== item.TasksDone) },
                    { title: 'Overdue', data: listNames.filter(item => item.Overdue) },
                    { title: 'Completed', data: listNames.filter(item => item.NumberOfTasks === item.TasksDone) },
                ]}
                renderItem={({ item, index }) => (
                    <Pressable key={index} style={[styles.listsContainer, { backgroundColor: theme.cardBackgroundColor, borderColor: theme.borderColor }, item.NumberOfTasks === item.TasksDone
                        ? { backgroundColor: "#36da45" }
                        : {}, item.Overdue ? { backgroundColor: "#fd3259", borderWidth: 2 } : {}]} onPress={() => navigation.navigate("TasksScreen", {listID: item.id})}>
                        <View style={styles.starAndName}>
                            {!item.Overdue && !(item.NumberOfTasks === item.TasksDone) && (
                                <IAD
                                    style={[styles.starButton, { color: theme.color }]}
                                    name={item.starred ? "star" : "staro"}
                                    size={30}
                                    color="#000"
                                    onPress={() => {
                                        toggleStar(item.id, item.starred);
                                    }}
                                />
                            )}<Text style={[styles.listStyle, { color: theme.color }]}>{item.listName}</Text>
                        </View>
                        {item.NumberOfTasks === item.TasksDone ? (
                            <II
                                name="checkmark-circle-outline"
                                size={38}
                                style={styles.doneIcon}
                            ></II>
                        ) : item.Overdue ? (
                            <II name="alert-circle-outline" size={38} style={styles.alertIcon}></II>
                        ) : (
                            <CircularProgress
                                value={item.TasksDone / item.NumberOfTasks * 100}
                                maxValue={100}
                                valueSuffix={'%'}
                                progressValueFontSize={14}
                                radius={25}
                                clockwise={false}
                                progressValueColor={theme.color}
                                activeStrokeColor={"#03EF62"}
                                inActiveStrokeColor={'#2ecc71'}
                                inActiveStrokeOpacity={0.2}
                            />
                        )}
                    </Pressable>
                )}
                renderSectionHeader={({ section: { title } }) => (

                    <Text style={[styles.sectionHeader, { color: theme.color }]}>{title}</Text>
                )}
                keyExtractor={(item, index) => item + index}
            />
        </SafeAreaView>

    );
}


const styles = StyleSheet.create({
    listNamesContainer: {
        flex: 1,
    },
    sectionHeader: {
        fontSize: 30,
        fontWeight: 'bold',
        marginHorizontal: 20,
        marginTop: 20,
    },
    headerContainer: {
        height: '11%',
        backgroundColor: '#000',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    header: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#fff',
        margin: 20
    },
    addButtonStyle: {
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    alertIcon: {
        backgroundColor: '#000',
        borderRadius: 21,
        paddingLeft: 3,
        overflow: 'hidden',
        color: '#fD3259'
    },
    doneIcon: {
        backgroundColor: '#000',
        borderRadius: 21,
        paddingLeft: 3,
        overflow: 'hidden',
        color: "#03EF62"
    },
    listsContainer: {
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 10,
        alignItems: 'center',
        marginHorizontal: 20,
        marginVertical: 10,
        borderWidth: 2,
    },
    starAndName: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    listStyle: {
        fontSize: 24,
        marginLeft: 10,
    },
});
