import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Modal } from 'react-native';
import Colors from '../shared/Colors';
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
            <View style={{ width: '33%', height: 155, padding: 5 }}>

                {/* Modal */}
                <Modal
                    animationType='slide' visible={this.state.modalVisible}
                    onRequestClose={this.toggleSoundsModal}
                >
                    <SoundsModal item={this.state.item} />
                </Modal>

                <TouchableOpacity
                    style={[styles.listContainer, { backgroundColor: Colors.primary, width: '100%' }]}
                    onPress= {this.toggleSoundsModal}
                >
                    <Image
                        source={this.state.image}
                        style={{
                            maxWidth: '90%',
                            maxHeight: '80%',
                            aspectRatio: 1,
                            opacity: 0.8,
                            borderRadius: 5,
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
        paddingTop: 10,
        paddingVertical: 5,
        paddingHorizontal: 5,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
        height: 140,
    },
    listTitle: {
        paddingTop: 5,
        fontSize: 12,
        fontFamily: 'quicksand-regular',
        color: colors.white,
        marginBottom: 28,
    },
    count: {
        fontSize: 12,
        fontFamily: 'quicksand-regular',
        color: colors.white,
    },
    subtitle: {
        fontSize: 12,
        fontFamily: 'quicksand-regular',
        color: colors.white,
    },
    bodyContent: {
        flexDirection: 'column',
    },

});