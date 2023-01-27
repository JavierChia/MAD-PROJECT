import React, { Fragment, useState } from 'react';
import { Text, View, StyleSheet, TextInput, Button, Switch, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function App({ navigation }) {

    const [deadlineEnabled, setDeadlineEnabled] = useState(false);
    const [deadline, setDeadline] = useState(null)

    const [reminderEnabled, setReminderEnabled] = useState(false);
    const [reminder, setReminder] = useState(null)

    function toggleDeadline() {
        setDeadlineEnabled(previousState => !previousState);
    }
    function toggleReminder() {
        setReminderEnabled(previousState => !previousState);
    }

    return (
        <Fragment>
            <SafeAreaView style={{ flex: 0, backgroundColor: 'black' }} />
            <StatusBar barStyle='light-content' />
            <SafeAreaView style={styles.container}>
                {/* <View style={[styles.bar, { flex: 1 }]}>
                    <View style={[styles.backButton, { flex: 3 }]}>
                        <TouchableOpacity onPress={() => { navigation.navigate('NewListsScreen') }}>
                        <AntDesign name="leftcircleo" style={styles.returnIcon} /></TouchableOpacity>
                        <Text style={styles.barText}>
                            back
                        </Text>
                    </View>
                    <View style={{ flex: 5 }} />
                </View> */}

                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => { navigation.navigate('NavigationBar') }}>
                        <AntDesign name="leftcircleo" style={styles.returnIcon} />
                    </TouchableOpacity>
                    <Text style={styles.header}>New Task</Text>
                </View>

                <View style={[styles.settings, { flex: 8 }]}>
                    <View style={[{ flex: 1 }, styles.titleInputContainer]}>
                        <TextInput style={styles.titleInput} placeholderTextColor="#888" placeholder='My Task...'></TextInput>
                    </View>

                    <View style={[styles.settingSection, { flex: 2 }]}>
                        <View style={styles.settingSectionHeader}>
                            <View style={{ justifyContent: "center" }}>
                                <Text style={styles.settingName}>Deadline</Text>
                            </View>

                            <View>
                                <Switch
                                    trackColor={{ false: "#4C4C4C", true: "#03EF62" }}
                                    onValueChange={toggleDeadline}
                                    thumbColor="#FFFFFF"
                                    value={deadlineEnabled}
                                    style={{ transform: [{ scaleX: 1 }, { scaleY: 1 }] }}
                                />
                            </View>
                        </View>
                        <View style={styles.dateButton}>
                            <Button disabled={!deadlineEnabled} title="Mon 01 Feb 2023" />
                        </View>
                    </View>
                    <View style={[styles.settingSection, { flex: 1 }]}>
                        <View style={styles.settingSectionHeader}>
                            <View style={{ justifyContent: "center" }}>
                                <Text style={styles.settingName}>Remind Me</Text>
                            </View>

                            <View>
                                <Switch
                                    trackColor={{ false: "#4C4C4C", true: "#03EF62" }}
                                    onValueChange={toggleReminder}
                                    thumbColor="#FFF"
                                    value={reminderEnabled}
                                    style={{ transform: [{ scaleX: 1 }, { scaleY: 1 }] }}
                                />
                            </View>
                        </View>

                        <View style={styles.dateButton}>
                            <Button disabled={!reminderEnabled} title="1 Day Before" />
                        </View>
                    </View>
                    <View style={{ flex: 1 }} />
                    <View style={[{ flex: 4 }, styles.settingSection]}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.settingName}>Notes</Text>
                        </View>

                        <View style={[styles.notes, { flex: 4 }]}>
                            <TextInput multiline={true} style={styles.notesText} placeholderTextColor="#888" placeholder='Enter text here...'></TextInput>
                        </View>
                    </View>

                    <View style={styles.createButtonArea}>
                        <TouchableOpacity style={styles.createButton}>
                            <Text style={styles.buttonText}>Create</Text>
                        </TouchableOpacity>
                    </View>
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
        margin: 20
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
    returnIcon: {
        color: "white",
        fontSize: 30,
        marginLeft: 20,
    },
    settings: {
        flexDirection: "column",
        alignItems: "center",
        width: "100%"
    },
    settingSection: {
        flexDirection: "column",
        width: "80%"
    },
    settingSectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    settingName: {
        fontSize: 18,
        fontWeight: "500"
    },
    titleInputContainer: {
        backgroundColor: "#333333",
        justifyContent: "center",
        alignItems: "center",
        width: "65%",
        borderRadius: 10,
        marginTop: 40,
        marginBottom: 20,
        padding: 5
    },
    titleInput: {
        fontSize: 28,
        color: "white",
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 10
    },
    dateButton: {
        backgroundColor: "#CCC",
        borderRadius: 10,
        overflow: 'hidden'
    },
    notes: {
        backgroundColor: "#333333",
        borderRadius: 10,
        padding: 8
    },
    notesText: {
        fontSize: 16,
        color: "white"
    },
    createButtonArea: {
        flex: 3,
        width: "100%",
        alignItems: "center"
    },
    createButton: {
        flex: 1,
        backgroundColor: "#03EF62",
        width: "40%",
        justifyContent: "center",
        margin: 45,
        borderRadius: 10
    },
    buttonText: {
        color: "black",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 24
    }

});