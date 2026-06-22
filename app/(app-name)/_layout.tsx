import { Redirect, useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useAuth } from '@/presentation/auth/hooks/useAuth';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CustomDrawer from '@/presentation/CustomDrawer';

export default function AppLayout() {
    const { isAuthenticated, isLoading } = useAuth();
    const theme = useTheme();
    const router = useRouter();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator color={theme.colors.primary} />
            </View>
        );
    }

    if (!isAuthenticated) {
        return <Redirect href="/(auth)/login" />;
    }

    const backButton = () => (
        <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 16 }}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
    );

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer drawerContent={(props) => <CustomDrawer {...props} />} screenOptions={{ headerShown: false }}>
                <Drawer.Screen
                    name="(tabs)"
                    options={{ drawerLabel: 'Inicio', headerShown: false }}
                />
                <Drawer.Screen
                    name="profile"
                    options={{
                        drawerLabel: 'Perfil',
                        title: 'Perfil',
                        headerShown: true,
                        headerLeft: backButton,
                    }}
                />
                <Drawer.Screen
                    name="settings"
                    options={{
                        drawerLabel: 'Configuración',
                        title: 'Configuración',
                        headerShown: true,
                        headerLeft: backButton,
                    }}
                />
            </Drawer>
        </GestureHandlerRootView>
    );
}