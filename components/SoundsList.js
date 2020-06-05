import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Modal } from 'react-native';
import colors from '../shared/Colors';
import SoundsModal from '../components/SoundsModal';

export default class SoundsList extends React.Component {
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
            <View style={{ height: 225, paddingLeft: 0 }}>

                {/* Modal */}
                <Modal
                    animationType='slide' visible={this.state.modalVisible}
                    onRequestClose={this.toggleSoundsModal}
                >
                    <SoundsModal item={this.state.item} />
                </Modal>

                <TouchableOpacity
                    style={[styles.listContainer, { backgroundColor: '#2B2E35' }]}
                    onPress= {this.toggleSoundsModal}
                >
                    <Image
                        source={this.state.image}
                        style={{
                            width: 120,
                            height: 120,
                            opacity: 0.8
                        }}
                    />
                    <Text style={styles.listTitle} numberOfLines={2}>{this.state.item.name}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    listContainer: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginHorizontal: 12,
        alignItems: 'center',
        width: 170,
        height: 180,
    },
    listTitle: {
        paddingTop: 20,
        fontSize: 14,
        fontFamily: 'quicksand-regular',
        color: colors.white,
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

