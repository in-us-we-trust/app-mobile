import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { Stack, useNavigation } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';

export default function DeviceLayout() {
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
        <Stack screenOptions={{ headerShown: true, headerLeft: menuButton }}>
            <Stack.Screen
                name="index"
                options={{
                    title: 'Dispositivo',
                }}
            />
            <Stack.Screen
                name="link-device"
                options={{
                    title: 'Vincular Dispositivo',
                }}
            />
        </Stack>
    );
}
