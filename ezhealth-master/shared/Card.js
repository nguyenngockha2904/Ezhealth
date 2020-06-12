import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, Dimensions, TouchableOpacity, Modal, FlatList, ScrollView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

export default class card extends Component {

    state = {
        modalVisible: false,
        steps: this.props.todos.steps,
        title: this.props.todos.title,
        image: this.props.todos.image,
        timer: this.props.todos.timer,
    }

    toggleModal = () => {
        this.setState({ modalVisible: !this.state.modalVisible });
    };

    render() {
        return (
            <TouchableOpacity onPress={this.toggleModal}>
                <View style={styles.cardEx}>
                    {/* Modal */}
                    <Modal animationType='slide' visible={this.state.modalVisible} onRequestClose={this.toggleModal} >
                        <TouchableOpacity
                            onPress={this.toggleModal}
                            style={{ alignSelf: 'flex-end', margin: 20 }}
                        >
                            <AntDesign
                                name='close'
                                size={24}
                                color={colors.black}
                            />
                        </TouchableOpacity>
                        <ScrollView
                            howsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            style={{ width: '100%' }}>

                            <View style={{ alignItems: 'center' }}>
                                <Image source={this.state.image}
                                    style={{
                                        width: '80%',
                                        height: 300
                                    }} />
                                <View style={{ alignSelf: 'flex-start', padding: 10, paddingHorizontal: 35 }}>
                                    <Text style={styles.titleText}>{this.state.title}</Text>
                                    <FlatList
                                        data={this.state.steps}
                                        keyExtractor={item => item.step.toString()}
                                        horizontal={false}
                                        showsHorizontalScrollIndicator={false}
                                        showsVerticalScrollIndicator={false}
                                        renderItem={({ item }) => <Text style={styles.textStep}>Step {item.step}: {item.description}</Text>}
                                    />
                                </View>
                            </View>
                        </ScrollView>
                    </Modal>

                    <Image
                        style={{ width: 50, height: 50 }}
                        // source={{uri: this.state.image}}
                        source={this.state.image}
                    />
                    <Text style={[styles.text, { marginLeft: 10 }]}>{this.state.title}</Text>
                    <Text style={[styles.textTime, { textAlign: 'right', marginEnd: 20 }]}>{this.state.timer}s</Text>
                </View>
            </TouchableOpacity>
        )
    }
}
const styles = StyleSheet.create({
    cardEx: {
        flexDirection: 'row',
        margin: 10,
        padding: 5,
        width: Dimensions.get('window').width * 0.9,
        height: 70,
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    titleText: {
        fontSize: 24,
        fontFamily: 'quicksand-bold',
        color: colors.black,
        marginBottom: 10,
    },
    text: {
        color: '#151515',
        flex: 1,
        textAlign: 'center',
        fontFamily: 'quicksand-bold',
        letterSpacing: 2,
    },
    textStep: {
        textAlign: "justify",
        fontSize: 18,
        fontFamily: 'quicksand-regular',
        color: '#5e5e5e',
        marginBottom: 10,
    },
    textTime: {
        color: '#151515',
        textAlign: 'center',
        fontFamily: 'quicksand-bold',
        letterSpacing: 2,
    },
})
