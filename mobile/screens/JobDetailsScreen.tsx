import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import firebase from 'firebase/app';
import 'firebase/firestore';

const JobDetailsScreen = ({ route, navigation }) => {
  const { jobId } = route.params; 
  const [jobDetails, setJobDetails] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const jobDoc = await firebase.firestore().collection('jobs').doc(jobId).get();
        if (jobDoc.exists) {
          setJobDetails(jobDoc.data());
        } else {
          Alert.alert('Erro', 'Vaga não encontrada');
        }
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os detalhes da vaga');
      }
    };

    fetchJobDetails();
  }, [jobId]);

  if (!jobDetails) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  const { title, description, requirements, location, salary, type } = jobDetails;

  const handleApply = () => {
    Alert.alert('Candidatura Enviada', `Você se candidatou à vaga: ${title}`);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.info}>Localização: {location}</Text>
      <Text style={styles.info}>Tipo de Contratação: {type}</Text>
      <Text style={styles.info}>Salário: {salary}</Text>

      <Text style={styles.sectionTitle}>Descrição</Text>
      <Text style={styles.text}>{description}</Text>

      <Text style={styles.sectionTitle}>Requisitos</Text>
      <Text style={styles.text}>{requirements}</Text>

      <Button title="Candidatar-se" onPress={handleApply} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default JobDetailsScreen;
