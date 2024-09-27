import { createStackNavigator } from '@react-navigation/stack'
import Services from '../screens/Services';
import AddNewService from '../screens/AddNewService';
import ServiceDetail from '../screens/ServiceDetail';
import { useMyContextController } from '../store';
import IconButton from 'react-native-paper';
import EditService from '../screens/EditService';

const Stack = createStackNavigator();

const RouterService = () => {
    const [controller, dispatch] = useMyContextController();
    const { userLogin } = controller;

    //console.log(userLogin)
    return (
        <Stack.Navigator
            initialRouteName="Services"
            screenOptions={{
                //title: (userLogin == null) && (userLogin.name),
                headerTitleAlign: "center",
                headerStyle: {
                    backgroundColor: "pink",
                },
                //headerRight: (props) => <IconButton icon="account" />
            }}
        >
            <Stack.Screen name="Services" component={Services} options={{headerShown:false}} />
            <Stack.Screen name="AddNewService" component={AddNewService} />
            <Stack.Screen name="ServiceDetail" component={ServiceDetail} />
            <Stack.Screen name="EditService" component={EditService} />
        </Stack.Navigator>
    );
};

export default RouterService;
