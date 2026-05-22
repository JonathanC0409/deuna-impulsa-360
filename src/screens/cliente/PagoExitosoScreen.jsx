import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DeunaButton from '../../components/DeunaButton';
import DeunaCard from '../../components/DeunaCard';
import { colors } from '../../theme/colors';

export default function PagoExitosoScreen({ navigation, route }) {
  const puntos = route?.params?.puntos ?? 100;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>✓</Text>
        </View>
        <Text style={styles.title}>¡Pago exitoso!</Text>
        <Text style={styles.subtitle}>Tu compra fue registrada correctamente</Text>

        <DeunaCard style={styles.card}>
          <Text style={styles.label}>Puntos ganados</Text>
          <Text style={styles.puntos}>+{puntos}</Text>
          <Text style={styles.cashback}>+$2.40 cashback acumulado</Text>
        </DeunaCard>

        <DeunaButton title="Volver al inicio" onPress={() => navigation.navigate('ClienteTabs')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primaryLight,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  icon: { fontSize: 36, color: colors.success, fontWeight: '700' },
  title: { fontSize: 26, fontWeight: '800', textAlign: 'center', color: colors.text },
  subtitle: { fontSize: 15, textAlign: 'center', color: colors.textMuted, marginTop: 8, marginBottom: 24 },
  card: { marginBottom: 24, alignItems: 'center' },
  label: { fontSize: 14, color: colors.textMuted },
  puntos: { fontSize: 40, fontWeight: '800', color: colors.cashback, marginVertical: 8 },
  cashback: { fontSize: 14, color: colors.primary },
});
