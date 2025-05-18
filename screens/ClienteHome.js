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
  const [solicitacoes, setSolicitacoes] = useState([]); // Novos serviços solicitados
  const [erro, setErro] = useState('');
  const [buscaNome, setBuscaNome] = useState('');
  const [valorMin, setValorMin] = useState('');
  const [valorMax, setValorMax] = useState('');
  const [tabAtiva, setTabAtiva] = useState('disponiveis'); // 'disponiveis' ou 'solicitados'

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
    if (!valor || valor.toLowerCase() === 'a combinar') {
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

  // Renderiza serviços solicitados
  const renderSolicitacoes = () => {
    if (solicitacoes.length === 0) {
      return <Text style={styles.textoVazio}>Você ainda não solicitou nenhum serviço.</Text>;
    }

    return solicitacoes.map((solicitacao, index) => {
      const servico = solicitacao.servicoId;
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
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {tabAtiva === 'disponiveis' ? 'Serviços Disponíveis' : 'Serviços Solicitados'}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('PerfilUsuario')}>
          <Icon name="person-circle-outline" size={32} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
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

      {/* Conteúdo da aba */}
      {erro ? <Text style={styles.error}>{erro}</Text> : null}

      {tabAtiva === 'disponiveis' ? (
        <>
          {/* Filtros */}
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

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
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
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {renderSolicitacoes()}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  filtros: {
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  valorWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  scrollView: {
    flex: 1,
  },
  cardWrapper: {
    marginBottom: 16,
  },
  cardBackground: {
    width: '100%',
    height: 150,
    justifyContent: 'flex-end',
  },
  overlay: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 18,
    color: '#fff',
flex: 1,
marginLeft: 8,
fontWeight: 'bold',
},
valorContainer: {
backgroundColor: '#25A59A',
paddingHorizontal: 10,
paddingVertical: 4,
borderRadius: 8,
},
valorText: {
color: '#fff',
fontWeight: 'bold',
},
cardDetails: {
flexDirection: 'row',
alignItems: 'center',
marginTop: 8,
},
cardText: {
color: '#fff',
marginLeft: 6,
flex: 1,
},
error: {
color: 'red',
marginBottom: 10,
},
tabs: {
flexDirection: 'row',
marginBottom: 12,
borderBottomWidth: 1,
borderBottomColor: '#ddd',
},
tabButton: {
flex: 1,
paddingVertical: 8,
alignItems: 'center',
borderBottomWidth: 3,
borderBottomColor: 'transparent',
},
tabAtiva: {
borderBottomColor: '#25A59A',
},
tabTexto: {
color: '#777',
fontWeight: '600',
},
tabTextoAtivo: {
color: '#25A59A',
fontWeight: 'bold',
},
container: {
  flex: 1,
  paddingHorizontal: 16,
  paddingTop: 40, // antes era 20, aumente conforme necessário
  backgroundColor: '#f9f9f9',
},
textoVazio: {
textAlign: 'center',
color: '#666',
marginTop: 20,
fontSize: 16,
},
});
