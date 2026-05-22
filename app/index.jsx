import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, radii } from '../src/theme';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.logo}>deuna!</Text>
        <Text style={styles.title}>Deuna Impulsa 360</Text>
        <Text style={styles.subtitle}>
          Inventario para el negocio. Ruleta de premios para el cliente. Más transacciones para
          Deuna.
        </Text>

        <Pressable style={styles.card} onPress={() => router.push('/login-cliente')}>
          <Text style={styles.cardTitle}>Entrar como cliente</Text>
          <Text style={styles.cardSub}>Solo tu correo · demo</Text>
        </Pressable>

        <Pressable
          style={[styles.card, styles.cardOutline]}
          onPress={() => router.push('/login-negocio')}
        >
          <Text style={[styles.cardTitle, styles.cardTitlePurple]}>Entrar como negocio</Text>
          <Text style={[styles.cardSub, styles.cardSubOutline]}>Solo tu correo · demo</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.backgroundAlt },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  logo: {
    fontSize: 42,
    fontWeight: '900',
    color: colors.primary,
    fontStyle: 'italic',
    marginBottom: spacing.sm,
  },
  title: { ...typography.h1, marginBottom: spacing.md },
  subtitle: { ...typography.body, marginBottom: spacing.xxl },
  card: {
    backgroundColor: colors.primary,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardOutline: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  cardTitle: { fontSize: 17, fontWeight: '800', color: colors.white },
  cardTitlePurple: { color: colors.primary },
  cardSub: { fontSize: 13, color: 'rgba(255,255,255,0.9)', marginTop: 4 },
  cardSubOutline: { color: colors.textMuted },
});
