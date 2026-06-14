import { useContext } from 'react';
import { EventsContext } from '../context/EventsContext';

export const useEvents = () => {
  const context = useContext(EventsContext);

  if (context === null) {
    throw new Error('useEvents debe ser usado dentro de un EventsProvider');
  }

  return context;
};
