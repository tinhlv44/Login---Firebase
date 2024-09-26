import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from "react-native";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Card, Button } from "react-native-paper";

const TransactionScreen = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const transactionsCollection = collection(db, "transactions");

        const unsubscribe = onSnapshot(transactionsCollection, (querySnapshot) => {
            const transactionsList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
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
                <Text style={styles.transactionDate}>{new Date(item.date.seconds * 1000).toLocaleDateString()}</Text>
                <Text style={styles.transactionDescription}>{item.description}</Text>
                <Text style={styles.transactionAmount}>
                    {item.amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                </Text>
            </Card.Content>
        </Card>
    );

    const calculateTotalSpent = () => {
        return transactions.reduce((total, transaction) => total + transaction.amount, 0);
    };

    return (
        <View style={styles.container}>
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
                        <Button
                            mode="contained"
                            style={styles.refreshButton}
                            onPress={() => setLoading(true)}
                        >
                            Làm mới
                        </Button>
                    </View>
                </>
            )}
        </View>
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
    },
    transactionDescription: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    transactionAmount: {
        fontSize: 18,
        color: '#ff5722',
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
