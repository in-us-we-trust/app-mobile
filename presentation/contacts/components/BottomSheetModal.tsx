import React from 'react';
import { Modal, Pressable } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import styled from 'styled-components/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type BottomSheetModalProps = {
    visible: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
};

export function BottomSheetModal({ visible, onClose, title, children }: BottomSheetModalProps) {
    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <Backdrop onPress={onClose}>
                <KeyboardAvoidingView
                    behavior="padding"
                    style={{ width: '100%' }}
                >
                    {/* onPress vacío para que el toque no se propague al Backdrop y cierre el modal */}
                    <Pressable onPress={() => {}}>
                        <Sheet>
                            <Handle />
                            <Header>
                                <Title>{title}</Title>
                                <CloseButton onPress={onClose} hitSlop={10}>
                                    <MaterialCommunityIcons name="close" size={16} color="#666" />
                                </CloseButton>
                            </Header>
                            {children}
                        </Sheet>
                    </Pressable>
                </KeyboardAvoidingView>
            </Backdrop>
        </Modal>
    );
}

// ---------- Estilos ----------

const Backdrop = styled.Pressable`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.4);
  justify-content: flex-end;
`;

const Sheet = styled.View`
  background-color: #fff;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 12px 20px 28px;
`;

const Handle = styled.View`
  width: 36px;
  height: 4px;
  border-radius: 2px;
  background-color: #ddd;
  align-self: center;
  margin-bottom: 16px;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
`;

const CloseButton = styled.Pressable`
  width: 28px;
  height: 28px;
  border-radius: 14px;
  background-color: #f0f0f0;
  align-items: center;
  justify-content: center;
`;
