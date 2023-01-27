// import React, { useState } from 'react';
// import { Image, SafeAreaView, View, Text, StyleSheet, ScrollView, SectionList } from 'react-native';

// export default function LoginPage() {

// }
import React, { Fragment, useEffect, useState } from 'react';
import { Image, SafeAreaView, View, Text, StyleSheet, useWindowDimensions, TextInput, TouchableOpacity, StatusBar } from 'react-native';
import fireBaseApp from './firebase';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import Icon from 'react-native-vector-icons/Ionicons';
import { back } from 'react-native/Libraries/Animated/Easing';
import Checkbox from 'expo-checkbox';


const auth = getAuth(fireBaseApp);


export default function LoginScreen({ navigation }) {
    const { height } = useWindowDimensions();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isChecked, setChecked] = useState(false);


    const onHandleLogin = async () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                navigation.navigate("NavigationBar")
                console.log(user.email)
            })
            .catch((error) => alert(error.message));
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
                    <Text style={styles.header}>Login</Text>
                </View>
                <View style={styles.textInputContainer}>
                    <View style={styles.iconContainer}></View>
                    <Icon name='person-outline' size={26} style={styles.iconStyle} />
                    <TextInput style={styles.textInput}
                        placeholder='Enter email'
                        keyboardType='email-address'
                        textContentType='emailAddress'
                        autoCapitalize={false}
                        value={email}
                        onChangeText={text => setEmail(text)}
                    />
                </View>
                <View style={styles.textInputContainer}>
                    <Icon name='lock-closed-outline' size={26} style={styles.iconStyle} />
                    <TextInput style={styles.textInput}
                        placeholder='Enter Password'
                        textContentType='password'
                        secureTextEntry={true}
                        value={password}
                        onChangeText={text => setPassword(text)} />
                </View>
                <View style={styles.forgot}>
                    <TouchableOpacity><Text style={styles.forgotText}>Forgot Password?</Text></TouchableOpacity>
                </View>

                <TouchableOpacity onPress={onHandleLogin} style={styles.loginButtonContainer}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <View style={styles.registerContainer}>
                    <Text style={styles.questionText}>Don't have an account? </Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('RegisterScreen')}
                    >
                        <Text style={styles.registerText}>Register!</Text>
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
