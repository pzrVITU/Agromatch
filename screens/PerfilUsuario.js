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
  try {
    const token = await AsyncStorage.getItem('userToken');
    const userId = await AsyncStorage.getItem('userId');

    if (!token || !userId) return;

    // Busca dados do usuário
    const usuarioResponse = await fetch(`http://192.168.1.111:5000/api/usuarios/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!usuarioResponse.ok) throw new Error('Erro ao buscar usuário');
    const dadosUsuario = await usuarioResponse.json();

    // Busca contagem de serviços
    const servicosResponse = await fetch(`http://192.168.1.111:5000/api/usuarios/servicos-count/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!servicosResponse.ok) throw new Error('Erro ao buscar serviços');
    const { count } = await servicosResponse.json();

    setUsuario(dadosUsuario);
    setTotalServicos(count);
  } catch (error) {
    console.error('Erro ao carregar dados do perfil:', error);
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu Perfil</Text>
      <Text style={styles.label}>Nome:</Text>
      <Text style={styles.value}>{usuario.nome || 'Carregando...'}</Text>

      <Text style={styles.label}>Email:</Text>
      <Text style={styles.value}>{usuario.email || 'Carregando...'}</Text>

      <Text style={styles.label}>Total de Serviços Publicados:</Text>
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
