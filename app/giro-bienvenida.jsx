import { useRouter } from 'expo-router';
import GiroBienvenidaScreen from '../src/screens/auth/GiroBienvenidaScreen';

export default function GiroBienvenidaPage() {
  const router = useRouter();
  const navigation = {
    replace: (name, params) => {
      if (name === 'Ruleta') {
        router.replace({ pathname: '/ruleta', params });
        return;
      }
      if (name === 'ClienteHome') {
        router.replace('/cliente');
        return;
      }
      router.replace(name);
    },
  };

  return <GiroBienvenidaScreen navigation={navigation} />;
}
