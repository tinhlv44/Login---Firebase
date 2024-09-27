import React, { useLayoutEffect } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

const ServiceDetail = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { service } = route.params;

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Menu>
                    <MenuTrigger style={{ marginRight: 12 }}>
                        <MaterialIcons name="more-vert" size={24} color="black" />
                    </MenuTrigger>
                    <MenuOptions>
                        <MenuOption onSelect={() => handleEdit()}>
                            <Text style={styles.menuOption}>Sửa</Text>
                        </MenuOption>
                        <MenuOption onSelect={() => handleDelete()}>
                            <Text style={styles.menuOption}>Xóa</Text>
                        </MenuOption>
                    </MenuOptions>
                </Menu>
            ),
        });
    }, [navigation, service]);

    const handleEdit = () => {
        // Điều hướng đến trang chỉnh sửa dịch vụ
        navigation.navigate('EditService', { service });
    };

    const handleDelete = () => {
        Alert.alert(
            "Xóa Dịch Vụ",
            "Bạn có chắc chắn muốn xóa dịch vụ này không?",
            [
                {
                    text: "Hủy",
                    style: "cancel"
                },
                {
                    text: "Xóa",
                    onPress: async () => {
                        try {
                            await deleteDoc(doc(db, "services", service.id));
                            navigation.goBack();
                        } catch (error) {
                            console.error("Error removing document: ", error);
                            Alert.alert("Lỗi", "Có lỗi xảy ra khi xóa dịch vụ.");
                        }
                    }
                }
            ]
        );
    };

    if (!service) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Dịch vụ không tìm thấy.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.detailContainer}>
                <Text style={styles.label}>Tên Dịch Vụ:</Text>
                <Text style={styles.value}>{service.name}</Text>
            </View>
            <View style={styles.detailContainer}>
                <Text style={styles.label}>Giá:</Text>
                <Text style={styles.value}>{service.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Text>
            </View>
            <View style={styles.detailContainer}>
                <Text style={styles.label}>Người Tạo:</Text>
                <Text style={styles.value}>{service.createdBy}</Text>
            </View>
            <View style={styles.detailContainer}>
                <Text style={styles.label}>Thời Gian Tạo:</Text>
                <Text style={styles.value}>{new Date(service.createdAt.seconds * 1000).toLocaleString('vi-VN')}</Text>
            </View>
            <View style={styles.detailContainer}>
                <Text style={styles.label}>Lần Cuối Cập Nhật:</Text>
                <Text style={styles.value}>{new Date(service.updatedAt.seconds * 1000).toLocaleString('vi-VN')}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    detailContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    value: {
        fontSize: 16,
        color: '#333',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
    },
    menuOption: {
        padding: 10,
        fontSize: 16,
        color: '#333',
    },
});

export default ServiceDetail;
