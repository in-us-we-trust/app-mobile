import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { Stack, useNavigation } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';

export default function EventsLayout() {
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
        // El menú del drawer se pone solo en el index: el detalle tiene que
        // quedarse con la flecha de "Atrás" que agrega el Stack.
        <Stack screenOptions={{ headerShown: true }}>
            <Stack.Screen
                name="index"
                options={{
                    title: 'Eventos',
                    headerLeft: menuButton,
                }}
            />
            <Stack.Screen
                name="event/[trackId]"
                options={{
                    title: 'Evento',
                }}
            />
        </Stack>
    );
}
