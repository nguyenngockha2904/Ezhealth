import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'
import colors from '../shared/Colors';
import firebaseApp from '../Fire';
import 'firebase/firestore';

export default class AppsList extends React.Component {

    state = {
        settings: this.props.settings,
        apps: this.props.apps,
        challenges: this.props.challenges,
    }

    componentDidMount() {
        var self = this;
        const docSettings = firebaseApp.firestore().collection('users').doc(firebaseApp.auth().currentUser.email).collection('informations').doc('settings');
        docSettings
            .onSnapshot(function (doc) {
                self.setState({
                    settings: doc.data().settings,
                })
            });
        const docChallenges = firebaseApp.firestore().collection('users').doc(firebaseApp.auth().currentUser.email).collection('features').doc('challenges');
        docChallenges
            .onSnapshot(function (doc) {
                self.setState({
                    challenges: doc.data().challenges,
                })
            });
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    openNavigation = (apps) => {
        if (!this.state.apps.limitedFeature) {
            if (apps.navigation != '')
                this.props.navigation.navigate(apps.navigation, { settings: this.state.settings, challenges: this.state.challenges });
            else
                this.props.toggleFixModal();
        } else if (this.state.apps.limitedFeature && this.state.settings.rank != 'Common User') {
            if (apps.navigation != '')
                this.props.navigation.navigate(apps.navigation, { settings: this.state.settings, challenges: this.state.challenges });
            else
                this.props.toggleFixModal();
        } else {
            Alert.alert(
                'Notification',
                'This feature is only for Premium User.',
                [
                    { text: 'OK' },
                ],
                { cancelable: false }
            );
        }
    }

    render() {
        if (this.state.settings.rank != 'Common User') {
            return (
                <View style={{
                    aspectRatio: 1,
                    width: this.props.percent,
                    paddingLeft: 0,
                    opacity: 1,
                }}>
                    {/* Apps */}
                    <TouchableOpacity
                        style={[styles.listContainer, { backgroundColor: this.state.apps.color }]}
                        onPress={() => this.openNavigation(this.state.apps)}
                    >
                        <Image
                            source={this.state.apps.imageBackground}
                            style={{
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                borderRadius: 10,
                                opacity: 1,
                            }}
                        />
                        <Text style={styles.listTitle} numberOfLines={1}>{this.state.apps.name}</Text>

                    </TouchableOpacity>
                </View>
            );
        } else {
            return (
                <View style={{
                    aspectRatio: 1,
                    width: this.props.percent,
                    paddingLeft: 0,
                    alignItems: 'center',
                    opacity: this.state.settings.rank == 'Common User' && !this.state.apps.limitedFeature ? 1 : 0.5
                }}>
                    {/* Acctive Apps */}
                    <TouchableOpacity
                        style={[styles.listContainer, { backgroundColor: this.state.apps.color, justifyContent: 'center' }]}
                        onPress={() => this.openNavigation(this.state.apps)}
                    >
                        <FontAwesome5 name={this.state.apps.icon}
                            size={40}
                            color={colors.white}
                            paddingVertical={20}
                            style={{ marginBottom: 20, paddingTop: 20 }} />
                        <Text style={styles.listTitle} numberOfLines={1}>{this.state.apps.name}</Text>
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