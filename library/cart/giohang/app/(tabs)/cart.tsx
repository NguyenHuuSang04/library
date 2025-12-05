import React, { useMemo, useCallback } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../src/redux/store';
import { removeFromCart, increaseQuantity, decreaseQuantity, clearCart } from '../../src/redux/cartSlice';
import CartItem from '../../src/components/CartItem';

export default function CartScreen() {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();

  const totalPrice = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  const handleIncrease = useCallback((id: string) => {
    dispatch(increaseQuantity(id));
  }, [dispatch]);

  const handleDecrease = useCallback((id: string) => {
    dispatch(decreaseQuantity(id));
  }, [dispatch]);

  const handleRemove = useCallback((id: string) => {
    dispatch(removeFromCart(id));
  }, [dispatch]);

  const handleClear = () => {
    dispatch(clearCart());
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <CartItem
            item={item}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
            onRemove={handleRemove}
          />
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Your cart is empty.</Text>}
      />
      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: ${totalPrice.toFixed(2)}</Text>
        <Button title="Clear Cart" onPress={handleClear} color="red" />
        <Button title="Checkout" onPress={() => alert('Checkout not implemented')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  emptyText: { textAlign: 'center', marginTop: 20, fontSize: 18, color: '#666' },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#ccc', gap: 10 },
  totalText: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
});
