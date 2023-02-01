import React, { Fragment, useState, useEffect, useContext } from 'react';
import { SafeAreaView, View, Text, StyleSheet, SectionList, TouchableOpacity, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import firebase from './firebase';
import { doc, updateDoc, getFirestore, getDoc } from 'firebase/firestore'
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth"

import {EventRegister} from 'react-native-event-listeners';
import themeContext from '../config/themeContext';

const auth = getAuth(firebase);
const user = auth.currentUser;
const db = getFirestore(firebase);

const SETTINGS = [
    {
        title: 'PREFERENCES',
        data: [
            { id: 'language', icon: 'globe-outline', label: 'Language', status: 'English', icon2: 'chevron-forward-outline' },
            { id: 'mode', icon: 'contrast', label: 'Dark Mode', status: 'OFF', icon2: 'chevron-forward-outline' },
        ]
    },
    {
        title: 'HELP',
        data: [
            { id: 'bug', icon: 'flag-outline', label: 'Report Bug', icon2: 'chevron-forward-outline' },
            { id: 'contact', icon: 'mail-outline', label: 'Contact Us', icon2: 'chevron-forward-outline' },
        ]
    },
    {
        title: 'ACCOUNT SETTINGS',
        data: [
            { id: 'resetpw', icon: 'finger-print-outline', label: 'Reset Password', icon2: 'chevron-forward-outline' },
            { id: 'logout', icon: 'log-out-outline', label: 'Log Out', icon2: '' },
        ]
    }
]

export default function SettingsScreen({ navigation }) {
    const [darkMode, setDarkMode] = useState(false);
    const [uid, setUid] = useState('');
    const theme = useContext(themeContext);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUid(user.uid);
                getMode(user.uid)
            }
        });
    }, []);

    const onPressHandler = (id) => {
        if (id === 'logout') {
            signOut(auth).then(() => {

            }).catch((error) => {
                // An error happened.
            });
        }
    }

    const getMode = async (uid) => {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setDarkMode(docSnap.data().mode);
        } else {

        }
    }

    const updateMode = (value) => {
        try {
            const ref = doc(db, "users", uid);
            updateDoc(ref, {
                mode: value,
            })
        } catch (error) {
            alert('Error toggling' + error);
        }
    }

    return (
        <SafeAreaView style={[styles.background, {backgroundColor: theme.backgroundColor}]}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Settings</Text>
            </View>
            <SectionList
                sections={SETTINGS}
                keyExtractor={(item, index) => item + index}
                renderItem={({ item }) =>
                    <TouchableOpacity onPress={() => onPressHandler(item.id)} style={[styles.settingOptions, {backgroundColor: theme.cardBackgroundColor}]}>
                        <Icon name={item.icon} size={26} style={[styles.iconStyle, {color: theme.color}]} />
                        <Text style={[styles.labelStyle, {color: theme.color}]}>{item.label}</Text>
                        {item.id === 'mode' ? (
                            <Switch
                                value={darkMode}
                                onValueChange={(value) => { 
                                    setDarkMode(value), 
                                    updateMode(value) 
                                    EventRegister.emit("changeTheme", darkMode)
                                }}
                            />
                        ) : (
                            <>
                                <Text style={[styles.statusStyle, {color: theme.color}]}>{item.status}</Text>
                                <Icon name={item.icon2} size={26} style={[styles.icon2Style, {color: theme.color}]} />
                            </>
                        )}
                    </TouchableOpacity>
                }
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.settingsSectionHeader}>{title}</Text>
                )}
            />

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
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
    settingsSectionHeader: {
        marginHorizontal: 20,
        marginTop: 30,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#a7a7a7'
    },
    settingOptions: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        marginTop: 10,
        marginHorizontal: 20,
        borderRadius: 10,
        overflow: 'hidden',
    },
    iconStyle: {
        marginRight: 15,
    },
    icon2Style: {
        marginLeft: 3,
        // color: '#616161'
    },
    labelStyle: {
        flex: 1,
        fontSize: 22,
        fontWeight: '400',
    },
    statusStyle: {
        fontSize: 20,
        color: '#616161',
    }
})