import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Alert } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, getDocs, query, where, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
//import { DatePickerModal } from 'react-native-paper-dates';
//import '../traudotorCalendar/translation';
import moment from 'moment';

const ModalListaLocacoes = ({ casa, handleClose }) => {
  const [locacoes, setLocacoes] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [isDateRangePickerVisible, setIsDateRangePickerVisible] = useState(false);
  const [formState, setFormState] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const locacoesQuery = query(collection(db, 'rentals'), where('casa', '==', casa));
        const querySnapshot = await getDocs(locacoesQuery);

        setLocacoes(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Erro ao buscar locações:', error);
      }
    })();
  }, [casa]);

  const handleEdit = async (id, updatedData) => {
    try {
      await updateDoc(doc(db, 'rentals', id), updatedData);
      Alert.alert('Sucesso', 'Locação atualizada com sucesso!');
      setLocacoes(locacoes.map(loc => (loc.id === id ? { ...loc, ...updatedData } : loc)));
      setEditMode(null);
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao atualizar a locação.');
      console.error('Erro ao atualizar locação:', error);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Você tem certeza que deseja excluir esta locação?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'rentals', id));
              Alert.alert('Sucesso', 'Locação excluída com sucesso!');
              setLocacoes(locacoes.filter(loc => loc.id !== id));
            } catch (error) {
              Alert.alert('Erro', 'Ocorreu um erro ao excluir a locação.');
              console.error('Erro ao excluir locação:', error);
            }
          },
        },
      ]
    );
  };

  const handleDateRangeChange = (range) => {
    if (range) {
      const { startDate, endDate } = range;
      setFormState({
        ...formState,
        startDate: moment(startDate).format('YYYY-MM-DD'),
        endDate: moment(endDate).format('YYYY-MM-DD'),
      });
    }
    setIsDateRangePickerVisible(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      {editMode === item.id ? (
        <>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { paddingRight: 40 }]}
              value={item.clientName}
              placeholder="Nome do Cliente"
              onChangeText={(text) => setLocacoes(locacoes.map(loc => (loc.id === item.id ? { ...loc, clientName: text } : loc)))}
            />
            <Icon name="pencil" size={20} color="#000" style={styles.icon} />
          </View>

          <TouchableOpacity
            style={styles.dateInputContainer}
            onPress={() => setIsDateRangePickerVisible(true)}
          >
            <Text style={styles.dateInput}>
              {`${formState.startDate || moment(item.startDate).format('YYYY-MM-DD')} - ${formState.endDate || moment(item.endDate).format('YYYY-MM-DD')}`}
            </Text>
            <Icon name="calendar" size={20} color="#000" style={styles.icon} />
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { paddingRight: 40 }]}
              value={item.advancePayment}
              placeholder="Pagamento Antecipado"
              keyboardType="numeric"
              onChangeText={(text) => setLocacoes(locacoes.map(loc => (loc.id === item.id ? { ...loc, advancePayment: text } : loc)))}
            />
            <Icon name="pencil" size={20} color="#000" style={styles.icon} />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { paddingRight: 40 }]}
              value={item.cleaningFee}
              placeholder="Taxa de Limpeza"
              keyboardType="numeric"
              onChangeText={(text) => setLocacoes(locacoes.map(loc => (loc.id === item.id ? { ...loc, cleaningFee: text } : loc)))}
            />
            <Icon name="pencil" size={20} color="#000" style={styles.icon} />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { paddingRight: 40 }]}
              value={item.totalAmount}
              placeholder="Valor Total"
              keyboardType="numeric"
              onChangeText={(text) => setLocacoes(locacoes.map(loc => (loc.id === item.id ? { ...loc, totalAmount: text } : loc)))}
            />
            <Icon name="pencil" size={20} color="#000" style={styles.icon} />
          </View>

          <View style={styles.actionsContainer}>
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  'Confirmar Edição',
                  'Você deseja salvar as alterações?',
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                      text: 'Salvar',
                      onPress: () => handleEdit(item.id, {
                        clientName: item.clientName,
                        startDate: formState.startDate || item.startDate,
                        endDate: formState.endDate || item.endDate,
                        advancePayment: item.advancePayment,
                        cleaningFee: item.cleaningFee,
                        totalAmount: item.totalAmount,
                      }),
                    },
                  ]
                );
              }}
              style={styles.actionButton}
            >
              <Icon name="save" size={25} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setEditMode(null)}
              style={styles.actionButton}
            >
              <Icon name="times" size={25} color="#000" />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <Text style={styles.itemText}>
            {`${moment(item.startDate).format('DD/MM/YYYY')} a ${moment(item.endDate).format('DD/MM/YYYY')} - ${item.clientName} - R$${item.advancePayment} - R$${item.cleaningFee} - R$${item.totalAmount}`}
          </Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              onPress={() => setEditMode(item.id)}
              style={styles.actionButton}
            >
              <Icon name="pencil" size={25} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDelete(item.id)}
              style={styles.actionButton}
            >
              <Icon name="trash" size={25} color="#000" />
            </TouchableOpacity>
          </View>
        </>
      )}

    </View>
  );

  return (
    <View style={styles.modalContainer}>
        <TouchableOpacity
  style={styles.backButton}
  onPress={handleClose}
  hitSlop={{ top: 1, bottom: 1, left: 1, right: 1 }} // Expande a área de toque
>
  <FontAwesome5 name="hand-point-left" size={40} color="#000" />
</TouchableOpacity>

      <FlatList
        data={locacoes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContentContainer} // Adiciona o padding ao contêiner da lista
      />
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    margin: 20,
  },
  listContentContainer: {
    paddingTop: 10, // Ajuste o valor conforme necessário para criar um espaço no topo
  },
  itemContainer: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    padding: 10,
  },
  icon: {
    position: 'absolute',
    right: 0,
    top: 10,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
  },
  dateInput: {
    flex: 1,
    padding: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    padding: 5,
  },
  backButton: {
    width: 60,         // Largura do botão
    height: 60,        // Altura do botão
    justifyContent: 'center',
    alignItems: 'center',
    padding: 1,       // Espaço extra ao redor do ícone
  },
});

export default ModalListaLocacoes;
