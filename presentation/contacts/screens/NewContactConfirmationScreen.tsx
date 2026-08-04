import React from 'react';
import styled from 'styled-components/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ContactType } from './NewContactTypeScreen';

// Misma paleta que se ve en la lista de contactos (MG en rojo, etc.)
const AVATAR_COLORS = ['#4E7FF5', '#F5A64E', '#0FA968', '#E5534B'];

function colorForName(name: string) {
    const sum = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

function initialsForName(name: string) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function NewContactConfirmationScreen() {
    const router = useRouter();
    const { name, type, photoUri, contactId } = useLocalSearchParams<{
        name: string;
        type: ContactType;
        photoUri?: string;
        contactId?: string;
    }>();

    const isNotify = type === 'notify';
    const displayName = name || 'Contacto';

    const handleDone = () => router.navigate('/contacts');
    const handleAddAnother = () => router.replace('/contacts/new');
    // Sin id (el backend no lo devolvió) se cae a la lista, que es desde donde
    // igual se puede abrir el detalle.
    const handleViewContact = () =>
        contactId ? router.replace(`/contacts/${contactId}`) : router.navigate('/contacts');

    return (
        <Container>
            <Content>
                <AvatarWrapper>
                    {photoUri ? (
                        <AvatarImage source={{ uri: photoUri }} />
                    ) : (
                        <Avatar color={colorForName(displayName)}>
                            <AvatarText>{initialsForName(displayName)}</AvatarText>
                        </Avatar>
                    )}
                    <CheckBadge>
                        <MaterialCommunityIcons name="check" size={16} color="#fff" />
                    </CheckBadge>
                </AvatarWrapper>

                <Title>¡Contacto agregado!</Title>
                <Subtitle>
                    <BoldSpan>{displayName}</BoldSpan> se guardó correctamente.
                </Subtitle>

                <SummaryCard>
                    {isNotify ? (
                        <SummaryRow>
                            <SummaryIcon background="#EFEAFE">
                                <MaterialCommunityIcons name="bell-outline" size={20} color="#6C4EF5" />
                            </SummaryIcon>
                            <SummaryText>
                                <SummaryTitle>A notificar</SummaryTitle>
                                <SummaryDescription>Recibe alertas en incidentes</SummaryDescription>
                            </SummaryText>
                        </SummaryRow>
                    ) : (
                        <SummaryRow>
                            <SummaryIcon background="#EAF3EE">
                                <MaterialCommunityIcons name="account-outline" size={20} color="#0FA968" />
                            </SummaryIcon>
                            <SummaryText>
                                <SummaryTitle>Solo registro</SummaryTitle>
                                <SummaryDescription>No recibe alertas, solo reconocimiento</SummaryDescription>
                            </SummaryText>
                        </SummaryRow>
                    )}

                    <SummaryRow withBorder>
                        <SummaryIcon background="#EAF3EE">
                            <MaterialCommunityIcons name="camera-outline" size={20} color="#0FA968" />
                        </SummaryIcon>
                        <SummaryText>
                            <SummaryTitle>Rostro registrado</SummaryTitle>
                            <SummaryDescriptionGreen>
                                La IA ya puede reconocerla en la puerta
                            </SummaryDescriptionGreen>
                        </SummaryText>
                    </SummaryRow>
                </SummaryCard>
            </Content>

            <Footer>
                <Button mode="contained" onPress={handleDone} contentStyle={{ height: 48 }}>
                    Listo
                </Button>
                <Button icon="eye-outline" mode="outlined" onPress={handleViewContact} contentStyle={{ height: 48 }}>
                    Ver contacto
                </Button>
                <Button
                    mode="text"
                    onPress={handleAddAnother}
                    style={{ marginTop: 4 }}
                    contentStyle={{ height: 44 }}
                >
                    Agregar otro contacto
                </Button>
            </Footer>
        </Container>
    );
}

// ---------- Estilos ----------

const Container = styled.View`
  flex: 1;
  background-color: #fff;
  padding: 20px;
`;

const Content = styled.View`
  flex: 1;
  align-items: center;
  padding-top: 24px;
`;

const AvatarWrapper = styled.View`
  margin-bottom: 20px;
`;

const Avatar = styled.View<{ color: string }>`
  width: 92px;
  height: 92px;
  border-radius: 46px;
  background-color: ${({ color }) => color};
  align-items: center;
  justify-content: center;
`;

const AvatarImage = styled.Image`
  width: 92px;
  height: 92px;
  border-radius: 46px;
  background-color: #f0f0f0;
`;

const AvatarText = styled.Text`
  color: #fff;
  font-size: 30px;
  font-weight: 700;
`;

const CheckBadge = styled.View`
  position: absolute;
  right: -2px;
  bottom: -2px;
  width: 28px;
  height: 28px;
  border-radius: 14px;
  background-color: #0fa968;
  border-width: 3px;
  border-color: #fff;
  align-items: center;
  justify-content: center;
`;

const Title = styled.Text`
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 6px;
`;

const Subtitle = styled.Text`
  font-size: 15px;
  color: #666;
  text-align: center;
  margin-bottom: 24px;
  line-height: 21px;
`;

const BoldSpan = styled.Text`
  font-weight: 700;
  color: #1a1a1a;
`;

const SummaryCard = styled.View`
  width: 100%;
  background-color: #fff;
  border-width: 1px;
  border-color: #eee;
  border-radius: 14px;
  padding: 4px 16px;
`;

const SummaryRow = styled.View<{ withBorder?: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: 14px 0;
  border-top-width: ${({ withBorder }) => (withBorder ? 1 : 0)}px;
  border-top-color: #eee;
`;

const SummaryIcon = styled.View<{ background: string }>`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: ${({ background }) => background};
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const SummaryText = styled.View`
  flex: 1;
`;

const SummaryTitle = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
`;

const SummaryDescription = styled.Text`
  font-size: 12px;
  color: #999;
  margin-top: 2px;
`;

const SummaryDescriptionGreen = styled(SummaryDescription)`
  color: #0fa968;
`;

const Footer = styled.View`
  width: 100%;
  gap: 8px;
`;
