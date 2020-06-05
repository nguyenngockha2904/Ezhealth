import React from 'react'
import { Text, View, SafeAreaView, TouchableOpacity, FlatList, TextInput, Keyboard, StyleSheet } from 'react-native'
import { MaterialIcons, AntDesign, Ionicons } from '@expo/vector-icons';
import colors from '../shared/Colors';

export default class ChallengesModal extends React.Component {
    state = {
        newTodo: '',
        color: this.props.list.color,
    }

    toggleDeleteTodo = (index) => {
        let list = this.props.list;
        list.todos.splice(index, 1);
        this.props.updateList(list);
    }

    toggleTodoCompleted = index => {
        let list = this.props.list;
        list.todos[index].completed = !list.todos[index].completed;
        this.props.updateList(list);
    }

    addTodo = () => {
        let list = this.props.list;
        if (!list.todos.some(todo => todo.title === this.state.newTodo)) {
            list.todos.push({ title: this.state.newTodo, completed: false });
            this.props.updateList(list);
        }
        this.setState({ newTodo: '' });
        Keyboard.dismiss();
    }

    renderTodo = (todo, index) => {
        return (
            <View style={styles.todoContainer}>
                <TouchableOpacity onPress={() => this.toggleTodoCompleted(index)}>
                    <Ionicons
                        name={todo.completed ? 'ios-square' : 'ios-square-outline'}
                        size={24}
                        color={colors.gray}
                        style={{ width: 32 }}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => this.toggleTodoCompleted(index)}>
                    <Text
                        style={[styles.todo, {
                            textDecorationLine: todo.completed ? 'line-through' : 'none',
                            color: todo.completed ? colors.gray : colors.black, flex: 1,
                        }]}
                    >{todo.title}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.toggleDeleteTodo(index)}
                >
                    <MaterialIcons
                        style={{
                            alignSelf: 'flex-end',
                        }}
                        size={23}
                        name='delete'
                        color={colors.gray}

                    />
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        const list = this.props.list;
        const taskCount = list.todos.length;
        const completedCount = list.todos.filter(todo => todo.completed).length;
        return (
            <View style={{ flex: 1, }} >
                <SafeAreaView style={styles.container}>
                    <TouchableOpacity
                        style={{ position: 'absolute', top: 24, right: 32, zIndex: 10 }}
                        onPress={this.props.closeModal}
                    >
                        <AntDesign name='close' size={24} color={colors.black} />
                    </TouchableOpacity>

                    <View style={[styles.section, styles.header, { borderBottomColor: list.color }]}>
                        <View>
                            <Text style={styles.title}>{list.name}</Text>
                            <Text style={styles.taskCount}>
                                {completedCount} of {taskCount} challenges is finished
                        </Text>
                        </View>
                    </View>
                    <View style={[styles.section, { flex: 3 }]}>
                        <FlatList
                            data={list.todos}
                            renderItem={({ item, index }) => this.renderTodo(item, index)}
                            keyExtractor={(_, index) => index.toString()}
                            contentContainerStyle={{ paddingHorizontal: 32, paddingVertical: 64 }}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                    <View style={[styles.section, styles.footer]}>
                        <TextInput
                            selectionColor={this.state.color}
                            style={[styles.input, { borderColor: list.color }]}
                            onChangeText={text => this.setState({ newTodo: text })}
                            value={this.state.newTodo}
                        />
                        <TouchableOpacity
                            style={[styles.addTodo, { backgroundColor: list.color }]}
                            onPress={() => this.addTodo()}
                        >
                            <AntDesign
                                name='plus'
                                size={16}
                                color={colors.white}
                            />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    section: {
        alignSelf: 'stretch',
        flex: 1,
    },
    header: {
        justifyContent: 'flex-end',
        marginLeft: 64,
        borderBottomWidth: 3,
    },
    title: {
        fontSize: 30,
        fontFamily: 'quicksand-bold',
        color: colors.black,
    },
    taskCount: {
        marginTop: 4,
        marginBottom: 16,
        color: colors.gray,
        fontFamily: 'quicksand-regular',

    },
    footer: {
        fontFamily: 'quicksand-regular',
        paddingHorizontal: 32,
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        fontFamily: 'quicksand-regular',
        flex: 1,
        height: 48,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 6,
        marginRight: 8,
        paddingHorizontal: 8,
    },
    addTodo: {
        borderRadius: 4,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    todoContainer: {
        width: '100%',
        paddingVertical: 16,
        flexDirection: 'row',
    },
    todo: {
        color: colors.black,
        fontFamily: 'quicksand-bold',
        fontSize: 16,
    }
});
