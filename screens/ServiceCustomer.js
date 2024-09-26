import React, { useEffect, useState } from "react";
import { Image, View, StyleSheet, FlatList, TouchableOpacity, Alert, Text } from "react-native";
import { IconButton, Card, Button } from "react-native-paper";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";

const ServiceCustomer = ({ navigation }) => {
    const [services, setServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const servicesCollection = collection(db, "services");

        const unsubscribe = onSnapshot(servicesCollection, (querySnapshot) => {
            const servicesList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setServices(servicesList);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching services: ", error);
            Alert.alert("Lỗi", "Có lỗi xảy ra khi lấy dữ liệu dịch vụ.");
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleSelectService = (service) => {
        const isSelected = selectedServices.some(selected => selected.id === service.id);
        if (isSelected) {
            setSelectedServices(prev => prev.filter(selected => selected.id !== service.id));
        } else {
            setSelectedServices(prev => [...prev, service]);
        }
    };

    const calculateTotalPrice = () => {
        return selectedServices.reduce((total, service) => total + service.price, 0);
    };

    const handlePayment = () => {
        // Xử lý thanh toán ở đây
        Alert.alert("Thông báo", "Chức năng thanh toán chưa được triển khai.");
    };

    const renderItem = ({ item }) => {
        const isSelected = selectedServices.some(selected => selected.id === item.id);
        return (
            <TouchableOpacity
                onPress={() => handleSelectService(item)}
                style={styles.card}
            >
                <Card style={isSelected ? styles.selectedCard : {}}>
                    <Card.Content>
                        <Text style={styles.serviceName}>{item.name}</Text>
                        <Text style={styles.servicePrice}>
                            {item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </Text>
                    </Card.Content>
                </Card>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Image
                source={require("../assets/logo.png")}
                style={styles.logo}
            />

            <View style={styles.header}>
                <Text style={styles.title}>Danh sách dịch vụ</Text>
            </View>

            {loading ? (
                <Text style={styles.loading}>Đang tải dữ liệu...</Text>
            ) : (
                <FlatList
                    data={services}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                />
            )}

            <View style={styles.summaryContainer}>
                <Text style={styles.totalText}>
                    Tổng tiền: {calculateTotalPrice().toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                </Text>
                <Button
                    mode="contained"
                    style={styles.paymentButton}
                    onPress={handlePayment}
                >
                    Thanh toán
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f9f9f9',
    },
    logo: {
        alignSelf: "center",
        height: 100,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: '#333',
    },
    card: {
        marginBottom: 10,
    },
    selectedCard: {
        backgroundColor: '#e0e0e0',
    },
    serviceName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    servicePrice: {
        fontSize: 16,
        color: '#333',
    },
    loading: {
        textAlign: 'center',
        fontSize: 18,
        color: '#333',
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
    paymentButton: {
        marginTop: 16,
        backgroundColor: '#ff5722',
    }
});

export default ServiceCustomer;
