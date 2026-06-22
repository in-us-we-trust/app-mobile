import React from 'react';
import { Button, Text } from 'react-native-paper';
import styled from 'styled-components/native';

type EmptyFilterStateProps = {
    tab: 'cercanos' | 'conocidos';
    onAdd: () => void;
};

export function EmptyFilterState({ tab, onAdd }: EmptyFilterStateProps) {
    const message =
        tab === 'cercanos'
            ? 'Todavia no marcaste a nadie como contacto cercano.'
            : 'Todavia no agregaste conocidos.';

    return (
        <EmptyContainer>
            <Text variant="bodyMedium" style={{ color: '#6b7280', textAlign: 'center', marginBottom: 20 }}>
                {message}
            </Text>
            <Button mode="contained" icon="plus" style={{ borderRadius: 24 }} contentStyle={{ paddingVertical: 6 }} onPress={onAdd}>
                Agregar contacto
            </Button>
        </EmptyContainer>
    );
}

const EmptyContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;
