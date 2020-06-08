import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'
import colors from '../shared/Colors';
export default class ActiveList extends React.Component {

    openNavigation = (active) => {
        if (active.navigation != '')
            this.props.navigation.navigate(active.navigation);
        else 
            this.props.toggleFixModal();
    }
    
    render() {
        const active = this.props.active;
        if (this.props.infomations.rank != 'Common User') {
            return (
                <View style={{ aspectRatio: 1, width: this.props.percent, paddingLeft: 0 }}>
                    {/* Acctive Apps */}
                    <TouchableOpacity
                        style={[styles.listContainer, { backgroundColor: active.color }]}
                        onPress={() => this.openNavigation(active)}
                    >
                        <Image
                            source={active.imageBackground}
                            style={{ width: '100%', height: '100%', position: 'absolute', borderRadius: 10, opacity: 1 }}
                        />
                        <Text style={styles.listTitle} numberOfLines={1}>{active.name}</Text>

                    </TouchableOpacity>
                </View>
            );
        } else {
            return (
                <View style={{ aspectRatio: 1, width: this.props.percent, paddingLeft: 0 }}>
                    {/* Acctive Apps */}
                    <TouchableOpacity
                        style={[styles.listContainer, { backgroundColor: active.color, justifyContent: 'center' }]}
                        onPress={() => this.openNavigation(active)}
                    >
                        <FontAwesome5 name={active.icon}
                            size={40}
                            color={colors.white}
                            paddingVertical={20}
                            style={{ marginBottom: 20, paddingTop: 20 }} />
                        <Text style={styles.listTitle} numberOfLines={1}>{active.name}</Text>
                    </TouchableOpacity>
                </View>
            )
        }
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
