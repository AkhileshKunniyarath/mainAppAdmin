import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Snackbar from 'react-native-snackbar';

const UserList = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const snapshot = await firestore().collection('users').get();
      const usersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await firestore().collection('users').doc(userId).update({ active: newStatus });

      Snackbar.show({
        text: newStatus ? 'User unblocked successfully' : 'User blocked successfully',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: newStatus ? 'green' : 'red',
        textColor: 'white',
      });

      // Refresh user list
      fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Panel</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.userContainer}>
            <Text style={styles.email}>{item.email}</Text>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: item.active ? 'red' : 'green' }]}
              onPress={() => toggleUserStatus(item.id, item.active)}
            >
              <Text style={styles.buttonText}>
                {item.active ? 'Block' : 'Unblock'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userContainer: {
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    // borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  email : {
    fontSize: 18,
  },
  button: {
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default UserList;
