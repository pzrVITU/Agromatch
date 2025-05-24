import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  TextInput
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ClienteHome({ navigation }) {
  const [servicos, setServicos] = useState([]);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [erro, setErro] = useState('');
  const [buscaNome, setBuscaNome] = useState('');
  const [valorMin, setValorMin] = useState('');
  const [valorMax, setValorMax] = useState('');
  const [tabAtiva, setTabAtiva] = useState('disponiveis');

  useEffect(() => {
    carregarServicos();
    carregarSolicitacoes();
  }, []);

  const carregarServicos = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.error('Token não encontrado');
        return;
      }

      const response = await fetch('http://192.168.1.111:5000/api/servicos', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setServicos(data);
      } else {
        setErro(data.message || 'Erro ao carregar serviços.');
      }
    } catch (error) {
      setErro('Erro de conexão: ' + error.message);
    }
  };

  const carregarSolicitacoes = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.error('Token não encontrado');
        return;
      }

      const response = await fetch('http://192.168.1.111:5000/api/solicitacao/cliente', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setSolicitacoes(data);
      } else {
        setErro(data.message || 'Erro ao carregar solicitações.');
      }
    } catch (error) {
      setErro('Erro de conexão: ' + error.message);
    }
  };

  const formatarValor = (valor) => {
    if (!valor || valor.toLowerCase?.() === 'a combinar') {
      return 'A combinar';
    }
    const num = parseFloat(valor);
    if (isNaN(num)) return valor;
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const filtrarServicos = () => {
    return servicos.filter(servico => {
      const nomeMatch = servico.nome.toLowerCase().includes(buscaNome.toLowerCase());

      const valorNumerico = parseFloat(servico.valor);
      const min = parseFloat(valorMin);
      const max = parseFloat(valorMax);

      const valorMatch =
        (!valorMin || isNaN(min) || valorNumerico >= min) &&
        (!valorMax || isNaN(max) || valorNumerico <= max);

      return nomeMatch && valorMatch;
    });
  };

  const renderSolicitacoes = () => {
    if (solicitacoes.length === 0) {
      return <Text style={styles.textoVazio}>Você ainda não solicitou nenhum serviço.</Text>;
    }

    return solicitacoes.map((solicitacao, index) => {
      const servico = solicitacao.servicoId;
      if (!servico || !servico.nome) return null;

      return (
        <TouchableOpacity
          key={index}
          style={styles.cardWrapper}
          onPress={() => navigation.navigate('ServicoDetalhado', { servicoId: servico._id })}
        >
          <ImageBackground
            source={require('../assets/background.png')}
            style={styles.cardBackground}
            imageStyle={{ borderRadius: 12 }}
          >
            <View style={styles.overlay}>
              <View style={styles.cardHeader}>
                <Icon name="leaf-outline" size={18} color="#fff" />
                <Text style={styles.cardTitle}>{servico.nome}</Text>
                <View style={styles.valorContainer}>
                  <Text style={styles.valorText}>{formatarValor(servico.valor)}</Text>
                </View>
              </View>
              <View style={styles.cardDetails}>
                <Icon name="chatbox-ellipses-outline" size={14} color="#fff" />
                <Text style={styles.cardText}>{servico.descricao}</Text>
              </View>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      );
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {tabAtiva === 'disponiveis' ? 'Serviços Disponíveis' : 'Serviços Solicitados'}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('PerfilUsuario')}>
          <Icon name="person-circle-outline" size={32} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tabButton, tabAtiva === 'disponiveis' && styles.tabAtiva]}
          onPress={() => setTabAtiva('disponiveis')}
        >
          <Text style={[styles.tabTexto, tabAtiva === 'disponiveis' && styles.tabTextoAtivo]}>
            Disponíveis
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, tabAtiva === 'solicitados' && styles.tabAtiva]}
          onPress={() => setTabAtiva('solicitados')}
        >
          <Text style={[styles.tabTexto, tabAtiva === 'solicitados' && styles.tabTextoAtivo]}>
            Solicitados
          </Text>
        </TouchableOpacity>
      </View>

      {erro ? <Text style={styles.error}>{erro}</Text> : null}

      {tabAtiva === 'disponiveis' ? (
        <>
          <View style={styles.filtros}>
            <TextInput
              style={styles.input}
              placeholder="Buscar por nome"
              value={buscaNome}
              onChangeText={setBuscaNome}
            />
            <View style={styles.valorWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Valor mínimo"
                keyboardType="numeric"
                value={valorMin}
                onChangeText={setValorMin}
              />
              <TextInput
                style={styles.input}
                placeholder="Valor máximo"
                keyboardType="numeric"
                value={valorMax}
                onChangeText={setValorMax}
              />
            </View>
          </View>

          <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 20 }}>
            {filtrarServicos().map((servico, index) => (
              <TouchableOpacity
                key={index}
                style={styles.cardWrapper}
                onPress={() => navigation.navigate('ServicoDetalhado', { servicoId: servico._id })}
              >
                <ImageBackground
                  source={require('../assets/background.png')}
                  style={styles.cardBackground}
                  imageStyle={{ borderRadius: 12 }}
                >
                  <View style={styles.overlay}>
                    <View style={styles.cardHeader}>
                      <Icon name="leaf-outline" size={18} color="#fff" />
                      <Text style={styles.cardTitle}>{servico.nome}</Text>
                      <View style={styles.valorContainer}>
                        <Text style={styles.valorText}>{formatarValor(servico.valor)}</Text>
                      </View>
                    </View>
                    <View style={styles.cardDetails}>
                      <Icon name="chatbox-ellipses-outline" size={14} color="#fff" />
                      <Text style={styles.cardText}>{servico.descricao}</Text>
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      ) : (
        <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 20 }}>
          {renderSolicitacoes()}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2F2F2F',
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#D6E6E3',
    borderRadius: 10,
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 45,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-around',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  tabTextInactive: {
    color: '#666',
    fontWeight: '600',
    fontSize: 14,
  },
  tabTextActive: {
    color: '#899E3D',
    fontWeight: '700',
    fontSize: 14,
    borderBottomWidth: 2,
    borderColor: '#899E3D',
    paddingBottom: 4,
  },
  scrollView: {
    marginTop: 10,
  },
  cardWrapper: {
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
  },
  cardBackground: {
    height: 100,
    justifyContent: 'flex-end',
    width: '100%',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    flex: 1,
    justifyContent: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
    flex: 1,
  },
  valorContainer: {
    marginLeft: 10,
    backgroundColor: '#899E3D',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  valorText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  cardDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 6,
    flexShrink: 1,
  },
  formContainer: {
    marginTop: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  postButton: {
    backgroundColor: '#899E3D',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  postButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  erroTexto: {
    color: 'red',
    marginBottom: 10,
    marginLeft: 2,
  },

  // Modal styles
  modalFundo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalTitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalDescricao: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'justify',
  },
  modalValor: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
  },
  botaoFechar: {
    backgroundColor: '#899E3D',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  textoBotaoFechar: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  botaoModal: {
    marginTop: 10,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBotaoModal: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  botaoFecharModal: {
    marginTop: 15,
    backgroundColor: '#777',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBotaoFecharModal: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  containerBotoesModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10, // funciona no React Native 0.71+, senão use marginRight no primeiro botão
  },
  botaoModal: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBotaoModal: {
    color: '#fff',
    fontWeight: 'bold',
  },header: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 15,
},
title: {
  fontSize: 24,
  fontWeight: 'bold',
  color: '#2F2F2F',
  flex: 1,
},
filtros: {
  marginBottom: 15,
},
inputBusca: {
  backgroundColor: '#fff',
  borderRadius: 8,
  paddingHorizontal: 12,
  paddingVertical: 10,
  fontSize: 14,
  marginBottom: 10,
  borderWidth: 1,
  borderColor: '#ccc',
  width: '100%',
},
valorWrapper: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  gap: 10,
},
inputValor: {
  backgroundColor: '#fff',
  borderRadius: 8,
  paddingHorizontal: 12,
  paddingVertical: 10,
  fontSize: 14,
  borderWidth: 1,
  borderColor: '#ccc',
  flex: 1,
},
tabs: {
  flexDirection: 'row',
  marginBottom: 15,
  borderRadius: 10,
  overflow: 'hidden',
  borderWidth: 1,
  borderColor: '#7B9E3D',
},
tabButton: {
  flex: 1,
  paddingVertical: 10,
  backgroundColor: '#E6E6E6',
  alignItems: 'center',
},
tabAtiva: {
  backgroundColor: '#7B9E3D',
},
tabTexto: {
  fontSize: 16,
  fontWeight: '600',
  color: '#555',
},
tabTextoAtivo: {
  color: '#fff',
},

});
