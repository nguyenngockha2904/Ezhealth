import React, { Component } from 'react'
import { Animated, Platform, StatusBar, RefreshControl, Text, View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import firebaseApp from '../Fire';
import 'firebase/firestore';
import { AntDesign, FontAwesome5, MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons';

const HEADER_MAX_HEIGHT = Math.round(Dimensions.get('window').height) * 0.85;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? HEADER_MAX_HEIGHT - 100 : HEADER_MAX_HEIGHT - 100;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default class UserInfomations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            following: this.props.navigation.getParam('following', ''),
            profile: {},
            settings: {},
            scrollY: new Animated.Value(
                // iOS has negative initial scroll value because content inset...
                Platform.OS === 'ios' ? -HEADER_MAX_HEIGHT : 0,
            ),
            refreshing: false,
            followingList: [],
            followersList: [],
            records: {},
        };
    }

    checkFollow = () => {
        return this.state.followingList.indexOf(this.state.following) > -1;
    }

    checkSelf = () => {
        if (this.state.following != firebaseApp.auth().currentUser.email) {
            if (this.checkFollow()) {
                return (<TouchableOpacity
                    style={[styles.button, { backgroundColor: this.state.settings.color, width: '60%' }]}
                    onPress={this.unFollowHandler}
                >
                    <Text style={styles.buttonText}>UNFOLLOW</Text>
                </TouchableOpacity>)
            } else {
                return (<TouchableOpacity
                    style={[styles.button, { backgroundColor: this.state.settings.color, width: '60%' }]}
                    onPress={this.followHandler}
                >
                    <Text style={styles.buttonText}>FOLLOW</Text>
                </TouchableOpacity>)
            }
        } else
            return (null)
    }
    unFollowHandler = () => {
        const email = firebaseApp.auth().currentUser.email;
        let followingList = this.state.followingList;
        const index = followingList.indexOf(this.state.following);
        followingList.splice(index, 1);
        const docFollowing = firebaseApp.firestore().collection('users').doc(email).collection('follows');
        docFollowing.doc('following').get().then(() => {
            docFollowing.doc('following').set({
                following: followingList,
            });
        });
        let followersList = this.state.followersList;
        const indexFollowers = followersList.indexOf(email);
        followersList.splice(indexFollowers, 1);
        const docFollowers = firebaseApp.firestore().collection('users').doc(this.state.following).collection('follows');
        docFollowers.doc('followers').get().then(() => {
            docFollowers.doc('followers').set({
                followers: followersList,
            });
        });
        this.setState({
            followingList: followingList,
            followersList: followersList,
        });
    }

    followHandler = () => {
        const email = firebaseApp.auth().currentUser.email;
        let followingList = this.state.followingList;
        followingList.push(this.state.following);
        const docFollowing = firebaseApp.firestore().collection('users').doc(email).collection('follows');
        docFollowing.doc('following').get().then(() => {
            docFollowing.doc('following').set({
                following: followingList,
            });
        });
        let followersList = this.state.followersList;
        followersList.push(email);
        const docFollowers = firebaseApp.firestore().collection('users').doc(this.state.following).collection('follows');
        docFollowers.doc('followers').get().then(() => {
            docFollowers.doc('followers').set({
                followers: followersList,
            });
        });
        this.setState({
            followingList: followingList,
            followersList: followersList,
        });
    }

    componentDidMount() {
        var self = this;
        const email = this.state.following;
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
                    assetsLoaded: true,
                });
            });
        firebaseApp.firestore().collection('users').doc(firebaseApp.auth().currentUser.email).collection('follows').doc('following')
            .onSnapshot(function (doc) {
                self.setState({
                    followingList: doc.data().following,
                });
            });
        firebaseApp.firestore().collection('users').doc(this.state.following).collection('follows').doc('followers')
            .onSnapshot(function (doc) {
                self.setState({
                    followersList: doc.data().followers,
                });
            });
        firebaseApp.firestore().collection('users').doc(this.state.following).collection('features').doc('fitness')
            .onSnapshot(function (doc) {
                self.setState({
                    records: doc.data().records,
                })
            });

    }
    _renderScrollViewContent() {
        return (
            <View style={styles.scrollViewContent}>
                <View style={styles.info}>
                    <Text style={styles.nameText}>{this.state.profile.name}</Text>
                    {/* Rank */}
                    <View style={[styles.rank]}>
                        <AntDesign name={this.state.settings.icon} size={15} color={this.state.settings.rank == 'Premium User' ? 'yellow' : 'black'} />
                        <Text style={styles.rankText}>{this.state.settings.rank}</Text>
                    </View>
                    <View style={{
                        width: '90%',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignSelf: 'center',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <View style={{
                            flex: 1, justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <FontAwesome5 name="fist-raised" size={20} color="black" />
                    <Text style={styles.recordsText} >{this.state.records.completedRounds}</Text>
                        </View>
                        <View style={{
                            flex: 1, justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <MaterialCommunityIcons name="clock" size={20} color="black" />
                            <Text style={styles.recordsText} >{this.state.records.workoutMinutes}</Text>
                        </View>
                        <View style={{
                            flex: 1, justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <FontAwesome5 name="fire" size={20} color="black" />
                            <Text style={styles.recordsText} >{this.state.records.burnedCalories}</Text>
                        </View>
                        <View style={{
                            flex: 1, justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <SimpleLineIcons name="trophy" size={20} color="black" />
                            <Text style={styles.recordsText} >{this.state.records.wunMedals}</Text>
                        </View>
                    </View>
                    <View style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'flex-end'
                    }}>
                        {this.checkSelf()}
                    </View>
                </View>
            </View>
        );
    }


    render() {
        // Because of content inset the scroll value will be negative on iOS so bring
        // it back to 0.
        const scrollY = Animated.add(
            this.state.scrollY,
            Platform.OS === 'ios' ? HEADER_MAX_HEIGHT : 0,
        );
        const headerTranslate = scrollY.interpolate({
            inputRange: [0, 700],
            outputRange: [0, -HEADER_SCROLL_DISTANCE],
            extrapolate: 'clamp',
        });
        return (
            <View style={styles.fill}>
                <StatusBar
                    translucent
                    barStyle="light-content"
                    backgroundColor="transparent"
                />
                <Animated.View
                    pointerEvents="none"
                    style={[
                        styles.header,
                        {
                            transform: [{ translateY: headerTranslate }],
                            backgroundColor: 'transparent',
                        },
                    ]}
                >
                    <Animated.Image
                        style={[
                            styles.backgroundImage,
                            {
                                transform: [{ translateY: headerTranslate }],
                            },
                        ]}
                        source={{ uri: this.state.profile.photoURL }}
                    />
                </Animated.View>
                <Animated.ScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={1}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
                        { useNativeDriver: true },
                    )}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={() => {
                                this.setState({ refreshing: true });
                                setTimeout(() => this.setState({ refreshing: false }), 1000);
                            }}
                            // Android offset for RefreshControl
                            progressViewOffset={HEADER_MAX_HEIGHT}
                        />
                    }
                    // iOS offset for RefreshControl
                    contentInset={{
                        top: HEADER_MAX_HEIGHT,
                    }}
                    contentOffset={{
                        y: -HEADER_MAX_HEIGHT,
                    }}
                >
                    {this._renderScrollViewContent()}
                </Animated.ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    fill: {
        flex: 1,
        backgroundColor: 'white',
    },
    content: {
        flex: 1,
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        overflow: 'hidden',
        height: HEADER_MAX_HEIGHT,
    },
    backgroundImage: {
        top: 0,
        left: 0,
        right: 0,
        width: null,
        height: HEADER_MAX_HEIGHT,
        resizeMode: 'cover',
        borderBottomRightRadius: 30,
        borderBottomLeftRadius: 30,
    },
    scrollViewContent: {
        // iOS uses content inset, which acts like padding.
        flex: 1,
        paddingTop: Platform.OS !== 'ios' ? HEADER_MAX_HEIGHT - 50 : 0,
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    row: {
        height: 40,
        margin: 16,
        backgroundColor: '#D3D3D3',
        alignItems: 'center',
        justifyContent: 'center',
    },
    body: {
        width: '100%',
        height: '100%',
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: 'white',
    },
    info: {
        width: '85%',
        height: 350,
        backgroundColor: 'white',
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 230,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 5 },
        shadowOpacity: 0.2,
        marginBottom: 10,
        elevation: 5,
        padding: 20,
    },
    nameText: {
        width: '90%',
        textTransform: 'uppercase',
        fontFamily: 'quicksand-bold',
        fontSize: 18,
        textAlign: 'center',
    },
    rankText: {
        fontFamily: 'quicksand-regular',
        fontSize: 15,
        paddingLeft: 5,
    },
    rank: {
        paddingBottom: 20,
        width: '60%',
        alignSelf: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 30,
    },
    buttonText: {
        fontSize: 15,
        color: 'white',
        fontFamily: 'quicksand-medium',
        textAlign: 'center'
    },
    recordsText: {
        fontSize: 10,
        color: 'black',
        fontFamily: 'quicksand-medium',
        textAlign: 'center'
    }
});