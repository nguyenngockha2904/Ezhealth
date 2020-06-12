import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import colors from '../shared/Colors';
import { welcomeStyles } from '../styles/WelcomeStyles';
import firebaseApp from '../Fire';
import { NavigationActions } from 'react-navigation';
import Loader from '../shared/Loader';

export default class Welcome extends Component {
    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            assetsLoaded: false,
        };
    }

    async componentDidMount() {
        firebaseApp.auth().onAuthStateChanged(user => {
            if (user) {
                this.gotoHome();
                this.setState({ assetsLoaded: true });
            } else {
                this.setState({ assetsLoaded: true });
            }
        })
    }

    componentWillUnmount () {
        this._isMounted = false;
    }
    
    gotoHome = () => {
        if (firebaseApp.auth().currentUser.emailVerified) {
            const navigateAction = NavigationActions.navigate({
                routeName: 'HomeStack',
                params: {},
                action: NavigationActions.navigate({ routeName: 'Home' }),
            });
            this.props.navigation.dispatch(navigateAction);
        }
    }

    toggleRegister = () => {
        this.props.navigation.navigate('Register');
    };

    loggedCheck = () => {
        const logged = firebaseApp.auth().currentUser;
        if (logged != null) {
            this.gotoHome();
        }
        else {
            this.props.navigation.navigate('Login', { gotoHome: this.gotoHome });
        }
    }

    render() {
        return (
            <View style={welcomeStyles.container}>
                <Loader
                    loading={!this.state.assetsLoaded} />
                <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                    {/* Logo */}
                    <Image style={welcomeStyles.logo}
                        width={320}
                        height={240}
                        source={require('../assets/animations/bicycleboy.gif')}
                    />
                    {/* Title header */}
                    <View style={{ flexDirection: 'row' }}>
                        <View style={welcomeStyles.divider} />
                        <Text style={welcomeStyles.title}>
                            Easy <Text style={{ fontFamily: 'quicksand-regular', color: colors.black }}>Health</Text>
                        </Text>
                        <View style={welcomeStyles.divider} />
                    </View>

                    {/* Touch */}
                    <View style={{ flexDirection: 'column', alignItems: 'center', paddingTop: 20 }}>

                        {/* Register */}
                        <TouchableOpacity style={welcomeStyles.login}
                            onPress={this.loggedCheck}>
                            <Text style={welcomeStyles.textLogin}>Log In</Text>
                        </TouchableOpacity>

                        {/* Have an account? */}
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={[welcomeStyles.text, { color: colors.black, fontSize: 14, }]}>Don't have an account?</Text>
                            <TouchableOpacity
                                onPress={this.toggleRegister}>
                                <Text style={[welcomeStyles.text, { paddingLeft: 5, fontSize: 16, color: colors.red }]}>Register</Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                    {/* End tag */}
                </View>
            </View>
        )
    }
}

