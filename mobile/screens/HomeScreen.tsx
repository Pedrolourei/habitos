import React from "react";
import { View, Text, Button } from "react-native";

interface HomeScreenProps {
  userType: string | null; // Pode ser 'empresa' ou 'candidato'
  navigation: any;
}

const HomeScreen = ({ userType, navigation }: HomeScreenProps) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Bem-vindo à tela inicial!</Text>

      {userType === "empresa" && (
        <Button
          title="Publicar Vagas"
          onPress={() => {
            console.log("Botão de publicar vagas clicado!");
          }}
        />
      )}

      {userType === "candidato" && (
        <Button
          title="Ir para o Perfil"
          onPress={() => {
            // Navegar para a tela de perfil do candidato
            navigation.navigate("Profile");
          }}
        />
      )}

      <Button
        title="Visualizar Vagas"
        onPress={() => {
          // Navegar para a lista de vagas
          navigation.navigate("JobList");
        }}
      />
    </View>
  );
};

export default HomeScreen;
