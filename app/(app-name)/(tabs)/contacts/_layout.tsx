import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { Stack, useNavigation } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';

export default function ContactsLayout() {
    const navigation = useNavigation();
    const theme = useTheme();

    // El drawer vive en el navigator de más arriba (fuera de las tabs),
    // así que dispatch sigue funcionando aunque estemos en un Stack anidado.
    const menuButton = () => (
        <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            style={{ marginLeft: 16 }}
        >
            <MaterialCommunityIcons name="menu" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
    );

    return (
        <Stack screenOptions={{ headerShown: true, headerLeft: menuButton }}>
            <Stack.Screen
                name="index"
                options={{
                    title: 'Contactos',
                }}
            />
            <Stack.Screen
                name="new/index"
                options={{
                    title: 'Nuevo contacto',
                    headerBackVisible: false, // se cancela con el botón de abajo, no con "Atrás"a
                }}
            />
            <Stack.Screen
                name="new/details"
                options={{
                    title: 'Datos del contacto',
                    headerBackVisible: false,
                }}
            />
            <Stack.Screen
                name="new/confirmation"
                options={{
                    title: 'Contacto agregado',
                    headerBackVisible: false,
                    headerLeft: () => null, // pantalla de cierre: solo se sale con "Listo"
                }}
            />
        </Stack>
    );
}
