import React from 'react';
import { Text, View, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons'
import colors from '../shared/Colors';
import { homeStyles } from '../styles/HomeStyles';
import ChallengesModal from './ChallengesModal';
import ProgressCircle from 'react-native-progress-circle';

export default class ChallengesList extends React.Component {
    state = {
        modalVisible: false,
        challenges: this.props.challenges,
    };
    toggleChallengesModal = () => {
        this.setState({ modalVisible: !this.state.modalVisible });
    };

    ratingChallenges = (percent) => {
        if (Math.ceil(percent) === 100) {
            return (
                <MaterialIcons
                    name='done'
                    size={20}
                />
            )
        }
    }
    
    render() {
        const challenges = this.props.challenges;
        const count = challenges.todos.length;
        const completedCount = challenges.todos.filter(todo => todo.completed).
            length;
        const percent = (completedCount / count) * 100
        const remainingCount = challenges.todos.length - completedCount;
        return (
            <View>
                {/* Modal Acctive Projects */}
                <Modal
                    animationType='slide' visible={this.state.modalVisible}
                    onRequestClose={this.toggleChallengesModal}
                >
                    <ChallengesModal closeModal={this.toggleChallengesModal}
                        list={challenges}
                        updateList={this.props.updateList} />
                </Modal>
                <TouchableOpacity style={{ flexDirection: 'row', marginLeft: 10, paddingBottom: 20 }}
                    onPress={this.toggleChallengesModal}
                >
                    <ProgressCircle
                        style={styles.progress}
                        percent={Math.ceil(percent)}
                        radius={32}
                        borderWidth={6}
                        color={challenges.colorLight}
                        shadowColor={colors.white}
                        bgColor={colors.white}
                        paddingVertical={10}
                    >
                        <View style={[homeStyles.bodyTouch, { backgroundColor: challenges.color }]}>
                            <FontAwesome5
                                name={challenges.icon}
                                size={40}
                                color={colors.white}
                            />
                        </View>
                    </ProgressCircle>
                    <View style={homeStyles.bodyContentText}>
                        <Text style={[homeStyles.bodyContentTitle, { color: challenges.color }]}>{challenges.name} {this.ratingChallenges(percent)}</Text>
                        <Text style={homeStyles.bodyContentSub}>Challenges today: {completedCount}/{challenges.todos.length} finished.</Text>
                    </View>
                    <Text style={styles.percent}>{Math.ceil(percent) + '%'} </Text>

                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    progress: {
        width: 10,
        height: 10,
        alignSelf: 'flex-end',
        justifyContent: 'flex-end'
    },
    percent: {
        fontSize: 14,
        color: colors.black,
        fontFamily: 'quicksand-regular',
        alignSelf: 'flex-end',
        padding: 20,
        paddingBottom: 10,
    }
});
