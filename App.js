// App.js
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import HomeScreen from './HomeScreen'; // Certifique-se de que HomeScreen está importado
import CalendarScreen from './CalendariosCasas/CalendarScreen'; // Importando a tela de calendário

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Login' }}
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
