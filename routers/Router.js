import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { LoginScreen } from '../screens/LoginScreen';
import { SignupScreen } from '../screens/SignupScreen';
import { ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
import Admin from '../screens/Admin';
import Customer from '../screens/Customer';
import { MyContextControllerProvider, useMyContextController } from '../store';
//import { MyContextControllerProvider, useMyContextController } from '../context/MyContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator
    initialRouteName="Login"
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </Stack.Navigator>
);

const AppStack = () => {
  const [controller] = useMyContextController();
  const { userLogin } = controller;

  return (
    <>
      {userLogin ? (
        userLogin.role === 'customer' ? (
          // Nếu người dùng đã đăng nhập và là khách hàng, hiển thị Customer
          <Customer />
        ) : (
          // Nếu người dùng đã đăng nhập và là quản trị viên, hiển thị Admin
          <Admin />
        )
      ) : (
        // Nếu người dùng chưa đăng nhập, bạn có thể chuyển hướng đến màn hình đăng nhập
        // Hoặc có thể để lại trống để xử lý đăng nhập ở nơi khác
        null
      )}
    </>
  );
};

const Router = () => {
  const [controller] = useMyContextController();
  const { userLogin } = controller;

  return (
    <NavigationContainer>
      {userLogin ? (
        // Nếu người dùng đã đăng nhập, hiển thị AppStack
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="App" component={AppStack} />
        </Stack.Navigator>
      ) : (
        // Nếu người dùng chưa đăng nhập, hiển thị AuthStack
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Auth" component={AuthStack} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

const App = () => (
  <MyContextControllerProvider>
    <Router />
  </MyContextControllerProvider>
);

export default App;
