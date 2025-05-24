import React, { useEffect, useState } from 'react'; 
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  StatusBar,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ServicoDetalhado({ route, navigation }) {
  const { servicoId } = route.params;
  const [servico, setServico] = useState(null);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    buscarDetalhesDoServico();
  }, []);

  const buscarDetalhesDoServico = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`http://192.168.1.111:5000/api/servicos/${servicoId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setServico(data);
      } else {
        setErro(data.message || 'Erro ao buscar serviço');
      }
    } catch (err) {
      setErro('Erro de conexão: ' + err.message);
    } finally {
      setCarregando(false);
    }
  };

  const contratarServico = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');

      const response = await fetch('http://192.168.1.111:5000/api/solicitacao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ servicoId }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Sucesso', 'Serviço contratado com sucesso!');
        navigation.goBack();
      } else {
        Alert.alert('Erro', data.message || 'Erro ao contratar serviço.');
      }
    } catch (err) {
      Alert.alert('Erro de conexão', err.message);
    }
  };

  const abrirWhatsApp = () => {
    if (!servico || !servico.prestadorId || !servico.prestadorId.telefone) {
      Alert.alert('Erro', 'Telefone do prestador não disponível');
      return;
    }

    // Limpa o telefone, deixa só números para o link funcionar corretamente
    const telefoneLimpo = servico.prestadorId.telefone.replace(/\D/g, '');

    // Link para abrir o WhatsApp
    const url = `whatsapp://send?phone=55${telefoneLimpo}`;

    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          Alert.alert('Erro', 'WhatsApp não está instalado no dispositivo');
        } else {
          return Linking.openURL(url);
        }
      })
      .catch(err => Alert.alert('Erro', 'Erro ao tentar abrir o WhatsApp'));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Detalhes do Serviço</Text>
        <TouchableOpacity onPress={() => navigation.navigate('PerfilUsuario')}>
          <Icon name="person-circle-outline" size={30} color="#444" />
        </TouchableOpacity>
      </View>

      {carregando ? (
        <ActivityIndicator size="large" color="#28a745" />
      ) : erro ? (
        <Text style={styles.erro}>{erro}</Text>
      ) : servico ? (
        <>
          <Text style={styles.label}>Nome:</Text>
          <Text style={styles.text}>{servico.nome}</Text>

          <Text style={styles.label}>Descrição:</Text>
          <Text style={styles.text}>{servico.descricao}</Text>

          <Text style={styles.label}>Valor:</Text>
          <Text style={styles.text}>
            {servico.valor === 'A combinar'
              ? 'A combinar'
              : parseFloat(servico.valor).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
          </Text>

          {servico.prestadorId && (
            <>
              <Text style={styles.label}>Prestador:</Text>
              <Text style={styles.text}>{servico.prestadorId.nome}</Text>

              <Text style={styles.label}>Telefone:</Text>
              <Text style={styles.text}>{servico.prestadorId.telefone}</Text>

              <TouchableOpacity style={styles.whatsappButton} onPress={abrirWhatsApp}>
                <Text style={styles.buttonText}>Contato via WhatsApp</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity style={styles.button} onPress={contratarServico}>
            <Text style={styles.buttonText}>Contratar Serviço</Text>
          </TouchableOpacity>
        </>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    color: '#28a745',
  },
  text: {
    fontSize: 16,
    color: '#555',
    marginTop: 6,
    lineHeight: 22,
  },
  button: {
    marginTop: 40,
    backgroundColor: '#28a745',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#28a745',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  whatsappButton: {
    marginTop: 20,
    backgroundColor: '#25D366',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  erro: {
    color: '#e74c3c',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
});