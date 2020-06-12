import React, { Component } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import ProgressCircle from 'react-native-progress-circle';
import { AntDesign } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
export default class StartFit extends Component {
    state = {
        color: this.props.navigation.getParam('color'),
        todos: this.props.navigation.getParam('todos', ''),
        count: this.props.navigation.getParam('todos').length,
        image: this.props.navigation.getParam('ready'),
        completed: false,
        title: 'READY TO START',
        next: '',
        timerStart: 10,
        timer: 10,
        titileButton: 'PAUSE',
        i: 0,
    }
    onSpeak =(text) =>{
        Speech.speak(text,{
            language:'en',
            pitch:1,
            rate:1
        });
    }
    componentDidMount () {
        this.startFit();
    }
    startFit = () => {
        if(this.state.title==='READY TO START'||this.state.title==='REST 10 SECONDS')
        {
            this.onSpeak(this.state.title);
        }else {
            this.onSpeak('START '+this.state.title);
        }
        this.interval = setInterval(
            () => {
                this.setState((prevState) => ({ timer: prevState.timer - 1 }));
            },
            1000
        );
    }

    startNewFit = () => {
        if (this.state.i < this.state.count) {
            this.setState({
                completed: this.state.todos[this.state.i].completed,
                image: this.state.todos[this.state.i].image,
                title: this.state.todos[this.state.i].title,
                timerStart: this.state.todos[this.state.i].timer,
                timer: this.state.todos[this.state.i].timer,
                i: this.state.i + 1,
            });
           
        }
        this.onSpeak('START '+this.state.todos[this.state.i].title);
    }

    buttonClick = () => {
        if(this.state.title != 'READY TO START') {
            if (this.state.titileButton === 'START') {
                this.setState({ titileButton: 'PAUSE' });
                this.startFit();
            }
            else if (this.state.titileButton === 'PAUSE') {
                this.onSpeak('PAUSE '+this.state.title);
                this.setState({ titileButton: 'START' });
                clearInterval(this.interval);
            }
        }
    }

    componentDidUpdate() {
        if(this.state.timer === 15){
            this.onSpeak('HAlF OF TIME');
        }
        if(this.state.timer === 1 && this.state.titileButton==='PAUSE'){
            this.onSpeak('1');
        }else if(this.state.timer === 2&& this.state.titileButton==='PAUSE'){
            this.onSpeak('2');
        }else if(this.state.timer === 3&& this.state.titileButton==='PAUSE'){
            this.onSpeak('3');
        }
        if (this.state.timer === 0) {
            if (this.state.title === 'READY TO START') {
                this.startNewFit();
            } else if (this.state.title === 'REST 10 SECONDS') {

                this.startNewFit();
                this.setState({

                    next: '',
                    
                });
            } else if (this.state.i < this.state.count) {
                this.setState({
                    timerStart: 10,
                    timer: 10,
                    image: this.state.todos[this.state.i].image,
                    title: 'REST 10 SECONDS',
                    next: 'NEXT: '+ this.state.todos[this.state.i].title,
                });
                this.onSpeak('REST 10 SECONDS');
                this.onSpeak('NEXT ROUND IS '+ this.state.todos[this.state.i].title);
            }
            else {
                clearInterval(this.interval);
                Alert.alert(
                    'Notification',
                    'You have done all the exercises.',
                    [
                        { text: 'OK' },
                    ],
                    { cancelable: false }
                );
                this.props.navigation.pop();
            }
        }
    }

    backExercise = () => {
        if (this.state.i > 1) {
            clearInterval(this.interval);
            this.setState({
                completed: this.state.todos[this.state.i - 2].completed,
                image: this.state.todos[this.state.i - 2].image,
                title: this.state.todos[this.state.i - 2].title,
                timerStart: this.state.todos[this.state.i - 2].timer,
                timer: this.state.todos[this.state.i - 2].timer,
                titileButton: 'START',
                i: this.state.i - 1,
            })
        }
    }

    nextExercise = () => {
        if (this.state.i < this.state.count) {
            clearInterval(this.interval);
            this.setState({
                completed: this.state.todos[this.state.i].completed,
                image: this.state.todos[this.state.i].image,
                title: this.state.todos[this.state.i].title,
                timerStart: this.state.todos[this.state.i].timer,
                timer: this.state.todos[this.state.i].timer,
                titileButton: 'START',
                i: this.state.i + 1,
            })
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        const percent = (this.state.timer / this.state.timerStart) * 100;
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <ProgressCircle
                        style={styles.progress}
                        percent={Math.ceil(percent)}
                        radius={60}
                        borderWidth={10}
                        color={'#2B2E35'}
                        shadowColor={this.state.color}
                        bgColor={colors.white}
                        paddingVertical={10}
                    >
                        <Text style={[styles.buttonText, { fontSize: 40, textAlign: 'center', marginTop: 0 }]}>{this.state.timer}</Text>
                    </ProgressCircle>

                </View>
                <View style={styles.bodyContainer}>
                    <Text style={styles.buttonText}>{this.state.title}</Text>
                    <Text style={styles.buttonText}>{this.state.next}</Text>
                    <Image
                        style={{ width: '80%', height: '70%' }}
                        source={this.state.image}
                    />
                    <View style={{ flexDirection: 'row' }}>

                        <TouchableOpacity style={{ paddingHorizontal: 20 }} onPress={this.backExercise}>
                            <AntDesign name="arrowleft" size={24} color="black" style={{ alignSelf: 'center' }} />

                        </TouchableOpacity>

                        <Text style={styles.buttonText}>{this.state.i}/{this.state.count}</Text>

                        <TouchableOpacity style={{ paddingHorizontal: 20 }} onPress={this.nextExercise}>
                            <AntDesign name="arrowright" size={24} color="black" style={{ alignSelf: 'center' }} />
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity style={[styles.button, { backgroundColor: this.state.color }]}
                    onPress={this.buttonClick}
                >
                    <Text style={[styles.buttonText, { color: colors.white }]}>{this.state.titileButton}</Text>
                </TouchableOpacity>
            </View>
        )
    }

}
const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2B2E35'

    },
    header: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingTop: 15,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        backgroundColor: colors.white,
    },
    timer: {
        backgroundColor: '#fff',
        width: 40,
        height: 40,
        borderRadius: 500,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bodyContainer: {
        flex: 2.5,
        width: '90%',
        marginHorizontal: 5,
        marginVertical: 10,
        flexDirection: 'column',
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,

    },
    button: {
        flex: 0.25,
        width: '90%',
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 10,
        marginBottom: 10,
    },
    buttonText: {
        color: '#2B2E35',
        fontSize: 20,
        alignSelf: 'center',
        letterSpacing: 1,
        fontFamily: 'quicksand-bold',
    },
    progress: {
        paddingTop: 5,
        width: 20,
        height: 20,
        alignSelf: 'flex-end',
        justifyContent: 'flex-end',
    },

});