import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Telas já existentes
import HomeScreen from './screens/HomeScreen';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import ClienteHome from './screens/ClienteHome';
import PrestadorHome from './screens/PrestadorHome';

// Novas telas adicionadas
import ServicoDetalhado from './screens/ServicoDetalhado';
import PerfilUsuario from './screens/PerfilUsuario';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">

        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: 'Cadastro', headerShown: false }}
        />

        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="ClienteHome"
          component={ClienteHome}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="PrestadorHome"
          component={PrestadorHome}
          options={{ headerShown: false }}
        />

        <Stack.Screen
           name="ServicoDetalhado"
           component={ServicoDetalhado}
           options={{ headerShown: false }}
/>


        <Stack.Screen
          name="PerfilUsuario"
          component={PerfilUsuario}
          options={{ title: 'Meu Perfil' }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
