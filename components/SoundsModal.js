import React, { Component } from 'react'
import { Text, View, StyleSheet, Image, ScrollView, TouchableOpacity, TouchableWithoutFeedback, Modal, ImageBackground } from 'react-native'
import colors from '../shared/Colors'
import { Audio } from 'expo-av';
import { AntDesign } from '@expo/vector-icons'
import { RadioButton } from 'react-native-paper';

Audio.setAudioModeAsync({ staysActiveInBackground: true, playThroughEarpieceAndroid: false });

export default class SoundsModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isPlaying: false,
            item: this.props.item,
            blur: this.props.item.blur,
            image: this.props.item.image,
            sound: this.props.item.sound,
            modalTimer: false,
            timeDuration: 0,
            setTime: false,
            time: '',
        };
        this.loadAudio = this.loadAudio.bind(this);
        this.toggleAudioPlayback = this.toggleAudioPlayback.bind(this);
    }

    componentDidMount() {
        this.loadAudio();
    }

    toggleTimerModal = () => {
        this.setState({ modalTimer: !this.state.modalTimer });
    };

    componentWillUnmount() {
        this.soundObject.stopAsync();
        this.toggleAudioPlayback();
        clearInterval(this.interval);
    }

    async loadAudio() {
        this.soundObject = new Audio.Sound();
        try {
            await this.soundObject.loadAsync(this.state.sound);
        } catch (e) {
            console.log('ERROR Loading Audio', e);
        }
    }

    toggleAudioPlayback() {
        this.setState({
            isPlaying: !this.state.isPlaying,
        }, () => (this.state.isPlaying
            ? this.soundObject.playAsync()
            : this.soundObject.stopAsync()));
    }

    toggleStopAudioPlayback() {
        this.setState({
            isPlaying: false,
            timeDuration: 0,
        });
        this.soundObject.stopAsync();
    }

    setTimer = (time) => {
        clearInterval(this.interval);
        if (time > 0) {
            this.interval = setInterval(
                () => {
                    this.setTime(this.state.timeDuration);
                },
                1000
            );
        } else {
            clearInterval(this.interval);
            this.setState({
                time: '',
            });
        }
    }

    setTime = (totalSeconds) => {
        totalSeconds = totalSeconds - 1;
        const hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        if (hours > 0)
            this.setState({
                time: hours + ':' + minutes + ':' + seconds,
                timeDuration: this.state.timeDuration - 1,
            });
        else
            this.setState({
                time: minutes + ':' + seconds,
                timeDuration: this.state.timeDuration - 1,
            });
        if (this.state.timeDuration == 0) {
            clearInterval(this.interval);
            this.toggleStopAudioPlayback();
            this.setState({
                time: '',
            });
        }

    }

    render() {
        const { timeDuration } = this.state;
        return (
            <ImageBackground source={this.state.blur} style={{ width: '100%', height: '100%' }} >
                <View style={styles.contrainer}>

                    {/* Modal timer */}
                    <Modal
                        transparent={true}
                        animationType='fade'
                        onRequestClose={this.toggleTimerModal}
                        visible={this.state.modalTimer}
                        style={{
                            backgroundColor: 'transparent'
                        }}>
                        <TouchableWithoutFeedback onPress={this.toggleTimerModal}>
                            <View style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'rgba(0,0,0,0.3)'
                            }}
                                width='100%'
                                height='100%'
                            >
                                <ScrollView
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                    style={{
                                        paddingBottom: 40,
                                        padding: 20,
                                        marginVertical: 75,
                                        marginHorizontal: 30,
                                        backgroundColor: colors.primary
                                    }}
                                    width='70%'
                                    height='100%'>

                                    <View>
                                        <Text style={styles.textTime}>Set The Timer Duration</Text>
                                        <RadioButton.Group
                                            onValueChange={this.toggleTimerModal}
                                        >
                                            {/* No timer */}
                                            <TouchableOpacity
                                                style={styles.timeDurationSelect}
                                                onPress={() => {
                                                    this.setState({ timeDuration: 0 });
                                                    this.setTimer(0);
                                                    this.toggleTimerModal()
                                                }}>

                                                <RadioButton
                                                    uncheckedColor={colors.white}
                                                    color={'#7DC481'}
                                                    value={0}
                                                    status={timeDuration === 0 ? 'checked' : 'unchecked'}
                                                    onPress={() => { this.setState({ timeDuration: 0 }); this.setTimer(0); this.toggleTimerModal() }} />

                                                <Text style={styles.textTimeD}>No timer</Text>
                                            </TouchableOpacity>

                                            {/* 10 seconds */}
                                            <TouchableOpacity
                                                style={styles.timeDurationSelect}
                                                onPress={() => { this.setState({ timeDuration: 10 }); this.setTimer(10); this.toggleTimerModal() }}>

                                                <RadioButton
                                                    uncheckedColor={colors.white}
                                                    color={'#7DC481'}
                                                    value={10}
                                                    status={timeDuration === 10 ? 'checked' : 'unchecked'}
                                                    onPress={() => { this.setState({ timeDuration: 10 }); this.setTimer(10); this.toggleTimerModal() }} />

                                                <Text style={styles.textTimeD}>10 seconds</Text>
                                            </TouchableOpacity>

                                            {/* 5 minutes */}
                                            <TouchableOpacity
                                                style={styles.timeDurationSelect}
                                                onPress={() => { this.setState({ timeDuration: 300 }); this.setTimer(300); this.toggleTimerModal() }}>

                                                <RadioButton
                                                    uncheckedColor={colors.white}
                                                    color={'#7DC481'}
                                                    value={300}
                                                    status={timeDuration === 300 ? 'checked' : 'unchecked'}
                                                    onPress={() => { this.setState({ timeDuration: 300 }); this.setTimer(300); this.toggleTimerModal() }} />

                                                <Text style={styles.textTimeD}>5 minutes</Text>
                                            </TouchableOpacity>

                                            {/* 10 minutes */}
                                            <TouchableOpacity
                                                style={styles.timeDurationSelect}
                                                onPress={() => { this.setState({ timeDuration: 600 }); this.setTimer(600); this.toggleTimerModal() }}>

                                                <RadioButton
                                                    uncheckedColor={colors.white}
                                                    color={'#7DC481'}
                                                    value={600}
                                                    status={timeDuration === 600 ? 'checked' : 'unchecked'}
                                                    onPress={() => { this.setState({ timeDuration: 600 }); this.setTimer(600); this.toggleTimerModal() }} />

                                                <Text style={styles.textTimeD}>10 minutes</Text>
                                            </TouchableOpacity>

                                            {/* 15 minutes */}
                                            <TouchableOpacity
                                                style={styles.timeDurationSelect}
                                                onPress={() => { this.setState({ timeDuration: 900 }); this.setTimer(900); this.toggleTimerModal() }}>

                                                <RadioButton
                                                    uncheckedColor={colors.white}
                                                    color={'#7DC481'}
                                                    value={900}
                                                    status={timeDuration === 900 ? 'checked' : 'unchecked'}
                                                    onPress={() => { this.setState({ timeDuration: 900 }); this.setTimer(900); this.toggleTimerModal() }} />

                                                <Text style={styles.textTimeD}>15 minutes</Text>
                                            </TouchableOpacity>

                                            {/* 30 minutes */}
                                            <TouchableOpacity
                                                style={styles.timeDurationSelect}
                                                onPress={() => { this.setState({ timeDuration: 1800 }); this.setTimer(1800); this.toggleTimerModal() }}>

                                                <RadioButton
                                                    uncheckedColor={colors.white}
                                                    color={'#7DC481'}
                                                    value={1800}
                                                    status={timeDuration === 1800 ? 'checked' : 'unchecked'}
                                                    onPress={() => { this.setState({ timeDuration: 1800 }); this.setTimer(1800); this.toggleTimerModal() }} />

                                                <Text style={styles.textTimeD}>30 minutes</Text>
                                            </TouchableOpacity>


                                            {/* 1 hour */}
                                            <TouchableOpacity
                                                style={styles.timeDurationSelect}
                                                onPress={() => { this.setState({ timeDuration: 3600 }); this.setTimer(3600); this.toggleTimerModal() }}>

                                                <RadioButton
                                                    uncheckedColor={colors.white}
                                                    color={'#7DC481'}
                                                    value={3600}
                                                    status={timeDuration === 3600 ? 'checked' : 'unchecked'}
                                                    onPress={() => { this.setState({ timeDuration: 3600 }); this.setTimer(3600); this.toggleTimerModal() }} />

                                                <Text style={styles.textTimeD}>1 hour</Text>
                                            </TouchableOpacity>

                                            {/* 2 hours */}
                                            <TouchableOpacity
                                                style={styles.timeDurationSelect}
                                                onPress={() => { this.setState({ timeDuration: 7200 }); this.setTimer(7200); this.toggleTimerModal() }}>

                                                <RadioButton
                                                    uncheckedColor={colors.white}
                                                    color={'#7DC481'}
                                                    value={7200}
                                                    status={timeDuration === 7200 ? 'checked' : 'unchecked'}
                                                    onPress={() => { this.setState({ timeDuration: 7200 }); this.setTimer(7200); this.toggleTimerModal() }} />

                                                <Text style={styles.textTimeD}>2 hours</Text>
                                            </TouchableOpacity>

                                            {/* 4 hours */}
                                            <TouchableOpacity
                                                style={styles.timeDurationSelect}
                                                onPress={() => { this.setState({ timeDuration: 14400 }); this.setTimer(14400); this.toggleTimerModal() }}>

                                                <RadioButton
                                                    uncheckedColor={colors.white}
                                                    color={'#7DC481'}
                                                    value={14400}
                                                    status={timeDuration === 14400 ? 'checked' : 'unchecked'}
                                                    onPress={() => { this.setState({ timeDuration: 14400 }); this.setTimer(14400); this.toggleTimerModal() }} />

                                                <Text style={styles.textTimeD}>4 hours</Text>
                                            </TouchableOpacity>

                                            {/* 8 hours */}
                                            <TouchableOpacity
                                                style={[styles.timeDurationSelect, { paddingBottom: 30, }]}
                                                onPress={() => { this.setState({ timeDuration: 28800 }); this.setTimer(28800); this.toggleTimerModal() }}>

                                                <RadioButton
                                                    uncheckedColor={colors.white}
                                                    color={'#7DC481'}
                                                    value={28800}
                                                    status={timeDuration === 28800 ? 'checked' : 'unchecked'}
                                                    onPress={() => { this.setState({ timeDuration: 28800 }); this.setTimer(28800); this.toggleTimerModal() }} />

                                                <Text style={styles.textTimeD}>8 hours</Text>
                                            </TouchableOpacity>

                                        </RadioButton.Group>
                                    </View>
                                </ScrollView>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>

                    {/* Body */}
                    <View style={styles.body}>
                        {/* Image */}
                        <TouchableOpacity onPress={this.toggleAudioPlayback}>
                            <Image source={this.state.image} style={styles.image} />
                        </TouchableOpacity>

                        <View style={styles.bottom}>
                            <Text style={styles.textBottom}>{this.state.item.name}</Text>
                        </View>

                        {/* Playback */}
                        <View style={styles.playback}>
                            {/* Plus */}
                            <TouchableOpacity style={{ padding: 15 }}>
                                <AntDesign
                                    name='pluscircle'
                                    size={45}
                                    color={colors.white} />
                            </TouchableOpacity>
                            {/* Play / Pause */}
                            <TouchableOpacity style={{ padding: 15 }} onPress={this.toggleAudioPlayback}>
                                <AntDesign
                                    name={this.state.isPlaying ? 'pausecircle' : 'play'}
                                    size={75}
                                    color={colors.white} />
                            </TouchableOpacity>
                            {/* Timer */}
                            <View>
                                <TouchableOpacity style={{ padding: 15, paddingTop: 40 }}
                                    onPress={this.toggleTimerModal}
                                >
                                    <AntDesign
                                        name='clockcircle'
                                        size={45}
                                        color={this.state.timeDuration === 0 ? colors.white : '#7DC481'} />
                                </TouchableOpacity>
                                <Text style={{
                                    paddingTop: 0,
                                    color: colors.white,
                                    fontFamily: 'quicksand-regular',
                                    fontSize: 18,
                                    alignSelf: 'center',
                                }}>{this.state.time}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        )
    }
}


const styles = StyleSheet.create({
    contrainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%'
    },
    body: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        margin: 10,
        width: 300,
        height: 300,
        borderRadius: 200,
        borderWidth: 2,
        borderColor: colors.white,
        opacity: 0.8
    },
    playback: {
        paddingTop: 30,
        paddingBottom: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottom: {
        paddingTop: 20,
        width: '100%',
    },
    textBottom: {
        color: colors.white,
        fontFamily: 'quicksand-regular',
        fontSize: 30,
        alignSelf: 'center',
    },
    textTime: {
        alignSelf: 'center',
        color: colors.white,
        fontFamily: 'quicksand-bold',
        fontSize: 20,
        paddingBottom: 20,
    },
    textTimeD: {
        paddingLeft: 10,
        marginTop: 3,
        color: colors.white,
        fontFamily: 'quicksand-medium',
        fontSize: 18,
    },
    timeDurationSelect: {
        flexDirection: 'row', paddingTop: 10,
    }
})