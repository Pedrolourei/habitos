import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';  

const CreateJobScreen = ({ navigation }) => {
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [isPaid, setIsPaid] = useState(false); 
  const { initPaymentSheet, presentPaymentSheet } = useStripe(); 

  const handleCreateJob = async () => {

    if (!jobTitle || !jobDescription || !jobLocation || !jobType) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    if (!isPaid) {
      Alert.alert('Pagamento Pendente', 'A vaga precisa ser paga antes de ser publicada.');
      return;
    }

    try {
      const newJob = {
        title: jobTitle,
        description: jobDescription,
        location: jobLocation,
        type: jobType,
        status: 'Pendente',
        createdAt: new Date(),
      };
      
      await firebase.firestore().collection('jobs').add(newJob);
      Alert.alert('Sucesso', 'Vaga criada com sucesso! Aguardando pagamento para publicação.');
      navigation.goBack(); 
    } catch (error) {
      Alert.alert('Erro', 'Erro ao criar vaga. Tente novamente.');
      console.error(error);
    }
  };

  const handlePayment = async () => {
    try {
      const { error } = await initPaymentSheet({
        paymentIntentClientSecret: '',
      });

      if (error) {
        Alert.alert('Erro', 'Erro ao inicializar o pagamento');
        return;
      }

      const { error: paymentError } = await presentPaymentSheet();

      if (paymentError) {
        Alert.alert('Erro no Pagamento', paymentError.message);
      } else {
        Alert.alert('Sucesso', 'Pagamento realizado com sucesso!');
        setIsPaid(true);
      }
    } catch (error) {
      console.error('Erro ao processar pagamento', error);
      Alert.alert('Erro', 'Erro inesperado ao processar pagamento.');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Crie uma nova Vaga</Text>
      <TextInput
        placeholder="Título da vaga"
        value={jobTitle}
        onChangeText={setJobTitle}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Descrição da vaga"
        value={jobDescription}
        onChangeText={setJobDescription}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Localização"
        value={jobLocation}
        onChangeText={setJobLocation}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Tipo de contratação (ex: CLT, PJ, Estágio)"
        value={jobType}
        onChangeText={setJobType}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />

      {}
      <Button
        title="Realizar Pagamento"
        onPress={handlePayment}
        disabled={isPaid} 
      />

      {}
      <Button
        title="Criar Vaga"
        onPress={handleCreateJob}
        disabled={!isPaid} 
      />
    </View>
  );
};

export default CreateJobScreen;
