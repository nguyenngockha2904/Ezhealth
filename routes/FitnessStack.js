
import Fitness from '../screens/Fitness';
import { createStackNavigator } from 'react-navigation-stack';
import DetailFitness from '../screens/DetailFitness';
import StartFit from '../screens/StartFitness';
const screens = {
    Fitness: {
        screen: Fitness,
        navigationOptions: {
            headerShown: false,
        
        }
    },
    DetailFitness: {
        screen: DetailFitness,
        navigationOptions: {
            headerShown: false,
        
        }
    },
    StartFit:{
        screen:StartFit,
        navigationOptions: {
            headerShown: false,
        
        }
    }
    
}

const FitnessStack = createStackNavigator(screens);
export default FitnessStack;