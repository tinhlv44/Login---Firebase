import React from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import {  Text, TextInput } from "react-native-paper";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { db } from "../firebaseConfig"; // Import db từ firebaseConfig
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { Button } from "../components";
import { Colors } from "../config";

// Validation schema with Yup
const validationSchema = Yup.object().shape({
    name: Yup.string().required("Tên dịch vụ là bắt buộc"),
    price: Yup.number()
        .required("Giá là bắt buộc")
        .min(10000, "Giá phải ít nhất 10,000")
});

const AddNewService = ({ navigation }) => {

    const handleAddService = async (values) => {
        try {
            await addDoc(collection(db, "services"), {
                name: values.name,
                price: parseFloat(values.price),
                createdBy: "Admin", // Hoặc thay đổi theo thông tin người dùng hiện tại
                createdAt: Timestamp.fromDate(new Date()),
                updatedAt: Timestamp.fromDate(new Date()),
            });
            Alert.alert("Thành công", "Dịch vụ đã được thêm thành công");
            navigation.goBack(); // Quay lại màn hình trước đó
        } catch (error) {
            console.error("Lỗi khi thêm tài liệu: ", error);
            Alert.alert("Lỗi", "Đã xảy ra lỗi khi thêm dịch vụ");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Formik
                initialValues={{ name: "", price: "" }}
                validationSchema={validationSchema}
                onSubmit={handleAddService}
            >
                {({ handleChange, handleBlur, handleSubmit, values }) => (
                    <View>
                        <TextInput
                            mode="outlined"
                            label="Tên Dịch Vụ"
                            onChangeText={handleChange("name")}
                            onBlur={handleBlur("name")}
                            value={values.name}
                            style={styles.input}
                        />
                        <ErrorMessage name="name" component={Text} style={styles.errorText} />

                        <TextInput
                            mode="outlined"
                            label="Giá"
                            keyboardType="numeric"
                            onChangeText={handleChange("price")}
                            onBlur={handleBlur("price")}
                            value={values.price}
                            style={styles.input}
                        />
                        <ErrorMessage name="price" component={Text} style={styles.errorText} />
                        <Button style={styles.button} onPress={handleSubmit}>
                            <Text style={styles.buttonText}>Thêm Dịch Vụ</Text>
                        </Button>
                    </View>
                )}
            </Formik>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        height: 50,
        marginBottom: 15,
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
    errorText: {
        color: "red",
        marginBottom: 10,
    },
});

export default AddNewService;
