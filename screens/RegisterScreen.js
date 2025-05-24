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
import { Picker } from '@react-native-picker/picker';

export default function RegisterScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [documento, setDocumento] = useState('');
  const [documentoTipo, setDocumentoTipo] = useState('cpf');
  const [tipoUsuario, setTipoUsuario] = useState(null);
  const [errors, setErrors] = useState({});

  const validateFields = () => {
    const newErrors = {};

    if (!nome.trim().includes(' ')) newErrors.nome = 'Informe nome e sobrenome.';
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Email inválido.';
    if (!telefone || telefone.replace(/\D/g, '').length < 10) newErrors.telefone = 'Telefone inválido.';
    if (!usuario.trim()) newErrors.usuario = 'Nome de usuário obrigatório.';
    if (senha.length < 6) newErrors.senha = 'A senha deve ter no mínimo 6 caracteres.';

    const docClean = documento.replace(/\D/g, '');

    if (!documento.trim()) {
      newErrors.documento = 'Documento obrigatório.';
    } else {
      if (documentoTipo === 'cpf' && docClean.length !== 11)
        newErrors.documento = 'CPF inválido.';
      if (documentoTipo === 'cnpj' && docClean.length !== 14)
        newErrors.documento = 'CNPJ inválido.';
    }

    if (!tipoUsuario) newErrors.tipoUsuario = 'Selecione o tipo de usuário.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateFields()) return;

    const payload = {
      nome,
      email,
      telefone,
      usuario,
      senha,
      tipo: tipoUsuario,
      cpf: documentoTipo === 'cpf' ? documento : null,
      cnpj: documentoTipo === 'cnpj' ? documento : null,
    };

    try {
      const response = await fetch('http://192.168.1.111:5000/api/usuarios/register', {
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
        <Text style={[styles.label, styles.labelLeft]}>Nome</Text>
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
        <Text style={[styles.label, styles.labelLeft]}>Email</Text>
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

        {/* Telefone */}
        <Text style={[styles.label, styles.labelLeft]}>Telefone</Text>
        <View style={styles.inputContainer}>
          <FontAwesome name="phone" size={20} color="#333" style={styles.icon} />
          <TextInputMask
            style={styles.input}
            type={'cel-phone'}
            options={{
              maskType: 'BRL',
              withDDD: true,
              dddMask: '(99) ',
            }}
            placeholder="(99) 99999-9999"
            placeholderTextColor="#333"
            keyboardType="phone-pad"
            value={telefone}
            onChangeText={setTelefone}
          />
        </View>
        {errors.telefone && <Text style={styles.errorText}>{errors.telefone}</Text>}

        {/* Usuário */}
        <Text style={[styles.label, styles.labelLeft]}>Usuário</Text>
        <View style={styles.inputContainer}>
          <FontAwesome name="user-circle" size={20} color="#333" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Usuário"
            placeholderTextColor="#333"
            value={usuario}
            onChangeText={setUsuario}
          />
        </View>
        {errors.usuario && <Text style={styles.errorText}>{errors.usuario}</Text>}

        {/* Senha */}
        <Text style={[styles.label, styles.labelLeft]}>Senha</Text>
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

        {/* Documento */}
        <View style={styles.centeredGroup}>
          <Text style={[styles.label, styles.labelCenter]}>Documento</Text>
          <View style={styles.radioOptionRow}>
            <TouchableOpacity onPress={() => setDocumentoTipo('cpf')} style={styles.radioRow}>
              <View style={[styles.radioCircle, documentoTipo === 'cpf' && styles.selected]} />
              <Text style={styles.radioLabel}>CPF</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setDocumentoTipo('cnpj')} style={styles.radioRow}>
              <View style={[styles.radioCircle, documentoTipo === 'cnpj' && styles.selected]} />
              <Text style={styles.radioLabel}>CNPJ</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <FontAwesome
            name={documentoTipo === 'cpf' ? 'id-card' : 'building'}
            size={20}
            color="#333"
            style={styles.icon}
          />
          <TextInputMask
            style={styles.input}
            type={documentoTipo}
            placeholder={documentoTipo === 'cpf' ? '000.000.000-00' : '00.000.000/0000-00'}
            placeholderTextColor="#333"
            keyboardType="numeric"
            value={documento}
            onChangeText={setDocumento}
          />
        </View>
        {errors.documento && <Text style={styles.errorText}>{errors.documento}</Text>}

        {/* Tipo de usuário */}
        <View style={styles.centeredGroup}>
          <Text style={[styles.label, { alignSelf: 'flex-start' }]}>Tipo de usuário</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={tipoUsuario}
              onValueChange={(itemValue) => setTipoUsuario(itemValue)}
              style={styles.picker}
              dropdownIconColor="#fff"
              mode="dropdown"
            >
              <Picker.Item label="Selecione o tipo de usuário" value={null} color="#999" />
              <Picker.Item label="Prestador de serviço" value="prestador" />
              <Picker.Item label="Cliente" value="cliente" />
            </Picker>
          </View>
          {errors.tipoUsuario && <Text style={styles.errorText}>{errors.tipoUsuario}</Text>}
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
    marginTop: 10,
  },
  labelLeft: {
    alignSelf: 'flex-start',
  },
  labelCenter: {
    alignSelf: 'center',
  },
  inputContainer: {
    backgroundColor: '#E9F8F9',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 10,
    marginTop: 8,
    alignSelf: 'center',
    width: '100%',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#000',
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
    marginTop: 20,
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
  pickerContainer: {
  backgroundColor: '#E9F8F9',
  borderRadius: 12,
  marginTop: 8,
  width: '100%',
  justifyContent: 'center',
},
picker: {
  color: '#333',
  height: 54,
  width: '100%',
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
    color: '#ff4444',
    marginTop: 3,
    marginBottom: 3,
    alignSelf: 'flex-start',
    fontWeight: '600',
  },
  centeredGroup: {
    marginTop: 0,
    alignItems: 'center',
  },
  radioOptionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
});
