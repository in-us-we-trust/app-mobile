import React from 'react';
import { IconButton, Text } from 'react-native-paper';
import styled from 'styled-components/native';

type AddContactRowProps = {
    onPress: () => void;
};

export function AddContactRow({ onPress }: AddContactRowProps) {
    return (
        <AddRowCard onPress={onPress}>
            <PlusCircle>
                <IconButton icon="plus" size={20} iconColor="#6d28d9" style={{ margin: 0 }} />
            </PlusCircle>
            <RowContent>
                <Text variant="titleMedium" style={{ fontWeight: '600', color: '#6d28d9' }}>
                    Agregar contacto
                </Text>
            </RowContent>
        </AddRowCard>
    );
}

const AddRowCard = styled.Pressable`
  flex-direction: row;
  align-items: center;
  padding: 14px;
  background-color: #fff;
  border-radius: 16px;
  margin-bottom: 10px;
  border-width: 1.5px;
  border-style: dashed;
  border-color: #c4b5fd;
`;

const PlusCircle = styled.View`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  border-width: 1.5px;
  border-color: #c4b5fd;
  align-items: center;
  justify-content: center;
`;

const RowContent = styled.View`
  flex: 1;
  margin-left: 12px;
`;
