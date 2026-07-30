import React, { useState } from 'react';
import styled from 'styled-components/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export type ContactType = 'notify' | 'record';

export default function NewContactTypeScreen() {
    const router = useRouter();
    // Presente cuando se llega desde el modal de sugerencia de contacto, para
    // que la pantalla de detalles sepa que no debe limpiar las fotos precargadas.
    const { prefill } = useLocalSearchParams<{ prefill?: string }>();
    const [type, setType] = useState<ContactType>('notify');

    return (
        <Container>
            <Title>¿Qué tipo de contacto es?</Title>
            <Subtitle>Podés cambiarlo más adelante.</Subtitle>

            <OptionCard selected={type === 'notify'} onPress={() => setType('notify')}>
                <IconWrapper selected={type === 'notify'}>
                    <MaterialCommunityIcons
                        name="bell-outline"
                        size={22}
                        color={type === 'notify' ? '#6C4EF5' : '#666'}
                    />
                </IconWrapper>
                <OptionText>
                    <OptionTitle>A notificar</OptionTitle>
                    <OptionDescription>
                        Recibe alertas cuando hay un incidente. También guardás su rostro para que la IA lo reconozca.
                    </OptionDescription>
                </OptionText>
                <Radio selected={type === 'notify'}>
                    {type === 'notify' && <MaterialCommunityIcons name="check" size={13} color="#fff" />}
                </Radio>
            </OptionCard>

            <OptionCard selected={type === 'record'} onPress={() => setType('record')}>
                <IconWrapper selected={type === 'record'}>
                    <MaterialCommunityIcons
                        name="account-outline"
                        size={22}
                        color={type === 'record' ? '#0FA968' : '#666'}
                    />
                </IconWrapper>
                <OptionText>
                    <OptionTitle>Solo registrar</OptionTitle>
                    <OptionDescription>
                        Queda registrado para que la IA lo reconozca en la puerta. No recibe alertas.
                    </OptionDescription>
                </OptionText>
                <Radio selected={type === 'record'} />
            </OptionCard>

            <Footer>
                <Button
                    mode="contained"
                    onPress={() => router.push({
                        pathname: '/contacts/new/details',
                        params: prefill === '1' ? { type, prefill } : { type },
                    })}
                    contentStyle={{ height: 48 }}
                >
                    Continuar
                </Button>
                <Button
                    mode="text"
                    onPress={() => router.navigate('/contacts')}
                    style={{ marginTop: 4 }}
                    contentStyle={{ height: 44 }}
                >
                    Cancelar
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

const Title = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
`;

const Subtitle = styled.Text`
  font-size: 14px;
  color: #777;
  margin-top: 4px;
  margin-bottom: 20px;
`;

const OptionCard = styled.Pressable<{ selected: boolean }>`
  flex-direction: row;
  align-items: flex-start;
  border-width: 1.5px;
  border-color: ${({ selected }) => (selected ? '#6C4EF5' : '#E5E5EA')};
  background-color: ${({ selected }) => (selected ? '#F5F2FF' : '#fff')};
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 14px;
`;

const IconWrapper = styled.View<{ selected: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  align-items: center;
  justify-content: center;
  background-color: ${({ selected }) => (selected ? '#E9E3FF' : '#F0F0F0')};
  margin-right: 12px;
`;

const OptionText = styled.View`
  flex: 1;
`;

const OptionTitle = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
`;

const OptionDescription = styled.Text`
  font-size: 13px;
  color: #777;
  margin-top: 2px;
  line-height: 18px;
`;

const Radio = styled.View<{ selected: boolean }>`
  width: 22px;
  height: 22px;
  border-radius: 11px;
  align-items: center;
  justify-content: center;
  border-width: ${({ selected }) => (selected ? 0 : 1.5)}px;
  border-color: #ccc;
  background-color: ${({ selected }) => (selected ? '#6C4EF5' : 'transparent')};
`;

const Footer = styled.View`
  margin-top: auto;
`;
