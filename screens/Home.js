import React from 'react';
import { Animated, Platform, StatusBar, RefreshControl, Text, View, Image, TouchableOpacity, FlatList, ScrollView, StyleSheet, Modal, ImageBackground } from 'react-native';
import { AntDesign, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons'
import colors from '../shared/Colors';
import { homeStyles } from '../styles/HomeStyles';
import AppsList from '../components/AppsList';
import firebaseApp from '../Fire';
import 'firebase/firestore';
import Loader from '../shared/Loader';
import apps from '../temp/TempApps';
import FollowList from '../components/FollowsList';

const HEADER_MAX_HEIGHT = 200;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 72 : 72;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default class Home extends React.Component {
  themeColors = ['#17b2ac', '#ed3c56', '#5495e5', '#f9bb56', '#A3A1F7', '#2B2E35'];
  themeColorsLight = ['#d1fffd', '#ffd6df', '#dbe5ff', '#f7e4d5', '#e1e0ff', '#bfbfbf'];
  constructor(props) {
    super(props);

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
      modalFix: false,
      settings: {},
      profile: {},
      photoURL: firebaseApp.auth().currentUser.photoURL,
      displayName: firebaseApp.auth().currentUser.displayName,
      loading: true,
      followers: [],
      following: [],
      records: [],
      scrollY: new Animated.Value(
        // iOS has negative initial scroll value because content inset...
        Platform.OS === 'ios' ? -HEADER_MAX_HEIGHT : 0,
      ),
      refreshing: false,
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

  toggleSearchModal = () => {
    this.setState({ modalSearch: !this.state.modalSearch });
  }
  openSearchUsers = () => {
    this.props.navigation.navigate('SearchUsers', {
      settings: this.state.settings,
      themeColorsLight: this.state.themeColorsLight[this.getIndex(this.state.settings.color)],
    });
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
      docSettings.update({
        settings: this.state.settings,
      })
    });
  }
  componentDidMount() {
    const ref = firebaseApp.firestore().collection('users').doc(firebaseApp.auth().currentUser.email);
    ref.collection('features').doc('challenges')
      .onSnapshot((doc) =>  {
        this.setState({
          challenges: doc.data().challenges,
        });
      });
    ref.collection('informations').doc('settings')
      .onSnapshot((doc) =>  {
        this.setState({
          settings: doc.data().settings,
        });
      });
    ref.collection('follows').doc('followers')
      .onSnapshot((doc) =>  {
        this.setState({
          followers: doc.data().followers,
        });
      });
    ref.collection('follows').doc('following')
      .onSnapshot((doc) =>  {
        this.setState({
          following: doc.data().following,
        });
      });
    ref.collection('informations').doc('profile')
      .onSnapshot((doc) =>  {
        this.setState({
          profile: doc.data().profile,
        });
      });
      ref.collection('features').doc('fitness')
      .onSnapshot((doc) =>  {
        this.setState({
          fitnessCompleted: doc.data().fitnessCompleted,
          records: doc.data().records,
          assetsLoaded: true,
        });
      });
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  renderAppsList = (item, percent) => {
    return <AppsList
      apps={item}
      navigation={this.props.navigation}
      challenges={this.state.challenges}
      settings={this.state.settings}
      toggleFixModal={this.toggleFixModal}
      percent={percent} />
  };

  renderFollowsList = (item) => {
    return <FollowList
      following={item}
      navigation={this.props.navigation}
      challenges={this.state.challenges}
      settings={this.state.settings}
      toggleFixModal={this.toggleFixModal}
    />
  }

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
      logOut: this.logOut.bind(this),
      profile: this.state.profile,
      name: this.state.displayName,
      photoURL: this.state.photoURL,
      settings: this.state.settings,
    });
  }
  openLeaderboard = () => {
    this.props.navigation.navigate('Leaderboard', {
      profile: this.state.profile,
      settings: this.state.settings,
      themeColorsLight: this.state.themeColorsLight[this.getIndex(this.state.settings.color)],
    });
  }
  openUserInfomations = (email) => {
    this.props.navigation.navigate('UserInfomations', {
      following: email,
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

  changeRatioApps = () => {
    if (this.state.settings.rank != 'Common User') {
      this.props.navigation.navigate('AllApps', {
        navigation: this.props.navigation,
      });
    }
  }


  _renderScrollViewContent() {
    return (
      <View style={styles.scrollViewContent}>
        <View style={homeStyles.container}>
          {/* Modal fix */}
          <Modal
            transparent={true}
            onRequestClose={this.toggleFixModal}
            visible={this.state.modalFix}
            animationType='fade'
          >
            <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.9)' }}
              width='100%'
              height='100%'
            >
              <TouchableOpacity
                style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}
                onPress={this.toggleFixModal}
              >
                <Text
                  style={{
                    width: '100%',
                    textAlign: 'center',
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
                    width: '100%',
                    textAlign: 'center',
                  }}
                >This feature is being developed</Text>
              </TouchableOpacity>
            </View>
          </Modal>

          {/* Body */}
          <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            style={{ width: '100%' }}
          >

            {/* Follows */}
            <View style={[homeStyles.body, { paddingTop: 15 }]}>

              <View style={homeStyles.bodyTitle}>
                <Text style={homeStyles.titleBodyText}>Following</Text>
                <TouchableOpacity onPress={this.openSearchUsers}>
                  <FontAwesome5
                    name='search'
                    size={25}
                    color={this.state.settings.color}
                    style={homeStyles.star}
                  />
                </TouchableOpacity>
              </View>

              <View style={[homeStyles.bodyContent],
              {
                justifyContent: 'center',
                alignItems: 'flex-start',
                paddingLeft: 10,
                paddingTop: 15
              }}
              >
                {this.state.following.length > 0 ?

                  <FlatList
                    flexDirection={'column'}
                    horizontal={true}
                    style={homeStyles.flatlistBoby}
                    data={this.state.following}
                    contentContainerStyle={{ paddingLeft: 10, paddingVertical: 10 }}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => this.renderFollowsList(item)}
                    keyExtractor={item => item}
                  />

                  :
                  <View style={{
                    width: '100%',
                    height: 120,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: -10,
                  }}>
                    <TouchableOpacity
                      style={{
                        width: 90,
                        height: 90,
                        backgroundColor: 'white', borderRadius: 100, borderWidth: 2,
                        borderColor: 'white',
                        alignItems: 'center',
                        justifyContent: 'center',
                        shadowColor: this.state.settings.color,
                        shadowOffset: { width: 2, height: 5 },
                        shadowOpacity: 0.5,
                        elevation: 5,
                        alignthis: 'center'
                      }}
                      onPress={() => { this.openSearchUsers() }}
                    >
                      <AntDesign name="plus" size={24} color={this.state.settings.color} />
                    </TouchableOpacity>
                  </View>
                }

              </View>

            </View>

            {/* Leaderboard */}
            <View style={[homeStyles.body, { paddingTop: 0 }]}>

              <View style={homeStyles.bodyTitle}>
                <Text style={homeStyles.titleBodyText}>Leaderboard</Text>
                <TouchableOpacity onPress={() => this.openLeaderboard()}>
                  <MaterialCommunityIcons
                    name='google-analytics'
                    size={25}
                    color={this.state.settings.color}
                    style={homeStyles.star}
                  />
                </TouchableOpacity>
              </View>

              <View style={[homeStyles.bodyContent],
              {
                justifyContent: 'center',
                alignItems: 'center'
              }}
              >
                <View style={{
                  aspectRatio: 3,
                  width: this.props.percent,
                  paddingLeft: 0,
                  opacity: 1,
                  width: '100%',
                  alignItems: 'center',
                  marginTop: 20,
                }}>
                  <TouchableOpacity
                    style={[styles.listContainer, { backgroundColor: 'white', justifyContent: 'center' }]}
                    onPress={() => this.openLeaderboard()}
                  >
                    <Image
                      source={require('../assets/backgrounds/apps/run.png')}
                      style={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        borderRadius: 10,
                        opacity: 1,
                      }}
                    />
                    <View style={{ flexDirection: 'column', width: '100%', height: '100%', padding: 20, alignItems: 'flex-start', justifyContent: 'center' }}>
                      <Text style={{
                        color: 'white',
                        fontSize: 15,
                        fontFamily: 'quicksand-regular',
                        textShadowColor: 'rgba(0, 0, 0, 0.75)',
                        textShadowOffset: { width: -1, height: 1 },
                        textShadowRadius: 5
                      }}>Tournament</Text>
                      <Text style={{
                        color: 'white',
                        fontSize: 17,
                        fontFamily: 'quicksand-bold',
                        textShadowColor: 'rgba(0, 0, 0, 0.75)',
                        textShadowOffset: { width: -1, height: 1 },
                        textShadowRadius: 5
                      }}>EZ HEALTH</Text>
                      <Text style={{
                        color: 'white',
                        fontSize: 15,
                        fontFamily: 'quicksand-regular',
                        textShadowColor: 'rgba(0, 0, 0, 0.75)',
                        textShadowOffset: { width: -1, height: 1 },
                        textShadowRadius: 5,
                        marginTop: 20,
                      }}>{this.state.records.wunMedals > 0 ? 'Trophies' : 'Trophy'}</Text>
                      <Text style={{
                        color: 'white',
                        fontSize: 17,
                        fontFamily: 'quicksand-bold',
                        textShadowColor: 'rgba(0, 0, 0, 0.75)',
                        textShadowOffset: { width: -1, height: 1 },
                        textShadowRadius: 5
                      }}>{this.state.records.wunMedals}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

            </View>
            {/* Apps */}
            <View style={[homeStyles.body, { paddingTop: 10 }]}>

              <View style={homeStyles.bodyTitle}>
                <Text style={homeStyles.titleBodyText}>Ez Apps</Text>
                <TouchableOpacity onPress={() => this.changeRatioApps()}>
                  <AntDesign
                    name='appstore1'
                    size={25}
                    color={this.state.settings.color}
                    style={homeStyles.star}
                  />
                </TouchableOpacity>
              </View>

              <View style={[homeStyles.bodyContent],
              {
                justifyContent: 'center',
                alignItems: 'center'
              }}
              >
                <FlatList
                  flexDirection={'column'}
                  numColumns={this.state.appRatio}
                  horizontal={false}
                  style={homeStyles.flatlistBoby}
                  data={apps}
                  contentContainerStyle={{ paddingLeft: 10, paddingVertical: 10 }}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => this.renderAppsList(item, this.state.percent)}
                  keyExtractor={item => item.id.toString()}
                />
              </View>

            </View>

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
      inputRange: [0, 300],
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
            style={[
              styles.header,
              { transform: [{ translateY: headerTranslate }] },
            ]}
          >
            {/* Header Container */}
            <View style={[homeStyles.header, { backgroundColor: this.state.settings.color }]}>
              {/* Info user */}
              <ImageBackground
                source={this.state.settings.rank != 'Common User' ? require('../assets/backgrounds/colorful-stars.png') : require('../assets/backgrounds/apps/none.png')}
                style={homeStyles.info}
              >

                {/* Avatar */}
                <View style={{
                  flex: 1,
                  width: '100%',
                  height: '100%',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                }}>
                  <TouchableOpacity onPress={() => this.openUserInfomations(firebaseApp.auth().currentUser.email)}>
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
                    <TouchableOpacity
                      style={homeStyles.name}
                      onPress={this.openProfileNavigation}
                    >
                      <Text style={homeStyles.nameText}>{this.state.displayName}</Text>
                      <Text style={homeStyles.nameSubText}>{this.state.settings.rank}</Text>
                    </TouchableOpacity>

                    {/* Render icon theme color */}
                    <View style={{ alignthis: 'stretch', justifyContent: 'center', paddingTop: 20, }}>
                      <View style={styles.renderColor}>{this.renderColors(this.state.settings.color)}</View>
                    </View>
                  </View>
                </View>

                {/* End tag */}
              </ImageBackground>
            </View>

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
    backgroundColor: 'transparent',
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
  listContainer: {
    paddingVertical: 0,
    borderRadius: 10,
    marginHorizontal: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '95%',
    height: '95%',
  },
});