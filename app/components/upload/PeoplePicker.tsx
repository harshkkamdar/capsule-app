import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Ionicons } from '@expo/vector-icons';

interface User {
  id: string;
  displayName: string;
  email: string;
}

interface PeoplePickerProps {
  onPeopleSelect: (people: string[]) => void;
  selectedPeople: string[];
}

export const PeoplePicker = ({ onPeopleSelect, selectedPeople }: PeoplePickerProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [peopleDisplayNames, setPeopleDisplayNames] = useState<{[key: string]: string}>({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as User));
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const toggleUser = (userId: string) => {
    const newSelected = selectedPeople.includes(userId)
      ? selectedPeople.filter(id => id !== userId)
      : [...selectedPeople, userId];
    onPeopleSelect(newSelected);
  };

  useEffect(() => {
    const fetchDisplayNames = async () => {
      if (!selectedPeople.length) return;
      
      const names: {[key: string]: string} = {};
      await Promise.all(
        selectedPeople.map(async (userId) => {
          const userDoc = await getDoc(doc(db, 'users', userId));
          if (userDoc.exists()) {
            names[userId] = userDoc.data().displayName;
          }
        })
      );
      setPeopleDisplayNames(names);
    };

    fetchDisplayNames();
  }, [selectedPeople]);

  return (
    <View className="mb-4">
      <TouchableOpacity 
        onPress={() => setIsOpen(!isOpen)}
        className="flex-row items-center justify-between p-3 border border-gray-200 rounded-lg"
      >
        <Text className="text-gray-600">Tag People</Text>
        <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={20} color="gray" />
      </TouchableOpacity>

      {isOpen && (
        <ScrollView className="mt-2 max-h-40 border border-gray-200 rounded-lg">
          {users.map(user => (
            <TouchableOpacity
              key={user.id}
              onPress={() => toggleUser(user.id)}
              className={`p-3 flex-row items-center justify-between ${
                selectedPeople.includes(user.id) ? 'bg-blue-50' : ''
              }`}
            >
              <Text>{user.displayName}</Text>
              {selectedPeople.includes(user.id) && (
                <Ionicons name="checkmark" size={20} color="#0061FF" />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Display selected people chips */}
      {selectedPeople.length > 0 && (
        <View className="flex-row flex-wrap gap-2 mb-4 mt-4">
          {selectedPeople.map((personId) => (
            <View 
              key={personId} 
              className="flex-row items-center bg-blue-100 rounded-full px-3 py-1.5"
            >
              <Ionicons name="person" size={16} color="#0061FF" />
              <Text className="text-blue-600 ml-1">
                {peopleDisplayNames[personId] || 'Loading...'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  onPeopleSelect(selectedPeople.filter(id => id !== personId));
                }}
                className="ml-1"
              >
                <Ionicons name="close-circle" size={16} color="#0061FF" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}; 