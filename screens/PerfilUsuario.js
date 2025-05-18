import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PerfilUsuario() {
  const [usuario, setUsuario] = useState({});
  const [totalServicos, setTotalServicos] = useState(0);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    const userData = await AsyncStorage.getItem('userData');
    const userServicos = await AsyncStorage.getItem('userServicos'); // ou calcular via API
    if (userData) {
      setUsuario(JSON.parse(userData));
    }
    if (userServicos) {
      const lista = JSON.parse(userServicos);
      setTotalServicos(lista.length || 0);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu Perfil</Text>
      <Text style={styles.label}>Nome:</Text>
      <Text style={styles.value}>{usuario.nome}</Text>

      <Text style={styles.label}>Email:</Text>
      <Text style={styles.value}>{usuario.email}</Text>

      <Text style={styles.label}>Total de Serviços Contratados:</Text>
      <Text style={styles.value}>{totalServicos}</Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Alterar Senha</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    color: '#555',
  },
  value: {
    fontSize: 16,
    color: '#000',
  },
  button: {
    marginTop: 30,
    backgroundColor: '#7A942E',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
