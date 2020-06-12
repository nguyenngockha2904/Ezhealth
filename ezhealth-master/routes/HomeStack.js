
import Home from '../screens/Home';
import Food from '../screens/Food';
import FitnessStack from './FitnessStack';
import SleepySounds from '../screens/SleepySounds';
import UserProfile from '../screens/UserProfile';
import ForAdminitrastor from '../screens/ForAdminitrastor'
import { createStackNavigator } from 'react-navigation-stack';

const screens = {
    Home: {
        screen: Home,
        navigationOptions: { headerShown: false }
    },
    Food: {
        screen: Food,
        navigationOptions: { headerShown: false }
    },
    FitnessStack: {
        screen: FitnessStack,
        navigationOptions: { headerShown: false }
    },
    SleepySounds: {
        screen: SleepySounds,
        navigationOptions: { headerShown: false }
    },
    UserProfile: {
        screen: UserProfile,
        navigationOptions: { headerShown: false }
    },
    ForAdminitrastor: {
        screen: ForAdminitrastor,
        navigationOptions: { headerShown: false }
    },
}
const HomeStack = createStackNavigator(screens);
export default HomeStack;