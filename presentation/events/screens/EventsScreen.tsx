import React, { useCallback } from 'react';
import { FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useTheme, Text } from 'react-native-paper';
import styled from 'styled-components/native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useDevice } from '@/presentation/device/hooks/useDevice';
import { NoDeviceState } from '@/presentation/device/components/NoDeviceState';
import { useEvents } from '../hooks/useEvents';
import { FeaturedCard } from '../components/FeaturedCard';
import { EventRow } from '../components/EventRow';
import { EmptyEventsState } from '../components/EmptyEventsState';
import { HomeEvent } from '../types';
import { useSuggestedContact } from '@/presentation/contacts/hooks/useSuggestedContact';
import { usePhotoPicker } from '@/presentation/contacts/hooks/usePhotoPicker';
import { SuggestedContactModal } from '@/presentation/contacts/components/SuggestedContactModal';

export default function EventsScreen() {
    const theme = useTheme();
    const router = useRouter();
    const { urgentEvent, events, loading, error, refresh } = useEvents();
    const { suggestion, dismissSuggestion } = useSuggestedContact();
    const { setSelectedCaptures, addSuggestedCaptures } = usePhotoPicker();
    const { device, isLoading: isLoadingDevice, fetchDevice } = useDevice();

    // Se revalida al entrar al tab: el usuario puede vincular el timbre desde
    // la pantalla de Dispositivo y volver acá sin remontar la app.
    useFocusEffect(
        useCallback(() => {
            void fetchDevice();
        }, [fetchDevice]),
    );

    const handlePress = (event: HomeEvent) => {
        router.push(`/event/${event.trackId}`);
    };

    const handleAcceptSuggestion = () => {
        if (!suggestion) return;
        // Se agregan también a suggestedCaptures (no solo selectedCaptures) para
        // que sigan siendo visibles/seleccionables si el usuario reabre el
        // selector de fotos durante el alta (ver ChoosePhotoScreen.handleConfirm).
        // Van a suggestedCaptures y no a galleryCaptures porque son de origen
        // timbre/backend, no fotos importadas de la galería del teléfono.
        addSuggestedCaptures(suggestion.captures);
        setSelectedCaptures(suggestion.captures);
        dismissSuggestion();
        router.push({ pathname: '/contacts/new', params: { prefill: '1' } });
    };

    const hasContent = !!urgentEvent || events.length > 0;

    let content: React.ReactNode;

    // El spinner a pantalla completa es solo para la primera carga; en un refresh
    // posterior ya hay contenido y alcanza con el RefreshControl de la lista.
    if ((loading && !hasContent) || (isLoadingDevice && !device)) {
        content = (
            <CenteredView bg={theme.colors.background}>
                <ActivityIndicator color={theme.colors.primary} />
            </CenteredView>
        );
    } else if (!device) {
        // Sin timbre vinculado no hay eventos que registrar.
        content = (
            <CenteredView bg={theme.colors.background}>
                <NoDeviceState
                    title={'Vinculá tu timbre\npara empezar a registrar eventos'}
                    description="Cada vez que alguien toque el timbre vas a ver acá quién fue y cuándo. Vinculá un dispositivo para empezar."
                    onLink={() => router.push('/(app-name)/(tabs)/device/link-device')}
                />
            </CenteredView>
        );
    } else if (error) {
        content = (
            <CenteredView bg={theme.colors.background}>
                <Text style={{ color: theme.colors.error, marginBottom: 12 }}>{error}</Text>
                <Text style={{ color: theme.colors.primary }} onPress={refresh}>
                    Reintentar
                </Text>
            </CenteredView>
        );
    } else if (!hasContent) {
        content = (
            <Container bg={theme.colors.background}>
                <EmptyEventsState />
            </Container>
        );
    } else {
        content = (
            <Container bg={theme.colors.background}>
                {/* Evento urgente: fuera de cualquier scroll, siempre visible */}
                {urgentEvent && (
                    <FeaturedCard event={urgentEvent} onPress={handlePress} tag="Requiere atención" />
                )}

                {/* Único scroll de la pantalla: historial como lista plana,
                    sin agrupar por fecha. */}
                {events.length > 0 && (
                    <>
                        <SectionLabel color={theme.colors.onSurfaceVariant}>Historial</SectionLabel>
                        <FlatList
                            style={{ flex: 1 }}
                            data={events}
                            keyExtractor={(item) => item.id}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 32 }}
                            refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
                            renderItem={({ item }) => <EventRow event={item} onPress={handlePress} />}
                        />
                    </>
                )}
            </Container>
        );
    }

    return (
        <>
            {content}
            <SuggestedContactModal
                visible={!!suggestion}
                suggestion={suggestion}
                onAccept={handleAcceptSuggestion}
                onIgnore={() => dismissSuggestion()}
            />
        </>
    );
}

// ─── Styled Components ────────────────────────────────────────────────────────

const Container = styled.View<{ bg: string }>`
  flex: 1;
  background-color: ${({ bg }) => bg};
  padding: 16px 16px 0 16px;
`;

const CenteredView = styled.View<{ bg: string }>`
  flex: 1;
  background-color: ${({ bg }) => bg};
  justify-content: center;
  align-items: center;
`;

const SectionLabel = styled.Text<{ color: string }>`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: ${({ color }) => color};
  margin-bottom: 10px;
`;
