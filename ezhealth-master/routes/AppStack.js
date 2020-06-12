import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import WelcomeStack from './WelcomeStack';
import HomeStack from './HomeStack';

const screens = {
    WelcomeStack: {
        screen: WelcomeStack,
        navigationOptions: { headerShown:false }
    },
    HomeStack: {
        screen: HomeStack,
        navigationOptions: { headerShown:false }
    },
};

const AppStack = createStackNavigator(screens);
export default createAppContainer(AppStack);
