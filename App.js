// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import HomeScreen from './HomeScreen';
import CalendarScreen from './CalendariosCasas/CalendarScreen'; // Verifique se o caminho está correto

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Login', headerShown: false }} // Escondendo o cabeçalho
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Seus Anúncios' }}
        />
        <Stack.Screen
          name="CalendarScreen"
          component={CalendarScreen}
          options={({ route }) => ({ title: `Calendário da ${route.params.casaNome}` })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
