import { useFocusEffect, useRouter } from 'expo-router';
import moment from 'moment';
import { useCallback, useState } from 'react';
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { loadTasks, saveTasks } from '../utils/storage';
import { Task } from '../utils/taskModel';

export default function HomeScreen() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const router = useRouter();

    useFocusEffect(
        useCallback(() => {
            loadTasks().then(setTasks);
        }, [])
    );

    const toggleComplete = async (id: string) => {
        const updated = tasks.map(task =>
            task.id === id ? { ...task, isComplete: !task.isComplete } : task
        );
        setTasks(updated);
        await saveTasks(updated);
    };

    return (
        <View className="flex-1 bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Header Section */}
            <View className="px-6 pt-12 pb-6">
                <Text className="text-3xl font-bold text-slate-800 mb-2">Drive Tasks</Text>
                <Text className="text-slate-500 text-base">Stay organized and productive</Text>
            </View>

            {/* Tasks List */}
            <View className="flex-1 px-4">
                <FlatList
                    data={tasks}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    ListEmptyComponent={
                        <View className="items-center justify-center mt-20">
                            <View className="w-24 h-24 bg-blue-100 rounded-full items-center justify-center mb-4">
                                <Text className="text-4xl">📝</Text>
                            </View>
                            <Text className="text-xl font-semibold text-slate-600 mb-2">No tasks yet</Text>
                            <Text className="text-slate-400 text-center px-8">
                                Tap the + button below to create your first task
                            </Text>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <View className="mb-4">
                            <TouchableOpacity
                                className={`rounded-2xl shadow-sm border-0 overflow-hidden ${item.isComplete
                                    ? 'bg-slate-100'
                                    : 'bg-white shadow-lg shadow-blue-500/10'
                                    }`}
                                onPress={() => toggleComplete(item.id)}
                                activeOpacity={0.7}
                            >
                                {/* Task Content */}
                                <View className="p-5">
                                    <View className="flex-row items-start justify-between">
                                        <View className="flex-1 mr-3">
                                            {/* Task Title */}
                                            <Text
                                                className={`text-lg font-semibold mb-2 ${item.isComplete
                                                    ? 'line-through text-slate-400'
                                                    : 'text-slate-800'
                                                    }`}
                                            >
                                                {item.title}
                                            </Text>

                                            {/* Task Description */}
                                            {item.description && (
                                                <Text
                                                    className={`text-sm mb-3 leading-5 ${item.isComplete ? 'text-slate-400' : 'text-slate-600'
                                                        }`}
                                                    numberOfLines={2}
                                                >
                                                    {item.description}
                                                </Text>
                                            )}

                                            {/* Due Date */}
                                            {item.dueDate && (
                                                <View className="flex-row items-center mb-4">
                                                    <View className={`px-3 py-1 rounded-full ${item.isComplete ? 'bg-slate-200' : 'bg-blue-50'
                                                        }`}>
                                                        <Text className={`text-xs font-medium ${item.isComplete ? 'text-slate-400' : 'text-blue-600'
                                                            }`}>
                                                            📅 {moment(item.dueDate).format('MMM DD, YYYY • HH:mm')}
                                                        </Text>
                                                    </View>
                                                </View>
                                            )}
                                        </View>

                                        {/* Completion Indicator */}
                                        <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${item.isComplete
                                            ? 'bg-green-500 border-green-500'
                                            : 'border-slate-300'
                                            }`}>
                                            {item.isComplete && (
                                                <Text className="text-white text-xs font-bold">✓</Text>
                                            )}
                                        </View>
                                    </View>

                                    {/* Action Buttons */}
                                    <View className="flex-row gap-3 mt-4">
                                        <TouchableOpacity
                                            className="flex-1 bg-amber-50 border border-amber-200 rounded-xl py-3 px-4"
                                            onPress={() => router.push({ pathname: '/task-form', params: { id: item.id } })}
                                            activeOpacity={0.7}
                                        >
                                            <Text className="text-amber-700 font-semibold text-center text-sm">
                                                ✏️ Edit
                                            </Text>
                                        </TouchableOpacity>

                                        {item.id && (
                                            <TouchableOpacity
                                                className="bg-red-50 border border-red-200 rounded-xl py-3 px-4"
                                                onPress={async () => {
                                                    Alert.alert(
                                                        'Delete Task',
                                                        'Are you sure you want to delete this task?',
                                                        [
                                                            {
                                                                text: 'Cancel',
                                                                style: 'cancel',
                                                            },
                                                            {
                                                                text: 'Delete',
                                                                style: 'destructive',
                                                                onPress: async () => {
                                                                    const updatedList = tasks.filter((t) => t.id !== item.id);
                                                                    await saveTasks(updatedList);
                                                                    loadTasks().then(setTasks);
                                                                }
                                                            },
                                                        ]
                                                    );
                                                }}
                                                activeOpacity={0.7}
                                            >
                                                <Text className="text-red-600 font-semibold text-center text-sm">
                                                    🗑️ Delete
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>

                                {/* Completion Overlay */}
                                {item.isComplete && (
                                    <View className="absolute inset-0 bg-slate-100/50 rounded-2xl" />
                                )}
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </View>

            {/* Floating Action Button */}
            <TouchableOpacity
                className="absolute bottom-8 right-6 w-16 h-16 from-blue-600 rounded-2xl shadow-lg shadow-blue-500/30 items-center justify-center"
                onPress={() => router.push('/task-form')}
            >
                <View className="w-40 h-40 bg-blue-100 rounded-full items-center justify-center mr-3">
                    <Text className="text-2xl p-2">{'➕'}</Text>
                </View>
            </TouchableOpacity>
        </View>

    );
}
