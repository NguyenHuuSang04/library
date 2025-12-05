import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Product } from '../redux/cartSlice';

interface ProductItemProps {
  product: Product;
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ProductItem: React.FC<ProductItemProps> = ({ product, onPress, onEdit, onDelete }) => {
  return (
    <View style={styles.container}>
      <Pressable onPress={onPress} style={styles.content}>
        <Image source={{ uri: product.image }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>${product.price}</Text>
        </View>
      </Pressable>
      <View style={styles.actions}>
        {onEdit && (
          <Pressable onPress={onEdit} style={[styles.button, styles.editButton]}>
            <Text style={styles.buttonText}>Edit</Text>
          </Pressable>
        )}
        {onDelete && (
          <Pressable onPress={onDelete} style={[styles.button, styles.deleteButton]}>
            <Text style={styles.buttonText}>Del</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 14,
    color: 'green',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  editButton: {
    backgroundColor: '#2196F3',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default React.memo(ProductItem);
