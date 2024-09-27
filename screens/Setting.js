import {
  Text,
  View,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import { logout, useMyContextController } from "../store";
import { useEffect } from "react";
import { Colors } from "../config";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";
import { Button } from "../components";

const Setting = ({ navigation }) => {
  const sendFeedback = () => {
    const email = "mealsapp@email.com";
    const subject = "Góp ý về ứng dụng";
    const body = "Xin chào, tôi có góp ý sau về ứng dụng...";

    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    Linking.openURL(mailtoUrl).catch((err) =>
      console.error("Error opening email app:", err)
    );
  };

  const confirmSendFeedback = () => {
    Alert.alert("Feedback", "Do you want to feedback about app?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: sendFeedback,
      },
    ]);
  };
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;
  const handleLogout = () => {
    logout(dispatch);
  };
  console.log(userLogin)
  const account = {
    name: userLogin.fullName,
    email: userLogin.email,
  };
  useEffect(() => {
    if (userLogin == null) {
      //navigation.navigate("Login")
    }
  }, [userLogin]);

  return (
    <SafeAreaView style={[styles.container, styles.lightContainer]}>
      <View style={styles.card}>
        <Text style={styles.title}>Thông Tin Tài Khoản</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Tên Tài Khoản:</Text>
          <Text style={styles.value}>{account.name}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{account.email}</Text>
        </View>
      </View>
      {/* <View style={[styles.settingRow, { borderBottomColor: "black" }]}>
        <Text style={[styles.text, styles.lightText]}>Nền tối</Text>
        <Switch
        // onValueChange={toggleDarkMode}
        // alue={isDarkMode}
        />
      </View> */}
      {userLogin.role === 'customer' && (<TouchableOpacity
        onPress={confirmSendFeedback}
        style={[styles.settingRow, { borderBottomWidth: 0 }]}
      >
        <Text style={[styles.text, styles.lightText]}>Góp ý</Text>
        <View>
          <Ionicons name="mail" size={34} color={"black"} />
        </View>
      </TouchableOpacity>)}
      <Button style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Đăng xuất</Text>
      </Button>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    marginHorizontal: 8,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
  lightContainer: {
  },
  lightText: {
  },
  darkContainer: {
  },
  darkText: {
  },
  feedbackButton: {
    paddingHorizontal: 8,
    marginHorizontal: 20,
  },
  button: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    backgroundColor: Colors.orange,
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 20,
    color: Colors.white,
    fontWeight: "700",
  },
  card: {
    borderRadius: 8,
    padding: 16,
    borderBottomWidth: 1
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  infoContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  value: {
    fontSize: 16,
    color: "#555",
  },
});

export default Setting;
