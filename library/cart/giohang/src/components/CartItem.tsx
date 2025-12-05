import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { CartItem as CartItemType } from '../redux/cartSlice';

interface CartItemProps {
  item: CartItemType;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onIncrease, onDecrease, onRemove }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>${item.price}</Text>
      </View>
      <View style={styles.actions}>
        <Pressable onPress={() => onDecrease(item.id)} style={styles.button}>
          <Text>-</Text>
        </Pressable>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <Pressable onPress={() => onIncrease(item.id)} style={styles.button}>
          <Text>+</Text>
        </Pressable>
        <Pressable onPress={() => onRemove(item.id)} style={[styles.button, styles.removeButton]}>
          <Text style={styles.removeText}>X</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 12,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    marginHorizontal: 5,
  },
  quantity: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
  removeButton: {
    backgroundColor: '#ffdddd',
    marginLeft: 10,
  },
  removeText: {
    color: 'red',
  },
});

export default React.memo(CartItem);
