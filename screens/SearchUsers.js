import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, TextInput, FlatList, Image } from 'react-native';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import firebaseApp from '../Fire';
import 'firebase/firestore';

export default class SearchUsers extends Component {
    state = {
        settings: this.props.navigation.getParam('settings', ''),
        listSeach: [],
        listEmail: [],
        listAllUser: [],
        themeColorsLight: this.props.navigation.getParam('themeColorsLight', ''),
        text: '',
    }

    searchHandler = (str) => {
        this.setState({ text: str });
        if (str.replace(/ /g, '') != '') {
            let listSeach = [];
            const strg = this.clear(str).toLowerCase();
            this.state.listAllUser.forEach(user => {
                if (this.clear(user.name).toLowerCase().replace(/ /g, '').includes(strg.toLowerCase().replace(/ /g, '')) || user.email.replace(/ /g, '').includes(strg.toLowerCase().replace(/ /g, ''))) {
                    listSeach.push(user);
                }
            });
            this.setState({
                listSeach: listSeach,
            });
        } else {
            this.setState({
                listSeach: [],
            });
        }
    }

    openProfileNavigation = (email) => {
        this.props.navigation.navigate('UserInfomations', {
            following: email,
        });
    }
    clear = (str) => {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");
        return str;
    }

    renderSerchList = (item) => {
        return (
            <TouchableOpacity
                style={{ justifyContent: 'center' }}
                onPress={() => this.openProfileNavigation(item.item.email)}
            >
                <View style={{
                    width: '100%',
                    height: 80,
                    backgroundColor: this.state.themeColorsLight,
                    marginTop: 10,
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    borderRadius: 50,
                }}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        paddingLeft: 0,
                        width: '75%',
                        alignContent: 'center',
                        paddingLeft: 5
                    }}>
                        <Image
                            source={{ uri: item.item.photoURL }}
                            style={{ width: 70, aspectRatio: 1, borderRadius: 200 }}
                        />
                        <View style={{ flexDirection: 'column', justifyContent: 'center', paddingLeft: 10 }}>

                            <Text
                                numberOfLines={1}
                                style={{
                                    fontFamily: 'quicksand-bold',
                                    fontSize: 15,
                                }}
                            >{item.item.name}</Text>

                            <Text
                                numberOfLines={1}
                                style={{
                                    fontFamily: 'quicksand-regular',
                                    fontSize: 15,
                                }}
                            >{item.item.email.replace('@gmail.com', '')}</Text>
                        </View>
                    </View>
                </View >
            </TouchableOpacity>
        );
    }

    async componentDidMount() {
        let users = firebaseApp.firestore().collection('users');
        let tempDoc = [];
        await users.get().then((querySnapshot) => {
            querySnapshot.docs.map((doc) => {
                tempDoc.push(doc.id);
            });
        });
        let listAllUser = [];
        this.setState({ listEmail: tempDoc });
        this.state.listEmail.forEach(item => {
            firebaseApp.firestore().collection('users').doc(item).collection('informations').doc('profile')
                .onSnapshot(function (doc) {
                    listAllUser.push({
                        email: item,
                        name: doc.data().profile.name,
                        photoURL: doc.data().profile.photoURL,
                    });
                });
        });
        this.setState({ listAllUser: listAllUser });
    }

    render() {
        return (
            <View style={styles.container}
                width='100%'
                height='100%'
            >
                <View style={styles.searchBox}>
                    <View style={[styles.searchIcon, { backgroundColor: this.state.settings.color }]}>
                        <FontAwesome5
                            name='search'
                            size={25}
                            color={'white'}
                        />
                    </View>
                    <TextInput
                        defaultValue={this.state.nameInput}
                        style={styles.textInput}
                        onChangeText={text => this.searchHandler(text)}
                    />
                </View>
                {(this.state.listSeach.length == 0 && this.state.text.replace(/ /g, '').length > 0) ?
                    <Text
                        numberOfLines={1}
                        style={{
                            width: '85%',
                            fontFamily: 'quicksand-regular',
                            fontSize: 15,
                            alignSelf: 'center',
                            textAlign: 'center',
                        }}
                    >We couldn't find anything for {this.state.text}</Text>
                    : null
                }
                <FlatList
                    flexDirection={'column'}
                    numColumns={1}
                    horizontal={false}
                    data={this.state.listSeach}
                    contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 10 }}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    renderItem={item => this.renderSerchList(item)}
                    style={{ width: '95%' }}
                    keyExtractor={(item, index) => index.toString()}
                />

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: 'white',
    },
    searchBox: {
        width: '90%',
        height: 50,
        backgroundColor: 'white',
        marginTop: 60,
        borderRadius: 100,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 5 },
        shadowOpacity: 0.2,
        marginBottom: 10,
        elevation: 5,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    searchIcon: {
        width: 40,
        aspectRatio: 1,
        marginLeft: 5,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textInput: {
        flex: 1,
        paddingLeft: 10,
        fontFamily: 'quicksand-regular',
        fontSize: 18,
    }
});