import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../src/redux/store';
import React from 'react';
export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="product/[id]" options={{ title: 'Product Detail' }} />
        <Stack.Screen name="admin/create" options={{ title: 'Admin' }} />
        <Stack.Screen name="admin/edit/[id]" options={{ title: 'Edit Product' }} />
      </Stack>
    </Provider>
  );
}
