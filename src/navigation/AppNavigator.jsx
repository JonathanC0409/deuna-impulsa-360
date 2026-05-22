import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from '../theme/colors';

import InicioClienteScreen from '../screens/cliente/InicioClienteScreen';
import PagoExitosoScreen from '../screens/cliente/PagoExitosoScreen';
import BeneficiosScreen from '../screens/cliente/BeneficiosScreen';
import BilleteraScreen from '../screens/cliente/BilleteraScreen';
import MisRecompensasScreen from '../screens/cliente/MisRecompensasScreen';
import PerfilClienteScreen from '../screens/cliente/PerfilClienteScreen';

import DashboardNegocioScreen from '../screens/negocio/DashboardNegocioScreen';
import ItemsNegocioScreen from '../screens/negocio/ItemsNegocioScreen';
import CrearItemScreen from '../screens/negocio/CrearItemScreen';
import RegistrarVentaScreen from '../screens/negocio/RegistrarVentaScreen';

import RuletaScreen from '../screens/ruleta/RuletaScreen';
import ResultadoRecompensaScreen from '../screens/ruleta/ResultadoRecompensaScreen';

import PromocionesScreen from '../screens/promociones/PromocionesScreen';

const RootStack = createNativeStackNavigator();
const ClienteStack = createNativeStackNavigator();
const NegocioStack = createNativeStackNavigator();
const RuletaStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const headerOptions = {
  headerStyle: { backgroundColor: colors.primary },
  headerTintColor: colors.white,
  headerTitleStyle: { fontWeight: '700' },
};

function ClienteTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
        },
        ...headerOptions,
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={InicioClienteScreen}
        options={{ title: 'Inicio', tabBarLabel: 'Inicio' }}
      />
      <Tab.Screen
        name="Beneficios"
        component={BeneficiosScreen}
        options={{ title: 'Beneficios' }}
      />
      <Tab.Screen
        name="Billetera"
        component={BilleteraScreen}
        options={{ title: 'Billetera' }}
      />
      <Tab.Screen
        name="Tu"
        component={PerfilClienteScreen}
        options={{ title: 'Tú', tabBarLabel: 'Tú' }}
      />
    </Tab.Navigator>
  );
}

function ClienteNavigator() {
  return (
    <ClienteStack.Navigator screenOptions={headerOptions}>
      <ClienteStack.Screen
        name="ClienteTabs"
        component={ClienteTabs}
        options={{ headerShown: false }}
      />
      <ClienteStack.Screen
        name="PagoExitoso"
        component={PagoExitosoScreen}
        options={{ title: 'Pago exitoso' }}
      />
      <ClienteStack.Screen
        name="MisRecompensas"
        component={MisRecompensasScreen}
        options={{ title: 'Mis recompensas' }}
      />
    </ClienteStack.Navigator>
  );
}

function NegocioNavigator() {
  return (
    <NegocioStack.Navigator screenOptions={headerOptions}>
      <NegocioStack.Screen
        name="DashboardNegocio"
        component={DashboardNegocioScreen}
        options={{ title: 'Mi negocio' }}
      />
      <NegocioStack.Screen
        name="ItemsNegocio"
        component={ItemsNegocioScreen}
        options={{ title: 'Items' }}
      />
      <NegocioStack.Screen
        name="CrearItem"
        component={CrearItemScreen}
        options={{ title: 'Crear item' }}
      />
      <NegocioStack.Screen
        name="RegistrarVenta"
        component={RegistrarVentaScreen}
        options={{ title: 'Registrar venta' }}
      />
    </NegocioStack.Navigator>
  );
}

function RuletaNavigator() {
  return (
    <RuletaStack.Navigator screenOptions={headerOptions}>
      <RuletaStack.Screen name="Ruleta" component={RuletaScreen} options={{ title: 'Ruleta' }} />
      <RuletaStack.Screen
        name="ResultadoRecompensa"
        component={ResultadoRecompensaScreen}
        options={{ title: 'Tu premio' }}
      />
    </RuletaStack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={headerOptions}>
        <RootStack.Screen
          name="Cliente"
          component={ClienteNavigator}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="Negocio"
          component={NegocioNavigator}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="Ruleta"
          component={RuletaNavigator}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="Promociones"
          component={PromocionesScreen}
          options={{ title: 'Promociones' }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
