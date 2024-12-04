import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import JobListScreen from "./screens/JobListScreen";  // Sua tela de lista de vagas
import JobDetailsScreen from "./screens/JobDetailsScreen";  // Tela de detalhes da vaga
import LoginScreen from "./screens/LoginScreen";  // Tela de login
import HomeScreen from "./screens/HomeScreen";  // Tela inicial com botões de navegação
import ProfileScreen from "./screens/ProfileScreen";  // Tela de perfil do candidato
import { AsyncStorage } from "react-native"; // Para verificar se o usuário está logado

const Stack = createStackNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userType, setUserType] = useState<string | null>(null);

  // Verificar o estado de login ao carregar o app
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userToken = await AsyncStorage.getItem("userToken");
        const accountType = await AsyncStorage.getItem("userType");
        if (userToken) {
          setIsLoggedIn(true); // O usuário está logado
          setUserType(accountType); // Tipo de conta (candidato ou empresa)
        } else {
          setIsLoggedIn(false); // O usuário não está logado
        }
      } catch (error) {
        console.log("Erro ao verificar login: ", error);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLoggedIn ? "Home" : "Login"}>
        <Stack.Screen name="Home">
          {(props) => <HomeScreen {...props} userType={userType} />}
        </Stack.Screen>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="JobList" component={JobListScreen} />
        <Stack.Screen name="JobDetails" component={JobDetailsScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
