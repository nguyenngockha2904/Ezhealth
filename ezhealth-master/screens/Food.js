import React, { Component } from "react";
import { StyleSheet, View, Text, Image, FlatList, ScrollView } from 'react-native';
import foods from '../temp/TempFood';
import FoodsList from '../components/FoodsList';
import { homeStyles } from '../styles/HomeStyles';
import colors from "../shared/Colors";

const fruits = foods.filter(item => item.type == 'fruit');
const vegetables = foods.filter(item => item.type == 'vegetables');
const nutsandseeds = foods.filter(item => item.type == 'nutsandseeds');

export default class Food extends Component {

    renderFoodList = item => {
        return <FoodsList foods={item} />
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    style={{ width: '100%' }} >
                    {/* <Text style={styles.titleBodyText}>FOOD CHOICES</Text> */}
                    <Image
                        style={{
                            alignSelf: 'center',
                            marginTop: 30,
                            width: 300,
                            height: 450
                        }}
                        source={require('../assets/images/foods/logo.png')}
                    />

                    {/* Fruits */}
                    <View style={homeStyles.body}>
                        <View style={homeStyles.bodyTitle}>
                            <Text style={homeStyles.titleBodyText}>Fruits</Text>
                        </View>

                        <View style={homeStyles.bodyContent}>
                            <FlatList
                                flexDirection={'column'}
                                horizontal={true}
                                style={styles.flatlistBoby}
                                data={fruits}
                                contentContainerStyle={{ paddingHorizontal: 0, paddingVertical: 0 }}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item }) => this.renderFoodList(item)}
                                keyExtractor={item => item.id.toString()}
                            />
                        </View>
                    </View>

                    {/* Vegetables */}
                    <View style={homeStyles.body}>
                        <View style={homeStyles.bodyTitle}>
                            <Text style={homeStyles.titleBodyText}>Vegetables</Text>
                        </View>

                        <View style={homeStyles.bodyContent}>
                            <FlatList
                                flexDirection={'column'}
                                horizontal={true}
                                style={styles.flatlistBoby}
                                data={vegetables}
                                contentContainerStyle={{ paddingHorizontal: 0, paddingVertical: 0 }}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item }) => this.renderFoodList(item)}
                                keyExtractor={item => item.id.toString()}
                            />
                        </View>
                    </View>

                    {/* Nuts and seeds */}
                    <View style={homeStyles.body}>
                        <View style={homeStyles.bodyTitle}>
                            <Text style={homeStyles.titleBodyText}>Nuts and seeds</Text>
                        </View>

                        <View style={homeStyles.bodyContent}>
                            <FlatList
                                flexDirection={'column'}
                                horizontal={true}
                                style={styles.flatlistBoby}
                                data={nutsandseeds}
                                contentContainerStyle={{ paddingHorizontal: 0, paddingVertical: 0 }}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item }) => this.renderFoodList(item)}
                                keyExtractor={item => item.id.toString()}
                            />
                        </View>
                    </View>

                    {/* End tag */}
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
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    flatlistBoby: {
        
    },
    titleBodyText: {
        color: colors.black,
        flex: 1,
        alignSelf: 'center',
        fontFamily: 'quicksand-regular',
        fontSize: 50,
        paddingTop: 50
    },
});