import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const CustomerDetailScreen = ({ route }) => {
    const { customerId } = route.params;
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const customerDoc = doc(db, "USERS", customerId);
                const docSnap = await getDoc(customerDoc);
                if (docSnap.exists()) {
                    setCustomer(docSnap.data());
                } else {
                    Alert.alert("Lỗi", "Khách hàng không tồn tại.");
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching customer: ", error);
                Alert.alert("Lỗi", "Có lỗi xảy ra khi lấy dữ liệu khách hàng.");
                setLoading(false);
            }
        };

        fetchCustomer();
    }, [customerId]);

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#ff5722" />
            ) : customer ? (
                <View style={styles.detailContainer}>
                    <Text style={styles.detailTitle}>Thông tin khách hàng</Text>
                    <Text style={styles.detailText}>Họ tên: {customer.fullName}</Text>
                    <Text style={styles.detailText}>Email: {customer.email}</Text>
                    <Text style={styles.detailText}>Số điện thoại: {customer.phone}</Text>
                    <Text style={styles.detailText}>Địa chỉ: {customer.address}</Text>
                </View>
            ) : (
                <Text>Không có dữ liệu để hiển thị.</Text>
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
    detailContainer: {
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 3,
    },
    detailTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    detailText: {
        fontSize: 18,
        marginBottom: 8,
    },
});

export default CustomerDetailScreen;
