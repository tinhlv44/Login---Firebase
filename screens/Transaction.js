import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from "react-native";
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore"; // Thêm doc, getDoc để lấy dữ liệu từ Firestore
import { db } from "../firebaseConfig";
import { Card } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { format } from "date-fns";

const TransactionScreen = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Hàm lấy thông tin user dựa trên customerId
    const fetchCustomerName = async (customerId) => {
        try {
            // Lấy tài liệu người dùng từ Firestore
            const userDoc = await getDoc(doc(db, "USERS", customerId));
    
            // Kiểm tra xem tài liệu có tồn tại không
            if (userDoc.exists()) {
                const userData = userDoc.data();
                return userData.fullName || "Unknown"; // Trả về fullName hoặc "Unknown" nếu không có fullName
            } else {
                console.error(`No user found for customerId: ${customerId}`);
                return "Unknown"; // Nếu không tìm thấy người dùng, trả về "Unknown"
            }
        } catch (error) {
            console.error("Error fetching customer name:", error);
            return "Unknown"; // Trả về "Unknown" trong trường hợp có lỗi
        }
    };
    

    // Hàm để lấy dữ liệu giao dịch và tên khách hàng
    const fetchTransactionsWithCustomerNames = async (querySnapshot) => {
        const transactionsList = await Promise.all(
            querySnapshot.docs.map(async (doc) => {
                const transactionData = doc.data();
                const customerName = transactionData.customer && await fetchCustomerName(transactionData.customer); // Lấy tên khách hàng từ bảng USERS
                return {
                    id: doc.id,
                    ...transactionData,
                    customerName: customerName || 'N?A', // Thêm tên khách hàng vào dữ liệu giao dịch
                    formattedDate: transactionData.date
                };
            })
        );
        setTransactions(transactionsList);
        setLoading(false);
    };

    useEffect(() => {
        const transactionsCollection = collection(db, "transactions");

        const unsubscribe = onSnapshot(transactionsCollection, async (querySnapshot) => {
            setLoading(true);
            await fetchTransactionsWithCustomerNames(querySnapshot); // Gọi hàm để lấy dữ liệu giao dịch cùng với tên khách hàng
        }, (error) => {
            console.error("Error fetching transactions: ", error);
            Alert.alert("Lỗi", "Có lỗi xảy ra khi lấy dữ liệu giao dịch.");
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const renderItem = ({ item }) => {
    
        return (
            <Card style={styles.card}>
                <Card.Content>
                    <View style={{flexDirection:'row-reverse', justifyContent:'space-between'}}>
                        <Text style={styles.transactionDate}>
                            {item.date.toString()}
                        </Text>
                        <Text style={styles.transactionDate}>
                            {item.customerName || "N/A"}
                        </Text>
                    </View>
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
    };
    

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
                        data={transactions.reverse()}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        
                    />
                    <View style={styles.summaryContainer}>
                        <Text style={styles.totalText}>
                            Tổng: {calculateTotalSpent().toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </Text>
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
});

export default TransactionScreen;
