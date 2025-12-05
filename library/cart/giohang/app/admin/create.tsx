import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { API_URL } from '../../src/constants/config';

export default function CreateProductScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [errors, setErrors] = useState<{ name?: string; price?: string; image?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nameInputRef = useRef<TextInput>(null);
  const prevPriceRef = useRef<string>('');

  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    prevPriceRef.current = price;
  }, [price]);

  const validate = () => {
    let valid = true;
    let newErrors: { name?: string; price?: string; image?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }
    if (!price.trim() || isNaN(Number(price))) {
      newErrors.price = 'Valid price is required';
      valid = false;
    }
    if (!image.trim()) {
      newErrors.image = 'Image URL is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (validate()) {
      setIsSubmitting(true);
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            price: Number(price),
            image,
            description: 'New product',
          }),
        });

        if (response.ok) {
          Alert.alert('Success', `Product "${name}" created!`);
          router.back();
        } else {
          Alert.alert('Error', 'Failed to create product');
        }
      } catch (error) {
        Alert.alert('Error', 'An error occurred');
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Product Name</Text>
      <TextInput
        ref={nameInputRef}
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter product name"
      />
      {errors.name && <Text style={styles.error}>{errors.name}</Text>}

      <Text style={styles.label}>Price</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        placeholder="Enter price"
        keyboardType="numeric"
      />
      {errors.price && <Text style={styles.error}>{errors.price}</Text>}

      <Text style={styles.label}>Image URL</Text>
      <TextInput
        style={styles.input}
        value={image}
        onChangeText={setImage}
        placeholder="Enter image URL"
      />
      {errors.image && <Text style={styles.error}>{errors.image}</Text>}

      <Button title={isSubmitting ? "Creating..." : "Create Product"} onPress={handleSubmit} disabled={isSubmitting} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  label: { fontSize: 16, marginBottom: 5, fontWeight: 'bold' },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 8, borderRadius: 4 },
  error: { color: 'red', marginBottom: 10 },
});
