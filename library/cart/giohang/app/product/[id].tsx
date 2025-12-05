import React, { useLayoutEffect } from 'react';
import { View, Text, Image, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useDispatch } from 'react-redux';
import { useFetch } from '../../src/hooks/useFetch';
import { addToCart, Product } from '../../src/redux/cartSlice';
import { API_URL } from '../../src/constants/config';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { data: product, loading, error } = useFetch<Product>(`${API_URL}/${id}`);

  useLayoutEffect(() => {
    if (product) {
      navigation.setOptions({ title: product.name });
    }
  }, [navigation, product]);

  if (loading) return <ActivityIndicator size="large" style={styles.center} />;
  if (error) return <Text style={styles.center}>Error: {error.message}</Text>;
  if (!product) return <Text style={styles.center}>Product not found</Text>;

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    alert('Added to cart!');
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>${product.price}</Text>
      <Text style={styles.description}>{product.description || 'No description available.'}</Text>
      <Button title="Add to Cart" onPress={handleAddToCart} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: 300, borderRadius: 10, marginBottom: 20 },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  price: { fontSize: 20, color: 'green', marginBottom: 10 },
  description: { fontSize: 16, color: '#666', marginBottom: 20 },
});
