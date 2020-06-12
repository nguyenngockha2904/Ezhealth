import React, { Component } from "react";
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import Card from '../shared/Card';
import colors from "../shared/Colors";
export default class DetailFitness extends Component {
    state = {
        ready: this.props.navigation.getParam('ready'),
        name: this.props.navigation.getParam('name'),
        color: this.props.navigation.getParam('color'),
        todos: this.props.navigation.getParam('todos'),
        count: this.props.navigation.getParam('todos').length,
        remainingSecs: 0,
    }

    geRemaining = (time) => {
        const mins = Math.floor(time / 60);
        const secs = time - mins * 60;
        return { mins, secs };
    }
    renderCard = item => {
        return (
                <Card todos={item} />
        )
    }
    render() {
        return (
            <View style={styles.container}>

                <View style={[styles.header, { backgroundColor: '#fff' }]}>
                    <Text style={[styles.text, { flex: 1, fontSize: 30, marginTop: 50, letterSpacing: 3, color: '#151515', }]}>{this.state.name.toUpperCase()}</Text>
                </View>

                <View style={styles.body}>
                    <View style={{ paddingTop: 10, paddingLeft: 20, flexDirection: 'row', flex: 0.30 }}>
                        <Text style={{ ...styles.text, ...styles.boytitle, color: colors.white }}>ROUND: {this.state.count}</Text>
                        <Text style={{ ...styles.text, ...styles.boytitle, color: colors.white, marginEnd: 25, textAlign: 'right' }}>REST 10S/ROUND</Text>
                    </View>
                    <View style={styles.bodyContainer}>
                        <FlatList
                            flexDirection={'column'}
                            horizontal={false}
                            data={this.state.todos}
                            contentContainerStyle={{ paddingHorizontal: 0, paddingVertical: 0 }}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => this.renderCard(item)}
                            keyExtractor={item => item.id.toString()}
                        />
                    </View>
                    <TouchableOpacity style={{ marginVertical: 10 }}
                        onPress={() => {
                            todos: this.props.navigation.replace('StartFit', {
                                todos: this.state.todos,
                                color: this.state.color,
                                ready: this.state.ready,
                            })
                        }}
                    >
                        <View style={[styles.button, {
                            backgroundColor: this.state.color,
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '90%'
                        }]}>
                            <Text style={styles.buttonText}>START NOW</Text>
                        </View>
                    </TouchableOpacity>


                </View>
            </View>
        )
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: '#2B2E35',
    },
    header: {
        width: '100%',
        height: 120,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        alignSelf: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    infoHeader: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    infoDetail: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
    },
    infoIcon: {

        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        backgroundColor: '#2B2E35',
    },
    infoText: {
        marginLeft: 5,
        fontSize: 35,
        fontFamily: 'quicksand-light',
        letterSpacing: 2,
    },
    infoChild: {
        flexDirection: 'column',
        marginLeft: 10,
    },
    infotextChild: {
        color: '#151515',
        fontSize: 12,
        fontFamily: 'quicksand-bold',
    },
    text: {
        color: '#151515',
        flex: 1,
        fontFamily: 'quicksand-bold',
    },
    body: {
        width: '100%',
        flex: 1,
        justifyContent: 'flex-start',

    },
    boytitle: {
        fontSize: 22,
        marginTop: 18,
        fontFamily: 'quicksand-regular',
    },

    bodyContainer: {
        width: '100%',
        flex: 2,
        marginHorizontal: 0,
        marginVertical: 10,
        flexDirection: 'column',
        alignContent: 'center',
        alignItems: 'center',
    },
    button: {
        height: 60,
        borderRadius: 10,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#151515',
        fontFamily: 'quicksand-bold',
        justifyContent: 'center',
        color: '#fff',
        fontSize: 20,
        letterSpacing: 2,
        alignSelf: 'center',
    }


})