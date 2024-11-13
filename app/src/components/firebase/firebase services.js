import React, { useEffect, useState } from 'react';
import { View, Button, Text } from 'react-native';
import { addDocument, fetchDocuments } from './firebaseServices';

const MyComponent = () => {
  const [data, setData] = useState([]);

  const handleAddDocument = async () => {
    await addDocument({ name: 'New Item', timestamp: new Date() });
    fetchData();
  };

  const fetchData = async () => {
    const documents = await fetchDocuments();
    setData(documents);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View>
      <Button title="Add Document" onPress={handleAddDocument} />
      <Text>Data from Firestore:</Text>
      {data.map((item, index) => (
        <Text key={index}>{item.name}</Text>
      ))}
    </View>
  );
};

export default MyComponent;
