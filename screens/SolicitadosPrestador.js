import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SolicitadosPrestador() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    buscarSolicitacoes();
  }, []);

  const buscarSolicitacoes = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch('http://192.168.1.111:5000/api/solicitacao/prestador', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setSolicitacoes(data);
        setErro('');
      } else {
        setErro(data.message || 'Erro ao carregar solicitações');
      }
    } catch (err) {
      setErro('Erro de conexão: ' + err.message);
    } finally {
      setCarregando(false);
    }
  };

  const atualizarStatus = async (idSolicitacao, novoStatus) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`http://192.168.1.111:5000/api/solicitacao/${idSolicitacao}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: novoStatus }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Sucesso', 'Status atualizado com sucesso!');
        buscarSolicitacoes(); // Atualiza a lista após mudança
      } else {
        Alert.alert('Erro', data.message || 'Erro ao atualizar status');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro de conexão: ' + error.message);
    }
  };

  if (carregando)
    return <ActivityIndicator size="large" color="#28a745" style={{ marginTop: 20 }} />;

  if (erro)
    return (
      <Text style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>{erro}</Text>
    );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={solicitacoes}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.titulo}>{item.servicoId?.nome}</Text>
            <Text>Cliente: {item.clienteId?.nome}</Text>
            <Text>Status: {item.status || 'pendente'}</Text>

            {/* Botão Aceitar aparece só se status for pendente (ou diferente de aceito e finalizado) */}
            {item.status !== 'aceito' && item.status !== 'finalizado' && (
              <Button title="Aceitar" onPress={() => atualizarStatus(item._id, 'aceito')} />
            )}

            {/* Botão Finalizar aparece somente se status for aceito */}
            {item.status === 'aceito' && (
              <View style={{ marginTop: 5 }}>
                <Button title="Finalizar" onPress={() => atualizarStatus(item._id, 'finalizado')} />
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={<Text>Nenhuma solicitação encontrada.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#e6f2ea',
  },
  titulo: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
});
