import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { Tabs, useNavigation } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';

export default function TabsLayout() {
    const navigation = useNavigation();
    const theme = useTheme();

    const menuButton = () => (
        <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            style={{ marginLeft: 16 }}
        >
            <MaterialCommunityIcons name="menu" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
    );

    return (
        <Tabs screenOptions={{
            headerShown: true,
            headerLeft: menuButton,
        }}>
            {/* Mismo patrón que contacts/device: apunta al GRUPO (events), que tiene
                su propio _layout con Stack, para que el detalle del evento quede
                DENTRO de esta tab. Es un grupo y no una carpeta común para que el
                listado siga viviendo en "/" (a donde redirige el login). */}
            <Tabs.Screen
                name="(events)"
                options={{
                    title: 'Eventos',
                    headerShown: false, // el header lo maneja el Stack de (events)/_layout.tsx
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="calendar-clock" color={color} size={size} />
                    ),
                }}
            />
            {/* Apunta a la CARPETA contacts, que tiene su propio _layout con Stack.
                new/index y new/details quedan DENTRO de esta tab. */}
            <Tabs.Screen
                name="contacts"
                options={{
                    title: 'Contactos',
                    headerShown: false, // el header lo maneja el Stack de contacts/_layout.tsx
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="account-group" color={color} size={size} />
                    ),
                }}
            />
            {/* Mismo patrón para device: apunta a la CARPETA, no a "device/index",
                para que link-device quede DENTRO de esta tab. */}
            <Tabs.Screen
                name="device"
                options={{
                    title: 'Dispositivo',
                    headerShown: false, // el header lo maneja el Stack de device/_layout.tsx
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="doorbell" color={color} size={size} />
                    ),
                }}
            />
        </Tabs>
    );
}
