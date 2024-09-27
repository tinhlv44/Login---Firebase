import React, { useEffect, useState } from "react";
import { Text, StyleSheet, Alert } from "react-native";
import { Formik } from "formik";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { auth } from '../firebaseConfig';
import { View, TextInput, Logo, Button, FormErrorMessage } from "../components";
import { Images, Colors } from "../config";
import { useTogglePasswordVisibility } from "../hooks";
import { loginValidationSchema } from "../utils";
import { signInWithEmailAndPassword } from "firebase/auth";
import { login, useMyContextController } from "../store";

export const LoginScreen = ({ navigation }) => {
  const [errorState, setErrorState] = useState("");
  const { passwordVisibility, handlePasswordVisibility, rightIcon } = useTogglePasswordVisibility();
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;

  const handleLogin = async (values) => {
    const { email, password } = values;

    try {
      // Gọi hàm login từ Context
      await login(dispatch, email, password);

      console.log(userLogin.role)
      // Kiểm tra và điều hướng theo role của người dùng
      if (userLogin?.role === "admin") {
        //navigation.navigate("Admin");
      } else if (userLogin?.role === "customer") {
        //navigation.navigate("Customer");
      } else {
        Alert.alert("Thông báo", "Không thể xác định vai trò người dùng.");
      }
    } catch (error) {
      setErrorState("Email hoặc mật khẩu không đúng.");
    }
  };

  useEffect(() => {
    if (userLogin) {
      if (userLogin.role === "admin") {
        //navigation.navigate("Admin");
      } else if (userLogin.role === "customer") {
        //navigation.navigate("Customer");
      }
    }
  }, [userLogin]);

  return (
    <View isSafe style={styles.container}>
      <KeyboardAwareScrollView enableOnAndroid={true}>
        {/* Logo và tiêu đề */}
        <View style={styles.logoContainer}>
          {/* <Logo uri={Images.logo} /> */}
          <Text style={styles.screenTitle}>Chào mừng trở lại!</Text>
        </View>

        {/* Form đăng nhập */}
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={loginValidationSchema}
          onSubmit={(values) => handleLogin(values)}
        >
          {({
            values,
            touched,
            errors,
            handleChange,
            handleSubmit,
            handleBlur,
          }) => (
            <>
              {/* Input Email */}
              <TextInput
                name="email"
                leftIconName="email"
                placeholder="Nhập email"
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
              />
              <FormErrorMessage error={errors.email} visible={touched.email} />

              {/* Input Password */}
              <TextInput
                name="password"
                leftIconName="key-variant"
                placeholder="Nhập mật khẩu"
                autoCapitalize="none"
                secureTextEntry={passwordVisibility}
                textContentType="password"
                rightIcon={rightIcon}
                handlePasswordVisibility={handlePasswordVisibility}
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
              />
              <FormErrorMessage
                error={errors.password}
                visible={touched.password}
              />

              {/* Hiển thị lỗi */}
              {/* {errorState !== "" ? (
                <FormErrorMessage error={errorState} visible={true} />
              ) : null} */}

              {/* Nút Đăng nhập */}
              <Button style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Đăng nhập</Text>
              </Button>
            </>
          )}
        </Formik>

        {/* Button điều hướng đến màn hình Đăng ký */}
        <Button
          style={styles.borderlessButtonContainer}
          borderless
          title={"Tạo tài khoản mới?"}
          onPress={() => navigation.navigate('Signup')}
        />
        
        {/* Button quên mật khẩu */}
        <Button
          style={styles.borderlessButtonContainer}
          borderless
          title={"Quên mật khẩu?"}
          onPress={() => navigation.navigate('ForgotPassword')}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
  },
  logoContainer: {
    alignItems: "center",
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.black,
    paddingTop: 20,
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
  borderlessButtonContainer: {
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
