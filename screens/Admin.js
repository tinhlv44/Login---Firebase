import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useMyContextController } from '../store';
import CustomerDetailScreen from './CustomerDetailScreen';
import AddNewService from './AddNewService';
import ServiceDetail from './ServiceDetail';
import EditService from './EditService';
import Services from './Services';
import Transaction from './Transaction';
import Customers from './Customers';
import Setting from './Setting';

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

const AdminStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#e91e63', // Màu nền của header
        },
        headerTintColor: '#ffffff', // Màu của văn bản và icon trong header
        headerTitleStyle: {
          fontWeight: 'bold', // Định dạng văn bản tiêu đề header
        },
      }}
    >
      <Stack.Screen
        name="Admin"
        component={Admin}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CustomerDetail"
        component={CustomerDetailScreen}
        options={{ title: "Chi tiết khách hàng" }}
      />
      <Stack.Screen name="AddNewService" component={AddNewService} 
        options={{ title: "Thêm dịch vụ" }}
      />
      <Stack.Screen name="ServiceDetail" component={ServiceDetail} 
        options={{ title: "Chi tiết dịch vụ" }}
      />
      <Stack.Screen name="EditService" component={EditService} 
        options={{ title: "Sửa dịch vụ" }}
      />
    </Stack.Navigator>
  );
};

const Admin = () => {
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;

  return (
    <Tab.Navigator
      activeColor="#ffffff"  // Màu của icon khi chọn
      inactiveColor="#f0edf6"  // Màu của icon khi không chọn
      barStyle={{ backgroundColor: '#e91e63' }}  // Màu nền của thanh tab
    >
      <Tab.Screen
        name="Services"
        component={Services}
        options={{
          title: "Trang chủ",
          tabBarIcon: "home",
        }}
      />
      <Tab.Screen
        name="Transaction"
        component={Transaction}
        options={{
          title: 'Giao dịch',
          tabBarIcon: "cash",
        }}
      />
      <Tab.Screen
        name="Customers"
        component={Customers}
        options={{
          title: 'Khách hàng',
          tabBarIcon: "account",
        }}
      />
      <Tab.Screen
        name="Setting"
        component={Setting}
        options={{
          title: 'Cài đặt',
          tabBarIcon: "cog",
        }}
      />
    </Tab.Navigator>
  );
};

export default AdminStack;
