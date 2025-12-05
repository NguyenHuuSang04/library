import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '@/store/store';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="create"
          options={{ title: 'Create Task' }}
        />
        <Stack.Screen
          name="[id]"
          options={{ title: 'Edit Task' }}
        />
      </Stack>
    </Provider>
  );
}