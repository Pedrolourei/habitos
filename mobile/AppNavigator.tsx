import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import JobsListScreen from './screens/JobsListScreen';
import RegisterUserScreen from './screens/RegisterUserScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="JobsList">
        <Stack.Screen
          name="JobsList"
          component={JobsListScreen}
          options={{ title: 'Vagas' }}
        />
        <Stack.Screen
          name="RegisterUser"
          component={RegisterUserScreen}
          options={{ title: 'Cadastro de Usuário' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
