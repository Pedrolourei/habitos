import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const RegisterUserScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleRegister = async () => {
    if (!name || !email) {
      alert('Preencha todos os campos!');
      return;
    }

    try {
      await firestore().collection('users').add({
        name,
        email,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      alert('Usuário cadastrado com sucesso!');
      setName('');
      setEmail('');
    } catch (error) {
      alert('Erro ao cadastrar usuário: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Cadastro de Usuário</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <Button title="Cadastrar" onPress={handleRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
});

export default RegisterUserScreen;
