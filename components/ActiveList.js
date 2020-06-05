import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'
import colors from '../shared/Colors';

export default class ActiveList extends React.Component {
    render() {
        const active = this.props.active;
        return (
            <View style={{ aspectRatio: 1, width: '50%', paddingLeft: 0 }}>
                {/* Acctive Apps */}
                <TouchableOpacity
                    style={[styles.listContainer, { backgroundColor: active.color}]}
                    onPress={() => this.props.navigation.navigate(active.navigation)}
                >
                    <Image
                        source={{ uri: active.imageBackground }}
                        style={{ width: '100%', height: '100%', position: 'absolute', borderRadius: 10, opacity:  1}}
                    />
                    {/* <FontAwesome5 name={active.icon}
                        size={40}
                        color={colors.white}
                        paddingVertical={20}
                        style={{ marginBottom: 20, paddingTop:20 }} /> */}
                    <Text style={styles.listTitle} numberOfLines={1}>{active.name}</Text>
                </TouchableOpacity>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    listContainer: {
        paddingVertical: 0,
        borderRadius: 10,
        marginHorizontal: 0,
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '95%',
        height: '95%',
    },
    listTitle: {
        paddingTop: 0,
        fontSize: 18,
        fontFamily: 'quicksand-bold',
        color: colors.white,
        marginBottom: 5,
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
