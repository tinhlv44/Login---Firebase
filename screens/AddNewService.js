import React from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { db } from "../firebaseConfig"; // Import db từ firebaseConfig
import { collection, addDoc, Timestamp } from "firebase/firestore";

// Validation schema with Yup
const validationSchema = Yup.object().shape({
    name: Yup.string().required("Service name is required"),
    price: Yup.number()
        .required("Price is required")
        .min(10000, "Price must be at least 10,000")
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
            Alert.alert("Success", "Service added successfully");
            navigation.goBack(); // Quay lại màn hình trước đó
        } catch (error) {
            console.error("Error adding document: ", error);
            Alert.alert("Error", "There was an error adding the service");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Add New Service</Text>
            <Formik
                initialValues={{ name: "", price: "" }}
                validationSchema={validationSchema}
                onSubmit={handleAddService}
            >
                {({ handleChange, handleBlur, handleSubmit, values }) => (
                    <View>
                        <TextInput
                            mode="outlined"
                            label="Service Name"
                            onChangeText={handleChange("name")}
                            onBlur={handleBlur("name")}
                            value={values.name}
                            style={styles.input}
                        />
                        <ErrorMessage name="name" component={Text} style={styles.errorText} />

                        <TextInput
                            mode="outlined"
                            label="Price"
                            keyboardType="numeric"
                            onChangeText={handleChange("price")}
                            onBlur={handleBlur("price")}
                            value={values.price}
                            style={styles.input}
                        />
                        <ErrorMessage name="price" component={Text} style={styles.errorText} />

                        <Button
                            mode="contained"
                            onPress={handleSubmit}
                            style={styles.button}
                        >
                            Add Service
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
        marginTop: 20,
    },
    errorText: {
        color: "red",
        marginBottom: 10,
    },
});

export default AddNewService;

