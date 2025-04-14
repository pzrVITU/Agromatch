import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');

    if (!email || !senha) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      const response = await fetch('http://192.168.1.111:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (response.ok && data.user) {
        const { tipo } = data.user;

        if (tipo === 'cliente') {
          navigation.navigate('ClienteHome');
        } else if (tipo === 'prestador') {
          navigation.navigate('PrestadorHome');
        } else {
          setError('Tipo de usuário não reconhecido.');
        }
      } else {
        setError(data.message || 'Email ou senha incorretos.');
      }
    } catch (error) {
      console.error(error);
      setError('Erro ao conectar com o servidor.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo-folha.png')} style={styles.logo} />
      <Image source={require('../assets/plant-icon.png')} style={styles.icon} />

      <Text style={styles.title}>Faça o login</Text>

      <Text style={styles.label}>Email</Text>
      <View style={styles.inputContainer}>
        <Icon name="mail-outline" size={20} color="#444" style={styles.iconInput} />
        <TextInput
          style={styles.input}
          placeholder="email@gmail.com"
          placeholderTextColor="#333"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <Text style={styles.label}>Senha</Text>
      <View style={styles.inputContainer}>
        <Icon name="lock-closed-outline" size={20} color="#444" style={styles.iconInput} />
        <TextInput
          style={styles.input}
          placeholder="***********"
          placeholderTextColor="#333"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />
      </View>

      {error !== '' && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#899E3D',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 60,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 25,
  },
  label: {
    color: '#fff',
    alignSelf: 'flex-start',
    marginLeft: 5,
    marginTop: 15,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DDEAEA',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 5,
    height: 50,
    width: '100%',
  },
  iconInput: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#000',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    alignSelf: 'flex-start',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: '#7B8F2A',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backText: {
    marginTop: 20,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});