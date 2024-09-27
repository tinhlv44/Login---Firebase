import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { Card } from "react-native-paper";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { SafeAreaView } from "react-native-safe-area-context";

const CustomersScreen = ({ navigation }) => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const customersCollection = collection(db, "USERS");

        const unsubscribe = onSnapshot(customersCollection, (querySnapshot) => {
            const customersList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCustomers(customersList);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching customers: ", error);
            Alert.alert("Lỗi", "Có lỗi xảy ra khi lấy dữ liệu khách hàng.");
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const renderItem = ({ item }) => 
    {
        if (item.role !== 'customer') return (<></>)
        return (
        <TouchableOpacity
            onPress={() => navigation.navigate("CustomerDetail", { customerId: item.id })}
            style={styles.card}
        >
            <Card>
                <Card.Content>
                    <Text style={styles.customerName}>{item.fullName}</Text>
                    <Text style={styles.customerEmail}>{item.email}</Text>
                </Card.Content>
            </Card>
        </TouchableOpacity>
    );
    }
    

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Danh sách khách hàng</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#ff5722" />
            ) : (
                <FlatList
                    data={customers}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: '#333',
        marginBottom: 20,
    },
    card: {
        marginBottom: 10,
    },
    customerName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    customerEmail: {
        fontSize: 16,
        color: '#333',
    },
});

export default CustomersScreen;
