import React from 'react';
import { Text, View, Image, TouchableOpacity, FlatList, ScrollView, StyleSheet, Modal, } from 'react-native';
import { FontAwesome, AntDesign, SimpleLineIcons } from '@expo/vector-icons'
import colors from '../shared/Colors';
import { homeStyles } from '../styles/HomeStyles';
import ChallengesList from '../components/ChallengesList';
import ActiveList from '../components/ActiveList';
import firebaseApp from '../Fire';
import 'firebase/firestore';
import Loader from '../shared/Loader';

export default class Home extends React.Component {
    themeColors = ['#17b2ac', '#ed3c56', '#5495e5', '#f9bb56', '#A3A1F7'];
    themeColorsLight = ['#d1fffd', '#ffd6df', '#dbe5ff', '#f7e4d5', '#e1e0ff'];
    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            assetsLoaded: false,
            foo: true,
            themeColors: this.themeColors,
            themeColorsLight: this.themeColorsLight,
            counter: 0,
            active: [],
            challenges: [],
            user: {},
            modalVisible: false,
            modalFix: false,
            infomations: {},
            photoURL: firebaseApp.auth().currentUser.photoURL,
            displayName: firebaseApp.auth().currentUser.displayName,
            loading: true,
        };
    }

    handleOnNavigateBack = (photoURL, displayName) => {
        this.setState({
            photoURL,
            displayName
        })
    }

    toggleFixModal = () => {
        this.setState({ modalFix: !this.state.modalFix });
    }

    updateList = list => {
        this.setState({
            challenges: this.state.challenges.map(item => {
                return item.id === list.id ? list : item;
            })
        });
        const doc = firebaseApp.firestore().collection('users').doc(firebaseApp.auth().currentUser.email);
        doc.get().then((docSnapshot) => {
            doc.set({
                challenges: this.state.challenges,
                active: this.state.active,
                infomations: this.state.infomations
            })
        });
    };

    getIndex(color) {
        return this.state.themeColors.findIndex(item => item === color);;
    }

    changeThemeColor = (color) => {
        this.setState({
            infomations: {
                rank: this.state.infomations.rank,
                color: color,
                colorLight: this.state.themeColorsLight[this.getIndex(color)],
                icon: this.state.infomations.icon,
            }
        });
        const doc = firebaseApp.firestore().collection('users').doc(firebaseApp.auth().currentUser.email);
        doc.get().then((docSnapshot) => {
            doc.set({
                challenges: this.state.challenges,
                active: this.state.active,
                infomations: this.state.infomations
            })
        });
    }

    async componentDidMount() {
        var self = this;
        firebaseApp.firestore().collection('users').doc(firebaseApp.auth().currentUser.email)
            .onSnapshot(function (doc) {
                self.setState({
                    active: doc.data().active,
                    challenges: doc.data().challenges,
                    infomations: doc.data().infomations,
                    assetsLoaded: true
                })
            });
    }

    resetChallenges = () => {
        challenges = this.state.challenges;

        challenges.forEach(array => {
            array.todos.map(item => {
                item.completed = false;
            })
        });
        this.updateList(challenges);
    }

    renderChallengesList = item => {
        return <ChallengesList challenges={item} updateList={this.updateList} />
    };

    renderActiveList = item => {
        return <ActiveList active={item} navigation={this.props.navigation} />
    };

    renderColors() {
        return this.state.themeColors.map((color) => {
            return (
                <TouchableOpacity
                    key={color}
                    style={[styles.colorSelect, { backgroundColor: color }]}
                    onPress={() => this.changeThemeColor(color)}
                />
            );
        });
    };

    openProfileNavigation = () => {
        this.props.navigation.navigate('UserProfile', {
            onNavigateBack: this.handleOnNavigateBack.bind(this),
            logOut: this.logOut.bind(this)
        });
    }

    logOut = () => {
        firebaseApp.auth().signOut().then(function () {
            // Sign-out successful.openNavigation
        }).catch(function (error) {
            // An error happened.
        });
        this.props.navigation.navigate('Welcome');
    }

    // BackHandler
    // componentDidMount() {
    //     BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    // }

    // componentWillUnmount() {
    //     BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    // }
    // onBackPress = () => {
    // }

    render() {
        const { assetsLoaded } = this.state;
        if (assetsLoaded) {
            return (
                <View style={homeStyles.container}>
                    {/* Modal fix */}
                    <Modal transparent={true} onRequestClose={this.toggleFixModal} visible={this.state.modalFix} animationType='fade'>
                        <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.9)' }}
                            width='100%'
                            height='100%'
                        >
                            <TouchableOpacity
                                style={{ alignItems: 'center', justifyContent: 'center' }}
                                onPress={this.toggleFixModal}
                            >
                                <Image source={require('../assets/images/fix.png')}
                                    resizeMode='cover'
                                    style={{ width: 130, height: 130 }}
                                />
                                <Text
                                    style={{
                                        fontSize: 38,
                                        fontFamily: 'quicksand-bold',
                                        color: colors.white,
                                    }}
                                >OOPS...</Text>
                                <Text
                                    style={{
                                        fontSize: 25,
                                        fontFamily: 'quicksand-regular',
                                        color: colors.white,
                                        paddingHorizontal: 20,
                                    }}
                                >This feature is being developed</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>

                    {/* Header Container */}
                    <View style={[homeStyles.header, { backgroundColor: this.state.infomations.color }]}>
                        {/* Info user */}
                        <View style={homeStyles.info}>

                            {/* Avatar */}
                            <View style={{
                                flex: 1,
                                width: '100%',
                                height: '100%',
                                alignItems: 'flex-end',
                                justifyContent: 'center',
                            }}>
                                <TouchableOpacity onPress={this.openProfileNavigation}>
                                    <Image
                                        style={homeStyles.avatarImage}
                                        source={{ uri: this.state.photoURL }}
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* Info of current user */}
                            <View style={{
                                flex: 1,
                                width: '100%',
                                height: '100%',
                                alignItems: 'flex-start',
                                justifyContent: 'center',
                            }}>
                                <View style={homeStyles.name}>
                                    <TouchableOpacity style={homeStyles.name} onPress={this.openProfileNavigation}>
                                        <Text style={homeStyles.nameText}>{this.state.displayName}</Text>
                                        <Text style={homeStyles.nameSubText}>{this.state.infomations.rank}</Text>
                                    </TouchableOpacity>

                                    {/* Render icon theme color */}
                                    <View style={{ alignSelf: 'stretch' }}>
                                        <View style={styles.renderColor}>{this.renderColors()}</View>
                                    </View>
                                </View>
                            </View>

                            {/* End tag */}
                        </View>
                    </View>

                    {/* Body */}
                    <ScrollView
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        style={{ width: '100%' }}
                    >

                        {/* Challenges */}
                        <View style={homeStyles.body}>
                            <View style={homeStyles.bodyTitle}>
                                <Text style={homeStyles.titleBodyText}>Challenges</Text>
                                <TouchableOpacity
                                    onPress={this.resetChallenges}>
                                    <SimpleLineIcons

                                        name='reload'
                                        size={30}
                                        color={this.state.infomations.color}
                                        style={homeStyles.star}
                                    />
                                </TouchableOpacity>
                            </View>

                            <View style={homeStyles.bodyContent}>
                                <FlatList
                                    data={this.state.challenges}
                                    keyExtractor={item => item.id.toString()}
                                    horizontal={false}
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item }) => this.renderChallengesList(item)}
                                />
                            </View>
                        </View>

                        {/* Active Apps */}
                        <View style={[homeStyles.body, { paddingTop: 15 }]}>

                            <View style={homeStyles.bodyTitle}>
                                <Text style={homeStyles.titleBodyText}>Active Apps</Text>
                                <AntDesign
                                    name='appstore1'
                                    size={30}
                                    color={this.state.infomations.color}
                                    style={homeStyles.star}
                                />

                            </View>

                            <View style={homeStyles.bodyContent}>
                                <FlatList
                                    flexDirection={'column'}
                                    numColumns={2}
                                    horizontal={false}
                                    style={homeStyles.flatlistBoby}
                                    data={this.state.active}
                                    contentContainerStyle={{ paddingHorizontal: 0, paddingVertical: 10 }}
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item }) => this.renderActiveList(item)}
                                    keyExtractor={item => item.id.toString()}
                                />
                            </View>

                        </View>
                    </ScrollView>
                </View>
            );
        }
        else {
            return (
                <Loader
                    loading={this.state.loading} />
            );
        }
    }
}

const styles = StyleSheet.create({
    colorSelect: {
        width: 23,
        height: 23,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: colors.white,
    },
    renderColor: {
        width: 155,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 20,
    }
});

