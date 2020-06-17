import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import firebaseApp from '../Fire';
import 'firebase/firestore';
import ProgressCircle from 'react-native-progress-circle';

export default class FollowList extends React.Component {

    state = {
        following: this.props.following,
        profile: {},
        settings: {},
    }

    openProfileNavigation = () => {
        this.props.navigation.navigate('UserInfomations', {
            following: this.state.following,
        });
    }
    componentDidMount() {
        var self = this;
        const email = this.props.following;
        firebaseApp.firestore().collection('users').doc(email).collection('informations').doc('profile')
            .onSnapshot(function (doc) {
                self.setState({
                    profile: doc.data().profile,
                });
            });
        firebaseApp.firestore().collection('users').doc(email).collection('informations').doc('settings')
            .onSnapshot(function (doc) {
                self.setState({
                    settings: doc.data().settings,
                });
            });
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    render() {
        return (
            <View style={{
                width: 100,
                height: 120,
                paddingLeft: 0,
                opacity: 1,
                borderRadius: 100,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                marginRight: 15,
            }}>
                {/* Following */}
                <TouchableOpacity
                    style={[styles.listContainer, {
                        width: 90,
                        height: 90,
                        backgroundColor: 'transparent',
                        borderRadius: 100,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }]}
                    onPress={() => { this.openProfileNavigation() }}
                >
                    <Image
                        source={{ uri: this.state.profile.photoURL }}
                        style={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            borderRadius: 100,
                            opacity: 1,
                        }}
                    />

                </TouchableOpacity>
                <View style={{ width: '100%', height: '100%', alignItems: 'center' }}>
                    <Text
                        numberOfLines={1}
                        style={
                            {
                                color: 'black',
                                fontSize: 11,
                                paddingTop: 5,
                                fontFamily: 'quicksand-medium',
                            }
                        }
                    >{this.state.profile.name}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    listContainer: {
        paddingVertical: 0,
        borderRadius: 100,
        marginHorizontal: 0,
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '95%',
        height: '95%',
    },
    progress: {
        width: 10,
        height: 10,
        alignSelf: 'flex-end',
        justifyContent: 'flex-end'
    },
});
