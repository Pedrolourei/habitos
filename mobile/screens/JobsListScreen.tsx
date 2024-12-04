import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import firebase from 'firebase/app';
import 'firebase/firestore';

const JobListScreen = ({ navigation }) => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const snapshot = await firebase.firestore().collection('jobs').get();
        const jobList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setJobs(jobList);
      } catch (error) {
        console.error("Erro ao carregar vagas: ", error);
      }
    };

    fetchJobs();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.jobItem}>
            <Text style={styles.jobTitle}>{item.title}</Text>
            <Button
              title="Ver Detalhes"
              onPress={() => navigation.navigate('JobDetails', { jobId: item.id })}
            />
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
  jobItem: {
    marginBottom: 20,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default JobListScreen;
