import React, { useState, Fragment } from 'react';
import { Text, View, StyleSheet, TextInput, Switch, TouchableOpacity, SafeAreaView, FlatList, StatusBar } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

const TASKS = [
    { id: 1, name: "Task1" },
    { id: 2, name: "Task2" },
    { id: 3, name: "Task3" },
    { id: 4, name: "Task4" },
    { id: 5, name: "Task5" }
]
export default function App({ navigation }) {

    const [starred, setStarred] = useState(false);

    const toggleStarred = () => {
        setStarred(previousState => !previousState);
    }

    const renderTask = ({ item }) => {
        return (
            <View style={[styles.taskBox, { flex: 1 }]}>
                <View style={{ flex: 14 }}>
                    <TouchableOpacity>
                        <Text style={styles.task}>{item.name}</Text>
                    </TouchableOpacity></View>
                <View style={{ flex: 1 }}>
                    <TouchableOpacity style={styles.remove}>
                        <Text style={styles.minus}>X</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <Fragment>
            <SafeAreaView style={{ flex: 0, backgroundColor: 'black' }} />
            <StatusBar barStyle='light-content' />
            <SafeAreaView style={{ flex: 1 }}>
                {/* <View style={[styles.bar, { flex: 1 }]}>
                    <View style={[styles.backButton, { flex: 3 }]}>
                        <TouchableOpacity style={{ flex: 1, flexDirection: "row", alignItems: "center" }} onPress={() => {navigation.navigate('NavigationBar')}}>
                            <AntDesign name="leftcircleo" style={styles.returnIcon} />
                        </TouchableOpacity>
                        <Text style={styles.barText}>
                            New List
                        </Text>
                    </View>
                    <View style={{ flex: 3 }} />
                </View> */}

                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => { navigation.navigate('NavigationBar') }}>
                        <AntDesign name="leftcircleo" style={styles.returnIcon} />
                    </TouchableOpacity>
                    <Text style={styles.header}>NewList</Text>
                </View>

                <View style={[styles.settings, { flex: 8 }]}>
                    <View style={[styles.titleBox, { flex: 1 }]}>
                        <TextInput style={styles.titleInput} placeholderTextColor="#888" placeholder='Untitled List...'></TextInput>
                    </View>

                    <View style={[styles.starredSection, { flex: 1 }]}>
                        <View style={{ justifyContent: "center" }}>
                            <Text style={styles.settingName}>Starred List</Text>
                        </View>

                        <View>
                            <Switch
                                trackColor={{ false: "#4C4C4C", true: "#03EF62" }}
                                onValueChange={toggleStarred}
                                thumbColor="#FFFFFF"
                                value={starred}
                                style={{ transform: [{ scaleX: 1.6 }, { scaleY: 1.6 }] }}
                            />
                        </View>
                    </View>

                    <View style={{ flex: 1, width: "100%" }}>
                        <View style={{ backgroundColor: "black", }}>
                            <Text style={styles.tasks}>Tasks</Text>
                        </View>
                    </View>
                    <View style={{ flex: 4, width: "100%" }}>
                        <View style={{ flex: 1 }}>
                            <FlatList style={{ flex: 1 }} data={TASKS} keyExtractor={(item) => item.id} renderItem={({ item }) => { return renderTask({ item }) }} />
                        </View>
                        <View></View>
                    </View>
                    <View style={{ flex: 1, width: "100%", alignItems: "center" }}>
                        <TouchableOpacity style={styles.newTask} onPress={() => { navigation.navigate('NewTaskScreen') }}>
                            <Text style={styles.newTaskText}>+</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1 }} />
                    <View style={[{ flex: 1.2, alignItems: "center", width: "100%" }, styles.settingSection]}>
                        <TouchableOpacity style={styles.createButton}>
                            <Text style={styles.buttonText}>Create</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 0.2 }} />

                </View>

            </SafeAreaView>
        </Fragment>
    )
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
        margin: 20
    },
    returnIcon: {
        color: "white",
        fontSize: 30,
        marginLeft: 20,
    },
    container: {
        flex: 1,
        flexDirection: "column",
    },
    bar: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "black",

    },
    backButton: {
        flexDirection: "row",
        alignItems: "center"
    },
    barText: {
        color: "white",
        fontSize: 28,
        fontWeight: "bold",
        paddingTop: 2
    },

    settings: {
        flexDirection: "column",
        alignItems: "center",
        width: "100%"
    },
    titleBox: {
        backgroundColor: "#333333",
        width: "75%",
        marginTop: 40,
        marginBottom: 20,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10
    },
    titleInput: {
        fontSize: 28,
        color: "white",
    },
    starredSection: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "75%",
        marginBottom: 20
    },
    settingName: {
        fontSize: 20,
        fontWeight: "500"
    },
    tasks: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
        padding: 8,
        paddingLeft: 20
    },
    taskBox: {
        flex: 1,
        flexDirection: "row",
        paddingBottom: 8,
        width: "87%",
        alignItems: "center"
    },
    task: {
        fontSize: 24,
        color: "black",
        fontWeight: "500",
        paddingLeft: 20,
        backgroundColor: "#E2E2E2",
        paddingTop: 14,
        paddingBottom: 14,
        marginLeft: 16,
        marginRight: 10,
        borderRadius: 10

    },
    remove: {
        width: 66,
        height: 66,
        borderRadius: 10,
        backgroundColor: "red",
        justifyContent: "center"
    },
    minus: {
        color: "white",
        textAlign: "center",
        fontSize: 20,
        padding: 0
    },
    newTask: {
        backgroundColor: "#88AAFF",
        width: "90%",
        borderRadius: 10,
        marginTop: 10
    },
    newTaskText: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 30
    },
    createButton: {
        backgroundColor: "#03EF62",
        width: "40%",
        borderRadius: 20
    },
    buttonText: {
        fontSize: 26,
        fontWeight: "bold",
        textAlign: "center",
        padding: 6
    }

});