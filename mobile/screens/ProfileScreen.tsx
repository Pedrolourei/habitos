// mobile/screens/ProfileScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';

const ProfileScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');

  const handleSaveProfile = () => {
    if (!name || !email) {
      Alert.alert('Erro', 'Nome e Email são obrigatórios!');
      return;
    }

    // Salvar as informações no Firestore
    firebase.firestore().collection('candidates').doc(email).set({
      name,
      email,
      skills,
      experience,
    });

    Alert.alert('Sucesso', 'Perfil salvo com sucesso!');
    navigation.goBack(); // Volta para a tela anterior
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Perfil do Candidato</Text>
      <TextInput
        placeholder="Nome"
        value={name}
        onChangeText={setName}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Habilidades"
        value={skills}
        onChangeText={setSkills}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Experiência"
        value={experience}
        onChangeText={setExperience}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />

      <Button title="Salvar Perfil" onPress={handleSaveProfile} />
    </View>
  );
};

export default ProfileScreen;
