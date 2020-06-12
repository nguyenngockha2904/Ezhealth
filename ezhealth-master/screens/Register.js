import React, { Component } from 'react';
import { Alert, StyleSheet, Text, View, TextInput, ImageBackground, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { AntDesign, Fontisto } from '@expo/vector-icons'
import colors from '../shared/Colors';
import firebaseApp from '../Fire';
import 'firebase/firestore';
import challenges from '../temp/TempChallenges';
import infomations from '../temp/TempInfomations';


export default class Register extends Component {
    avatars = [
        '',
        'https://firebasestorage.googleapis.com/v0/b/ez-health.appspot.com/o/default%2Favatars%2Favatar_1.png?alt=media&token=d44ddf63-1c78-4656-b109-b235804743f1',
        'https://firebasestorage.googleapis.com/v0/b/ez-health.appspot.com/o/default%2Favatars%2Favatar_2.png?alt=media&token=59945fb2-d7ea-48b6-b0ff-d1cbaa502cee',
        'https://firebasestorage.googleapis.com/v0/b/ez-health.appspot.com/o/default%2Favatars%2Favatar_3.png?alt=media&token=73140d7a-0ed7-477c-8478-73d8bf83e001',
        'https://firebasestorage.googleapis.com/v0/b/ez-health.appspot.com/o/default%2Favatars%2Favatar_4.png?alt=media&token=6b31914e-a792-4525-b9cf-ef7138faa0f8',
        'https://firebasestorage.googleapis.com/v0/b/ez-health.appspot.com/o/default%2Favatars%2Favatar_5.png?alt=media&token=739c9a61-8f51-44d3-95e1-3d5f278c5d31',
        'https://firebasestorage.googleapis.com/v0/b/ez-health.appspot.com/o/default%2Favatars%2Favatar_6.png?alt=media&token=7dcc4d19-0a2b-4033-b069-993e8354d1fd',
        'https://firebasestorage.googleapis.com/v0/b/ez-health.appspot.com/o/default%2Favatars%2Favatar_7.png?alt=media&token=9720f9bb-14a3-43be-9f82-c8e0a241367c',
        'https://firebasestorage.googleapis.com/v0/b/ez-health.appspot.com/o/default%2Favatars%2Favatar_8.png?alt=media&token=785f568f-6285-4d58-8392-872ad47a1c0d',
        'https://firebasestorage.googleapis.com/v0/b/ez-health.appspot.com/o/default%2Favatars%2Favatar_9.png?alt=media&token=522515c9-40e4-4533-bd14-2277b060c932',
        'https://firebasestorage.googleapis.com/v0/b/ez-health.appspot.com/o/default%2Favatars%2Favatar_10.png?alt=media&token=b5023ac5-b6de-4bf6-ae06-4016f0afaf00',
        'https://firebasestorage.googleapis.com/v0/b/ez-health.appspot.com/o/default%2Favatars%2Favatar_11.png?alt=media&token=cb8d8563-3109-4228-bd34-3f5b8059f6de',
        'https://firebasestorage.googleapis.com/v0/b/ez-health.appspot.com/o/default%2Favatars%2Favatar_12.png?alt=media&token=7798190a-6cf8-4ef7-b2f6-6869386b8cbd',
    ]
    rand = Math.floor(Math.random() * (12 - 1 + 1)) + 1;

    state = {
        name: '',
        email: this.props.navigation.getParam('email', ''),
        password: '',
        rePassword: '',
        photoURL: this.avatars[this.rand]
    }

    checkFirebase = () => {
        const doc = firebaseApp.firestore().collection('users').doc(firebaseApp.auth().currentUser.email);
        doc.get().then((docSnapshot) => {
            if (!docSnapshot.exists) {
                console.log('Doc existed');
            }
            else {
                doc.set({
                    challenges: challenges,
                    infomations: infomations,
                })
            }
        });
    }

    sendEmailVerifycation = () => {
        const user = firebaseApp.auth().currentUser;

        user.sendEmailVerification().then(function () {
            // Email sent.
        }).catch(function (error) {
            // An error happened.
        });
    }

    signOut = () => {
        firebaseApp.auth().signOut().then(function () {
            // Sign-out successful.
        }).catch(function (error) {
            // An error happened.
        });
    }

    gotoLogIn = () => {
        this.props.navigation.replace('Login', {
            email: this.state.email
        });
    }

    signUp = () => {
        if (this.state.password == this.state.rePassword) {
            firebaseApp.auth()
                .createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then((userCredentials) => {
                    if (userCredentials.user) {
                        userCredentials.user.updateProfile({
                            displayName: this.state.name,
                            photoURL: this.state.photoURL,
                        }).then(() => {
                            Alert.alert(
                                'Notification',
                                'Created a new account with email ' + this.state.email +'.',
                                [
                                    { text: 'OK', onPress: () => { this.sendEmailVerifycation(), this.checkFirebase(), this.gotoLogIn()} },
                                ],
                                { cancelable: false }
                            );
                        })
                    }
                })
                .catch(function (error) {
                    // Handle Errors here.
                    //const errorCode = error.code;
                    const errorMessage = error.message;
                    Alert.alert(
                        'Notification',
                        errorMessage,
                        [
                            { text: 'OK' },
                        ],
                        { cancelable: false }
                    );
                });
        } else {
            Alert.alert(
                'Notification',
                'Two passwords do not match, type again.',
                [
                    { text: 'OK' },
                ],
                { cancelable: false }
            );
        }
    }


    render() {
        return (
            <View>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                    {/* Image background */}
                    <ImageBackground
                        source={require('../assets/backgrounds/background_green.png')}
                        style={styles.container}
                    >
                        {/* Body */}
                        <View style={styles.body}>

                            {/* Title */}
                            <Text style={[styles.titleText, { paddingTop: 60 }]}>Create</Text>
                            <Text style={[styles.titleText, {}]}>Account</Text>

                            {/* Text input */}
                            <View
                                style={{ paddingTop: 40 }}
                            >
                                <TextInput style={styles.textInput}
                                    placeholderTextColor="#fff"
                                    placeholder={'Name'}
                                    onChangeText={text => this.setState({ name: text })}
                                />
                                <TextInput style={styles.textInput}
                                    defaultValue={this.state.email}
                                    placeholderTextColor="#fff"
                                    placeholder={'Email'}
                                    onChangeText={text => this.setState({ email: text })}
                                />
                                <TextInput style={styles.textInput}
                                    placeholderTextColor="#fff"
                                    secureTextEntry={true}
                                    placeholder={'Password'}
                                    onChangeText={text => this.setState({ password: text })}
                                />
                                <TextInput style={styles.textInput}
                                    placeholderTextColor="#fff"
                                    secureTextEntry={true}
                                    placeholder={'Retype Password'}
                                    onChangeText={text => this.setState({ rePassword: text })}
                                />
                                <TouchableOpacity style={{ alignItems: 'flex-end', width: '88%', }}
                                    onPress={() => this.signUp()}>
                                    <Fontisto
                                        name='angle-dobule-right'
                                        size={24}
                                        color={colors.white}
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* Submit */}
                            <View style={styles.bottom} >
                                <Text style={[styles.signUpText]}>Sign Up</Text>
                                <TouchableOpacity
                                    onPress={() => { this.checkFirebase() }}
                                >
                                    <AntDesign
                                        size={40}
                                        name='arrowright'
                                        style={styles.iconSignUp}
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* End tag */}
                        </View>
                    </ImageBackground>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%'
    },
    text: {
        fontSize: 18,
        fontFamily: 'quicksand-regular',
        color: colors.white,
    },
    titleText: {
        fontSize: 40,
        fontFamily: 'quicksand-medium',
        color: colors.white,
    },
    iconClose: {
        color: colors.white,
        alignSelf: 'center',
    },
    body: {
        paddingLeft: 35,
    },
    textInput: {
        marginBottom: 40,
        paddingBottom: 10,
        width: '88%',
        borderBottomWidth: 1,
        borderBottomColor: colors.white,
        fontSize: 18,
        color: colors.white,
        fontFamily: 'quicksand-regular',
    },
    picker: {
        fontSize: 18,
        fontFamily: 'quicksand-regular',
        height: 50,
        width: 120,
        color: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.white,
        alignSelf: 'center',
    },
    bottom: {
        width: '93%',
        justifyContent: 'space-between',
        paddingTop: 45,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconSignUp: {
        color: colors.white,
        backgroundColor: colors.black,
        padding: 10,
        borderRadius: 100,
    },
    signUpText: {
        fontSize: 35,
        fontFamily: 'quicksand-regular',
        color: colors.white,
    },
    down: {
        color: colors.white,
    }
})