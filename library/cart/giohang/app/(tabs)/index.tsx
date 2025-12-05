import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, StyleSheet, Button, Alert, Platform } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useFetch } from '../../src/hooks/useFetch';
import { useDebounce } from '../../src/hooks/useDebounce';
import ProductItem from '../../src/components/ProductItem';
import { Product } from '../../src/redux/cartSlice';
import { API_URL } from '../../src/constants/config';

export default function HomeScreen() {
  const router = useRouter();
  const { data, loading, error, refetch } = useFetch<Product[]>(API_URL);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  const filteredProducts = useMemo(() => {
    if (!data) return [];
    if (!debouncedSearch) return data;
    return data.filter(p => p.name.toLowerCase().includes(debouncedSearch.toLowerCase()));
  }, [data, debouncedSearch]);

  const handleDelete = async (id: string) => {
    const deleteProduct = async () => {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          refetch();
        } else {
          if (Platform.OS === 'web') {
            alert("Failed to delete product");
          } else {
            Alert.alert("Error", "Failed to delete product");
          }
        }
      } catch (error) {
        if (Platform.OS === 'web') {
          alert("An error occurred");
        } else {
          Alert.alert("Error", "An error occurred");
        }
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm("Are you sure you want to delete this product?")) {
        deleteProduct();
      }
    } else {
      Alert.alert(
        "Delete Product",
        "Are you sure you want to delete this product?",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Delete", 
            style: "destructive",
            onPress: deleteProduct
          }
        ]
      );
    }
  };

  if (loading) return <ActivityIndicator size="large" style={styles.center} />;
  if (error) return <Text style={styles.center}>Error: {error.message}</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shop</Text>
        <View style={styles.actions}>
           
            <Button title="Admin" onPress={() => router.push('/admin/create')} />
        </View>
      </View>
      
      <TextInput
        style={styles.input}
        placeholder="Search products..."
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ProductItem 
            product={item} 
            onPress={() => router.push(`/product/${item.id}`)} 
            onEdit={() => router.push({ pathname: '/admin/edit/[id]', params: { id: item.id } })}
            onDelete={() => handleDelete(item.id)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 24, fontWeight: 'bold' },
  actions: { flexDirection: 'row', gap: 10 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 8, borderRadius: 4 },
});
