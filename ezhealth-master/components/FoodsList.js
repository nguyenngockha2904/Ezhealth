import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Modal } from 'react-native';
import colors from '../shared/Colors';
import FoodInfoModal from './FoodModal';

export default class FoodsList extends React.Component {
    state = {
        food: this.props.foods,
        modalVisible: false,
    };

    toggleFooodModal = () => {
        this.setState({ modalVisible: !this.state.modalVisible });
    };


    render() {
        return (
            <View style={{ height: 275, paddingLeft: 0 }}>

                {/* Modal */}
                <Modal
                    animationType='slide' visible={this.state.modalVisible}
                    onRequestClose={this.toggleFooodModal}
                >
                    <FoodInfoModal item={this.state.food} toggleFooodModal={this.toggleFooodModal} />
                </Modal>

                <TouchableOpacity
                    style={[styles.listContainer, { backgroundColor: this.state.food.color }]}
                    onPress= {this.toggleFooodModal}
                >
                    <Image
                        source={this.state.food.image}
                        style={{
                            width: 120,
                            height: 120
                        }}
                    />
                    <Text style={styles.listTitle} numberOfLines={1}>{this.state.food.name}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    listContainer: {
        paddingVertical: 32,
        paddingHorizontal: 16,
        borderRadius: 5,
        marginHorizontal: 12,
        alignItems: 'center',
        width: 170,
        height: 250,
    },
    listTitle: {
        paddingTop: 20,
        fontSize: 18,
        fontFamily: 'quicksand-bold',
        color: colors.black,
        marginBottom: 28,
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
