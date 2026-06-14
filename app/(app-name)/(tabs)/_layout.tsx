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
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Eventos',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="calendar-clock" color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="contacts"
                options={{
                    title: 'Contactos',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="account-group" color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="device/index"
                options={{
                    title: 'Dispositivo',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="doorbell" color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="device/link-device"
                options={{
                    href: null,
                    title: 'Vincular Dispositivo',
                }} />
        </Tabs>
    );
}