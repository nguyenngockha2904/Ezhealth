import React from 'react';
import { Text, View, Image, TouchableOpacity, FlatList, ScrollView, StyleSheet, Modal, ImageBackground } from 'react-native';
import { AntDesign } from '@expo/vector-icons'
import colors from '../shared/Colors';
import { homeStyles } from '../styles/HomeStyles';
import ActiveList from '../components/ActiveList';
import firebaseApp from '../Fire';
import 'firebase/firestore';
import Loader from '../shared/Loader';
import active from '../temp/TempActive';

export default class Home extends React.Component {
    themeColors = ['#17b2ac', '#ed3c56', '#5495e5', '#f9bb56', '#A3A1F7', '#2B2E35'];
    themeColorsLight = ['#d1fffd', '#ffd6df', '#dbe5ff', '#f7e4d5', '#e1e0ff', '#bfbfbf'];
    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            appRatio: 2,
            percent: '50%',
            assetsLoaded: false,
            foo: true,
            themeColors: this.themeColors,
            themeColorsLight: this.themeColorsLight,
            counter: 0,
            challenges: [],
            user: {},
            modalVisible: false,
            modalFix: false,
            settings: {},
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
        const docChallenges = firebaseApp.firestore().collection('users').doc(firebaseApp.auth().currentUser.email).collection('features').doc('challenges');
        const docSettings = firebaseApp.firestore().collection('users').doc(firebaseApp.auth().currentUser.email).collection('informations').doc('settings');

        docChallenges.get().then(() => {
            docChallenges.set({
                challenges: this.state.challenges,
            });
        });
        docSettings.get().then(() => {
            docSettings.set({
                settings: this.state.settings
            });
        });
    };

    getIndex(color) {
        return this.state.themeColors.findIndex(item => item === color);;
    }

    changeThemeColor = (color) => {
        this.setState({
            settings: {
                rank: this.state.settings.rank,
                color: color,
                colorLight: this.state.themeColorsLight[this.getIndex(color)],
                icon: this.state.settings.icon,
            }
        });
        const docSettings = firebaseApp.firestore().collection('users').doc(firebaseApp.auth().currentUser.email).collection('informations').doc('settings'); 
        docSettings.get().then(() => {
            docSettings.set({
                settings: this.state.settings
            })
        });
    }

    async componentDidMount() {
        var self = this;
        firebaseApp.firestore().collection('users').doc(firebaseApp.auth().currentUser.email).collection('features').doc('challenges')
            .onSnapshot(function (doc) {
                self.setState({
                    challenges: doc.data().challenges,
                })
            });
        firebaseApp.firestore().collection('users').doc(firebaseApp.auth().currentUser.email).collection('informations').doc('settings')
            .onSnapshot(function (doc) {
                self.setState({
                    settings: doc.data().settings,
                    assetsLoaded: true,
                })
            });
    }
    componentWillUnmount () {
        this._isMounted = false;
    }
    
    renderActiveList = (item, percent) => {
        return <ActiveList active={item} navigation={this.props.navigation}
            challenges={this.state.challenges}
            settings={this.state.settings} toggleFixModal={this.toggleFixModal} percent={percent} />
    };

    renderColors(userColor) {
        if (this.state.settings.rank != 'Common User')
            return this.state.themeColors.map((color) => {
                if (userColor == color) {
                    return (
                        <TouchableOpacity
                            key={color}
                            style={[styles.colorSelect, { width: 25, height: 25, backgroundColor: color, borderWidth: 2 }]}
                            onPress={() => this.changeThemeColor(color)}
                        />
                    );
                } else
                    return (
                        <TouchableOpacity
                            key={color}
                            style={[styles.colorSelect, { backgroundColor: color, marginTop: 3 }]}
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
        }).catch(function () {
            // An error happened.
        });
        this.props.navigation.navigate('Welcome');
    }

    changeRatioActiveApps = () => {

    }

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
                    <View style={[homeStyles.header, { backgroundColor: this.state.settings.color }]}>
                        {/* Info user */}
                        <ImageBackground source={this.state.settings.rank != 'Common User' ? require('../assets/backgrounds/colorful-stars.png') : require('../assets/backgrounds/apps/none.png')} style={homeStyles.info}>

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
                                <View style={[homeStyles.name]}>
                                    <TouchableOpacity style={homeStyles.name} onPress={this.openProfileNavigation}>
                                        <Text style={homeStyles.nameText}>{this.state.displayName}</Text>
                                        <Text style={homeStyles.nameSubText}>{this.state.settings.rank}</Text>
                                    </TouchableOpacity>

                                    {/* Render icon theme color */}
                                    <View style={{ alignSelf: 'stretch', justifyContent: 'center', paddingTop: 20, }}>
                                        <View style={styles.renderColor}>{this.renderColors(this.state.settings.color)}</View>
                                    </View>
                                </View>
                            </View>

                            {/* End tag */}
                        </ImageBackground>
                    </View>

                    {/* Body */}
                    <ScrollView
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        style={{ width: '100%' }}
                    >

                        {/* Active Apps */}
                        <View style={[homeStyles.body, { paddingTop: 15 }]}>

                            <View style={homeStyles.bodyTitle}>
                                <Text style={homeStyles.titleBodyText}>Ez Apps</Text>
                                <TouchableOpacity onPress={() => this.changeRatioActiveApps()}>
                                    <AntDesign
                                        name='appstore1'
                                        size={30}
                                        color={this.state.settings.color}
                                        style={homeStyles.star}
                                    />
                                </TouchableOpacity>
                            </View>

                            <View style={[homeStyles.bodyContent], { justifyContent: 'center', alignItems: 'center' }}>
                                <FlatList
                                    flexDirection={'column'}
                                    numColumns={this.state.appRatio}
                                    horizontal={false}
                                    style={homeStyles.flatlistBoby}
                                    data={active}
                                    contentContainerStyle={{ paddingLeft: 10, paddingVertical: 10 }}
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item }) => this.renderActiveList(item, this.state.percent)}
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
        width: 20,
        height: 20,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: colors.white,
    },
    renderColor: {
        width: 155,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

