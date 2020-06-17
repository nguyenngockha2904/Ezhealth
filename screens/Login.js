import React, { Component } from 'react';
import { StyleSheet, Alert, Text, View, TextInput, YellowBox, Modal, TouchableWithoutFeedback, Keyboard, ImageBackground, TouchableOpacity, } from 'react-native';
import { AntDesign, Fontisto } from '@expo/vector-icons'
import colors from '../shared/Colors';
import firebaseApp from '../Fire';
import Loader from '../shared/Loader';
import { NavigationActions } from 'react-navigation';

YellowBox.ignoreWarnings([
    'VirtualizedLists should never be nested', // TODO: Remove when fixed
    'Setting a timer for a long period of time',
]);

export default class Login extends Component {
    state = {
        modalVisible: false,
        email: this.props.navigation.getParam('email', ''),
        password: '',
        loading: false,
    }

    gotoHome = () => {
        this.setState({ email: '', password: '', })
        const navigateAction = NavigationActions.navigate({
            routeName: 'HomeStack',
            params: {},
            action: NavigationActions.navigate({ routeName: 'Home' }),
        });
        this.setState({ loading: true });
        this.props.navigation.dispatch(navigateAction);
    }

    signOut = () => {
        firebaseApp.auth().signOut().then(function () {
            // Sign-out successful.
        }).catch(function (error) {
            // An error happened.
        });
    }

    toggleModal = () => {
        this.setState({ modalVisible: !this.state.modalVisible });
    };

    sendEmailVerifycation = () => {
        const user = firebaseApp.auth().currentUser;

        user.sendEmailVerification().then(function () {
            // Email sent.
        }).catch(function (error) {
            // An error happened.
        });
    }

    componentDidMount() {
        this.signOut();
    }

    sendResetEmail = () => {
        const auth = firebaseApp.auth();
        const emailAddress = this.state.email;
        auth.sendPasswordResetEmail(emailAddress)
            .then(function () {
                // Email sent.
                this.setState({ loading: true });
                Alert.alert(
                    'Notification',
                    'We have e-mailed your password reset link!',
                    [
                        { text: 'OK' },
                    ],
                    { cancelable: false }
                );
            }).catch(function (error) {
                // An error happened.
                const errorMessage = error.message;
                this.setState({ loading: true });
                Alert.alert(
                    'Notification',
                    errorMessage,
                    [
                        { text: 'OK' },
                    ],
                    { cancelable: false }
                );
            });
    }

    gotoRegister = () => {
        this.props.navigation.replace('Register', {
            email: this.state.email
        });
    }

