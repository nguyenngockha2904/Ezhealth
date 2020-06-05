import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import colors from '../shared/Colors';
export default class FitnessList extends React.Component {

    state = {
        fitness: this.props.fitness,
    }
    render() {

        return (

            <View style={{ height: 400, paddingLeft: 0 }}>
                {/* fitness Apps */}

                <TouchableOpacity
                    style={[styles.listContainer, { backgroundColor: this.state.fitness.color }]}
                    onPress={() => this.props.navigation.navigate('DetailFitness', this.state.fitness)}
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
