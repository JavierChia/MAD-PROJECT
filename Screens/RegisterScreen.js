// import React, { useState } from 'react';
// import { Image, SafeAreaView, View, Text, StyleSheet, ScrollView, SectionList } from 'react-native';

// export default function LoginPage() {

// }
import React, { Fragment, useEffect, useState } from 'react';
import { Image, SafeAreaView, View, Text, StyleSheet, useWindowDimensions, TextInput, TouchableOpacity, StatusBar } from 'react-native';
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth"
import Icon from 'react-native-vector-icons/Ionicons';
import Checkbox from 'expo-checkbox';
import { LogBox } from 'react-native';
import { app as firebase } from './firebase'
import { getFirestore, setDoc, doc, collection, onSnapshot } from 'firebase/firestore'

LogBox.ignoreLogs(['AsyncStorage has been extracted from react-native core and will be removed in a future release.']);

const auth = getAuth(firebase);
const db = getFirestore(firebase)
const colRef = collection(db, "users")


export default function RegisterScreen({ navigation }) {
    const { height } = useWindowDimensions();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cPassword, setcPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showCPassword, setShowCPassword] = useState(false);
    const [isChecked, setChecked] = useState(false);


    const onHandleRegister = async () => {
        if (email !== "" && password !== "" && cPassword !== "") {
            if (password === cPassword) {
                createUserWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                        const user = userCredential.user;
                        setDoc(doc(db, "users", user.uid), {
                            email: user.email,
                        });
                    })
                    .catch((error) => {
                        switch (error.code) {
                            case 'auth/invalid-email':
                                alert('Please enter a valid email!')
                                break;
                            case 'auth/email-already-in-use':
                                alert('Email is already in use!')
                                break;
                            case 'auth/weak-password':
                                alert('Password should be at least 6 characters!');
                                break;
                            default:
                                alert(error.message);
                        }
                    });
            } else {
                alert("Passwords do not match!")
            }
        } else {
            alert("Please fill up all the fields!")
        }
    }

    // //check if user is already signed in
    // useEffect(() => {
    //     const unsubsribe = auth.onAuthStateChanged((user) => {
    //         if (user) {
    //             
    //         }
    //         else {
    //             return unsubsribe
    //         }
    //     })
    // }) Currently not needed

    return (
        <SafeAreaView style={styles.loginBackground}>
            <StatusBar barStyle='light-content'></StatusBar>
            <Image source={require('./logoV.png')} style={[styles.loginLogo, { height: height * 0.2 }]} resizeMode='contain' />

            <View style={styles.loginContainer}>
                <View style={styles.headerContainer}>
                    <Text style={styles.header}>Register</Text>
                </View>
                <View style={styles.textInputContainer}>
                    <View style={styles.iconContainer}></View>
                    <Icon name='person-outline' size={26} style={styles.iconStyle} />
                    <TextInput style={styles.textInput}
                        placeholder='Email'
                        keyboardType='email-address'
                        textContentType='emailAddress'
                        autoCapitalize={false}
                        value={email}
                        onChangeText={text => setEmail(text)}
                    />
                </View>
                <View style={styles.pwTextInputContainer}>
                    <Icon name='lock-closed-outline' size={26} style={styles.iconStyle} />
                    <TextInput style={styles.pwTextInput}
                        placeholder='Password'
                        textContentType='password'
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={text => setPassword(text)}>
                    </TextInput>
                    <TouchableOpacity style={styles.visibility} onPress={() => {
                        setShowPassword(!showPassword);
                    }}>
                        <Text>{showPassword ? <Icon name='eye-off' size={26} /> : <Icon name='eye' size={26} />}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.pwTextInputContainer}>
                    <Icon name='lock-closed-outline' size={26} style={styles.iconStyle} />
                    <TextInput style={styles.pwTextInput}
                        placeholder='Confirm Password'
                        textContentType='password'
                        secureTextEntry={!showCPassword}
                        value={cPassword}
                        onChangeText={text => setcPassword(text)}>
                    </TextInput>
                    <TouchableOpacity style={styles.visibility} onPress={() => {
                        setShowCPassword(!showCPassword);
                    }}>
                        <Text>{showCPassword ? <Icon name='eye-off' size={26} /> : <Icon name='eye' size={26} />}</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={onHandleRegister} style={styles.loginButtonContainer}>
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
                <View style={styles.registerContainer}>
                    <Text style={styles.questionText}>Already have an account? </Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('LoginScreen')}
                    >
                        <Text style={styles.registerText}>Login!</Text>
                    </TouchableOpacity>
                </View>
            </View>


        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    loginLogo: {
        marginTop: '18%',
        marginBottom: '2%',
        width: '70%'
    },

    loginContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: '5%',
        padding: '5%',
        borderRadius: 20,

    },
    headerContainer: {
        alignSelf: 'center',
    },

    header: {
        fontSize: 40,
        fontWeight: '800'
    },

    loginBackground: {
        alignItems: 'center',
        flex: 1,
        backgroundColor: '#000'
    },

    textInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: 'black',
        width: '90%',
        padding: '1.2%',
        marginTop: '8%',

    },
    textInput: {
        // backgroundColor: 'pink',
        width: '90%',
        borderLeftWidth: 0.5,
        borderLeftColor: '#000',
        paddingVertical: 5,
        paddingHorizontal: 10,
        fontSize: 18,
    },

    pwTextInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: 'black',
        width: '90%',
        padding: '1.2%',
        marginTop: '8%',

    },
    pwTextInput: {
        width: '81%',
        borderLeftWidth: 0.5,
        borderLeftColor: '#000',
        paddingVertical: 5,
        paddingHorizontal: 10,
        fontSize: 18,
    },

    iconStyle: {
        justifyContent: 'center',
        width: '10%',
        // backgroundColor: 'red'

    },

    loginButtonContainer: {
        marginTop: '5%',
        backgroundColor: '#03ef62',
        alignItems: 'center',
        padding: 10,
        borderRadius: 8,
    },

    buttonText: {
        fontWeight: 'bold',
        fontSize: 22
    },

    forgot: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingVertical: '1.6%',
        marginBottom: '8%'
    },

    forgotText: {
        fontSize: 13,
        fontWeight: 'bold',
    },

    registerContainer: {
        marginVertical: '3%',
        flexDirection: 'row',
        alignSelf: 'center',
    },

    registerText: {
        textDecorationLine: 'underline',
        fontSize: 13,
        fontWeight: 'bold'
    }

})
