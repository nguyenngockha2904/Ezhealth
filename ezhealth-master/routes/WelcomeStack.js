import { createStackNavigator } from 'react-navigation-stack';
import Register from '../screens/Register';
import Welcome from '../screens/Welcome';
import Login from '../screens/Login';

const screens = {
    Welcome: {
        screen: Welcome,
        navigationOptions: { headerShown:false }
    },
    Register: {
        screen: Register,
        navigationOptions: { headerShown:false }
    },
    Login: {
        screen: Login,
        navigationOptions: { headerShown:false }
    }
};

// home stack navigator screens
const WelcomeStack = createStackNavigator(screens);
export default WelcomeStack;
