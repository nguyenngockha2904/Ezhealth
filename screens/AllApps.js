import * as React from 'react';
import { BottomNavigation, Text } from 'react-native-paper';
import SleepySounds from './SleepySounds';
import Challenges from './Challenges';
import { View, Image, Dimensions, TouchableOpacity, Modal } from 'react-native';
import colors from '../shared/Colors';

export default class AllApps extends React.Component {
    state = {
        index: 0,
        routes: [
            { key: 'food', title: 'Food', color: '#17b2ac', icon: 'food-apple' },
            { key: 'rest', title: 'Rest', color: '#ed3c56', icon: 'feather' },
            { key: 'fitness', title: 'Fitness', color: '#5495e5', icon: 'run' },
            { key: 'challenges', title: 'Challenges', color: '#f9bb56', icon: 'flower-tulip' },
            { key: 'meditation', title: 'Meditation', color: '#A3A1F7', icon: 'clock' },
            { key: 'sleepy', title: 'Sleepy', color: '#2B2E35', icon: 'music' },
        ],
        modalFix: false,
    };

    toggleFixModal = () => {
        this.setState({ modalFix: !this.state.modalFix });
    }
    handleIndexChange = index => this.setState({ index });

    renderScene = ({ route, jumpTo }) => {
        switch (route.key) {
            case 'food':
                return (
                    <View style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: colors.green,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <TouchableOpacity
                            onPress={() => { this.props.navigation.navigate('Food', { navigation: this.props.navigation }); }}
                        >
                            <Image
                                style={{ width: Dimensions.get('window').width }}
                                source={require('../assets/backgrounds/apps/foods_l.png')}
                                resizeMode='contain'
                            />

                        </TouchableOpacity>
                    </View>
                );
            case 'rest':
                return (
                    <View style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: colors.red,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <TouchableOpacity
                            onPress={() => { this.toggleFixModal() }}
                        >
                            <Image
                                style={{ width: Dimensions.get('window').width }}
                                source={require('../assets/backgrounds/apps/beach_l.png')}
                                resizeMode='contain'
                            />

                        </TouchableOpacity>
                    </View>
                );
            case 'fitness':
                return (
                    <View style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: colors.blue,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <TouchableOpacity
                            onPress={() => { this.props.navigation.navigate('Fitness', { navigation: this.props.navigation }); }}
                        >
                            <Image
                                style={{ width: Dimensions.get('window').width }}
                                source={require('../assets/backgrounds/apps/fitness_l.png')}
                                resizeMode='contain'
                            />

                        </TouchableOpacity>
                    </View>
                );
            case 'challenges':
                return (
                    <View style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: colors.orange,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <TouchableOpacity
                            onPress={() => {this.props.navigation.navigate('Challenges', { navigation: this.props.navigation });  }}
                        >
                            <Image
                                style={{ width: Dimensions.get('window').width }}
                                source={require('../assets/backgrounds/apps/sunny.png')}
                                resizeMode='contain'
                            />

                        </TouchableOpacity>
                    </View>
                );
                // return (<Challenges />);
            case 'meditation':
                return (
                    <View style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: colors.purple,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <TouchableOpacity
                            onPress={() => { this.toggleFixModal() }}
                        >
                            <Image
                                style={{ width: Dimensions.get('window').width }}
                                source={require('../assets/backgrounds/apps/meditation_l.png')}
                                resizeMode='contain'
                            />

                        </TouchableOpacity>
                    </View>
                );
            case 'sleepy':
                return (
                    <View style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: colors.primary,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <TouchableOpacity
                            onPress={() => { this.props.navigation.navigate('SleepySounds', { navigation: this.props.navigation });  }}
                        >
                            <Image
                                style={{ width: Dimensions.get('window').width }}
                                source={require('../assets/backgrounds/apps/sleepy_l.png')}
                                resizeMode='contain'
                            />

                        </TouchableOpacity>
                    </View>
                );
            // return (<SleepySounds />);
        }
    }

    render() {
        return (
            <View style={{ width: '100%', height: '100%' }}>
                {/* Modal fix */}
                <Modal
                    transparent={true}
                    onRequestClose={this.toggleFixModal}
                    visible={this.state.modalFix}
                    animationType='fade'
                >
                    <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.9)' }}
                        width='100%'
                        height='100%'
                    >
                        <TouchableOpacity
                            style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}
                            onPress={this.toggleFixModal}
                        >
                            <Text
                                style={{
                                    width: '100%',
                                    textAlign: 'center',
                                    fontSize: 38,
                                    fontFamily: 'quicksand-bold',
                                    color: colors.white,
                                }}
                            >OOPS...</Text>
                            <Text
                                style={{
                                    fontSize: 25,
                                    fontFamily: 'quicksand-regular',
                                    color: colors.white,
                                    paddingHorizontal: 20,
                                    width: '100%',
                                    textAlign: 'center',
                                }}
                            >This feature is being developed</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <BottomNavigation
                    navigationState={this.state}
                    onIndexChange={this.handleIndexChange}
                    renderScene={this.renderScene}
                />
            </View>
        );
    }
}