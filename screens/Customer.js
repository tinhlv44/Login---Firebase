import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs"
import Setting, {} from './Setting'
import ServiceCustomer from "./ServiceCustomer"

const Tab = createMaterialBottomTabNavigator()

const Customer = () => {
  return (
    <Tab.Navigator
      activeColor="#ffffff"  // Màu của icon khi chọn
      inactiveColor="#f0edf6"  // Màu của icon khi không chọn
      barStyle={{ backgroundColor: '#e91e63' }}  // Màu nền của thanh tab
    >
      <Tab.Screen name="ServiceCustomer" component={ServiceCustomer} options={{
        title: "Trang chủ",
        tabBarIcon: "home"
      }} />
      <Tab.Screen name="Setting" component={Setting} options={{
        tabBarIcon: "cog",
        title: "Cài đật"
      }} />
    </Tab.Navigator>
  )
}

export default Customer
