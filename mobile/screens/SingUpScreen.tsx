import React, { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import { firebase } from "../firebaseConfig";

const SignUpScreen: React.FC<any> = ({ navigation }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSignUp = () => {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(() => {
        Alert.alert("Cadastro bem-sucedido!");
        navigation.navigate("Login");  // Navega para a tela de login após cadastro
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
      <Button title="Cadastrar" onPress={handleSignUp} />
    </View>
  );
};

export default SignUpScreen;
