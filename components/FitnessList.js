import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import colors from '../shared/Colors';
import firebaseApp from '../Fire';
import 'firebase/firestore';

export default class FitnessList extends React.Component {

    state = {
        fitness: this.props.fitness,
        settings: this.props.navigation.getParam('settings', ''),
    }

    openFitnessToggle = () => {
        if(!this.state.fitness.limitedFeature) {
            this.props.navigation.navigate('DetailFitness', this.state.fitness)
        } else if (this.state.fitness.limitedFeature && this.state.settings.rank != 'Common User' ) {
            this.props.navigation.navigate('DetailFitness', this.state.fitness)
        } else {
            Alert.alert(
                'Notification',
                'This feature is only for Premium User.',
                [
                    { text: 'OK' },
                ],
                { cancelable: false }
            );
        }
    }

    render() {
        return (
            <View style={{ height: 400, paddingLeft: 0 }}>
                {/* fitness Apps */}

                <TouchableOpacity
                    style={[styles.listContainer, { 
                        backgroundColor: this.state.fitness.color,
                        opacity:((this.state.settings.rank == 'Common User' && !this.state.fitness.limitedFeature)) || (this.state.settings.rank != 'Common User') ? 1 : 0.5 }]
                    }
                    onPress={() => this.openFitnessToggle()}
                >
                    <Text style={styles.listTitle}>{this.state.fitness.name.toUpperCase()}</Text>
                    <Image
                        source={this.state.fitness.image}
                        style={{width: 230, height: 300}}
                    />
                </TouchableOpacity>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    listContainer: {
        paddingVertical: 32,
        paddingHorizontal: 16,
        borderRadius: 35,
        marginHorizontal: 12,
        alignItems: 'center',
        width: 300,
        height: '100%',
    },
    listTitle: {
        fontSize: 18,
        fontFamily: 'quicksand-bold',
        color: colors.white,
        marginBottom: 18,
    },
    count: {
        fontSize: 15,
        fontFamily: 'quicksand-regular',
        color: colors.white,
    },
    subtitle: {
        fontSize: 15,
        fontFamily: 'quicksand-regular',
        color: colors.white,
    },
    bodyContent: {
        flexDirection: 'column',
    },

});
