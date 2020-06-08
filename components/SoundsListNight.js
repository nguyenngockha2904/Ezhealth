


import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Modal } from 'react-native';
import colors from '../shared/Colors';
import SoundsModal from '../components/SoundsModal';

export default class SoundsListNights extends React.Component {
    state = {
        item: this.props.item,
        modalVisible: false,
        image: this.props.item.image
    };

    toggleSoundsModal = () => {
        this.setState({ modalVisible: !this.state.modalVisible });
    };

    render() {
        return (
            <View style={{ height: 170, paddingLeft: 0 }}>

                {/* Modal */}
                <Modal
                    animationType='slide' visible={this.state.modalVisible}
                    onRequestClose={this.toggleSoundsModal}
                >
                    <SoundsModal item={this.state.item} />
                </Modal>

                <TouchableOpacity
                    style={[styles.listContainer, { backgroundColor: 'transpament' }]}
                    onPress= {this.toggleSoundsModal}
                >
                    <Image
                        source={this.state.image}
                        style={{
                            width: 100,
                            height: 100,
                            opacity: 0.8,
                            borderRadius: 200,
                            marginTop: 15,
                        }}
                    />
                    <Text style={styles.listTitle} numberOfLines={1}>{this.state.item.name}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    listContainer: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 35,
        marginHorizontal: 12,
        alignItems: 'center',
        width: 120,
        height: 150,
    },
    listTitle: {
        paddingTop: 10,
        fontSize: 14,
        fontFamily: 'quicksand-regular',
        color: colors.primary,
        marginBottom: 28,
    },
    count: {
        fontSize: 15,
        fontFamily: 'quicksand-regular',
        color: colors.primary,
    },
    subtitle: {
        fontSize: 15,
        fontFamily: 'quicksand-regular',
        color: colors.primary,
    },
    bodyContent: {
        flexDirection: 'column',
    },

});

