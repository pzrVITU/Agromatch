import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Logo folha */}
      <Image source={require('../assets/logo-folha.png')} style={styles.logo} />

      {/* Ícone agricultor/planta */}
      <Image source={require('../assets/plant-icon.png')} style={styles.illustration} />

      {/* Nome do app */}
      <Text style={styles.title}>AgroMatch</Text>

      {/* Descrição */}
      <Text style={styles.description}>
        Conectando produtores rurais a serviços especializados para otimizar o agronegócio brasileiro.
      </Text>

      {/* Botão Registrar */}
      <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerText}>Registrar</Text>
      </TouchableOpacity>

      {/* Botão Login */}
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8A9A3F',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 30,
  },
  illustration: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  registerButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 15,
  },
  registerText: {
    color: '#8A9A3F',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
