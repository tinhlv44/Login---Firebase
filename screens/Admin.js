import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs"
import Customer from "./ServiceCustomer"
import Customers from "./Customers"
import RouterService, {} from '../routers/RouterService'
import Transaction from "./Transaction"
import Setting, {} from './Setting'
import { createStackNavigator } from "@react-navigation/stack"
import ServiceCustomer from "./ServiceCustomer"
import CustomerDetailScreen from "./CustomerDetailScreen"

const Tab = createMaterialBottomTabNavigator()

const Stack = createStackNavigator();

const CustomerStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Customers" 
        component={Customers} 
        options={{ title: 'Dịch vụ khách hàng' }} 
      />
      <Stack.Screen 
        name="CustomerDetail" 
        component={CustomerDetailScreen} 
        options={{ title: 'Chi tiết khách hàng' }} 
      />
    </Stack.Navigator>
  );
};
const Admin = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="RouterService" component={RouterService} options={{
        title: "Home",
        tabBarIcon: "home"
      }} />
      <Tab.Screen name="Transaction" component={Transaction} options={{
        tabBarIcon: "cash"
      }} />
      <Tab.Screen name="CustomerStack" component={CustomerStack} options={{
        tabBarIcon: "account"
      }} />
      <Tab.Screen name="Setting" component={Setting} options={{
        tabBarIcon: "cog"
      }} />
    </Tab.Navigator>
  )
}

export default Admin
