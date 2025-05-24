import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Modal,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function PrestadorHome() {
  const navigation = useNavigation();
  const [abaAtiva, setAbaAtiva] = useState('listagem');
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [servicos, setServicos] = useState([]);
  const [servicosSolicitados, setServicosSolicitados] = useState([
    { nome: 'Aragem do Solo', cliente: 'Fazenda São Jorge', status: 'Pendente' },
    { nome: 'Plantio de Milho', cliente: 'Sítio Primavera', status: 'Aceito' },
  ]);

  const [carregando, setCarregando] = useState(false);
  const [erroTitulo, setErroTitulo] = useState('');
  const [erroDescricao, setErroDescricao] = useState('');
  const [modalVisivel, setModalVisivel] = useState(false);
  const [servicoSelecionado, setServicoSelecionado] = useState(null);

  useEffect(() => {
    carregarServicosPrestador();
  }, []);

  const handleAtualizarServico = async () => {
    if (!servicoSelecionado) return;

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.error('Token de autenticação não encontrado');
        return;
      }

      const response = await fetch(`http://192.168.1.111:5000/api/servicos/${servicoSelecionado._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: servicoSelecionado.nome,
          descricao: servicoSelecionado.descricao,
          valor: servicoSelecionado.valor,
        }),
      });

      if (response.ok) {
        console.log('Serviço atualizado com sucesso');
        carregarServicosPrestador();
        setModalVisivel(false);
      } else {
        const data = await response.json();
        console.error('Erro ao atualizar serviço:', data);
      }
    } catch (error) {
      console.error('Erro na atualização:', error);
    }
  };

  const handleDeletarServico = async () => {
    if (!servicoSelecionado) return;

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.error('Token de autenticação não encontrado');
        return;
      }

      const response = await fetch(`http://192.168.1.111:5000/api/servicos/${servicoSelecionado._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log('Serviço deletado com sucesso');
        carregarServicosPrestador();
        setModalVisivel(false);
      } else {
        const data = await response.json();
        console.error('Erro ao deletar serviço:', data);
      }
    } catch (error) {
      console.error('Erro na exclusão:', error);
    }
  };

  const carregarServicosPrestador = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('userToken');

      if (!userId || !token) {
        console.error('ID do usuário ou token não encontrado');
        return;
      }

      const response = await fetch(`http://192.168.1.111:5000/api/servicos?prestadorId=${userId}`, {
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
        console.error('Erro ao carregar serviços:', data);
      }
    } catch (error) {
      console.error('Erro na conexão:', error);
    }
  };

  const handlePostarServico = async () => {
    setErroTitulo('');
    setErroDescricao('');

    if (!titulo.trim()) {
      setErroTitulo('Título é obrigatório.');
    }
    if (!descricao.trim()) {
      setErroDescricao('Descrição é obrigatória.');
    }
    if (!titulo.trim() || !descricao.trim()) {
      return;
    }

    setCarregando(true);

    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        console.error('ID do usuário não encontrado');
        setCarregando(false);
        return;
      }

      const response = await fetch('http://192.168.1.111:5000/api/servicos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: titulo,
          descricao,
          valor: valor || 'A combinar',
          prestadorId: userId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Serviço cadastrado com sucesso:', data);
        setTitulo('');
        setDescricao('');
        setValor('');
        carregarServicosPrestador();
      } else {
        console.error('Erro ao cadastrar serviço:', data);
      }
    } catch (error) {
      console.error('Erro de conexão:', error);
    } finally {
      setCarregando(false);
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

  const abreModalServico = (servico) => {
    setServicoSelecionado(servico);
    setModalVisivel(true);
  };

  const descricaoResumo = (texto, limite = 60) => {
    if (!texto) return '';
    if (texto.length <= limite) return texto;
    return texto.substring(0, limite).trim() + '...';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Serviços</Text>
        <TouchableOpacity onPress={() => navigation.navigate('PerfilUsuario')}>
          <Icon name="person-circle-outline" size={32} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#6B7B7B" style={{ marginLeft: 10 }} />
        <TextInput
          placeholder="Busque serviços especializados"
          placeholderTextColor="#6B7B7B"
          style={styles.searchInput}
        />
      </View>

      <View style={styles.tabsContainer}>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tabButton, abaAtiva === 'listagem' && styles.tabAtiva]}
            onPress={() => setAbaAtiva('listagem')}
          >
            <Text numberOfLines={1} adjustsFontSizeToFit style={styles.tabTexto}>
              Listados
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, abaAtiva === 'cadastro' && styles.tabAtiva]}
            onPress={() => setAbaAtiva('cadastro')}
          >
            <Text numberOfLines={1} adjustsFontSizeToFit style={styles.tabTexto}>
              Cadastrados
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, abaAtiva === 'solicitados' && styles.tabAtiva]}
            onPress={() => navigation.navigate('SolicitadosPrestador')}
          >
            <Text numberOfLines={1} adjustsFontSizeToFit style={styles.tabTexto}>
              Solicitações
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {abaAtiva === 'listagem' ? (
        <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 20 }}>
          {servicos.map((servico, index) => (
            <TouchableOpacity
              key={index}
              style={styles.cardWrapper}
              activeOpacity={0.8}
              onPress={() => abreModalServico(servico)}
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
                    <Text style={styles.cardText}>{descricaoResumo(servico.descricao)}</Text>
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : abaAtiva === 'cadastro' ? (
        <View style={styles.formContainer}>
          <TextInput
            placeholder="Título do serviço"
            placeholderTextColor="#666"
            style={styles.input}
            value={titulo}
            onChangeText={text => {
              setTitulo(text);
              if (erroTitulo) setErroTitulo('');
            }}
          />
          {!!erroTitulo && <Text style={styles.erroTexto}>{erroTitulo}</Text>}

          <TextInput
            placeholder="Descrição do serviço"
            placeholderTextColor="#666"
            style={[styles.input, { height: 100 }]}
            multiline
            value={descricao}
            onChangeText={text => {
              setDescricao(text);
              if (erroDescricao) setErroDescricao('');
            }}
          />
          {!!erroDescricao && <Text style={styles.erroTexto}>{erroDescricao}</Text>}

          <TextInput
            placeholder="Valor (opcional)"
            placeholderTextColor="#666"
            style={styles.input}
            value={valor}
            onChangeText={setValor}
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={[styles.postButton, carregando && { opacity: 0.7 }]}
            onPress={handlePostarServico}
            disabled={carregando}
          >
            <Text style={styles.postButtonText}>
              {carregando ? 'Cadastrando...' : 'Postar Serviço'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 20 }}>
          {servicosSolicitados.map((solicitado, index) => (
            <View key={index} style={styles.cardWrapper}>
              <ImageBackground
                source={require('../assets/background.png')}
                style={styles.cardBackground}
                imageStyle={{ borderRadius: 12 }}
              >
                <View style={styles.overlay}>
                  <View style={styles.cardHeader}>
                    <Icon name="briefcase-outline" size={18} color="#fff" />
                    <Text style={styles.cardTitle}>{solicitado.nome}</Text>
                  </View>
                  <View style={styles.cardDetails}>
                    <Icon name="person-outline" size={14} color="#fff" />
                    <Text style={styles.cardText}>Cliente: {solicitado.cliente}</Text>
                  </View>
                  <View style={styles.cardDetails}>
                    <Icon name="information-circle-outline" size={14} color="#fff" />
                    <Text style={styles.cardText}>Status: {solicitado.status}</Text>
                  </View>
                </View>
              </ImageBackground>
            </View>
          ))}
        </ScrollView>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisivel}
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.modalFundo}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitulo}>{servicoSelecionado?.nome}</Text>
            <Text style={styles.modalDescricao}>{servicoSelecionado?.descricao}</Text>
            <Text style={styles.modalValor}>Valor: {formatarValor(servicoSelecionado?.valor)}</Text>

            <View style={styles.containerBotoesModal}>
              <TouchableOpacity
                style={[styles.botaoModal, { backgroundColor: '#6DBF97' }]}
                onPress={handleAtualizarServico}
              >
                <Text style={styles.textoBotaoModal}>Atualizar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.botaoModal, { backgroundColor: '#E57373' }]}
                onPress={handleDeletarServico}
              >
                <Text style={styles.textoBotaoModal}>Excluir</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.botaoFecharModal}
              onPress={() => setModalVisivel(false)}
            >
              <Text style={styles.textoBotaoFecharModal}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  header: {
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
    paddingVertical: 10,  // Reduzido de 10
    paddingHorizontal: 4,  // Reduzido de 10
    backgroundColor: '#E6E6E6',
    alignItems: 'center',
    minWidth: 0,  // Importante para evitar corte
    maxWidth: '95%',
  },
  tabTexto: {
    fontSize: 15,  // Reduzido de 14/16
    fontWeight: '600',
    color: '#555',
    includeFontPadding: false,  // Remove espaçamento extra da fonte
    textAlign: 'center',
  },
  tabAtiva: {
    backgroundColor: '#7B9E3D',
  },
  tabTextoAtivo: {
    color: '#fff',
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
  containerBotoesModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
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
});