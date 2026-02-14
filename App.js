import React, { useState, useEffect } from 'react';
import { View, Text,  FlatList, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Tasks" component={TasksScreen} />
        <Stack.Screen name="AddTask" component={AddTaskScreen} options={{ title: 'Add Task' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function TasksScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    saveTasks();
  }, [tasks]);

  const saveTasks = async () => {
    await AsyncStorage.setItem('TASKS', JSON.stringify(tasks));
  };

  const loadTasks = async () => {
    const data = await AsyncStorage.getItem('TASKS');
    if (data) setTasks(JSON.parse(data));
  };

  const deleteTask = (id) => {
    Alert.alert('ลบงาน', 'ต้องการลบงานนี้หรือไม่?', [
      { text: 'ยกเลิก' },
      { text: 'ลบ', onPress: () => setTasks(tasks.filter(t => t.id !== id)) }
    ]);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('AddTask', {
          editTask: item,
          updateTask: (updated) =>
            setTasks(tasks.map(t => t.id === updated.id ? updated : t))
        })
      }
      style={styles.card}
    >
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.image} />
      ) : null}

      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.category}>{item.category}</Text>

      <TouchableOpacity
        onPress={() => deleteTask(item.id)}
        style={styles.deleteBtn}
      >
        <Text style={{ color: '#fff' }}>ลบ</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {tasks.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={{ fontSize: 60 }}>📝</Text>
          <Text style={{ fontSize: 18 }}>ยังไม่มีงาน</Text>
          <Text style={{ color: 'gray' }}>กด + เพื่อเพิ่มงานแรก</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}

      <TouchableOpacity
        onPress={() =>
          navigation.navigate('AddTask', {
            addTask: (task) => setTasks([...tasks, task])
          })
        }
        style={styles.fab}
      >
        <Text style={{ color: '#fff', fontSize: 30 }}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

function AddTaskScreen({ route, navigation }) {
  const editTask = route.params?.editTask;
  const addTask = route.params?.addTask;
  const updateTask = route.params?.updateTask;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setCategory(editTask.category);
      setImage(editTask.image);
    }
  }, []);

  const saveTask = () => {
    if (!title.trim()) {
      Alert.alert('แจ้งเตือน', 'กรุณากรอกชื่องาน');
      return;
    }

    const taskData = {
      id: editTask ? editTask.id : Date.now().toString(),
      title,
      category,
      image
    };

    if (editTask) updateTask(taskData);
    else addTask(taskData);

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="ชื่องาน"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        placeholder="หมวดหมู่"
        value={category}
        onChangeText={setCategory}
        style={styles.input}
      />

      <TextInput
        placeholder="ลิงก์รูปภาพ (URL)"
        value={image}
        onChangeText={setImage}
        style={styles.input}
      />

      <TouchableOpacity onPress={saveTask} style={styles.saveBtn}>
        <Text style={{ color: '#fff', fontSize: 18 }}>บันทึกงาน</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2f2f2'
  },
  emptyBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 4
  },
  image: {
    height: 150,
    borderRadius: 10,
    marginBottom: 10
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  category: {
    color: 'gray',
    marginBottom: 8
  },
  deleteBtn: {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 8,
    alignSelf: 'flex-start'
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#4CAF50',
    width: 65,
    height: 65,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3
  },
  saveBtn: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center'
  }
};
