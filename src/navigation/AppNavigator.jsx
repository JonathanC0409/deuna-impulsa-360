import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, shadows } from '../theme';

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
import FlujoImpulsaScreen from '../screens/promociones/FlujoImpulsaScreen';

const RootStack = createNativeStackNavigator();
const ClienteStack = createNativeStackNavigator();
const NegocioStack = createNativeStackNavigator();
const RuletaStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const stackHeaderOptions = {
  headerStyle: { backgroundColor: colors.white },
  headerTintColor: colors.primary,
  headerTitleStyle: {
    ...typography.h2,
    fontSize: 17,
    color: colors.text,
  },
  headerShadowVisible: true,
  headerBackTitleVisible: false,
};

const purpleHeaderOptions = {
  headerStyle: { backgroundColor: colors.primary },
  headerTintColor: colors.white,
  headerTitleStyle: {
    ...typography.h2,
    fontSize: 17,
    color: colors.white,
  },
  headerBackTitleVisible: false,
};

const TAB_ICONS = {
  Inicio: { active: 'home', inactive: 'home-outline' },
  Beneficios: { active: 'gift', inactive: 'gift-outline' },
  Billetera: { active: 'wallet', inactive: 'wallet-outline' },
  Tu: { active: 'person-circle', inactive: 'person-circle-outline' },
};

function tabBarIcon(routeName, focused) {
  const pair = TAB_ICONS[routeName] ?? TAB_ICONS.Inicio;
  const iconName = focused ? pair.active : pair.inactive;
  return (
    <Ionicons name={iconName} size={24} color={focused ? colors.primary : colors.tabInactive} />
  );
}

function ClienteTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarLabelStyle: typography.tab,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 84 : 64,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingTop: 8,
          ...shadows.tabBar,
        },
        headerStyle: { backgroundColor: colors.white },
        headerTintColor: colors.text,
        headerTitleStyle: {
          ...typography.h2,
          fontSize: 17,
        },
        headerTitleAlign: 'center',
        headerShadowVisible: false,
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={InicioClienteScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ focused }) => tabBarIcon('Inicio', focused),
        }}
      />
      <Tab.Screen
        name="Beneficios"
        component={BeneficiosScreen}
        options={{
          title: 'Beneficios',
          tabBarIcon: ({ focused }) => tabBarIcon('Beneficios', focused),
        }}
      />
      <Tab.Screen
        name="Billetera"
        component={BilleteraScreen}
        options={{
          title: 'Billetera',
          tabBarIcon: ({ focused }) => tabBarIcon('Billetera', focused),
        }}
      />
      <Tab.Screen
        name="Tu"
        component={PerfilClienteScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Tú',
          tabBarIcon: ({ focused }) => tabBarIcon('Tu', focused),
        }}
      />
    </Tab.Navigator>
  );
}

function ClienteNavigator() {
  return (
    <ClienteStack.Navigator screenOptions={stackHeaderOptions}>
      <ClienteStack.Screen
        name="ClienteTabs"
        component={ClienteTabs}
        options={{ headerShown: false }}
      />
      <ClienteStack.Screen
        name="PagoExitoso"
        component={PagoExitosoScreen}
        options={{ title: 'Pago exitoso', ...purpleHeaderOptions }}
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
    <NegocioStack.Navigator screenOptions={purpleHeaderOptions}>
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
    <RuletaStack.Navigator screenOptions={purpleHeaderOptions}>
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
      <RootStack.Navigator screenOptions={stackHeaderOptions}>
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
        <RootStack.Screen
          name="FlujoImpulsa"
          component={FlujoImpulsaScreen}
          options={{ title: 'Flujo Impulsa 360' }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
