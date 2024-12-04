import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button } from 'react-native';

const ApplicationsHistoryScreen = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      const userApplications = await firebase.firestore()
        .collection('applications')
        .where('candidateId', '==', firebase.auth().currentUser.uid)
        .get();

      const apps = userApplications.docs.map(doc => doc.data());
      setApplications(apps);
    };

    fetchApplications();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text>Histórico de Candidaturas</Text>
      <FlatList
        data={applications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.jobTitle}</Text>
            <Text>Status: {item.status}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default ApplicationsHistoryScreen;
