import React, { useState } from "react";
import { Text, StyleSheet, Alert } from "react-native";
import { Formik } from "formik";
import { auth, db } from "../firebaseConfig"; // Add db from firebaseConfig
import {
  createUserWithEmailAndPassword, sendEmailVerification,
} from "firebase/auth";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { View, TextInput, Logo, Button, FormErrorMessage } from "../components";
import { Images, Colors } from "../config";
import { useTogglePasswordVisibility } from "../hooks";
import { signupValidationSchema } from "../utils";
import { doc, setDoc } from "firebase/firestore"; // Import Firestore

export const SignupScreen = ({ navigation }) => {
  const [errorState, setErrorState] = useState("");
  const {
    passwordVisibility,
    handlePasswordVisibility,
    rightIcon,
    handleConfirmPasswordVisibility,
    confirmPasswordIcon,
    confirmPasswordVisibility,
  } = useTogglePasswordVisibility();

  const handleSignup = async (values) => {
    const { fullName, email, password, phone, address } = values;
    try {
      // Tạo tài khoản người dùng với Firebase Authentication
      const response = await createUserWithEmailAndPassword(auth, email, password);
  
      // Gửi email xác nhận sau khi tạo tài khoản thành công
      await sendEmailVerification(response.user);
  
      // Lưu thông tin người dùng vào Firestore
      const userRef = doc(db, "USERS", response.user.uid);
      await setDoc(userRef, {
        fullName,
        email,
        phone,
        address,
        role: "customer"
      });
  
      // Thông báo cho người dùng về việc cần xác thực email
      Alert.alert("Thông báo", "Vui lòng xác nhận email của bạn qua liên kết đã được gửi.");
  
      // Chuyển hướng đến màn hình đăng nhập
      navigation.navigate("Login");
    } catch (error) {
      // Xử lý lỗi, ví dụ email đã tồn tại
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert("Thông báo", "Email đã tồn tại. Vui lòng chọn email khác.");
      } else {
        Alert.alert("Thông báo", "Có lỗi xảy ra. Vui lòng thử lại.");
        console.log(error)
      }
    }
  };

  return (
    <View isSafe style={styles.container}>
      <KeyboardAwareScrollView enableOnAndroid={true}>
        {/* LogoContainer: consits app logo and screen title */}
        <View style={styles.logoContainer}>
          {/* <Logo uri={Images.logo} /> */}
          <Text style={styles.screenTitle}>Tạo tài khoản mới!</Text>
        </View>
        {/* Formik Wrapper */}
        <Formik
          initialValues={{
            fullName: "",
            email: "",
            phone: "",
            address: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={signupValidationSchema}
          onSubmit={(values) => handleSignup(values)}
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
              {/* Full Name Field */}
              <TextInput
                name="fullName"
                leftIconName="account"
                placeholder="Nhập họ và tên"
                value={values.fullName}
                onChangeText={handleChange("fullName")}
                onBlur={handleBlur("fullName")}
              />
              <FormErrorMessage error={errors.fullName} visible={touched.fullName} />

              {/* Email Field */}
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

              {/* Phone Field */}
              <TextInput
                name="phone"
                leftIconName="phone"
                placeholder="Nhập số điện thoại"
                keyboardType="phone-pad"
                value={values.phone}
                onChangeText={handleChange("phone")}
                onBlur={handleBlur("phone")}
              />
              <FormErrorMessage error={errors.phone} visible={touched.phone} />

              {/* Address Field */}
              <TextInput
                name="address"
                leftIconName="home"
                placeholder="Nhập địa chỉ"
                value={values.address}
                onChangeText={handleChange("address")}
                onBlur={handleBlur("address")}
              />
              <FormErrorMessage error={errors.address} visible={touched.address} />

              {/* Password Field */}
              <TextInput
                name="password"
                leftIconName="key-variant"
                placeholder="Nhập mật khẩu"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={passwordVisibility}
                textContentType="newPassword"
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

              {/* Confirm Password Field */}
              <TextInput
                name="confirmPassword"
                leftIconName="key-variant"
                placeholder="Nhập lại mật khẩu"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={confirmPasswordVisibility}
                textContentType="password"
                rightIcon={confirmPasswordIcon}
                handlePasswordVisibility={handleConfirmPasswordVisibility}
                value={values.confirmPassword}
                onChangeText={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
              />
              <FormErrorMessage
                error={errors.confirmPassword}
                visible={touched.confirmPassword}
              />

              {/* Display Screen Error Messages */}
              {errorState !== "" ? (
                <FormErrorMessage error={errorState} visible={true} />
              ) : null}

              {/* Signup Button */}
              <Button style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Đăng ký</Text>
              </Button>
            </>
          )}
        </Formik>
        {/* Button to navigate to Login screen */}
        <Button
          style={styles.borderlessButtonContainer}
          borderless
          title={"Bạn đã có tài khoản?"}
          onPress={() => navigation.navigate("Login")}
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
