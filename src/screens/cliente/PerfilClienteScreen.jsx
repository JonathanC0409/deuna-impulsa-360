import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DeunaButton from '../../components/DeunaButton';
import DeunaCard from '../../components/DeunaCard';
import { colors } from '../../theme/colors';
import { MOCK_USUARIO } from '../../data/mockData';

export default function PerfilClienteScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{MOCK_USUARIO.nombre.charAt(0)}</Text>
        </View>
        <Text style={styles.nombre}>{MOCK_USUARIO.nombre}</Text>
        <Text style={styles.email}>{MOCK_USUARIO.email}</Text>

        <DeunaCard style={styles.card}>
          <Text style={styles.label}>Nivel</Text>
          <Text style={styles.value}>{MOCK_USUARIO.nivel}</Text>
          <Text style={[styles.label, styles.spaced]}>Puntos totales</Text>
          <Text style={styles.value}>{MOCK_USUARIO.puntos}</Text>
        </DeunaCard>

        <DeunaButton
          title="Mis recompensas"
          variant="outline"
          onPress={() => navigation.navigate('MisRecompensas')}
        />
        <DeunaButton
          title="Modo negocio"
          onPress={() => navigation.navigate('Negocio')}
          style={styles.gap}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, alignItems: 'center', paddingBottom: 32 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 32, color: colors.white, fontWeight: '700' },
  nombre: { fontSize: 22, fontWeight: '800', color: colors.text },
  email: { fontSize: 14, color: colors.textMuted, marginBottom: 20 },
  card: { width: '100%', marginBottom: 16 },
  label: { fontSize: 12, color: colors.textMuted },
  value: { fontSize: 18, fontWeight: '700', color: colors.primary, marginTop: 2 },
  spaced: { marginTop: 12 },
  gap: { marginTop: 12, width: '100%' },
});
