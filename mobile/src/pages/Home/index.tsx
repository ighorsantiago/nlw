import React, {useState, useEffect} from 'react';
import {Feather as Icon} from '@expo/vector-icons'
import {View, ImageBackground, Image, Text, Picker} from 'react-native';
import {RectButton} from 'react-native-gesture-handler';
import RNPicker, {Item as PItem} from 'react-native-picker-select';
import {Dropdown} from 'react-native-material-dropdown';
import axios from 'axios';

import {useNavigation} from '@react-navigation/native';

import styles, { pickerSelectStyles } from './styles';

interface IBGEUF {
  sigla: string;
}

interface IBGECity {
  nome: string;
}

const Home = () => {

  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');

  const navigation = useNavigation();

  // UF
  useEffect(() => {
    axios
      .get<IBGEUF[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(response => {
        const ufInitials = response.data.map(uf => uf.sigla);
        setUfs(ufInitials);
      });
  }, []);

  // Cidade
  useEffect(() => {
    if(selectedUf === '0') return;
    
    axios
      .get<IBGECity[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then(response => {
        const cityNames = response.data.map(city => city.nome);
        setCities(cityNames);
      });
  }, [selectedUf]);

  function handleNavigateToPoints() {
    navigation.navigate('Points', {uf: selectedUf, city: selectedCity});
    setSelectedUf('0');
    setSelectedCity('0');
  }

  return (
    <ImageBackground
      source={require('../../assets/home-background.png')}
      style={styles.container}
      imageStyle={{width: 274, height: 368}}
    >
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')}/>
        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eiciente.</Text>
      </View>

      <View style={styles.footer}>
        <View>
          <RNPicker
            style={pickerSelectStyles}
            placeholder={{
              label: 'Selecione um estado',
              value: '0'
            }}
            value={selectedUf}
            onValueChange={setSelectedUf}
            items={ufs.map(uf => {
              return {
                label: uf,
                value: uf,
              }
            })}
          />
        </View>
        
        <View>
          <RNPicker
            style={pickerSelectStyles}
            placeholder={{
              label: 'Selecione uma cidade',
              value: '0'
            }}
            value={selectedCity}
            onValueChange={setSelectedCity}
            items={cities.map(city => {
              return {
                label: city,
                value: city,
              }
            })}
          />
        </View>

        <RectButton style={styles.button} onPress={handleNavigateToPoints}>
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name="arrow-right" color="#FFF" size={24} />
            </Text>
          </View>
          <Text style={styles.buttonText}>
            Entrar
          </Text>
        </RectButton>
      </View>
    </ImageBackground>
  )
}

export default Home;