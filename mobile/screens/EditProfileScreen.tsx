import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const EditProfileScreen = ({ route, navigation }) => {
  const { candidateId } = route.params; // Recebe o ID do candidato como parâmetro
  const [candidateData, setCandidateData] = useState({
    name: '',
    email: '',
    city: '',
  });

  // Carrega os dados do candidato
  useEffect(() => {
    const fetchData = async () => {
      try {
        const doc = await firestore().collection('candidates').doc(candidateId).get();
        if (doc.exists) {
          setCandidateData(doc.data());
        } else {
          Alert.alert('Erro', 'Candidato não encontrado.');
        }
      } catch (error) {
        Alert.alert('Erro', 'Falha ao carregar dados.');
      }
    };
    fetchData();
  }, [candidateId]);

  // Atualiza os dados no Firestore
  const handleUpdate = async () => {
    try {
      await firestore().collection('candidates').doc(candidateId).update(candidateData);
      Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
      navigation.goBack(); // Retorna para a tela anterior
    } catch (error) {
      Alert.alert('Erro', 'Falha ao atualizar os dados.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        value={candidateData.name}
        onChangeText={(text) => setCandidateData({ ...candidateData, name: text })}
      />
      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={styles.input}
        value={candidateData.email}
        onChangeText={(text) => setCandidateData({ ...candidateData, email: text })}
      />
      <Text style={styles.label}>Cidade</Text>
      <TextInput
        style={styles.input}
        value={candidateData.city}
        onChangeText={(text) => setCandidateData({ ...candidateData, city: text })}
      />

      {}
      <Button title="Salvar" onPress={handleUpdate} />

      {}
      <Button title="Voltar" onPress={() => navigation.goBack()} />

      {}
      <Button
        title="Ver Vagas"
        onPress={() => navigation.navigate('JobsList')} // Nome da tela de vagas
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
  label: {
    fontSize: 16,
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 16,
  },
});

export default EditProfileScreen;
