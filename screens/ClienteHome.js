import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ClienteHome = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo, Cliente!</Text>
      <Text style={styles.subtitle}>Aqui você verá os serviços disponíveis do agronegócio.</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ClienteHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DDEAEA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4A7306',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#444',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#899E3D',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
