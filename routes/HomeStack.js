
import Home from '../screens/Home';
import Food from '../screens/Food';
import FitnessStack from './FitnessStack';
import SleepySounds from '../screens/SleepySounds';
import UserProfile from '../screens/UserProfile';
import UserInfomations from '../screens/UserInfomations';
import Challenges from '../screens/Challenges';
import SearchUsers from '../screens/SearchUsers';
import Leaderboard from '../screens/Leaderboard';
import AllApps from '../screens/AllApps';
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
    UserInfomations: {
        screen: UserInfomations,
        navigationOptions: { headerShown: false },
    },
    Challenges: {
        screen: Challenges,
        navigationOptions: { headerShown: false }
    },
    SearchUsers: {
        screen: SearchUsers,
        navigationOptions: { headerShown: false }
    },
    Leaderboard: {
        screen: Leaderboard,
        navigationOptions: { headerShown: false }
    },
    AllApps: {
        screen: AllApps,
        navigationOptions: { headerShown: false }
    },
}
const HomeStack = createStackNavigator(screens);
export default HomeStack;