    signIn = () => {
        var self = this;
        this.setState({ loading: true });
        let email = this.state.email.toLowerCase();
        if (!email.includes('@'))
            email += "@gmail.com";
        firebaseApp.auth()
            .signInWithEmailAndPassword(email, this.state.password)
            .then(() => {
                {
                    if (firebaseApp.auth().currentUser.emailVerified) {
                        this.gotoHome();
                        //const errorCode = error.code;
                        self.setState({ loading: false });
                    }
                    else {                //const errorCode = error.code;
                        self.setState({ loading: false });
                        Alert.alert(
                            'Notification',
                            'Your Email must be verified, check your Email',
                            [
                                { text: 'OK' },
                            ],
                            { cancelable: false }
                        );
                    }
                }

            })
            .catch(function (error) {
                // Handle Errors here.
                //const errorCode = error.code;
                self.setState({ loading: false });
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
    }

    render() {
        return (

            <View>
                {/* Loader */}
                <Loader
                    loading={this.state.loading} />
                {/* Modal reset password */}
                <Modal
                    animationType='slide' visible={this.state.modalVisible}
                    onRequestClose={this.toggleModal} >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={{
                            flex: 1,
                            width: '100%',
                            height: '100%',
                            backgroundColor: '#fff',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                        }}>
                            {/* Icon close modal */}
                            <TouchableOpacity
                                style={{ alignSelf: 'flex-end', padding: 20 }}
                                onPress={this.toggleModal}>
                                <AntDesign
                                    name='close'
                                    size={24}
                                />
                            </TouchableOpacity>

                            {/* Title text */}
                            <Text style={[styles.titleText, { color: colors.black, alignSelf: 'flex-start', paddingLeft: 20, paddingTop: 0 }]}>Solve Problems </Text>
                            <Text style={[styles.titleText, { color: colors.black, alignSelf: 'flex-start', paddingLeft: 20, }]}>For Your Account</Text>

                            {/* Text input */}
                            <TextInput style={[styles.textInputM, { paddingTop: 80 }]}
                                defaultValue={this.state.email}
                                placeholderTextColor="#333"
                                placeholder={'Email'}
                                onChangeText={text => this.setState({ email: text })}
                            />
                            {/* Touch */}
                            {/* Reset password */}
                            <View style={[styles.bottomM, { paddingTop: 40 }]} >
                                <Text style={[styles.signUpTextM]}>Reset password</Text>
                                <TouchableOpacity
                                    onPress={() => { this.sendResetEmail() }}
                                >
                                    <AntDesign
                                        size={40}
                                        name='arrowright'
                                        style={styles.iconSignUpM}
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* Register */}
                            <View style={styles.bottomM} >
                                <Text style={styles.signUpTextM}>Register</Text>
                                <TouchableOpacity
                                    onPress={() => { this.gotoRegister() }}
                                >
                                    <AntDesign
                                        size={40}
                                        name='arrowright'
                                        style={[styles.iconSignUpM, { backgroundColor: colors.green }]}
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* End tag */}
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>

                {/* Body */}
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    {/* Image background */}
                    <ImageBackground
                        source={require('../assets/backgrounds/background_red.png')}
                        style={styles.container}
                    >
                        <View style={styles.body}>

                            {/* Title text */}
                            <Text style={[styles.titleText, { paddingTop: 60 }]}>Welcome</Text>
                            <Text style={[styles.titleText, {}]}>Back</Text>

                            {/* Text input */}
                            <View
                                style={{ paddingTop: 50 }}
                            >
                                <TextInput style={styles.textInput}
                                    defaultValue={this.state.email}
                                    placeholderTextColor="white"
                                    placeholder={'Email or Username'}
                                    onChangeText={text => this.setState({ email: text })}
                                />
                                <TextInput style={styles.textInput}
                                    placeholderTextColor="white"
                                    defaultValue={this.state.password}
                                    secureTextEntry={true}
                                    onChangeText={text => this.setState({ password: text })}
                                    placeholder={'Password'}
                                />

                                {/* Login with & log in */}
                                <View style={styles.loginWith}>
                                    <Text style={styles.loginWithText}>Log in with</Text>

                                    {/* Icons */}
                                    {/* Facebook */}
                                    <TouchableOpacity style={{ paddingLeft: 10, }}>
                                        <AntDesign
                                            name='facebook-square'
                                            size={24}
                                            color={colors.white}
                                        />
                                    </TouchableOpacity>
                                    {/* Google */}
                                    <TouchableOpacity style={{ paddingLeft: 10, }}>
                                        <AntDesign
                                            name='google'
                                            size={24}
                                            color={colors.white}
                                        />
                                    </TouchableOpacity>
                                    {/* Log in */}
                                    <TouchableOpacity style={{ paddingLeft: 10 }}
                                        onPress={() => this.signIn()}>
                                        <Fontisto
                                            name='angle-dobule-right'
                                            size={24}
                                            color={colors.white}
                                        />
                                    </TouchableOpacity>
                                </View>

                                {/* Open having trouble modal */}
                                <TouchableOpacity
                                    style={{ alignSelf: 'flex-start', paddingRight: 40, paddingTop: 20 }}
                                    onPress={this.toggleModal} >
                                    <Text style={[styles.text, { color: colors.white, fontFamily: 'quicksand-regular', }]}>Having trouble accessing your account?</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Submit */}
                            <View style={styles.bottom} >
                                <Text style={[styles.signUpText]}>Log In</Text>
                                <TouchableOpacity
                                    onPress={() => this.signIn()}
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
    textInputM: {
        marginBottom: 40,
        paddingBottom: 10,
        width: '88%',
        borderBottomWidth: 1,
        borderBottomColor: colors.black,
        fontSize: 18,
        color: colors.black,
        fontFamily: 'quicksand-regular',
    },
    bottom: {
        width: '93%',
        justifyContent: 'space-between',
        paddingTop: 150,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconSignUp: {
        color: colors.black,
        backgroundColor: colors.white,
        padding: 10,
        borderRadius: 100,
    },
    signUpText: {
        fontSize: 35,
        fontFamily: 'quicksand-regular',
        color: colors.white,
    },
    signUpTextM: {
        fontSize: 35,
        fontFamily: 'quicksand-regular',
        color: colors.black,
    },
    loginWith: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    loginWithText: {
        fontSize: 18,
        fontFamily: 'quicksand-regular',
        color: colors.white,
    },
    iconSignUpM: {
        color: colors.white,
        backgroundColor: colors.red,
        padding: 10,
        borderRadius: 100,
    },
    bottomM: {
        width: '93%',
        justifyContent: 'space-between',
        paddingTop: 30,
        flexDirection: 'row',
        alignItems: 'center',
    },
})