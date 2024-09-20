import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { db } from '../firebaseConfig';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import ModalNovaLocacao from '../Modal/ModalNovaLocacao';
import ModalListaLocacoes from '../Modal/ModalListaLocacoes';

const CalendarScreen = ({ route }) => {
  const { casaId, casaNome } = route.params;
  const [selectedDates, setSelectedDates] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleLista, setModalVisibleLista] = useState(false);

  const fetchLocacoes = useCallback(
    async () => {
      try {
        const locacoesQuery = query(collection(db, 'rentals'), where('casa', '==', casaId));
        const querySnapshot = await getDocs(locacoesQuery);

        const dates = {};
        querySnapshot.docs.forEach(doc => {
          const { startDate, endDate } = doc.data();
          const start = new Date(startDate);
          const end = new Date(endDate);

          let currentDate = start;
          while (currentDate <= end) {
            const formattedDate = currentDate.toISOString().split('T')[0];
            dates[formattedDate] = {
              selected: true,
              customStyles: {
                container: { backgroundColor: '#D3D3D3', borderRadius: 0 },
                text: { color: 'black', textDecorationLine: 'line-through', fontWeight: 'bold' },
              },
            };
            currentDate.setDate(currentDate.getDate() + 1);
          }
        });

        setSelectedDates(dates);
      } catch (error) {
        console.error('Erro ao buscar locações:', error);
      }
    },
    [casaId]
  );

  useEffect(() => {
    fetchLocacoes();
  }, [fetchLocacoes]);

  const handleDayPress = (date) => {
    // Lógica para selecionar datas
  };

  const handleSaveLocacao = () => {
    fetchLocacoes(); // Atualiza o calendário após salvar
  };

  return (
    <View style={styles.container}>
      <Calendar
        style={styles.calendar}
        theme={{ textDayFontSize: 18, textMonthFontSize: 20, textDayHeaderFontSize: 16 }}
        markedDates={selectedDates}
        markingType="custom"
        onDayPress={handleDayPress}
        monthFormat="MM yyyy"
      />

      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Adicionar Nova Locação</Text>
      </TouchableOpacity>

      <Modal animationType="slide" transparent visible={modalVisible}>
        <ModalNovaLocacao casa={casaId} handleClose={() => setModalVisible(false)} onSave={handleSaveLocacao} />
      </Modal>

      <TouchableOpacity style={styles.button} onPress={() => setModalVisibleLista(true)}>
        <Text style={styles.buttonText}>Lista de Locações</Text>
      </TouchableOpacity>

      <Modal animationType="slide" transparent visible={modalVisibleLista}>
        <ModalListaLocacoes casa={casaId} handleClose={() => setModalVisibleLista(false)} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-start', alignItems: 'center', padding: 10 },
  calendar: { width: 380, height: 350, marginBottom: 20 },
  button: { alignItems: 'center', backgroundColor: '#00A8FF', padding: 15, borderRadius: 5, marginTop: 10, width: 300 },
  buttonText: { fontSize: 23, fontWeight: 'bold' },
});

export default CalendarScreen;

/*
  Resumo do funcionamento do código:
  
  1. Função `fetchLocacoes`:
     - Busca todas as locações para a casa específica no Firestore.
     - Atualiza o estado `selectedDates` com as datas bloqueadas.
  
  2. Uso de `useCallback`:
     - Memoriza a função `fetchLocacoes` para evitar recriações desnecessárias.
     - A função é recriada apenas quando `casaId` muda.
  
  3. Atualização do Calendário:
     - Após salvar uma nova locação, `handleSaveLocacao` chama `fetchLocacoes` para atualizar o calendário com as novas datas bloqueadas.
  
  4. Passagem de `onSave` para o Modal:
     - A função `handleSaveLocacao` é passada para o `ModalNovaLocacao` como prop `onSave`.
     - Após salvar a locação, `onSave` é chamado para acionar a atualização do calendário.
*/