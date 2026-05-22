import { useState } from 'react';
import {
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
import { registrarNegocio } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

export default function RegistroNegocioScreen({ navigation }) {
  const { signInDirecto } = useAuth();
  const [nombrePropietario, setNombrePropietario] = useState('');
  const [nombreNegocio, setNombreNegocio] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegistro = async () => {
    if (!nombrePropietario.trim() || !nombreNegocio.trim() || !correo.trim() || !telefono.trim()) {
      Alert.alert('Completa el formulario', 'Todos los campos marcados son obligatorios.');
      return;
    }

    setLoading(true);
    try {
      const { usuario, negocio } = await registrarNegocio({
        nombrePropietario,
        nombreNegocio,
        correo,
        telefono,
        direccion,
      });

      await signInDirecto({ usuario, negocio });

      Alert.alert(
        'Negocio registrado',
        `${negocio.NombreNegocio} ya puede cargar inventario y registrar ventas.`,
        [{ text: 'Ir al panel', onPress: () => navigation.replace('NegocioHome') }]
      );
    } catch (e) {
      Alert.alert('Registro', e.message ?? 'No se pudo crear el negocio.');
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
            <Text style={styles.title}>Registrar mi negocio</Text>
            <Text style={styles.sub}>
              Gestiona inventario, cobra con Deuna y activa promociones para tus clientes.
            </Text>

            <Text style={styles.label}>Tu nombre</Text>
            <TextInput
              style={styles.input}
              value={nombrePropietario}
              onChangeText={setNombrePropietario}
              placeholder="Juan Pérez"
              placeholderTextColor={colors.textMuted}
            />

            <Text style={styles.label}>Nombre del negocio</Text>
            <TextInput
              style={styles.input}
              value={nombreNegocio}
              onChangeText={setNombreNegocio}
              placeholder="Tienda Don Luis"
              placeholderTextColor={colors.textMuted}
            />

            <Text style={styles.label}>Correo</Text>
            <TextInput
              style={styles.input}
              value={correo}
              onChangeText={setCorreo}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Teléfono (clave de acceso)</Text>
            <TextInput
              style={styles.input}
              value={telefono}
              onChangeText={setTelefono}
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Dirección (opcional)</Text>
            <TextInput
              style={styles.input}
              value={direccion}
              onChangeText={setDireccion}
            />

            <DeunaButton
              title="Crear negocio"
              onPress={handleRegistro}
              loading={loading}
              style={styles.btn}
            />

            <DeunaButton
              title="Ya tengo cuenta"
              variant="outline"
              onPress={() => navigation.navigate('LoginNegocio')}
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
