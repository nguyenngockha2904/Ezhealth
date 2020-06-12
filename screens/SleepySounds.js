import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, FlatList } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import sleepy from '../temp/TempSleepySounds';
import SoundsList from '../components/SoundsList';
import SoundsListNight from '../components/SoundsListNight';
import SoundsListDaytime from '../components/SoundsListDaytime';
import colors from '../shared/Colors';

const nature = sleepy.filter(item => item.type == 'nature');
const rain = sleepy.filter(item => item.type == 'rain');
const daytime = sleepy.filter(item => item.type == 'daytime');
const nights = sleepy.filter(item => item.type == 'nights');

export default class SleepySounds extends Component {

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

    render() {
        return (
            <View style={styles.container}>
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    <Image
                        style={styles.headerImage}
                        source={require('../assets/backgrounds/header.png')} />
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
        )
    }
}

const styles = StyleSheet.create({
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