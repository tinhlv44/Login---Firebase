import React from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { db } from "../firebaseConfig"; // Import db từ firebaseConfig
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { Colors } from "../config";
import { Button } from "../components";

// Validation schema with Yup
const validationSchema = Yup.object().shape({
    name: Yup.string().required("Tên dịch vụ là bắt buộc"),
    price: Yup.number()
        .required("Giá là bắt buộc")
        .min(10000, "Giá phải ít nhất 10,000")
});

const EditService = ({ route, navigation }) => {
    const { service } = route.params; // Lấy thông tin dịch vụ từ params

    const handleUpdateService = async (values) => {
        try {
            const serviceRef = doc(db, "services", service.id);
            await updateDoc(serviceRef, {
                name: values.name,
                price: parseFloat(values.price),
                updatedAt: Timestamp.fromDate(new Date()),
            });
            Alert.alert("Thành công", "Dịch vụ đã được cập nhật thành công");
            navigation.navigate('Services'); // Quay lại màn hình trước đó
        } catch (error) {
            console.error("Lỗi khi cập nhật tài liệu: ", error);
            Alert.alert("Lỗi", "Đã xảy ra lỗi khi cập nhật dịch vụ");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Formik
                initialValues={{ name: service.name, price: service.price.toString() }}
                validationSchema={validationSchema}
                onSubmit={handleUpdateService}
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
                            <Text style={styles.buttonText}>Cập nhật Dịch Vụ</Text>
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

export default EditService;
