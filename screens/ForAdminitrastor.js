import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import colors from '../shared/Colors';
import firebaseApp from '../Fire';

export default class ForAdminitrastor extends Component {

    render() {
        return (
            <View style={styles.container} >
                {/* <TouchableOpacity style= {{width: 120, height: 40, backgroundColor: colors.primary}}
                >
                </TouchableOpacity> */}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: "center",
        backgroundColor: colors.primary
    }
});