import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform, ScrollView  } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import moment from 'moment';
//import { DatePickerModal } from 'react-native-paper-dates'; // Importando DatePickerModal e registerTranslation
//import '../traudotorCalendar/translation';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importando fonte de ícones




/**
 * Modal for creating a new rental.
 * 
 * @param {function} handleClose - Function to be called when the modal is closed.
 * @param {function} onSave - Function to be called when the rental is saved.
 * @param {string} casa - Casa ID.
 * 
 * @returns {JSX.Element} - The modal component.
 */
const ModalNovaLocacao = ({ handleClose, onSave, casa }) => {
  /**
   * State for the form fields.
   * 
   * @type {object}
   * @property {string} clientName - Name of the client.
   * @property {Date} startDate - Start date of the rental.
   * @property {Date} endDate - End date of the rental.
   * @property {string} advancePayment - Advance payment amount.
   * @property {string} cleaningFee - Cleaning fee amount.
   * @property {string} totalAmount - Total amount of the rental.
   */
  const [formState, setFormState] = useState({
    clientName: '',
    startDate: null,
    endDate: null,
    advancePayment: '',
    cleaningFee: '',
    totalAmount: '',
  });

  /**
   * State for form errors.
   * 
   * @type {object}
   */
  const [errorsState, setErrorsState] = useState({});

  /**
   * State for the date range picker visibility.
   * 
   * @type {boolean}
   */
  const [isDateRangePickerVisible, setIsDateRangePickerVisible] = useState(false);

  /**
   * State for the existing rentals.
   * 
   * @type {array}
   */
  const [existingRentals, setExistingRentals] = useState([]);

  /**
   * Fetches the existing rentals for the given house.
   * 
   * @returns {Promise<void>}
   */
  const fetchExistingRentals = async () => {
    try {
      // Query the rentals collection for the given house.
      const q = query(collection(db, 'rentals'), where('casa', '==', casa));
      // Get the query snapshot.
      const querySnapshot = await getDocs(q);
      // Initialize an empty array to store the rentals.
      const rentals = [];
      // Iterate over the query snapshot and add the rentals to the array.
      querySnapshot.forEach((doc) => {
        if (doc.exists()) {
          rentals.push(doc.data());
        }
      });
      // Set the existing rentals state to the fetched rentals.
      setExistingRentals(rentals);
    } catch (error) {
      // Log an error to the console if there was an issue fetching the rentals.
      console.error('Erro ao buscar locações: ', error);
    }
  };

  useEffect(() => {
    fetchExistingRentals();
  }, [casa]);

  /**
   * Checks if the given date range overlaps with any of the existing rentals.
   * 
   * @param {string} startDate - Start date of the new rental.
   * @param {string} endDate - End date of the new rental.
   * @returns {boolean} - True if the date range overlaps, false otherwise.
   */
  const isDateRangeOverlapping = (startDate, endDate) => {
    if (!startDate || !endDate) {
      return false;
    }

    // Create moment objects from the given dates.
    const newStart = moment(startDate);
    const newEnd = moment(endDate);

    // Check if the new rental overlaps with any of the existing rentals.
    return existingRentals.some(rental => {
      // Create moment objects from the existing rental dates.
      const rentalStart = moment(rental.startDate);
      const rentalEnd = moment(rental.endDate);

      // Check for overlap using the isBetween method.
      return (
        // Check if the new start date is between the existing rental dates.
        newStart.isBetween(rentalStart, rentalEnd, null, '[]') ||
        // Check if the new end date is between the existing rental dates.
        newEnd.isBetween(rentalStart, rentalEnd, null, '[]') ||
        // Check if the existing rental start date is between the new dates.
        rentalStart.isBetween(newStart, newEnd, null, '[]')
      );
    });
  };


  /**
   * Handles the date range picker change event.
   * 
   * @param {Object} range - Object with the start and end dates of the selected range.
   */
  const handleDateRangeChange = (range) => {
    if (range) {
      const { startDate, endDate } = range;

      // Format the dates to 'YYYY-MM-DD' and update the form state.
      setFormState({
        ...formState,
        startDate: moment(startDate).format('YYYY-MM-DD'),
        endDate: moment(endDate).format('YYYY-MM-DD'),
      });
    }

    // Hide the date range picker.
    setIsDateRangePickerVisible(false);
  };

  /**
   * Validates the form fields.
   * 
   * @returns {boolean} - Whether the form is valid or not.
   */
  const validateFields = () => {
    const newErrors = {};

    // Validate the client name field.
    if (!formState.clientName) {
      newErrors.clientName = 'Preencha o nome do cliente';
    }

    // Validate the start date field.
    if (!formState.startDate) {
      newErrors.startDate = 'Selecione a data de início';
    }

    // Validate the end date field.
    if (!formState.endDate) {
      newErrors.endDate = 'Selecione a data de término';
    }

    // Check if the form is valid.
    const isValid = Object.keys(newErrors).length === 0;
    setErrorsState(newErrors);
    return isValid;
  };

  /**
   * Handles the save button press.
   * 
   * @returns {Promise<void>} - A promise that resolves when the save operation is complete.
   */
  const handleSave = async () => {
    if (validateFields()) {
      // Check if the start date is overlapping with any existing rental.
      if (isDateRangeOverlapping(formState.startDate, formState.endDate)) {
        Alert.alert('Erro', 'As datas selecionadas já estão ocupadas. Escolha outro intervalo.');
        return;
      }

      try {
        // Add the rental to the Firestore.
        await addDoc(collection(db, 'rentals'), {
          clientName: formState.clientName,
          startDate: formState.startDate,
          endDate: formState.endDate,
          advancePayment: formState.advancePayment,
          cleaningFee: formState.cleaningFee,
          totalAmount: formState.totalAmount,
          casa: casa,
        });

        // Show a success alert.
        Alert.alert('Sucesso', 'Loca o salva com sucesso!');

        // Call the onSave callback if it exists.
        if (onSave) onSave();

        // Close the modal.
        handleClose();

        // Reset the form state.
        setFormState({
          clientName: '',
          startDate: '',
          endDate: '',
          advancePayment: '',
          cleaningFee: '',
          totalAmount: '',
        });
      } catch (error) {
        // Show an error alert.
        Alert.alert('Erro', 'Ocorreu um erro ao salvar a loção.');

        // Log the error.
        console.error('Erro ao salvar no Firestore: ', error);
      }
    } else {
      // Show an error alert if the form is not valid.
            Alert.alert('Erro', 'Preencha todos os campos obrigat rios.');
    }
  };

  /**
   * Renderiza o modal de cadastro de novas loca es.
   * 
   * @returns {JSX.Element} O modal de cadastro de novas loca es.
   */
  return (
    <KeyboardAvoidingView
    behavior={ Platform.OS === "ios" ? "padding" : "height" }
    keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}

    style={styles.modalContainer}>
  
      <ScrollView style={[styles.modalContent,{width:'100%'}]}>
        
        <Text style={styles.modalTitle}>Cadastrar Nova Locação</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { paddingRight: 40 }]} // Espaço para o ícone
            placeholder="Nome do Cliente *"
            value={formState.clientName}
            onChangeText={(text) => setFormState({ ...formState, clientName: text })}
          />
          <Icon name="pencil" size={20} color="#000" style={styles.icon} />
        </View>
        {errorsState.clientName && <Text style={styles.errorText}>{errorsState.clientName}</Text>}

        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => setIsDateRangePickerVisible(true)}
        >
          <View style={styles.dateInputContainer}>
            <Text>
              {formState.startDate && formState.endDate
                ? `Período: ${moment(formState.startDate).format('DD/MM/YYYY')} a ${moment(formState.endDate).format('DD/MM/YYYY')}`
                : 'Selecione o Período *'}
            </Text>
            <Icon name="calendar" size={20} color="#000" style={styles.iconCalendar} />
          </View>
        </TouchableOpacity>


        {errorsState.startDate && <Text style={styles.errorText}>{errorsState.startDate}</Text>}
        {errorsState.endDate && <Text style={styles.errorText}>{errorsState.endDate}</Text>}

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { paddingRight: 40 }]} // Espaço para o ícone
            placeholder="Valor do Adiantamento (R$)"
            keyboardType="numeric"
            value={formState.advancePayment}
            onChangeText={(text) => setFormState({ ...formState, advancePayment: text })}
          />
          <Icon name="pencil" size={20} color="#000" style={styles.icon} />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { paddingRight: 40 }]} // Espaço para o ícone
            placeholder="Taxa de Limpeza (R$)"
            keyboardType="numeric"
            value={formState.cleaningFee}
            onChangeText={(text) => setFormState({ ...formState, cleaningFee: text })}
          />
          <Icon name="pencil" size={20} color="#000" style={styles.icon} />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { paddingRight: 40 }]} // Espaço para o ícone
            placeholder="Valor Total (R$)"
            keyboardType="numeric"
            value={formState.totalAmount}
            onChangeText={(text) => setFormState({ ...formState, totalAmount: text })}
          />
          <Icon name="pencil" size={20} color="#000" style={styles.icon} />
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Salvar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleClose}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
      
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
    position: 'relative',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    height: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    position: 'relative',
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingRight: 40, // Espaço para o ícone
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    position: 'relative',
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    position: 'absolute',
    right: 10,
  },
  iconCalendar: {
    position: 'absolute',
    right: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 15,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#00A8FF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButtonText: {
    color: 'black',
    fontSize: 23,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#00A8FF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'black',
    fontSize: 23,
    fontWeight: 'bold',
  },
});

export default ModalNovaLocacao;