import React, { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import { firebase } from "../firebaseConfig";

const LoginScreen: React.FC<any> = ({ navigation }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = () => {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        Alert.alert("Login bem-sucedido!");
        navigation.navigate("Home");  // Navega para a tela principal após login
      })
      .catch((error) => {
        const errorMessage = error.message;
        Alert.alert(errorMessage);
      });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <TextInput
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        style={{ borderBottomWidth: 1, marginBottom: 20, padding: 10 }}
      />
      <TextInput
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderBottomWidth: 1, marginBottom: 20, padding: 10 }}
      />
      <Button title="Entrar" onPress={handleLogin} />
      <Button title="Cadastrar-se" onPress={() => navigation.navigate("SignUp")} />
    </View>
  );
};

export default LoginScreen;
