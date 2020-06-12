import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import colors from '../shared/Colors';

export default class FoodInfoModal extends Component {
    state = {
        food: this.props.item,
    };
    render() {
        return (
            <View style={[styles.container, { backgroundColor: this.state.food.color }]}>
                <TouchableOpacity
                    onPress={this.props.toggleFooodModal}
                    style={{ alignSelf: 'flex-end', margin: 20 }}
                >
                    <AntDesign
                        name='close'
                        size={24}
                        color={colors.black}
                    />
                </TouchableOpacity>
                <Image
                    style={styles.image}
                    source={ this.state.food.image }
                />
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    style={{ width: '100%' }}
                >
                    <View style={{ alignSelf: 'flex-start', padding: 10, paddingHorizontal: 35 }}>
                        <Text style={styles.titleText}>{this.state.food.name} ({this.state.food.vnname})</Text>
                        <Text style={styles.text}>{this.state.food.infomations}</Text>
                    </View>
                    <View style={{ alignSelf: 'flex-start', padding: 10, paddingHorizontal: 30 }}>
                        <Text style={styles.titleText}>Thông tin dinh dưỡng</Text>

                        <Text style={styles.text}><Text style={{ fontFamily: 'quicksand-regular', }}>Giá trị dinh dưỡng: </Text>100 mg</Text>

                        {/* Calo (kcal) */}
                        <Text style={styles.text}><Text style={{ fontFamily: 'quicksand-regular', }}>Calo (kcal): </Text>{this.state.food.nutritionalValue.calories}</Text>

                        {/* Lipid */}
                        <Text style={styles.text}><Text style={{ fontFamily: 'quicksand-regular', }}>Lipid: </Text>{this.state.food.nutritionalValue.lipid} g</Text>

                        {/* Cholesterol */}
                        <Text style={styles.text}><Text style={{ fontFamily: 'quicksand-regular', }}>Cholesterol: </Text>{this.state.food.nutritionalValue.cholesterol} mg</Text>

                        {/* Natri */}
                        <Text style={styles.text}><Text style={{ fontFamily: 'quicksand-regular', }}>Natri: </Text>{this.state.food.nutritionalValue.natri} mg</Text>

                        {/* Kali */}
                        <Text style={styles.text}><Text style={{ fontFamily: 'quicksand-regular', }}>Kali: </Text>{this.state.food.nutritionalValue.kali} mg</Text>

                        {/* Cacbohydrat */}
                        <Text style={styles.text}><Text style={{ fontFamily: 'quicksand-regular', }}>Cacbohydrat: </Text>{this.state.food.nutritionalValue.cacbohydrat} g</Text>

                        {/* Protein */}
                        <Text style={styles.text}><Text style={{ fontFamily: 'quicksand-regular', }}>Protein: </Text>{this.state.food.nutritionalValue.protein} g</Text>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    image: {
        width: '75%',
        height: '45%',
        margin: 10,
        alignSelf: 'center',
    },
    titleText: {
        fontSize: 24,
        fontFamily: 'quicksand-bold',
        color: colors.black,
        marginBottom: 10,
    },
    text: {
        textAlign: "justify",
        fontSize: 18,
        fontFamily: 'quicksand-regular',
        color: '#5e5e5e',
        marginBottom: 10,
    }
});
