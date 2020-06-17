import React, { Component } from 'react'
import { Animated, Platform, StatusBar, RefreshControl, StyleSheet, Text, View, Image, FlatList } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import sleepy from '../temp/TempSleepySounds';
import SoundsList from '../components/SoundsList';
import SoundsListNight from '../components/SoundsListNight';
import SoundsListDaytime from '../components/SoundsListDaytime';
import Loader from '../shared/Loader';
import colors from '../shared/Colors';

const nature = sleepy.filter(item => item.type == 'nature');
const rain = sleepy.filter(item => item.type == 'rain');
const daytime = sleepy.filter(item => item.type == 'daytime');
const nights = sleepy.filter(item => item.type == 'nights');
const HEADER_MAX_HEIGHT = 310;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 200 : 200;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default class SleepySounds extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scrollY: new Animated.Value(
                // iOS has negative initial scroll value because content inset...
                Platform.OS === 'ios' ? -HEADER_MAX_HEIGHT : 0,
            ),
            refreshing: false,
        };
    }
    componentDidMount() {
        this.setState({
            assetsLoaded: true,
        });
    }
    renderSoundsList = item => {
        return (
            <SoundsList item={item} />
        );
    }

    renderSoundsListNight = item => {
        return (
            <SoundsListNight item={item} />
        );
    }

    renderSoundsListDaytime = item => {
        return (
            <SoundsListDaytime item={item} />
        );
    }

    _renderScrollViewContent() {
        return (
            <View style={styles.scrollViewContent}>
                <View style={styles.container}>
                    <ScrollView
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Nights */}
                        <View style={[styles.body, { paddingTop: 0 }]}>
                            <View style={styles.bodyTitle}>
                                <Text style={[styles.titleBodyText, { color: colors.white }]}>Nightfall</Text>
                            </View>

                            <View style={styles.bodyContent}>
                                <FlatList

                                    flexDirection={'column'}
                                    horizontal={true}
                                    style={[styles.flatlistBoby,
                                    {
                                        backgroundColor: colors.white,
                                        borderTopLeftRadius: 15,
                                        borderBottomLeftRadius: 15
                                    }]}
                                    data={nights}
                                    contentContainerStyle={{ paddingHorizontal: 0, paddingVertical: 0 }}
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item }) => (this.renderSoundsListNight(item))}
                                    keyExtractor={item => item.id.toString()}
                                />
                            </View>
                        </View>
                        {/* Daytime */}
                        <View style={[styles.body, { paddingTop: 0 }]}>
                            <View style={styles.bodyTitle}>
                                <Text style={[styles.titleBodyText, { color: '#F9C34E' }]}>Daytime</Text>
                            </View>

                            <View style={styles.bodyContent}>
                                <FlatList

                                    flexDirection={'column'}
                                    horizontal={true}
                                    style={[styles.flatlistBoby,
                                    {
                                        backgroundColor: '#C56775',
                                        borderTopLeftRadius: 15,
                                        borderBottomLeftRadius: 15
                                    }]}
                                    data={daytime}
                                    contentContainerStyle={{ paddingHorizontal: 0, paddingVertical: 0 }}
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item }) => (this.renderSoundsListDaytime(item))}
                                    keyExtractor={item => item.id.toString()}
                                />
                            </View>
                        </View>


                        {/* Nature */}
                        <View style={[styles.body, { paddingTop: 10 }]}>
                            <View style={styles.bodyTitle}>
                                <Text style={styles.titleBodyText}>Nature</Text>
                            </View>

                            <View style={styles.bodyContent}>
                                <FlatList

                                    flexDirection={'column'}
                                    horizontal={false}
                                    numColumns={3}
                                    style={[styles.flatlistBoby]}
                                    data={nature}
                                    contentContainerStyle={{ paddingHorizontal: 0, paddingVertical: 0 }}
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item }) => (this.renderSoundsList(item))}
                                    keyExtractor={item => item.id.toString()}
                                />
                            </View>
                        </View>

                        {/* Rain */}
                        <View style={[styles.body, { paddingTop: 10 }]}>
                            <View style={styles.bodyTitle}>
                                <Text style={styles.titleBodyText}>Rain</Text>
                            </View>

                            <View style={styles.bodyContent}>
                                <FlatList

                                    flexDirection={'column'}
                                    horizontal={false}
                                    numColumns={3}
                                    style={[styles.flatlistBoby]}
                                    data={rain}
                                    contentContainerStyle={{ paddingHorizontal: 0, paddingVertical: 0 }}
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item }) => (this.renderSoundsList(item))}
                                    keyExtractor={item => item.id.toString()}
                                />
                            </View>
                        </View>

                        <Image
                            style={{
                                width: '100%',
                                height: 100,
                            }}
                            source={require('../assets/backgrounds/bottom.png')} />
                        {/* End tag */}
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
            inputRange: [0, 250],
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
                            { transform: [{ translateY: headerTranslate }] },
                        ]}
                    >
                        <Image
                            style={[
                                styles.backgroundImage,
                                {
                                },
                            ]}
                            source={require('../assets/backgrounds/sleepy_sounds_header_trans.png')}
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
        backgroundColor: '#35393f',
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
        backgroundColor: '#35393f',
    },
    headerImage: {
        width: '100%',
        height: 310,
    },
    flatlistBoby: {

    },
    titleBodySubText: {
        color: '#7DC481',
        flex: 1,
        alignSelf: 'center',
        fontFamily: 'quicksand-bold',
        fontSize: 10,
        paddingTop: 10
    },
    titleBodyText: {
        color: '#7DC481',
        flex: 1,
        alignSelf: 'center',
        fontFamily: 'quicksand-bold',
        fontSize: 30,
        paddingTop: 10
    },
    body: {
        width: '100%',
        flex: 1,
        justifyContent: 'flex-start',

    },
    bodyTitle: {
        paddingTop: 0,
        paddingLeft: 20,
        flexDirection: 'row',
    },
    bodyContent: {
        marginLeft: 10,
        flexDirection: 'row',
        alignItems: 'center',
        height: '100%',
        paddingBottom: 30,
    },
});