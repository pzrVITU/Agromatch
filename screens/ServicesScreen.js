import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const mockServices = [
  { id: '1', nome: 'Plantio de Soja', descricao: 'Serviço completo de plantio e preparo do solo.' },
  { id: '2', nome: 'Colheita de Milho', descricao: 'Equipamentos e equipe especializada.' },
  { id: '3', nome: 'Consultoria Agronômica', descricao: 'Profissionais qualificados para sua lavoura.' },
];

export default function ServicesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Serviços Disponíveis</Text>
      <FlatList
        data={mockServices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>{item.nome}</Text>
            <Text style={styles.cardDescription}>{item.descricao}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f1f1f1',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#446d1b',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  cardDescription: {
    marginTop: 8,
    color: '#555',
  },
});
