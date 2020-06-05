import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Image, Alert, ImageBackground, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native'
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
            infomations: {},
            name: '',
            photoURL: '',
            image: null,
            cover: require('../assets/backgrounds/colorful-stars.png'),
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
        this.getPermissionAsync();
        var self = this;
        firebaseApp.firestore().collection('users').doc(firebaseApp.auth().currentUser.email)
            .onSnapshot(function (doc) {
                self.setState({
                    infomations: doc.data().infomations,
                    name: firebaseApp.auth().currentUser.displayName,
                    photoURL: firebaseApp.auth().currentUser.photoURL,
                    image: firebaseApp.auth().currentUser.photoURL,
                })
            });
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
                this.setPho
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


    render() {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={[styles.container, { backgroundColor: this.state.infomations.color }]}>
                    {/* Loader */}
                    <Loader
                        loading={this.state.loading} />

                    {/* Header */}
                    <View style={styles.header}>
                        <ImageBackground
                            source={this.state.cover}
                            style={{
                                backgroundColor: this.state.infomations.color,
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


                        {/* Name */}
                        <View style={styles.name}>
                            <TextInput
                                style={styles.textInput} defaultValue={firebaseApp.auth().currentUser.displayName}
                                placeholderTextColor={colors.black}
                                placeholder={'Name'}
                                onChangeText={text => this.setState({ name: text })}
                            />
                        </View>
                        {/* Rank */}
                        <View style={[styles.name]}>
                            <AntDesign name={this.state.infomations.icon} size={18} color="black" />
                            <Text style={styles.nameText}>{this.state.infomations.rank}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', paddingTop: 0 }}>
                            <TouchableOpacity style={styles.bottom} onPress={() => this.uploadAvatar(this.state.image)} >

                                <Text style={[styles.signUpText]}>Save Changes</Text>
                                <AntDesign
                                    size={18}
                                    name='arrowright'
                                    style={[styles.iconSignUp, {
                                        color: colors.white,
                                        backgroundColor: this.state.infomations.color,
                                    }]}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                            <TouchableOpacity style={styles.bottom} onPress={this.logOut} >
                                <Text style={[styles.signUpText]}>Log Out</Text>
                                <AntDesign
                                    size={18}
                                    name='arrowright'
                                    style={[styles.iconSignUp, {
                                        color: colors.white,
                                        backgroundColor: colors.red,
                                    }]}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}


const styles = StyleSheet.create({
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
        width: '50%',
        alignSelf: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
    },
    nameText: {
        marginLeft: 5,
        fontFamily: 'quicksand-medium',
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: 18,
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
    bottom: {
        flex: 1,
        paddingRight: 20,
        width: '90%',
        justifyContent: 'flex-end',
        paddingTop: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconSignUp: {
        padding: 5,
        borderRadius: 100,
    },
    signUpText: {
        paddingRight: 10,
        fontSize: 16,
        fontFamily: 'quicksand-medium',
        color: colors.black,
    },
    iconLogOut: {
        width: 50,
        paddingLeft: 10,
        alignSelf: 'flex-start',
        marginTop: 10,
    },
});
