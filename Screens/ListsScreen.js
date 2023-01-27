import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import CircularProgress from 'react-native-circular-progress-indicator';

function AddList({ navigation }) {
    return (
        <TouchableOpacity
            style={styles.addButtonStyle}
            onPress={() => navigation.navigate('NewListsScreen')}
        ><Icon name="add-outline" size={50} color='#fff'/>
        </TouchableOpacity>
    );
}

function StarredButton() {
    return (
        <TouchableOpacity
            style={styles.starredButtonStyle}
        ><Icon name="star" size={30} color="#000" /></TouchableOpacity>

    )
}

export default function ListsScreen({ navigation }) {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Task Lists</Text>
                <AddList navigation={navigation} />
            </View>
            <View style={styles.allListsContianer}>
                <Pressable style={styles.listsContainer} onPress={() => navigation.navigate('TasksScreen')}>
                    <View style={styles.starAndListName}>
                        <StarredButton />
                        <Text style={styles.listStyle}>List 1
                        </Text>
                    </View>
                    <CircularProgress
                        value={4}
                        maxValue={5.5}
                        progressValueFontSize={16}
                        radius={20}
                        clockwise={false}
                        progressValueColor={'#000'}
                        activeStrokeColor={'#03EF62'}
                        style={styles.progressCircle}
                    />
                </Pressable>

                <View style={styles.listsContainer}>
                    <Text style={styles.listStyle}>List 2
                    </Text>
                    <CircularProgress
                        value={7}
                        maxValue={35}
                        progressValueFontSize={16}
                        radius={20}
                        clockwise={false}
                        progressValueColor={'#000'}
                        activeStrokeColor={'#03EF62'}
                        style={styles.progressCircle}
                    />
                </View>

                <View style={styles.listsContainer}>
                    <Text style={styles.listStyle}>List 3
                    </Text>
                    <Icon name="alert-circle-outline" size={38} style={styles.alertIcon}></Icon>
                </View>

                <View style={styles.listsContainer}>
                    <Text style={styles.listStyle}>List 4
                    </Text>
                    <Icon name="checkmark-circle-outline" size={38} style={styles.doneIcon}></Icon>
                </View>
            </View>

        </SafeAreaView>
    );
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
    addButtonStyle: {
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    starredButtonStyle: {
        backgroundColor: '#fff',
        paddingRight: 10
    },
    alertIcon: {
        backgroundColor: '#ff0000',
        borderRadius: 21,
        paddingLeft: 3,
        overflow: 'hidden',
    },
    doneIcon: {
        backgroundColor: '#03EF62',
        borderRadius: 21,
        paddingLeft: 3,
        overflow: 'hidden',
    },
    allListsContianer: {
        margin: 10
    },
    listsContainer: {
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 15,
        alignItems: 'center',
        margin: 10,
        borderWidth: 2,
        borderColor: 'black'
    },
    starAndListName: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    listStyle: {
        fontSize: 24
    },
});
