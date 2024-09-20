import { registerTranslation } from 'react-native-paper-dates';

// Registrar a tradução para o português
registerTranslation('pt', {
  save: 'Salvar',
  selectSingle: 'Selecionar data',
  selectMultiple: 'Selecionar datas',
  selectRange: 'Selecionar período',
  notAccordingToDateFormat: (inputFormat) =>
    `O formato da data deve ser ${inputFormat}`,
  mustBeHigherThan: (date) => `Deve ser posterior a ${date}`,
  mustBeLowerThan: (date) => `Deve ser anterior a ${date}`,
  mustBeBetween: (startDate, endDate) =>
    `Deve estar entre ${startDate} - ${endDate}`,
  dateIsDisabled: 'Dia não permitido',
  previous: 'Anterior',
  next: 'Próximo',
  typeInDate: 'Digite a data',
  pickDateFromCalendar: 'Escolha a data do calendário',
  close: 'Fechar',
});

