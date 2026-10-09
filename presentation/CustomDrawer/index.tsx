import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, useTheme } from 'react-native-paper';
import styled from 'styled-components/native';
import { useAuth } from '@/presentation/auth/hooks/useAuth';

const AVATAR_PLACEHOLDER = 'https://ui-avatars.com/api/?background=random&name=';

// --- Styled Components ---

const Wrapper = styled(SafeAreaView)`
  flex: 1;
`;

const Header = styled.View`
  padding: 20px 20px 16px 20px;
`;

const Avatar = styled(Image)`
  width: 64px;
  height: 64px;
  border-radius: 32px;
`;

const UserName = styled(Text)`
  font-weight: bold;
  margin-top: 10px;
`;

const UserEmail = styled(Text) <{ color: string }>`
  color: ${({ color }) => color};
`;

const Divider = styled.View<{ color: string }>`
  height: 1px;
  margin: 0 16px 8px 16px;
  background-color: ${({ color }) => color};
`;

const ItemsContainer = styled.View`
  padding: 0 12px;
  gap: 4px;
`;

const ItemButton = styled.TouchableOpacity<{ active: boolean; activeColor: string }>`
  flex-direction: row;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  gap: 14px;
  background-color: ${({ active, activeColor }) => active ? activeColor : 'transparent'};
`;

const ItemLabel = styled(Text) <{ color: string }>`
  font-size: 15px;
  color: ${({ color }) => color};
`;

const Footer = styled.View<{ borderColor: string }>`
  border-top-width: 1px;
  border-top-color: ${({ borderColor }) => borderColor};
  padding: 16px 24px;
`;

const LogoutButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;  // ← agregá 12px horizontal
`;

const LogoutText = styled(Text) <{ color: string }>`
  font-size: 15px;
  font-weight: 500;
  color: ${({ color }) => color};
`;

// --- Drawer Item ---

interface DrawerItemProps {
    icon: string;
    label: string;
    onPress: () => void;
    active?: boolean;
}

const DrawerItem = ({ icon, label, onPress, active = false }: DrawerItemProps) => {
    const theme = useTheme();
    return (
        <ItemButton
            active={active}
            activeColor={theme.colors.primaryContainer}
            onPress={onPress}
        >
            <MaterialCommunityIcons
                name={icon as any}
                size={22}
                color={active ? theme.colors.primary : theme.colors.onSurfaceVariant}
            />
            <ItemLabel color={active ? theme.colors.primary : theme.colors.onSurface}>
                {label}
            </ItemLabel>
        </ItemButton>
    );
};

// --- Main Component ---

export default function CustomDrawer(props: DrawerContentComponentProps) {
    const { user, logout } = useAuth();
    const theme = useTheme();
    const router = useRouter();

    const fullName = user ? `${user.firstName} ${user.lastName}` : 'Usuario';
    const email = user?.email ?? '';
    const avatarUrl = `${AVATAR_PLACEHOLDER}${encodeURIComponent(fullName)}`;

    const currentRoute = props.state.routeNames[props.state.index];

    const handleLogout = () => {
        logout();
        router.replace('/(auth)/login');
    };

    return (
        <Wrapper>
            <DrawerContentScrollView {...props} contentContainerStyle={{ flexGrow: 1 }}>

                <Header>
                    <Avatar source={{ uri: avatarUrl }} />
                    <UserName variant="titleMedium">{fullName}</UserName>
                    <UserEmail variant="bodySmall" color={theme.colors.onSurfaceVariant}>
                        {email}
                    </UserEmail>
                </Header>

                <Divider color={theme.colors.outlineVariant} />

                <ItemsContainer>
                    <DrawerItem
                        icon="cog-outline"
                        label="Configuración"
                        active={currentRoute === 'settings'}
                        onPress={() => router.push('/(app-name)/settings')}
                    />
                </ItemsContainer>

            </DrawerContentScrollView>

            <Footer borderColor={theme.colors.outlineVariant}>
                <LogoutButton onPress={handleLogout}>
                    <MaterialCommunityIcons name="logout" size={20} color={theme.colors.error} />
                    <LogoutText color={theme.colors.error}>Cerrar Sesión</LogoutText>
                </LogoutButton>
            </Footer>
        </Wrapper>
    );
}