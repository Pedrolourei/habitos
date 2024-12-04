import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const JobsListScreen = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('jobs') // Nome da coleção no Firestore
      .onSnapshot(snapshot => {
        const jobList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setJobs(jobList);
      });

    return () => unsubscribe();
  }, []);

  const renderJob = ({ item }) => (
    <View style={styles.jobItem}>
      <Text style={styles.jobTitle}>{item.title}</Text>
      <Text>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Vagas Disponíveis</Text>
      <FlatList
        data={jobs}
        keyExtractor={item => item.id}
        renderItem={renderJob}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  jobItem: { marginBottom: 15, padding: 10, backgroundColor: '#f1f1f1', borderRadius: 5 },
  jobTitle: { fontSize: 16, fontWeight: 'bold' },
});

export default JobsListScreen;
