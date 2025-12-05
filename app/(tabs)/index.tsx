import { useEffect, useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { setTasks, deleteTask, setLoading } from '@/store/taskSlice';
import { taskAPI } from '@/api/taskService';
import { Task } from '@/types/task';

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();


  const { tasks, loading } = useSelector((state: RootState) => state.tasks);


  const [searchQuery, setSearchQuery] = useState('');


  useEffect(() => {
    loadTasks();

  }, []);


  const loadTasks = async () => {
    try {
      dispatch(setLoading(true));
      const data = await taskAPI.getTasks();
      dispatch(setTasks(data));
    } catch (error: any) {
      if (Platform.OS === 'web') {
        window.alert(error.message || 'Failed to load tasks');
      } else {
        alert(error.message || 'Failed to load tasks');
      }
    } finally {
      dispatch(setLoading(false));
    }
  };


  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;

    return tasks.filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tasks, searchQuery]);


  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);


  const handleEdit = useCallback((id: string) => {
    router.push(`/${id}`);
  }, [router]);


  const confirmDelete = useCallback(async (id: string) => {
    try {
      await taskAPI.deleteTask(id);
      dispatch(deleteTask(id));
      if (Platform.OS === 'web') {
        window.alert('Task deleted successfully');
      } else {
        alert('Task deleted successfully');
      }
    } catch (error: any) {
      if (Platform.OS === 'web') {
        window.alert(error.message || 'Failed to delete task');
      } else {
        alert(error.message || 'Failed to delete task');
      }
    }
  }, [dispatch]);


  const handleDelete = useCallback((id: string) => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to delete this task?')) {
        confirmDelete(id);
      }
    } else {
      if (confirm('Are you sure you want to delete this task?')) {
        confirmDelete(id);
      }
    }
  }, [confirmDelete]);


  const handleTaskPress = useCallback((id: string) => {
    router.push(`/${id}`);
  }, [router]);


  const renderTaskItem = ({ item }: { item: Task }) => (
    <Pressable
      style={styles.taskCard}
      onPress={() => handleTaskPress(item.id)}
    >

      <View style={styles.taskContent}>
        <Text style={styles.taskTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.taskDescription} numberOfLines={2}>
          {item.description}
        </Text>


        <View
          style={[
            styles.statusBadge,
            item.status === 'Done' && styles.statusDone,
            item.status === 'In progress' && styles.statusInProgress,
            item.status === 'Todo' && styles.statusTodo,
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>


      <View style={styles.actionButtons}>
        <Pressable
          style={[styles.actionButton, styles.editButton]}
          onPress={(e) => {
            e.stopPropagation();
            handleEdit(item.id);
          }}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </Pressable>

        <Pressable
          style={[styles.actionButton, styles.deleteButton]}
          onPress={(e) => {
            e.stopPropagation();
            handleDelete(item.id);
          }}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </Pressable>
      </View>
    </Pressable>
  );


  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyText}>
        {searchQuery ? 'No tasks found' : 'No tasks yet. Tap + to create one!'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>


      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search tasks..."
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor="#999"
        />
        {searchQuery.length > 0 && (
          <Pressable
            style={styles.clearButton}
            onPress={() => setSearchQuery('')}
          >
            <Text style={styles.clearButtonText}>✕</Text>
          </Pressable>
        )}
      </View>


      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading tasks...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          renderItem={renderTaskItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyState}
        />
      )}


      <Pressable
        style={styles.addButton}
        onPress={() => router.push('/create')}
      >
        <Text style={styles.addButtonText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
  },
  clearButton: {
    padding: 5,
  },
  clearButtonText: {
    fontSize: 18,
    color: '#999',
  },

  listContent: {
    padding: 15,
  },

  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },

  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusTodo: {
    backgroundColor: '#e0e0e0',
  },
  statusInProgress: {
    backgroundColor: '#2196f3',
  },
  statusDone: {
    backgroundColor: '#4caf50',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },


  actionButtons: {
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 70,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#007AFF',
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },


  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },


  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },


  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    fontSize: 36,
    color: '#fff',
    fontWeight: 'bold',
  },
});