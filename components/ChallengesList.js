import React from 'react';
import { Text, View, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons'
import colors from '../shared/Colors';
import { homeStyles } from '../styles/HomeStyles';
import ChallengesModal from './ChallengesModal';
import ProgressCircle from 'react-native-progress-circle';
import SwipeButton from 'rn-swipe-button';

export default class ChallengesList extends React.Component {
    state = {
        modalVisible: false,
        challenges: this.props.challenges,
        delete: false,
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
            );
        }
    }

    renderDelete = () => {
        if (this.props.settings.rank != 'Common User') {
            this.setState({
                delete: !this.state.delete,
            });
        }
    }

    render() {
        const challenges = this.props.challenges;
        let count = 0;
        let completedCount = 0;
        let percent = 0;
        if (challenges.todos.length > 0) {
            count = challenges.todos.length;
            completedCount = challenges.todos.filter(todo => todo.completed).length;
            percent = (completedCount / count) * 100;
        }
        return (
            <View style={{ paddingBottom: 20 }}>
                {/* Modal Acctive Projects */}
                <Modal
                    animationType='slide' visible={this.state.modalVisible}
                    onRequestClose={this.toggleChallengesModal}
                >
                    <ChallengesModal closeModal={this.toggleChallengesModal}
                        list={challenges}
                        updateList={this.props.updateList} />
                </Modal>

                <TouchableOpacity style={{ flexDirection: 'row', marginLeft: 10, backgroundColor: 'transpament' }}
                    onPress={this.toggleChallengesModal}
                    onLongPress={this.renderDelete}
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
                       {count !=0 ?  <Text style={homeStyles.bodyContentSub}>Status: {completedCount}/{challenges.todos.length} finished</Text> : <Text style={homeStyles.bodyContentSub}>This challenge is empty</Text>}
                    </View>
                    {count != 0 ? <Text style={styles.percent}>{Math.ceil(percent) + '%'} </Text> : null}

                </TouchableOpacity>

                {this.state.delete ?
                    <SwipeButton
                        disabled={false}
                        //disable the button by doing true (Optional)
                        swipeSuccessThreshold={100}
                        height={25}
                        //height of the button (Optional)
                        width={'95%'}
                        //width of the button (Optional)
                        title={"Swipe to delete " + challenges.name}
                        //Text inside the button (Optional)
                        //thumbIconImageSource={thumbIcon}
                        //You can also set your own icon for the button (Optional)
                        onSwipeSuccess={() => {
                            this.renderDelete();
                            this.props.deleteChallenges(challenges.name);
                        }}
                        //After the completion of swipe (Optional)
                        railFillBackgroundColor={challenges.color} //(Optional)
                        railFillBorderColor={challenges.color} //(Optional)
                        thumbIconBackgroundColor={colors.white} //(Optional)
                        thumbIconBorderColor={challenges.color}
                        thumbIconImageSource={require('../assets/backgrounds/apps/none.png')} //(Optional)
                        railBackgroundColor={challenges.colorLight} //(Optional)
                        railBorderColor="white" //(Optional)
                        titleColor='black'
                        titleFontSize={16}
                        titleStyles={{fontFamily: 'quicksand-regular'}}
                    />
                    : null}
            </View>
        );
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
