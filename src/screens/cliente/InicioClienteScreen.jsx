import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DeunaButton from '../../components/DeunaButton';
import DeunaCard from '../../components/DeunaCard';
import MetricCard from '../../components/MetricCard';
import ModuloQuickNav from '../../components/ModuloQuickNav';
import { colors } from '../../theme/colors';
import { MOCK_USUARIO } from '../../data/mockData';

export default function InicioClienteScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.greeting}>Hola, {MOCK_USUARIO.nombre.split(' ')[0]} 👋</Text>
        <Text style={styles.title}>Deuna Impulsa 360</Text>

        <View style={styles.metrics}>
          <MetricCard
            label="Tus puntos"
            value={String(MOCK_USUARIO.puntos)}
            accent={colors.primary}
          />
          <MetricCard
            label="Cashback"
            value={`$${MOCK_USUARIO.cashback}`}
            accent={colors.cashback}
          />
        </View>

        <DeunaCard>
          <Text style={styles.cardTitle}>Nivel {MOCK_USUARIO.nivel}</Text>
          <Text style={styles.cardText}>
            Sigue comprando en negocios aliados para subir de nivel y ganar más beneficios.
          </Text>
        </DeunaCard>

        <ModuloQuickNav navigation={navigation} active="Cliente" />

        <DeunaButton
          title="Conocer el flujo 360"
          variant="outline"
          onPress={() => navigation.navigate('FlujoImpulsa')}
          style={styles.gap}
        />
        <DeunaButton
          title="Mis recompensas"
          variant="outline"
          onPress={() => navigation.navigate('MisRecompensas')}
          style={styles.gap}
        />
        <DeunaButton
          title="Simular pago exitoso"
          onPress={() => navigation.navigate('PagoExitoso', { puntos: 120 })}
        />
        <DeunaButton
          title="Ir a Ruleta"
          variant="cashback"
          onPress={() => navigation.navigate('Ruleta')}
          style={styles.gap}
        />
        <DeunaButton
          title="Ver promociones"
          variant="outline"
          onPress={() => navigation.navigate('Promociones')}
          style={styles.gap}
        />
        <DeunaButton
          title="Modo negocio"
          variant="outline"
          onPress={() => navigation.navigate('Negocio')}
          style={styles.gap}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 32 },
  greeting: { fontSize: 15, color: colors.textMuted },
  title: { fontSize: 26, fontWeight: '800', color: colors.primary, marginBottom: 16 },
  metrics: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: 6 },
  cardText: { fontSize: 14, color: colors.textMuted, lineHeight: 20 },
  gap: { marginTop: 12 },
});
