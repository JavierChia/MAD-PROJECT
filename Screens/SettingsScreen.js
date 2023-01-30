import React, { Fragment } from 'react';
import { SafeAreaView, View, Text, StyleSheet, SectionList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import fireBaseApp from './firebase';
import { getAuth, signOut } from "firebase/auth"

const auth = getAuth(fireBaseApp);

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

    const onPressHandler = (id) => {
        if (id === 'logout') {
            signOut(auth).then(() => {
                navigation.replace("LoginPage")
              }).catch((error) => {
                // An error happened.
              });
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#eaeaea' }}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Settings</Text>
            </View>
                <SectionList
                    sections={SETTINGS}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({ item }) =>
                        <TouchableOpacity onPress = {() => onPressHandler(item.id)} style={styles.settingOptions}>
                            <Icon name={item.icon} size={26} style={styles.iconStyle} />
                            <Text style={styles.labelStyle}>{item.label}</Text>
                            <Text style={styles.statusStyle}>{item.status}</Text>
                            <Icon name={item.icon2} size={26} style={styles.icon2Style} />
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
        overflow: 'hidden'
    },
    iconStyle: {
        marginRight: 15
    },
    icon2Style: {
        marginLeft: 3,
        color: '#616161'
    },
    labelStyle: {
        flex: 1,
        fontSize: 22,
        fontWeight: '400'
    },
    statusStyle: {
        fontSize: 20,
        color: '#616161',
    }
})