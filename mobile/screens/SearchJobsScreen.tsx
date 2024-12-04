// mobile/screens/SearchJobsScreen.tsx
import React, { useState } from 'react';
import { View, Text, Button, Picker } from 'react-native';

const SearchJobsScreen = () => {
  const [jobType, setJobType] = useState('CLT');
  const [location, setLocation] = useState('São Paulo');
  const [salaryRange, setSalaryRange] = useState('2000-4000');

  const handleSearch = () => {
    // Realizar a busca de vagas filtradas no Firestore com base nos filtros selecionados
    firebase.firestore().collection('jobs').where('type', '==', jobType).get()
      .then(snapshot => {
        snapshot.docs.forEach(doc => {
          console.log(doc.data());
        });
      });
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Buscar Vagas</Text>
      <Text>Tipo de Contratação</Text>
      <Picker selectedValue={jobType} onValueChange={setJobType}>
        <Picker.Item label="CLT" value="CLT" />
        <Picker.Item label="PJ" value="PJ" />
        <Picker.Item label="Estágio" value="Estágio" />
      </Picker>

      <Text>Localização</Text>
      <Picker selectedValue={location} onValueChange={setLocation}>
        <Picker.Item label="São Paulo" value="São Paulo" />
        <Picker.Item label="Rio de Janeiro" value="Rio de Janeiro" />
      </Picker>

      <Text>Faixa Salarial</Text>
      <Picker selectedValue={salaryRange} onValueChange={setSalaryRange}>
        <Picker.Item label="2000-4000" value="2000-4000" />
        <Picker.Item label="4000-6000" value="4000-6000" />
      </Picker>

      <Button title="Buscar Vagas" onPress={handleSearch} />
    </View>
  );
};

export default SearchJobsScreen;
