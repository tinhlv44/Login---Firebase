import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  HomeScreen,
  ForgotPasswordScreen,
  LoginScreen,
  SignupScreen,
} from "./screens";
import { RootNavigator } from "./navigation/RootNavigator";
import { AuthenticatedUserProvider } from "./providers";
//import firebaseApp from './firebaseConfig';
const App = () => {
  return (
    <AuthenticatedUserProvider>
      <SafeAreaProvider>
        <RootNavigator />
      </SafeAreaProvider>
    </AuthenticatedUserProvider>
  );
};
export default App;
