import React from 'react';
import { Button, IconButton, Text } from 'react-native-paper';
import styled from 'styled-components/native';

type EmptyStateProps = {
    onAdd: () => void;
};

export function EmptyState({ onAdd }: EmptyStateProps) {
    return (
        <EmptyContainer>
            <IconCircle>
                <IconButton icon="account-group-outline" size={48} iconColor="#6d28d9" />
            </IconCircle>
            <Text variant="titleLarge" style={{ fontWeight: 'bold', textAlign: 'center', marginTop: 16 }}>
                Todavia no agregaste contactos
            </Text>
            <Text variant="bodyMedium" style={{ color: '#6b7280', textAlign: 'center', marginTop: 8, paddingHorizontal: 24 }}>
                Agrega a las personas que queres que la IA reconozca en la puerta y defini a quien avisar si pasa algo.
            </Text>
            <Button mode="contained" icon="plus" style={{ marginTop: 24, borderRadius: 24 }} contentStyle={{ paddingVertical: 6 }} onPress={onAdd}>
                Agregar contacto
            </Button>
            <Button mode="text" icon="help-circle-outline" style={{ marginTop: 8 }}>
                Como funciona el reconocimiento?
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

const IconCircle = styled.View`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  border-width: 2px;
  border-style: dashed;
  border-color: #d1d5db;
  align-items: center;
  justify-content: center;
`;
