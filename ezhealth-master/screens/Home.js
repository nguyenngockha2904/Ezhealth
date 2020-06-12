import React from 'react';
import { Text, View, Image, TouchableOpacity, FlatList, ScrollView, StyleSheet, Modal, ImageBackground, TouchableWithoutFeedback, Alert, TextInput } from 'react-native';
import { AntDesign, SimpleLineIcons, FontAwesome5 } from '@expo/vector-icons'
import colors from '../shared/Colors';
import { homeStyles } from '../styles/HomeStyles';
import ChallengesList from '../components/ChallengesList';
import ActiveList from '../components/ActiveList';
import firebaseApp from '../Fire';
import 'firebase/firestore';
import Loader from '../shared/Loader';
import active from '../temp/TempActive';
import icons from '../temp/TempIcon';

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
            modalChooseIcon: false,
            modalChooseName: false,
            modalChooseColor: false,
            infomations: {},
            photoURL: firebaseApp.auth().currentUser.photoURL,
            displayName: firebaseApp.auth().currentUser.displayName,
            loading: true,
            challengeIcon: '',
            challengeName: '',
            challengeColor: '#17b2ac',
        };
    }

    handleOnNavigateBack = (photoURL, displayName) => {
        this.setState({
            photoURL,
            displayName
        })
    }

    openChooseNameModal = (name) => {
        this.toggleChooseIcon();
        this.setState({ challengeIcon: name, challengeName: '', });
        this.toggleChooseName();
    }

    openChooseColorModal = () => {
        this.toggleChooseName();
        this.toggleChooseColor();
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
                infomations: this.state.infomations
            });
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
                infomations: this.state.infomations
            })
        });
    }

    async componentDidMount() {
        var self = this;
        firebaseApp.firestore().collection('users').doc(firebaseApp.auth().currentUser.email)
            .onSnapshot(function (doc) {
                self.setState({
                    challenges: doc.data().challenges,
                    infomations: doc.data().infomations,
                    assetsLoaded: true
                })
            });
    }
    renderActiveList = (item, percent) => {
        return <ActiveList active={item} navigation={this.props.navigation} infomations={this.state.infomations} toggleFixModal={this.toggleFixModal} percent={percent} />
    };

    renderColors(userColor) {
        if (this.state.infomations.rank != 'Common User')
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
        }).catch(function (error) {
            // An error happened.
        });
        this.props.navigation.navigate('Welcome');
    }

    // CHALLENGES HANDLER
    toggleChooseIcon = () => {
        this.setState({ modalChooseIcon: !this.state.modalChooseIcon });
    }

    toggleChooseName = () => {
        this.setState({ modalChooseName: !this.state.modalChooseName });
    }

    toggleChooseColor = () => {
        this.setState({ modalChooseColor: !this.state.modalChooseColor });
    }

    renderAddChallengesColor(userColor) {
        if (this.state.infomations.rank != 'Common User')
            return this.state.themeColors.map((color) => {
                if (userColor == color) {
                    return (
                        <TouchableOpacity
                            key={color}
                            style={[styles.colorSelect, { width: 25, height: 25, backgroundColor: color, borderWidth: 2 }]}
                            onPress={() => this.setState({ challengeColor: color })}
                        />
                    );
                } else
                    return (
                        <TouchableOpacity
                            key={color}
                            style={[styles.colorSelect, { backgroundColor: color, marginTop: 3 }]}
                            onPress={() => this.setState({ challengeColor: color })}
                        />
                    );
            });
    };

    resetChallenges = () => {
        challenges = this.state.challenges;

        challenges.forEach(array => {
            array.todos.map(item => {
                item.completed = false;
            })
        });
        this.updateList(challenges);
    }
    addChallenges = () => {
        const max = 809100911091109
        const min = 81011;
        const random = (Math.floor(Math.random() * (max - min + 1)) + min);
        const icon = this.state.challengeIcon;
        const name = this.state.challengeName;
        const color = this.state.challengeColor;
        const newChallenges = {
            id: random,
            name: name,
            icon: icon,
            color: color,
            colorLight: this.state.themeColorsLight[this.getIndex(color)],
            todos: [
            ]
        };
        const add = this.state.challenges.push(newChallenges);
        this.toggleChooseColor();
        this.setState({
            challenges: add,
            challengeIcon: '',
            challengeName: '',
            challengeColor: '#17b2ac',
        });
        this.updateList(add);

    }

    deleteChallenges = (id, name) => {
        const challenges = this.state.challenges;
        const lengthList = this.state.challenges.length - 1;
        const index = this.state.challenges.find(item => item.id = id);
        const newList = challenges.splice(index, lengthList);
        const doc = firebaseApp.firestore().collection('users').doc(firebaseApp.auth().currentUser.email);
        this.setState({
            challenges: newList,
        });
        doc.get().then((docSnapshot) => {
            doc.set({
                challenges: newList,
                infomations: this.state.infomations
            });
        });
        // Alert.alert(
        //     'Notification',
        //     'This ' + name + ' challenge has been deleted.',
        //     [
        //         { text: 'OK' },
        //     ],
        //     { cancelable: false }
        // );
    }

    renderChallengesList = item => {
        return <ChallengesList challenges={item} updateList={this.updateList} infomations={this.state.infomations} deleteChallenges={this.deleteChallenges} />
    };


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

                    {/* Modal Choose Icon */}
                    <Modal transparent={true} onRequestClose={this.toggleChooseIcon} visible={this.state.modalChooseIcon} animationType='fade'>
                        <TouchableWithoutFeedback onPress={this.toggleChooseIcon}>
                            <View style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'transpament',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <View style={{
                                    borderRadius: 10,
                                    backgroundColor: this.state.infomations.color,
                                    width: '80%',
                                    height: '60%',
                                    padding: 10,
                                }}>
                                    <Text style={{
                                        color: colors.white,
                                        alignSelf: 'center',
                                        fontFamily: 'quicksand-bold',
                                        fontSize: 20,
                                        paddingBottom: 10,
                                    }} >First, choose icon:</Text>
                                    <FlatList
                                        flexDirection={'column'}
                                        numColumns={5}
                                        horizontal={false}
                                        style={{}}
                                        data={icons}
                                        contentContainerStyle={{}}
                                        showsHorizontalScrollIndicator={false}
                                        showsVerticalScrollIndicator={false}
                                        renderItem={({ item }) => {
                                            return (<TouchableOpacity
                                                style={{
                                                    width: '20%',
                                                    paddingHorizontal: 15,
                                                    paddingVertical: 15
                                                }}
                                                onPress={() => this.openChooseNameModal(item.name)}
                                            >
                                                <FontAwesome5 name={item.name} size={30} color="white" />
                                            </TouchableOpacity>)
                                        }}
                                        keyExtractor={item => item.id.toString()}
                                    />
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>

                    {/* Modal Choose Name */}
                    <Modal transparent={true} onRequestClose={this.toggleChooseName} visible={this.state.modalChooseName} animationType='fade'>
                        <TouchableWithoutFeedback onPress={this.toggleChooseName}>
                            <View style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'transpament',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <View style={{
                                    borderRadius: 10,
                                    backgroundColor: this.state.infomations.color,
                                    width: '90%',
                                    height: 120,
                                }}>
                                    <Text style={{
                                        color: colors.white,
                                        alignSelf: 'center',
                                        fontFamily: 'quicksand-bold',
                                        fontSize: 20,
                                        paddingBottom: 10,
                                    }} >Second, choose name:</Text>
                                    <View style={[styles.section, styles.footer]}>
                                        <TextInput
                                            selectionColor={this.state.infomations.color}
                                            style={[styles.input, { borderColor: this.state.infomations.color }]}
                                            onChangeText={text => this.setState({ challengeName: text })}
                                            value={this.state.challengeName}
                                        />
                                        <TouchableOpacity
                                            style={[styles.add, { backgroundColor: 'white' }]}
                                            onPress={() => { this.openChooseColorModal() }}
                                        >
                                            <AntDesign
                                                name='right'
                                                size={16}
                                                color={this.state.infomations.color}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>

                    {/* Modal Choose Color */}
                    <Modal transparent={true} onRequestClose={this.toggleChooseColor} visible={this.state.modalChooseColor} animationType='fade'>
                        <TouchableWithoutFeedback onPress={this.toggleChooseColor}>
                            <View style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'transpament',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <View style={{
                                    borderRadius: 10,
                                    backgroundColor: this.state.challengeColor,
                                    width: '90%',
                                    height: 240,
                                    alignSelf: 'center'
                                }}>
                                    <Text style={{
                                        color: colors.white,
                                        alignSelf: 'center',
                                        fontFamily: 'quicksand-bold',
                                        fontSize: 20,
                                        paddingBottom: 10,
                                    }} >Finally, choose color:</Text>
                                    <View style={{ width: '100%', alignItems: 'center', paddingTop: 10 }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={[homeStyles.bodyTouch, { backgroundColor: 'white', width: 80, height: 80 }]}>
                                                <FontAwesome5
                                                    name={this.state.challengeIcon}
                                                    size={75}
                                                    color={this.state.challengeColor}
                                                />
                                            </View>
                                            <View style={{ justifyContent: 'center' }}>
                                                <Text style={{ color: 'white', fontFamily: 'quicksand-medium', fontSize: 30, paddingLeft: 10, }}>{this.state.challengeName}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ alignItems: 'center', paddingTop: 20, }}>
                                        <View style={styles.renderColor}>{this.renderAddChallengesColor(this.state.challengeColor)}</View>
                                    </View>
                                    <View style={{ alignItems: 'center', width: '100%', paddingTop: 20, }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <TouchableOpacity
                                                style={styles.buttonAddChallenge}
                                                onPress={this.toggleChooseColor}
                                            >
                                                <Text style={{ color: 'black', fontFamily: 'quicksand-medium', fontSize: 20, padding: 0, alignSelf: "center" }}>Cancel</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={styles.buttonAddChallenge}
                                                onPress={this.addChallenges}
                                            >
                                                <Text style={{ color: 'black', fontFamily: 'quicksand-bold', fontSize: 18, padding: 0, alignSelf: "center" }}>Confirm</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>


                    {/* Header Container */}
                    <View style={[homeStyles.header, { backgroundColor: this.state.infomations.color }]}>
                        {/* Info user */}
                        <ImageBackground source={this.state.infomations.rank != 'Common User' ? require('../assets/backgrounds/colorful-stars.png') : require('../assets/backgrounds/apps/none.png')} style={homeStyles.info}>

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
                                        <Text style={homeStyles.nameSubText}>{this.state.infomations.rank}</Text>
                                    </TouchableOpacity>

                                    {/* Render icon theme color */}
                                    <View style={{ alignSelf: 'stretch', justifyContent: 'center', paddingTop: 20, }}>
                                        <View style={styles.renderColor}>{this.renderColors(this.state.infomations.color)}</View>
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

                        {/* Challenges */}
                        <View style={homeStyles.body}>
                            <View style={homeStyles.bodyTitle}>
                                <Text style={homeStyles.titleBodyText}>Challenges</Text>

                                {/* Add Challenges */}
                                {this.state.infomations.rank != 'Common User' ? <TouchableOpacity
                                    onPress={this.toggleChooseIcon}>
                                    <AntDesign
                                        name='plus'
                                        size={30}
                                        color={this.state.infomations.color}
                                        style={homeStyles.star}
                                    />
                                </TouchableOpacity> : null}

                                {/* Reset Challenges */}
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
                                <TouchableOpacity onPress={() => this.changeRatioActiveApps()}>
                                    <AntDesign
                                        name='appstore1'
                                        size={30}
                                        color={this.state.infomations.color}
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
    input: {
        flex: 1,
        fontFamily: 'quicksand-regular',
        height: 48,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 6,
        marginRight: 8,
        paddingHorizontal: 8,
        backgroundColor: 'white'
    },
    section: {
        alignSelf: 'stretch',
        flex: 1,
    },
    footer: {
        fontFamily: 'quicksand-regular',
        paddingHorizontal: 32,
        flexDirection: 'row',
        alignItems: 'center',
    },
    add: {
        borderRadius: 4,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonAddChallenge: {
        width: 100,
        height: 30,
        backgroundColor: 'white',
        borderRadius: 5,
        marginHorizontal: 5,
    }
});

