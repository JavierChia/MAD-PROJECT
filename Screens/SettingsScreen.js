import React, { Fragment, useState, useEffect, useContext } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  Switch,
  TextInput,
  Pressable,
  Linking,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import firebase from "./firebase";
import {
  doc,
  updateDoc,
  getFirestore,
  getDoc,
} from "firebase/firestore";
import {
  getAuth,
  signOut,
  onAuthStateChanged,
  updatePassword,
  deleteUser,
} from "firebase/auth";

import { EventRegister } from "react-native-event-listeners";
import themeContext from "../config/themeContext";
import Modal from "react-native-modal";

const auth = getAuth(firebase);
const user = auth.currentUser;
const db = getFirestore(firebase);

const SETTINGS = [
  {
    title: "PREFERENCES",
    data: [
      {
        id: "mode",
        icon: "contrast",
        label: "Dark Mode",
        status: "OFF",
        icon2: "chevron-forward-outline",
      },
    ],
  },
  {
    title: "HELP",
    data: [
      {
        id: "contact",
        icon: "mail-outline",
        label: "Contact Us",
        icon2: "chevron-forward-outline",
      },
    ],
  },
  {
    title: "ACCOUNT SETTINGS",
    data: [
      {
        id: "resetpw",
        icon: "finger-print-outline",
        label: "Reset Password",
        icon2: "chevron-forward-outline",
      },
      {
        id: "deleteAcc",
        icon: "ios-remove-circle-outline",
        label: "Delete Account",
        icon2: "",
      },
      { id: "logout", icon: "log-out-outline", label: "Log Out", icon2: "" },
    ],
  },
];

export default function SettingsScreen({ navigation }) {
  const [darkMode, setDarkMode] = useState(false);
  const [uid, setUid] = useState("");
  const theme = useContext(themeContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [cPassword, setcPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
        getMode(user.uid);
      }
    });
  }, []);

  const onPressHandler = (id) => {
    if (id === "logout") {
      signOut(auth)
        .then(() => {})
        .catch((error) => {
          // An error happened.
        });
    }
    if (id === "resetpw") {
      setIsModalVisible(true);
    }
    if (id === "contact") {
      Linking.openURL("mailto:support@done.com");
    }
    if (id === "deleteAcc") {
    const user = auth.currentUser;
      deleteUser(user)
        .then(() => {
          alert("Deleted Acc!");
        })
        .catch((error) => {
          alert(error);
        });
    }
  };

  const getMode = async (uid) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setDarkMode(docSnap.data().mode);
    } else {
    }
  };

  const updateMode = (value) => {
    try {
      const ref = doc(db, "users", uid);
      updateDoc(ref, {
        mode: value,
      });
    } catch (error) {}
  };

  const auth = getAuth();

  const onResetPW = (pw) => {
    const user = auth.currentUser;
    const newPassword = pw;
    if (password !== "" && cPassword !== "") {
      if (password === cPassword) {
        updatePassword(user, newPassword)
          .then(() => {
            setIsModalVisible(!isModalVisible);
            alert("Password has been reset!");
          })
          .catch((error) => {
            switch (error.code) {
              case "auth/weak-password":
                alert("Password should be at least 6 characters!");
                break;
              default:
                alert(error.message);
            }
          });
      } else {
        alert("Passwords do not match!");
      }
    } else {
      alert("Please fill up all the fields!");
    }
  };

  return (
    <SafeAreaView
      style={[styles.background, { backgroundColor: theme.backgroundColor }]}
    >
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setIsModalVisible(!isModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                marginTop: 15,
                marginBottom: 10,
              }}
            >
              Reset Password
            </Text>
            <TextInput
              style={styles.pwTextInput}
              placeholder="New Password"
              textContentType="password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(text) => setPassword(text)}
            ></TextInput>

            <TextInput
              style={styles.pwTextInput}
              placeholder="Confirm New Password"
              textContentType="password"
              secureTextEntry={!showCPassword}
              value={cPassword}
              onChangeText={(text) => setcPassword(text)}
            ></TextInput>
            <View
              style={{
                width: "65%",
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => onResetPW(password)}
              >
                <Text style={styles.textStyle}>Reset Password!</Text>
              </Pressable>
              <Pressable
                style={[styles.button2, styles.buttonClose2]}
                onPress={() => setIsModalVisible(!isModalVisible)}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.headerContainer}>
        <Text style={styles.header}>Settings</Text>
      </View>
      <SectionList
        sections={SETTINGS}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => onPressHandler(item.id)}
            style={[
              styles.settingOptions,
              { backgroundColor: theme.cardBackgroundColor },
            ]}
          >
            <Icon
              name={item.icon}
              size={26}
              style={[styles.iconStyle, { color: theme.color }]}
            />
            <Text style={[styles.labelStyle, { color: theme.color }]}>
              {item.label}
            </Text>
            {item.id === "mode" ? (
              <Switch
                value={darkMode}
                onValueChange={(value) => {
                  setDarkMode(value), updateMode(value);
                  EventRegister.emit("changeTheme", darkMode);
                }}
              />
            ) : (
              <>
                <Text style={[styles.statusStyle, { color: theme.color }]}>
                  {item.status}
                </Text>
                <Icon
                  name={item.icon2}
                  size={26}
                  style={[styles.icon2Style, { color: theme.color }]}
                />
              </>
            )}
          </TouchableOpacity>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.settingsSectionHeader}>{title}</Text>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  headerContainer: {
    height: "11%",
    backgroundColor: "#000",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    margin: 20,
  },
  settingsSectionHeader: {
    marginHorizontal: 20,
    marginTop: 30,
    fontSize: 20,
    fontWeight: "bold",
    color: "#a7a7a7",
  },
  settingOptions: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    marginTop: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    overflow: "hidden",
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
    fontWeight: "400",
  },
  statusStyle: {
    fontSize: 20,
    color: "#616161",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    width: "90%",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  pwTextInput: {
    width: "90%",
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginVertical: 5,
    fontSize: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000",
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    marginTop: 10,
    marginBottom: 15,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#333",
  },
  button2: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    marginTop: 10,
    marginBottom: 15,
  },
  buttonOpen2: {
    backgroundColor: "#F194FF",
  },
  buttonClose2: {
    backgroundColor: "#ff0000",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
