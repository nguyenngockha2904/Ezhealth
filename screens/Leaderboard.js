import React, { Component } from 'react'
import { Text, View, StyleSheet, Dimensions, Image, TouchableOpacity, FlatList } from 'react-native'
import { SimpleLineIcons } from '@expo/vector-icons';
import Loader from '../shared/Loader';
import firebaseApp from '../Fire';
import 'firebase/firestore';
import { color } from 'react-native-reanimated';
export default class Leaderboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: this.props.navigation.getParam('settings', ''),
      profile: this.props.navigation.getParam('profile', ''),
      themeColorsLight: this.props.navigation.getParam('themeColorsLight', ''),
      listLeader: [],
      text: '',
      records: {},
      assetsLoaded: false,
      sort: false,
      top: [1, 2, 3],
    }
  }
  async componentDidMount() {
    const ref = firebaseApp.firestore().collection('users').doc(firebaseApp.auth().currentUser.email);
    let users = firebaseApp.firestore().collection('users');
    let tempDoc = [];
    await users.get().then((querySnapshot) => {
      querySnapshot.docs.map((doc) => {
        tempDoc.push(doc.id);
      });
    });
    let listLeader = [];
    tempDoc.forEach(item => {
      let name;
      let photoURL;
      firebaseApp.firestore().collection('users').doc(item).collection('informations').doc('profile')
        .onSnapshot(function (doc) {
          name = doc.data().profile.name;
          photoURL = doc.data().profile.photoURL;
          firebaseApp.firestore().collection('users').doc(item).collection('features').doc('fitness')
            .onSnapshot(function (doc) {
              listLeader.push({
                email: item,
                name: name,
                photoURL: photoURL,
                wunMedals: doc.data().records.wunMedals,
              });
            });
        });

    });
    ref.collection('features').doc('fitness')
      .onSnapshot((doc) => {
        this.setState({
          fitnessCompleted: doc.data().fitnessCompleted,
          records: doc.data().records,
        });
      });
    this.setState({ listLeader: listLeader });
    this.interval = setInterval(() => {
      if (!this.state.sort && this.state.listLeader.length > 0) {
        this.setState({ listLeader: listLeader.sort((a, b) => (b.wunMedals - a.wunMedals)), assetsLoaded: true });
        clearInterval(this.interval);
      }
    }, 3000);
  }

  // sort = () => {
  //   this.setState({ listLeader: this.state.listLeader.sort((a, b) => (b.wunMedals - a.wunMedals)) });
  // }

  openProfileNavigation = (email) => {
    this.props.navigation.navigate('UserInfomations', {
      following: email,
    });
  }
  renderLeaderList = item => {
    const rank = this.state.listLeader.findIndex(val => val.email == item.item.email) + 1;
    return (
      <TouchableOpacity
        style={{ justifyContent: 'center', borderBottomWidth: 1, borderColor: this.state.themeColorsLight }}
        onPress={() => this.openProfileNavigation(item.item.email)}
      >
        <View style={{
          width: '100%',
          height: 80,
          backgroundColor: firebaseApp.auth().currentUser.email == item.item.email ? this.state.themeColorsLight : 'transparent',
          marginVertical: 10,
          alignItems: 'flex-start',
          justifyContent: 'center',
          borderRadius: 10,
        }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            paddingLeft: 0,
            width: '100%',
            alignContent: 'center',
            paddingLeft: 5
          }}>
            <View style={{ height: '100%', width: 30, justifyContent: 'center' }}>
              <Text style={{
                fontFamily: 'quicksand-bold',
                fontSize: (rank) == 1
                  ? 25 : 20,
                paddingLeft: 5,
                color: this.state.top.includes(rank)
                  ? this.state.settings.color : 'black'
              }}>{rank}</Text>
            </View>
            <Image
              source={{ uri: item.item.photoURL }}
              style={{ width: 60, aspectRatio: 1, borderRadius: 200 }}
            />
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', paddingLeft: 10 }}>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: 'quicksand-bold',
                  fontSize: 15,
                }}
              >{item.item.name}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <SimpleLineIcons name="trophy" size={15} color="black" />
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: 'quicksand-regular',
                    fontSize: 15,
                    paddingLeft: 3,
                  }}
                >{item.item.wunMedals}</Text>
              </View>
            </View>
            {rank == 1 ? <Image
              source={require('../assets/images/medals/gold.png')}
              style={{ width: 40, aspectRatio: 1, borderRadius: 200, alignSelf: 'center', left: 5 }}
            /> : null}
            {rank == 2 ? <Image
              source={require('../assets/images/medals/silver.png')}
              style={{ width: 40, aspectRatio: 1, borderRadius: 200, alignSelf: 'center', left: 5 }}
            /> : null}
            {rank == 3 ? <Image
              source={require('../assets/images/medals/bronze.png')}
              style={{ width: 40, aspectRatio: 1, borderRadius: 200, alignSelf: 'center', left: 5 }}
            /> : null}
          </View>
        </View >
      </TouchableOpacity>
    );
  }

  render() {
    const { assetsLoaded } = this.state;
    if (assetsLoaded) {
      return (
        <View style={styles.container}>

          <View style={styles.header}>

            <View style={styles.headerContent}>
              <View style={{ borderWidth: 5, borderRadius: 100, padding: 3, borderColor: this.state.settings.color }}>
                <TouchableOpacity onPress={() => this.openProfileNavigation(firebaseApp.auth().currentUser.email)}>
                  <Image
                    source={{ uri: this.state.profile.photoURL }}
                    style={{ width: 80, aspectRatio: 1, borderRadius: 100, }}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ paddingLeft: 10, width: '70%' }}>
                <Text numberOfLines={1} style={{ fontFamily: 'quicksand-bold', fontSize: 20 }}>{this.state.profile.name}</Text>
                <Text numberOfLines={1} style={{ fontFamily: 'quicksand-regular', fontSize: 18 }}>{this.state.settings.rank}</Text>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}>
                  <SimpleLineIcons name="trophy" size={20} color="black" />
                  <Text style={styles.recordsText} >{this.state.records.wunMedals}</Text>
                </View>
              </View>
            </View>

          </View>
          <FlatList
            flexDirection={'column'}
            numColumns={1}
            horizontal={false}
            extraData={this.state.listLeader.sort((a, b) => (b.wunMedals - a.wunMedals))}
            data={this.state.listLeader}
            contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 10 }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            renderItem={item => this.renderLeaderList(item)}
            style={{ width: '95%', height: Dimensions.get('window').height * 0.7, paddingTop: 0 }}
            keyExtractor={(item, index) => index.toString()}
          />
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
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'white'
  },
  header: {
    width: '100%',
    height: Dimensions.get('window').height * 0.25,
    justifyContent: 'center',
  },
  headerContent: {
    width: '100%',
    height: '50%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    flexDirection: 'row',
  },
  recordsText: {
    fontSize: 20,
    color: 'black',
    fontFamily: 'quicksand-medium',
    textAlign: 'center',
    paddingLeft: 5
  }
});
