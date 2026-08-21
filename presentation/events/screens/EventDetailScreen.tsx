import React from 'react';
import { ActivityIndicator, Share, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import styled from 'styled-components/native';
import { useEventDetail } from '../hooks/useEventDetail';
import { EventCapture } from '../components/EventCapture';
import { EventStatusBanner } from '../components/EventStatusBanner';
import { EventDetail } from '../types';

export default function EventDetailScreen() {
    const router = useRouter();
    const { trackId } = useLocalSearchParams<{ trackId: string }>();
    const { event, isLoading, error, refresh } = useEventDetail(trackId);

    const handleShare = async (detail: EventDetail) => {
        const message = `${detail.title} · ${detail.date}, ${detail.time}`;
        await Share.share(
            detail.imageUrl ? { message: `${message}\n${detail.imageUrl}` } : { message },
        );
    };

    // El alta de contacto arranca en el flujo que ya existe; la captura de este
    // evento no se puede pre-cargar porque el backend todavía no expone los
    // recortes de la cara (ver el modal de contacto sugerido).
    const handleAddContact = () => router.push('/contacts/new');

    const shareButton = (detail: EventDetail) => () => (
        <TouchableOpacity onPress={() => handleShare(detail)} hitSlop={8} style={{ marginRight: 4 }}>
            <MaterialCommunityIcons name="share-variant-outline" size={22} color="#6C4EF5" />
        </TouchableOpacity>
    );

    if (isLoading && !event) {
        return (
            <Centered>
                <ActivityIndicator color="#6C4EF5" />
            </Centered>
        );
    }

    if (error && !event) {
        return (
            <Centered>
                <ErrorText>{error}</ErrorText>
                <RetryButton onPress={refresh}>
                    <RetryText>Reintentar</RetryText>
                </RetryButton>
            </Centered>
        );
    }

    if (!event) {
        return (
            <Centered>
                <ErrorText>Evento no encontrado</ErrorText>
            </Centered>
        );
    }

    const canAddContact = event.kind === 'unknown_person';

    return (
        <Container>
            <Stack.Screen options={{ title: 'Evento', headerRight: shareButton(event) }} />

            <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
                <EventCapture uri={event.imageUrl} />

                <Body>
                    <Title>{event.title}</Title>
                    <Subtitle>
                        {event.date}, {event.time}
                    </Subtitle>

                    <EventStatusBanner
                        severity={event.severity}
                        title={event.statusTitle}
                        description={event.statusDescription}
                    />

                    <SectionLabel>Detalle</SectionLabel>
                    <Card>
                        <Row>
                            <RowLabel>Tipo de evento</RowLabel>
                            <RowValue>{event.codeLabel}</RowValue>
                        </Row>
                        <Row>
                            <RowLabel>Resultado</RowLabel>
                            <RowValue>{event.verdictLabel}</RowValue>
                        </Row>
                        <RowLast>
                            <RowLabel>Severidad</RowLabel>
                            <RowValue>{event.severityLabel}</RowValue>
                        </RowLast>
                    </Card>

                    {canAddContact && (
                        <PrimaryButton onPress={handleAddContact}>
                            <MaterialCommunityIcons name="account-plus-outline" size={20} color="#fff" />
                            <PrimaryButtonText>Agregar como contacto</PrimaryButtonText>
                        </PrimaryButton>
                    )}
                </Body>
            </ScrollView>
        </Container>
    );
}

// ─── Styled Components ────────────────────────────────────────────────────────

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

const Centered = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  padding: 24px;
`;

const ErrorText = styled.Text`
  font-size: 14px;
  color: #777;
  text-align: center;
`;

const RetryButton = styled.Pressable`
  margin-top: 12px;
`;

const RetryText = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #6c4ef5;
`;

const Body = styled.View`
  padding: 20px;
`;

const Title = styled.Text`
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.3px;
`;

const Subtitle = styled.Text`
  font-size: 14px;
  color: #777;
  margin-top: 4px;
  margin-bottom: 16px;
`;

const SectionLabel = styled.Text`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: #8a8a8a;
  margin-top: 22px;
  margin-bottom: 10px;
`;

const Card = styled.View`
  border-width: 1px;
  border-color: #ececec;
  border-radius: 14px;
  padding: 0 14px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom-width: 1px;
  border-bottom-color: #f0f0f0;
  gap: 12px;
`;

const RowLast = styled(Row)`
  border-bottom-width: 0;
`;

const RowLabel = styled.Text`
  font-size: 14px;
  color: #777;
`;

const RowValue = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  flex-shrink: 1;
  text-align: right;
`;

const PrimaryButton = styled.Pressable`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: #6c4ef5;
  border-radius: 28px;
  padding: 15px;
  margin-top: 24px;
`;

const PrimaryButtonText = styled.Text`
  font-size: 15px;
  font-weight: 700;
  color: #fff;
`;
