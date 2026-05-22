import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DeunaButton from '../../components/DeunaButton';
import ScreenContainer from '../../components/ScreenContainer';
import { colors, spacing, radii, typography } from '../../theme';
import { registrarCliente } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

export default function RegistroClienteScreen({ navigation }) {
  const { signInDirecto } = useAuth();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegistro = async () => {
    if (!nombre.trim() || !correo.trim() || !telefono.trim()) {
      Alert.alert('Completa el formulario', 'Nombre, correo y teléfono son obligatorios.');
      return;
    }

    setLoading(true);
    try {
      const { usuario, giroBienvenida } = await registrarCliente({
        nombre,
        correo,
        telefono,
      });

      await signInDirecto({
        usuario,
        giro: giroBienvenida?.giro ?? null,
      });

      Alert.alert(
        '¡Bienvenido a Deuna Impulsa!',
        'Tu cuenta está lista. Tienes 1 giro gratis de bienvenida en la ruleta.',
        [{ text: 'Girar ahora', onPress: () => navigation.replace('GiroBienvenida') }]
      );
    } catch (e) {
      Alert.alert('Registro', e.message ?? 'No se pudo crear la cuenta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <ScreenContainer>
            <Text style={styles.title}>Crear cuenta cliente</Text>
            <Text style={styles.sub}>
              Al registrarte recibes un giro gratis de bienvenida. Siempre ganas un premio.
            </Text>

            <Text style={styles.label}>Nombre completo</Text>
            <TextInput
              style={styles.input}
              value={nombre}
              onChangeText={setNombre}
              placeholder="María González"
              placeholderTextColor={colors.textMuted}
            />

            <Text style={styles.label}>Correo</Text>
            <TextInput
              style={styles.input}
              value={correo}
              onChangeText={setCorreo}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="maria@email.com"
              placeholderTextColor={colors.textMuted}
            />

            <Text style={styles.label}>Teléfono (clave de acceso)</Text>
            <TextInput
              style={styles.input}
              value={telefono}
              onChangeText={setTelefono}
              keyboardType="phone-pad"
              placeholder="0999999999"
              placeholderTextColor={colors.textMuted}
            />

            <DeunaButton
              title="Registrarme y obtener giro gratis"
              variant="cashback"
              onPress={handleRegistro}
              loading={loading}
              style={styles.btn}
            />

            <DeunaButton
              title="Ya tengo cuenta"
              variant="outline"
              onPress={() => navigation.navigate('LoginCliente')}
            />
          </ScreenContainer>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.backgroundAlt },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, paddingVertical: spacing.xl },
  title: { ...typography.h1, marginBottom: spacing.sm },
  sub: { ...typography.body, marginBottom: spacing.lg },
  label: { ...typography.label, marginBottom: spacing.xs, marginTop: spacing.md },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.lg,
    fontSize: 16,
    backgroundColor: colors.white,
  },
  btn: { marginTop: spacing.xl },
});
