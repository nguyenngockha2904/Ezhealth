import React from 'react';
import { Animated, Platform, StatusBar, RefreshControl, Text, View, Image, TouchableOpacity, FlatList, ScrollView, StyleSheet, Modal, TouchableWithoutFeedback, TextInput, Alert } from 'react-native';
import { AntDesign, SimpleLineIcons, FontAwesome5 } from '@expo/vector-icons'
import colors from '../shared/Colors';
import ChallengesList from '../components/ChallengesList';
import firebaseApp from '../Fire';
import Loader from '../shared/Loader';
import 'firebase/firestore';
import icons from '../temp/TempIcon';
import challenges from '../temp/TempChallenges';
import SwipeButton from 'rn-swipe-button';

const HEADER_MAX_HEIGHT = 500;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 0 : 0;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default class Challenges extends React.Component {
    themeColors = ['#17b2ac', '#ed3c56', '#5495e5', '#f9bb56', '#A3A1F7', '#2B2E35'];
    themeColorsLight = ['#d1fffd', '#ffd6df', '#dbe5ff', '#f7e4d5', '#e1e0ff', '#bfbfbf'];
    colorApp = [
        { name: 'yellow', color: '#FFD069', colorLight: '#FFF1D3' },
        { name: 'red', color: '#C36978', colorLight: '#FFB1BD' },
        { name: 'green', color: '#357377', colorLight: '#9BD9DE' },
    ];

    constructor(props) {
        super(props);
        this.state = {
            themeColors: this.themeColors,
            themeColorsLight: this.themeColorsLight,
            challenges: [],
            modalChooseIcon: false,
            modalChooseName: false,
            modalChooseColor: false,
            settings: {},
            loading: true,
            challengeIcon: '',
            challengeName: '',
            challengeColor: '#17b2ac',
            hardReset: false,
            color: '',
            colorLight: '',

            scrollY: new Animated.Value(
                // iOS has negative initial scroll value because content inset...
                Platform.OS === 'ios' ? -HEADER_MAX_HEIGHT : 0,
            ),
            refreshing: false,
        };
    }

    // CHALLENGES HANDLER
    openChooseNameModal = (name) => {
        this.autoColor();
        this.toggleChooseIcon();
        this.setState({ challengeIcon: name, challengeName: '', });
        this.toggleChooseName();
    }

    hardResetChallenges = () => {
        this.setState({
            challenges: challenges,
        });
        const docChallenges = firebaseApp.firestore().collection('users').doc(firebaseApp.auth().currentUser.email).collection('features').doc('challenges');
        docChallenges.get().then(() => {
            docChallenges.set({
                challenges: challenges,
            });
        });
        this.toggleHardReset();
    }

    autoColor = () => {
        const max = 2;
        const min = 0;
        const random = (Math.floor(Math.random() * (max - min + 1)) + min);
        this.setState({
            color: this.colorApp[random].color,
            colorLight: this.colorApp[random].colorLight,
        });
    }
    openChooseColorModal = () => {
        let challenges = this.state.challenges;
        challenges = challenges.filter(item => item.name.toLowerCase() == this.state.challengeName.toLowerCase())
        if (challenges.length >= 1) {
            Alert.alert(
                'Notification',
                'This challenge name is already taken, please try again with another name.',
                [
                    { text: 'OK' },
                ],
                { cancelable: false }
            );
        } else {
            this.toggleChooseName();
            this.toggleChooseColor();
        }
    }

    toggleChooseIcon = () => {
        this.autoColor();
        this.setState({ modalChooseIcon: !this.state.modalChooseIcon });
    }

    toggleChooseName = () => {
        this.setState({ modalChooseName: !this.state.modalChooseName });
    }

    toggleChooseColor = () => {
        this.setState({ modalChooseColor: !this.state.modalChooseColor });
    }
    toggleHardReset = () => {
        this.autoColor();
        if (this.state.settings.rank != 'Common User') {
            this.setState({ hardReset: !this.state.hardReset });
        }
    }
    renderAddChallengesColor(userColor) {
        if (this.state.settings.rank != 'Common User')
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

    updateList = list => {
        this.setState({
            challenges: this.state.challenges.map(item => {
                return item.id === list.id ? list : item;
            })
        });
        const docChallenges = firebaseApp.firestore().collection('users').doc(firebaseApp.auth().currentUser.email).collection('features').doc('challenges');
        docChallenges.get().then(() => {
            docChallenges.set({
                challenges: this.state.challenges,
            });
        });
    };

    componentWillUnmount() {
        this._isMounted = false;
    }

    getIndex(color) {
        return this.state.themeColors.findIndex(item => item === color);;
    }

    componentDidMount() {
        this.autoColor();
        var self = this;
        firebaseApp.firestore().collection('users').doc(firebaseApp.auth().currentUser.email).collection('features').doc('challenges')
            .onSnapshot(function (doc) {
                self.setState({
                    challenges: doc.data().challenges,
                });
            });
        firebaseApp.firestore().collection('users').doc(firebaseApp.auth().currentUser.email).collection('informations').doc('settings')
            .onSnapshot(function (doc) {
                self.setState({
                    settings: doc.data().settings,
                    assetsLoaded: true,
                });
            });
    }

    resetChallenges = () => {
        let challenges = this.state.challenges;
        challenges.forEach(array => {
            array.todos.map(item => {
                item.completed = false;
            })
        });
        this.updateList(challenges);
    }
    addChallenges = () => {
        const max = 809100911091109;
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

    deleteChallenges = (name) => {
        let challenges = this.state.challenges;
        challenges = challenges.filter(item => item.name != name)
        const docChallenges = firebaseApp.firestore().collection('users').doc(firebaseApp.auth().currentUser.email).collection('features').doc('challenges');
        this.setState({
            challenges: challenges,
        });
        docChallenges.get().then(() => {
            docChallenges.set({
                challenges: challenges,
            });
        });
    }

    renderChallengesList = item => {
        return <ChallengesList challenges={item} updateList={this.updateList} settings={this.state.settings} deleteChallenges={this.deleteChallenges} />
    };

    _renderScrollViewContent() {
        return (
            <View style={styles.scrollViewContent}>
                <View style={styles.container}>
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
                                    backgroundColor: this.state.color,
                                    width: '80%',
                                    height: '60%',
                                    padding: 10,
                                    borderWidth: 2,
                                    borderColor: 'white',
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
                                    backgroundColor: this.state.color,
                                    width: '90%',
                                    height: 120,
                                    borderWidth: 2,
                                    borderColor: 'white',
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
                                            selectionColor={'white'}
                                            style={[styles.input, { borderColor: 'white' }]}
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
                                                color={this.state.color}
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
                                    alignSelf: 'center',
                                    borderWidth: 2,
                                    borderColor: 'white',
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
                                            <View style={[styles.bodyTouch, { backgroundColor: 'white', width: 80, height: 80 }]}>
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

                    {/* Challenges */}
                    <ScrollView style={{ width: '100%', height: '100%', backgroundColor: '#FFF1D3' }}>
                        <View style={styles.body}>
                            <View style={styles.bodyTitle}>
                                <Text style={styles.titleBodyText}>Challenges</Text>
                                {/* Add Challenges */}
                                {this.state.settings.rank != 'Common User' ? <TouchableOpacity
                                    onPress={this.toggleChooseIcon}
                                >
                                    <AntDesign
                                        name='plus'
                                        size={30}
                                        color={'black'}
                                        style={styles.star}
                                    />
                                </TouchableOpacity> : null}

                                {/* Reset Challenges */}
                                <TouchableOpacity
                                    onPress={this.resetChallenges}
                                    onLongPress={this.toggleHardReset}
                                >
                                    <SimpleLineIcons
                                        name='reload'
                                        size={30}
                                        color={'black'}
                                        style={styles.star}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: '100%', alignItems: 'center', backgroundColor: 'white' }}>
                                {this.state.hardReset ?
                                    <SwipeButton
                                        disabled={false}
                                        //disable the button by doing true (Optional)
                                        swipeSuccessThreshold={100}
                                        height={25}
                                        //height of the button (Optional)
                                        width={'95%'}
                                        //width of the button (Optional)
                                        title={"Swipe to hard reset Challenges"}
                                        //Text inside the button (Optional)
                                        //thumbIconImageSource={thumbIcon}
                                        //You can also set your own icon for the button (Optional)
                                        onSwipeSuccess={() => {
                                            this.hardResetChallenges();
                                        }}
                                        //After the completion of swipe (Optional)
                                        railFillBackgroundColor={this.state.color} //(Optional)
                                        railFillBorderColor={this.state.color} //(Optional)
                                        thumbIconBackgroundColor={colors.white} //(Optional)
                                        thumbIconBorderColor={this.state.color}
                                        thumbIconImageSource={require('../assets/backgrounds/apps/none.png')} //(Optional)
                                        railBackgroundColor={this.state.colorLight} //(Optional)
                                        railBorderColor="white" //(Optional)
                                        titleColor='black'
                                        titleFontSize={16}
                                        titleStyles={{ fontFamily: 'quicksand-regular' }}
                                    />
                                    : null}
                            </View>
                            <View style={styles.bodyContent}>
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
                        <Image
                            source={require('../assets/images/challenges/sunny_bottom.png')}
                            style={{ width: '100%', height: 100, justifyContent: 'flex-end' }}
                        />
                    </ScrollView>
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

        const { assetsLoaded } = this.state;
        if (assetsLoaded) {
            return (
                <View style={styles.fill}>
                    <StatusBar
                        translucent
                        barStyle="light-content"
                        backgroundColor="transparent"
                    />
                    <Animated.ScrollView
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        style={styles.fill}
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
                    <Animated.View
                        pointerEvents="none"
                        style={[
                            styles.header,
                            { transform: [{ translateY: headerTranslate }],
                            backgroundColor: 'transparent', },
                        ]}
                    >
                        <Animated.Image
                            style={[
                                styles.backgroundImage,
                                {
                                    transform: [{ translateY: headerTranslate }],
                                },
                            ]}
                            source={require('../assets/images/challenges/sunny.png')}
                        />
                    </Animated.View>
                </View>
            );
        } else {
            return (
                <Loader
                    loading={this.state.loading} />
            );
        }
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
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        width: null,
        height: HEADER_MAX_HEIGHT,
        resizeMode: 'cover',
    },
    bar: {
        backgroundColor: 'transparent',
        marginTop: Platform.OS === 'ios' ? 28 : 38,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    title: {
        color: 'white',
        fontSize: 18,
    },
    scrollViewContent: {
        // iOS uses content inset, which acts like padding.
        paddingTop: Platform.OS !== 'ios' ? HEADER_MAX_HEIGHT : 0,
    },
    row: {
        height: 40,
        margin: 16,
        backgroundColor: '#D3D3D3',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: colors.white,
    },
    body: {
        width: '100%',
        height: '100%',
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: 'white',
    },
    bodyTitle: {
        paddingTop: 10,
        paddingLeft: 20,
        flexDirection: 'row',
    },
    titleBodyText: {
        color: colors.black,
        flex: 1,
        alignSelf: 'flex-start',
        fontFamily: 'quicksand-bold',
        fontSize: 22,
    },
    star: {
        alignSelf: 'flex-end',
        paddingRight: 10,
    },
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
    },
    bodyContent: {
        marginLeft: 10,
        flexDirection: 'row',
        alignItems: 'center',
        height: '100%',
        paddingBottom: 10,
    },
    bodyTouch: {
        width: 45,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
    },
});