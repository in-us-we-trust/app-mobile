import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Notificaciones',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="bell" color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="events"
                options={{
                    title: 'Eventos',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="calendar-clock" color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="device"
                options={{
                    title: 'Dispositivo',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="doorbell" color={color} size={size} />
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
        </Tabs>
    );
}