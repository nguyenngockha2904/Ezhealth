import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Image, ImageBackground, Alert, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native'
import colors from '../shared/Colors';
import firebaseApp from '../Fire';
import 'firebase/firestore';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import Loader from '../shared/Loader';
export default class UserProfile extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            loading: false,
            user: {},
            challenges: [],
            settings: this.props.navigation.getParam('settings', ''),
            name: '',
            photoURL: '',
            image: null,
            giftcode: '',
            profile: this.props.navigation.getParam('profile', ''),
        };
    }

    updateUser = () => {
        var user = firebaseApp.auth().currentUser;
        user.updateProfile({
            displayName: this.state.name,
            photoURL: this.state.photoURL
        }).then(function () {
            // Update successful.
        }).catch(function (error) {
            // An error happened.
        });
        const profile = this.state.profile;
        profile.name = this.state.name;
        profile.photoURL =  this.state.photoURL;
        const docProfile = firebaseApp.firestore().collection('users').doc(firebaseApp.auth().currentUser.email).collection('informations').doc('profile');
        docProfile.get().then(() => {
            docProfile.set({
                profile: profile,
            });
        });
        this.setState({ loading: false });
        this.props.navigation.state.params.onNavigateBack(this.state.photoURL, this.state.name);
        this.props.navigation.goBack();
    }

    logOut = () => {
        this.props.navigation.goBack()
        this.props.navigation.state.params.logOut();
    }

    uploadAvatar = async uri => {
        if (this.state.image != this.state.photoURL) {
            this.setState({ loading: true });
            const path = 'users/avatars/' + firebaseApp.auth().currentUser.email + '/avatar.png';
            return new Promise(async (res, rej) => {
                const response = await fetch(uri)
                const file = await response.blob()

                let upload = firebaseApp.storage().ref(path).put(file)

                upload.on(
                    'state_changed',
                    snapshot => { },
                    err => {
                        rej(err);
                    },
                    async () => {
                        const url = await upload.snapshot.ref.getDownloadURL();
                        res(url);
                        this.setState({ photoURL: url });
                        this.updateUser();
                    }
                );
            });
        } else
            this.updateUser();
    }
    componentDidMount() {
        var self = this;
        this.getPermissionAsync();
        self.setState({
            photoURL: firebaseApp.auth().currentUser.photoURL,
            image: firebaseApp.auth().currentUser.photoURL,
            name: firebaseApp.auth().currentUser.displayName,
        });
        firebaseApp.firestore().collection('users').doc(firebaseApp.auth().currentUser.email).collection('informations').doc('settings')
        .onSnapshot(function (doc) {
            self.setState({
                settings: doc.data().settings,
            });
        });
        firebaseApp.firestore().collection('users').doc(firebaseApp.auth().currentUser.email).collection('informations').doc('profile')
        .onSnapshot(function (doc) {
            self.setState({
                profile: doc.data().profile,
            });
        });

    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    _pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });
            if (!result.cancelled) {
                this.setState({ image: result.uri });
            }
        } catch (E) {
        }
    };

    getPermissionAsync = async () => {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
    }

    upToPremiumUser = () => {
        const premium =
        {
            color: '#17b2ac',
            colorLight: '#d1fffd',
            icon: 'star',
            rank: 'Premium User',
        };
        if (this.state.settings.rank == 'Common User') {
            const docGiftcode = firebaseApp.firestore().collection('giftcode').doc(this.state.giftcode);
            const docSettings = firebaseApp.firestore().collection('users').doc(firebaseApp.auth().currentUser.email).collection('informations').doc('settings');
            docGiftcode.delete().then(function () {
                console.log("Document successfully deleted!");
            }).catch(function (error) {
                console.error("Error removing document: ", error);
            });
            docSettings.get().then(() => {
                docSettings.set({
                    settings: premium
                });
            });
            this.setState({ loading: false });
            Alert.alert(
                'Notification',
                'You are Premium User now.',
                [
                    { text: 'OK' },
                ],
                { cancelable: false }
            );
        }
        else {
            this.setState({ loading: false });
            Alert.alert(
                'Notification',
                'You are ' + this.state.settings.rank + ', you can not use this giftcode.',
                [
                    { text: 'OK' },
                ],
                { cancelable: false }
            );
        }
    }

    checkGiftcode = () => {
        this.setState({ loading: true });
        var regex = /^([A-z0-9!@#$%^&*().,<>{}[\]<>?_=+\-|;:\'\"\/])*[^\s]\1*$/;
        if (this.state.giftcode != '') {
            if (this.state.giftcode.match(regex)) {
                const doc = firebaseApp.firestore().collection('giftcode').doc(this.state.giftcode);
                doc.get().then((doc) => {
                    if (doc.exists) {
                        this.upToPremiumUser();
                    } else {
                        this.setState({ loading: false });
                        Alert.alert(
                            'Notification',
                            'Giftcode does not exist or has been used.\nPlease try again with another giftcode.',
                            [
                                { text: 'OK' },
                            ],
                            { cancelable: false }
                        );
                    }
                }).catch(function (error) {
                    this.setState({ loading: false });
                    console.log("Error getting document:", error);
                });
            } else {
                this.setState({ loading: false });
                Alert.alert(
                    'Notification',
                    'Giftcode has no spaces.',
                    [
                        { text: 'OK' },
                    ],
                    { cancelable: false }
                );
            }
        } else {
            this.setState({ loading: false });
            Alert.alert(
                'Notification',
                'Please enter giftcode.',
                [
                    { text: 'OK' },
                ],
                { cancelable: false }
            );
        }
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={[styles.container, { backgroundColor: this.state.settings.color }]}>
                    {/* Loader */}
                    <Loader
                        loading={this.state.loading} />

                    {/* Header */}
                    <View style={styles.header}>
                        <ImageBackground
                            source={this.state.settings.rank != 'Common User' ? require('../assets/backgrounds/colorful-stars.png') : require('../assets/backgrounds/apps/none.png')}
                            style={{
                                backgroundColor: this.state.settings.color,
                                height: 200,
                                width: '100%',
                                flex: 1,
                            }}>
                        </ImageBackground>
                        <View style={{
                            backgroundColor: colors.white,
                            width: '95%',
                            flex: 1,
                            borderTopLeftRadius: 50,
                            borderTopRightRadius: 50,
                        }}>
                        </View>

                        {/* Avatar */}
                        <View style={{ position: 'absolute', alignSelf: 'center' }}>
                            <TouchableOpacity style={{ paddingTop: 50 }}
                                onPress={this._pickImage}
                            >
                                <Image
                                    style={styles.avatar}
                                    source={{ uri: this.state.image }} />
                            </TouchableOpacity>
                        </View>

                    </View>

                    <View style={{
                        flex: 1.2,
                        width: '95%',
                        backgroundColor: colors.white,
                        marginBottom: 10,
                        borderBottomLeftRadius: 50,
                        borderBottomRightRadius: 50,
                    }}>
                        {/* Rank */}
                        <View style={[styles.name]}>
                            <AntDesign name={this.state.settings.icon} size={20} color={this.state.settings.rank == 'Premium User' ? 'yellow' : 'black'} />
                            <Text style={styles.nameText}>{this.state.settings.rank}</Text>
                        </View>

                        {/* Name */}
                        <View style={styles.name}>
                            <TextInput
                                style={styles.textInput} defaultValue={firebaseApp.auth().currentUser.displayName}
                                placeholderTextColor={colors.gray}
                                placeholder={'Name'}
                                onChangeText={text => this.setState({ name: text })}
                            />
                        </View>
                        {/* Bottom */}

                        {/* Text Giftcode*/}
                        <View style={styles.name}>
                            <TextInput
                                style={styles.textInput} defaultValue={''}
                                placeholderTextColor={colors.gray}
                                placeholder={'Giftcode'}
                                onChangeText={text => this.setState({ giftcode: text })}
                            />
                        </View>
                        {/* Receive Giftcode */}
                        <TouchableOpacity style={[styles.button, { backgroundColor: this.state.settings.color, }]} onPress={() => this.checkGiftcode()} >
                            <Text style={styles.buttonText}>Receive Giftcode</Text>
                        </TouchableOpacity>

                        {/* Save Changes */}
                        <TouchableOpacity style={[styles.button, { backgroundColor: this.state.settings.color, }]} onPress={() => this.uploadAvatar(this.state.image)} >
                            <Text style={styles.buttonText}>Save Changes</Text>
                        </TouchableOpacity>

                        {/* Log Out */}
                        <TouchableOpacity style={[styles.button, { backgroundColor: colors.red, }]} onPress={() => this.logOut()} >
                            <Text style={styles.buttonText}>Log Out</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </TouchableWithoutFeedback>
        )
    }
}


const styles = StyleSheet.create({
    button: {
        alignSelf: 'center',
        borderRadius: 10,
        padding: 5,
        marginTop: 20,
        justifyContent: 'center',
        height: 40,
        width: '60%',
    },
    buttonText: {
        alignSelf: 'center',
        fontFamily: 'quicksand-medium',
        fontSize: 16,
        color: colors.white,
    },
    container: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: 'transparent'
    },
    header: {
        flex: 0.65,
        width: '100%',
        height: 310,
        alignItems: 'center'
    },
    avatar: {
        width: 180,
        height: 180,
        alignSelf: 'flex-start',
        borderWidth: 2,
        borderColor: colors.white,
    },
    name: {
        paddingBottom: 20,
        width: '60%',
        alignSelf: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
    },
    nameText: {
        marginLeft: 5,
        fontFamily: 'quicksand-bold',
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: 20,
        color: colors.black,
    },
    nameSubText: {
        fontFamily: 'quicksand-regular',
        fontSize: 16,
        color: colors.black,
    },
    textInput: {
        textAlign: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: colors.black,
        fontSize: 18,
        color: colors.black,
        fontFamily: 'quicksand-medium',
    },
});
