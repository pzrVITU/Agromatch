import { Image } from 'react-native';
import logoFolha from '../assets/logo-folha.png';
import iconeTrigo from '../assets/icone-trigo.png';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { TextInputMask } from 'react-native-masked-text';

export default function RegisterScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [documento, setDocumento] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState(null);
  const [errors, setErrors] = useState({});

  const validateFields = () => {
    const newErrors = {};

    if (!nome.trim().includes(' ')) newErrors.nome = 'Informe nome e sobrenome.';
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Email inválido.';
    if (!usuario.trim()) newErrors.usuario = 'Nome de usuário obrigatório.';
    if (senha.length < 6) newErrors.senha = 'A senha deve ter no mínimo 6 caracteres.';

    if (tipoUsuario === 'cliente') {
      const cpfClean = documento.replace(/\D/g, '');
      if (cpfClean.length !== 11) newErrors.documento = 'CPF inválido.';
    }

    if (tipoUsuario === 'prestador') {
      const cnpjClean = documento.replace(/\D/g, '');
      if (cnpjClean.length !== 14) newErrors.documento = 'CNPJ inválido.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateFields()) return;

    const payload = {
      nome,
      email,
      usuario,
      senha,
      tipo: tipoUsuario,
      cpf: tipoUsuario === 'cliente' ? documento : null,
      cnpj: tipoUsuario === 'prestador' ? documento : null,
    };

    try {
      const response = await fetch('http://192.168.1.111:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Usuário registrado com sucesso!');
        navigation.goBack();
      } else {
        alert(data.message || 'Erro ao registrar');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.logoContainer}>
          <Image source={logoFolha} style={styles.logoIcon} />
        </View>

        <View style={styles.titleRow}>
          <Text style={styles.title}>Olá!</Text>
          <Image source={iconeTrigo} style={styles.trigoIcon} />
        </View>
        <Text style={styles.subtitle}>Vamos criar seu cadastro.</Text>

        {/* Nome */}
        <Text style={styles.label}>Nome</Text>
        <View style={styles.inputContainer}>
          <FontAwesome name="user" size={20} color="#333" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Seu nome completo"
            placeholderTextColor="#333"
            value={nome}
            onChangeText={setNome}
          />
        </View>
        {errors.nome && <Text style={styles.errorText}>{errors.nome}</Text>}

        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <View style={styles.inputContainer}>
          <FontAwesome name="at" size={20} color="#333" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="email@gmail.com"
            placeholderTextColor="#333"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        {/* Usuário */}
        <Text style={styles.label}>Usuário</Text>
        <View style={styles.inputContainer}>
          <FontAwesome name="user-circle" size={20} color="#333" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Usuario"
            placeholderTextColor="#333"
            value={usuario}
            onChangeText={setUsuario}
          />
        </View>
        {errors.usuario && <Text style={styles.errorText}>{errors.usuario}</Text>}

        {/* Senha */}
        <Text style={styles.label}>Senha</Text>
        <View style={styles.inputContainer}>
          <FontAwesome name="lock" size={20} color="#333" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="********"
            placeholderTextColor="#333"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />
        </View>
        {errors.senha && <Text style={styles.errorText}>{errors.senha}</Text>}

        {/* CPF ou CNPJ */}
        {tipoUsuario && (
          <>
            <Text style={styles.label}>{tipoUsuario === 'cliente' ? 'CPF' : 'CNPJ'}</Text>
            <View style={styles.inputContainer}>
              <FontAwesome
                name={tipoUsuario === 'cliente' ? 'id-card' : 'building'}
                size={20}
                color="#333"
                style={styles.icon}
              />
              <TextInputMask
                style={styles.input}
                type={tipoUsuario === 'cliente' ? 'cpf' : 'cnpj'}
                placeholder={tipoUsuario === 'cliente' ? '000.000.000-00' : '00.000.000/0000-00'}
                placeholderTextColor="#333"
                keyboardType="numeric"
                value={documento}
                onChangeText={setDocumento}
              />
            </View>
            {errors.documento && <Text style={styles.errorText}>{errors.documento}</Text>}
          </>
        )}

        {/* Tipo de usuário */}
        <View style={styles.radioGroup}>
          <TouchableOpacity style={styles.radioOption} onPress={() => setTipoUsuario('prestador')}>
            <View style={[styles.radioCircle, tipoUsuario === 'prestador' && styles.selected]} />
            <Text style={styles.radioLabel}>Prestador de serviço</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.radioOption} onPress={() => setTipoUsuario('cliente')}>
            <View style={[styles.radioCircle, tipoUsuario === 'cliente' && styles.selected]} />
            <Text style={styles.radioLabel}>Cliente</Text>
          </TouchableOpacity>
        </View>

        {/* Botões */}
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.voltarText}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#899E3A',
  },
  scroll: {
    padding: 30,
  },
  title: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 26,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginTop: 15,
  },
  inputContainer: {
    backgroundColor: '#E9F8F9',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 10,
    marginTop: 8,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#000',
  },
  radioGroup: {
    marginTop: 30,
    marginBottom: 20,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
    marginRight: 10,
  },
  selected: {
    backgroundColor: '#fff',
  },
  radioLabel: {
    color: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#899E3A',
    fontSize: 18,
    fontWeight: 'bold',
  },
  voltarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  logoIcon: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trigoIcon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginLeft: 10,
    tintColor: '#FFFFFF',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 4,
    marginLeft: 5,
  },
});
