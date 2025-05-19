import React, { useState } from 'react';
import { FlatList, TextInput, TouchableOpacity, View, StyleSheet, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { v4 as uuidv4 } from 'uuid'; // Optional: install with `npm install uuid`

type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

const AllTodosScreen = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (!input.trim()) return Alert.alert("Empty Todo", "Please enter a todo");
    const newTodo: Todo = {
      id: uuidv4(),
      title: input.trim(),
      completed: false,
    };
    setTodos([newTodo, ...todos]);
    setInput('');
  };

  const toggleComplete = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <ThemedView style={styles.container}>
      {/* Input Area */}
      <View style={styles.inputRow}>
        <TextInput
          placeholder="Add a new task..."
          value={input}
          onChangeText={setInput}
          style={styles.input}
        />
        <TouchableOpacity onPress={addTodo} style={styles.addButton}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* List of Todos */}
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <TouchableOpacity onPress={() => toggleComplete(item.id)} style={{ flex: 1 }}>
              <ThemedText style={item.completed ? styles.completed : styles.todoText}>
                {item.title}
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteTodo(item.id)}>
              <Ionicons name="trash-outline" size={20} color="red" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<ThemedText style={{ textAlign: 'center', marginTop: 20 }}>No tasks yet</ThemedText>}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f4f4f4',
    borderRadius: 8,
    padding: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#0a84ff',
    padding: 10,
    borderRadius: 8,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#f4f4f4',
    borderRadius: 8,
    marginBottom: 8,
  },
  todoText: {
    fontSize: 16,
    color: '#333',
  },
  completed: {
    fontSize: 16,
    color: 'gray',
    textDecorationLine: 'line-through',
  },
});

export default AllTodosScreen;
