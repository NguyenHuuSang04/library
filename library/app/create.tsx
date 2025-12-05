import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { addTask } from '@/store/taskSlice';
import { taskAPI } from '@/api/taskService';
import { CreateTaskData } from '@/types/task';

type Status = 'Todo' | 'In progress' | 'Done';

export default function CreateScreen() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<Status>('Todo');
    const [loading, setLoading] = useState(false);


    const validateForm = (): boolean => {
        if (!title.trim()) {
            if (Platform.OS === 'web') {
                window.alert('Please enter task title');
            } else {
                alert('Please enter task title');
            }
            return false;
        }
        if (!description.trim()) {
            if (Platform.OS === 'web') {
                window.alert('Please enter task description');
            } else {
                alert('Please enter task description');
            }
            return false;
        }
        return true;
    };


    const handleCreate = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);

            const newTaskData: CreateTaskData = {
                title: title.trim(),
                description: description.trim(),
                status,
            };


            const createdTask = await taskAPI.createTask(newTaskData);


            dispatch(addTask(createdTask));


            if (Platform.OS === 'web') {
                window.alert('Task created successfully');
            } else {
                alert('Task created successfully');
            }


            setTitle('');
            setDescription('');
            setStatus('Todo');


            router.back();

        } catch (error: any) {
            if (Platform.OS === 'web') {
                window.alert(error.message || 'Failed to create task');
            } else {
                alert(error.message || 'Failed to create task');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.headerTitle}>Create New Task</Text>


            <View style={styles.formGroup}>
                <Text style={styles.label}>
                    Title <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter task title"
                    value={title}
                    onChangeText={setTitle}
                    placeholderTextColor="#999"
                    editable={!loading}
                />
            </View>


            <View style={styles.formGroup}>
                <Text style={styles.label}>
                    Description <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Enter task description"
                    value={description}
                    onChangeText={setDescription}
                    placeholderTextColor="#999"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    editable={!loading}
                />
            </View>


            <View style={styles.formGroup}>
                <Text style={styles.label}>Status</Text>
                <View style={styles.statusContainer}>
                    {(['Todo', 'In progress', 'Done'] as Status[]).map((s) => (
                        <Pressable
                            key={s}
                            style={[
                                styles.statusButton,
                                status === s && styles.statusButtonActive,
                                status === s && s === 'Done' && styles.statusDoneActive,
                                status === s && s === 'In progress' && styles.statusInProgressActive,
                                status === s && s === 'Todo' && styles.statusTodoActive,
                            ]}
                            onPress={() => setStatus(s)}
                            disabled={loading}
                        >
                            <Text
                                style={[
                                    styles.statusButtonText,
                                    status === s && styles.statusButtonTextActive,
                                ]}
                            >
                                {s}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            </View>


            <View style={styles.buttonContainer}>
                <Pressable
                    style={[styles.button, styles.cancelButton]}
                    onPress={() => router.back()}
                    disabled={loading}
                >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>

                <Pressable
                    style={[styles.button, styles.createButton, loading && styles.buttonDisabled]}
                    onPress={handleCreate}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.createButtonText}>Create Task</Text>
                    )}
                </Pressable>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        padding: 20,
    },


    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 25,
    },


    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    required: {
        color: '#ff3b30',
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    textArea: {
        height: 100,
        paddingTop: 15,
    },


    statusContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    statusButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#e0e0e0',
        alignItems: 'center',
    },
    statusButtonActive: {
        borderWidth: 2,
    },
    statusTodoActive: {
        backgroundColor: '#e0e0e0',
        borderColor: '#9e9e9e',
    },
    statusInProgressActive: {
        backgroundColor: '#2196f3',
        borderColor: '#1976d2',
    },
    statusDoneActive: {
        backgroundColor: '#4caf50',
        borderColor: '#388e3c',
    },
    statusButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666',
    },
    statusButtonTextActive: {
        color: '#fff',
        fontWeight: 'bold',
    },


    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 30,
    },
    button: {
        flex: 1,
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
    },
    createButton: {
        backgroundColor: '#007AFF',
    },
    createButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
});