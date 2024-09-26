import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from "react-native";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Card, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { format } from "date-fns";

const TransactionScreen = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const transactionsCollection = collection(db, "transactions");

        const unsubscribe = onSnapshot(transactionsCollection, (querySnapshot) => {
            const transactionsList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                //formattedDate: doc.data().date ? format(new Date(doc.data().date.seconds * 1000), 'yyyy-MM-dd HH:mm:ss') : 'N/A'
            }));
            setTransactions(transactionsList);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching transactions: ", error);
            Alert.alert("Lỗi", "Có lỗi xảy ra khi lấy dữ liệu giao dịch.");
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const renderItem = ({ item }) => (
        <Card style={styles.card}>
            <Card.Content>
                <Text style={styles.transactionDate}>
                    {/* {item.date || "N/A"} */}
                    {item.formattedDate || "N/A"}
                </Text>
                <View style={styles.servicesContainer}>
                    {item.services.map(service => (
                        <View key={service.id} style={styles.serviceRow}>
                            <Text style={styles.transactionName}>{service.name}</Text>
                            <Text style={styles.transactionAmount}>
                                {service.price ? service.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : "N/A"}
                            </Text>
                        </View>
                    ))}
                </View>
                <Text style={styles.totalAmount}>
                    Tổng tiền: {item.totalPrice ? item.totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : "N/A"}
                </Text>
            </Card.Content>
        </Card>
    );

    const calculateTotalSpent = () => {
        return transactions.reduce((total, transaction) => total + (transaction.totalPrice || 0), 0);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Danh sách giao dịch</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#ff5722" />
            ) : (
                <>
                    <FlatList
                        data={transactions}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                    />
                    <View style={styles.summaryContainer}>
                        <Text style={styles.totalText}>
                            Tổng chi tiêu: {calculateTotalSpent().toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </Text>
                        {/* <Button
                            mode="contained"
                            style={styles.refreshButton}
                            onPress={() => setLoading(true)}
                        >
                            Làm mới
                        </Button> */}
                    </View>
                </>
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
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 3,
    },
    transactionDate: {
        fontSize: 16,
        color: '#555',
        marginBottom: 8,
    },
    servicesContainer: {
        marginBottom: 8,
    },
    serviceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    transactionName: {
        fontSize: 16,
        color: '#333',
    },
    transactionAmount: {
        fontSize: 16,
        color: '#ff5722',
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 8,
    },
    summaryContainer: {
        marginTop: 20,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        alignItems: 'center',
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    refreshButton: {
        marginTop: 16,
        backgroundColor: '#ff5722',
    },
});

export default TransactionScreen;
