import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, FlatList } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import sleepy from '../temp/TempSleepySounds';
import SoundsList from '../components/SoundsList';

const rain = sleepy.filter(item => item.type == 'rain');
const nature = sleepy.filter(item => item.type == 'nature');
const animals = sleepy.filter(item => item.type == 'animals');

export default class SleepySounds extends Component {

    renderSoundsList = item => {
        return (
            <SoundsList item={item} />
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Rain */}
                    <View style={[styles.body, { paddingTop: 310 }]}>
                        <View style={styles.bodyTitle}>
                            <Text style={styles.titleBodyText}>Rain</Text>
                        </View>

                        <View style={styles.bodyContent}>
                            <FlatList

                                flexDirection={'column'}
                                horizontal={true}
                                style={styles.flatlistBoby}
                                data={rain}
                                contentContainerStyle={{ paddingHorizontal: 0, paddingVertical: 0 }}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item }) => (this.renderSoundsList(item))}
                                keyExtractor={item => item.id.toString()}
                            />
                        </View>
                    </View>

                    {/* Nature */}
                    <View style={styles.body}>
                        <View style={styles.bodyTitle}>
                            <Text style={styles.titleBodyText}>Nature</Text>
                        </View>

                        <View style={styles.bodyContent}>
                            <FlatList

                                flexDirection={'column'}
                                horizontal={true}
                                style={styles.flatlistBoby}
                                data={nature}
                                contentContainerStyle={{ paddingHorizontal: 0, paddingVertical: 0 }}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item }) => (this.renderSoundsList(item))}
                                keyExtractor={item => item.id.toString()}
                            />
                        </View>
                    </View>

                    {/* Animals */}
                    <View style={styles.body}>
                        <View style={styles.bodyTitle}>
                            <Text style={styles.titleBodyText}>Animals</Text>
                        </View>

                        <View style={styles.bodyContent}>
                            <FlatList

                                flexDirection={'column'}
                                horizontal={true}
                                style={styles.flatlistBoby}
                                data={animals}
                                contentContainerStyle={{ paddingHorizontal: 0, paddingVertical: 0 }}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item }) => (this.renderSoundsList(item))}
                                keyExtractor={item => item.id.toString()}
                            />
                        </View>
                    </View>

                    {/* End tag */}
                </ScrollView>
                <Image
                    style={styles.headerImage}
                    source={require('../assets/backgrounds/header_trans.png')} />
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
        position: 'absolute',
        width: '100%',
        height: 310,
    },
    flatlistBoby: {

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
        paddingBottom: 0,
    },
});