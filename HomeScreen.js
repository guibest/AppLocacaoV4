// HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const IconButton = ({ onPress, imageSource, title }) => (
  <TouchableOpacity style={styles.iconContainer} onPress={onPress}>
    <Image source={imageSource} style={styles.image} />
    <Text>{title}</Text>
  </TouchableOpacity>
);

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <IconButton
        onPress={() => navigation.navigate('CalendarScreen', { casaId: 'cima', casaNome: 'Casa de Cima' })}
        imageSource={require('./assets/cima.png')}
        title="Casa de Cima"
      />
      <IconButton
        onPress={() => navigation.navigate('CalendarScreen', { casaId: 'baixo', casaNome: 'Casa de Baixo' })}
        imageSource={require('./assets/baixo.png')}
        title="Casa de Baixo"
      />
      <IconButton
        onPress={() => navigation.navigate('CalendarScreen', { casaId: 'luana', casaNome: 'Casa da Luana' })}
        imageSource={require('./assets/lu.png')}
        title="Casa da Luana"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    margin: 20,
    alignItems: 'center',
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 30,
  },
});

export default HomeScreen;
