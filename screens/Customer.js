import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs"
import Setting, {} from './Setting'
import ServiceCustomer from "./ServiceCustomer"

const Tab = createMaterialBottomTabNavigator()

const Customer = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="ServiceCustomer" component={ServiceCustomer} options={{
        title: "Home",
        tabBarIcon: "home"
      }} />
      <Tab.Screen name="Setting" component={Setting} options={{
        tabBarIcon: "cog"
      }} />
    </Tab.Navigator>
  )
}

export default Customer
