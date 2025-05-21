import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

const CartScreen = () => {
    console.log('Inner Cart')
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  
  const navigation = useNavigation();

  type CartItem = {
    id: string;
    title: string;
    description: string;
    price: number;
    quantity: number;
    thumbnail: string;
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await fetch('https://dummyjson.com/carts/1');
      const data = await response.json();
      setCartItems(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch cart items. Please try again later.');
      setLoading(false);
      console.error('Error fetching cart items:', err);
    }
  };

  const handleQuantityChange = (itemId: string, change: number) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === itemId) {
        const newQuantity = item.quantity + change;
        
        if (newQuantity < 1) {
          return item;
        }
        
        if (newQuantity > 10) {
          Alert.alert('Maximum Quantity', 'You cannot add more than 10 items.');
          return item;
        }
        
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    
    setCartItems(updatedCart);
    // You would typically also update your backend or state management system here
  };

  const handleRemoveItem = (itemId) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Remove',
          onPress: () => {
            const updatedCart = cartItems.filter(item => item.id !== itemId);
            setCartItems(updatedCart);
            // You would typically also update your backend or state management system here
          }
        }
      ]
    );
  };

  const handleMoveToWishlist = (item) => {
    Alert.alert(
      'Move to Wishlist',
      'Move this item to your wishlist?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Move',
          onPress: () => {
            // Logic to add to wishlist would go here
            handleRemoveItem(item.id);
            console.log('Moved to wishlist:', item.name);
          }
        }
      ]
    );
  };

  const handleApplyPromo = () => {
    // This would typically validate the promo code against your backend
    // For now, we'll just simulate a successful promo code application
    if (promoCode.toLowerCase() === 'save20') {
      setPromoApplied(true);
      setDiscountAmount(calculateSubtotal() * 0.2); // 20% discount
      Alert.alert('Success', 'Promo code applied successfully!');
    } else {
      Alert.alert('Invalid Promo', 'The promo code you entered is invalid or expired.');
    }
  };

  const handleRemovePromo = () => {
    setPromoApplied(false);
    setDiscountAmount(0);
    setPromoCode('');
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateShipping = () => {
    // Simple shipping calculation logic
    const subtotal = calculateSubtotal();
    if (subtotal >= 100) return 0; // Free shipping over $100
    if (cartItems.length === 0) return 0;
    return 5.99; // Standard shipping fee
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = calculateShipping();
    return subtotal + shipping - discountAmount;
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Your cart is empty. Add some items before checking out.');
      return;
    }
    
    router.replace('/../screens/CheckoutScreen');
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        
        {item.size && (
          <Text style={styles.itemVariant}>Size: {item.size}</Text>
        )}
        
        {item.color && (
          <View style={styles.colorContainer}>
            <Text style={styles.itemVariant}>Color: </Text>
            <View style={[styles.colorIndicator, { backgroundColor: item.color.toLowerCase() }]} />
          </View>
        )}
        
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
        
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(item.id, -1)}
            disabled={item.quantity <= 1}
          >
            <Ionicons 
              name="remove" 
              size={16} 
              color={item.quantity <= 1 ? "#ccc" : "#333"} 
            />
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{item.quantity}</Text>
          
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(item.id, 1)}
            disabled={item.quantity >= 10}
          >
            <Ionicons 
              name="add" 
              size={16} 
              color={item.quantity >= 10 ? "#ccc" : "#333"} 
            />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.itemActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleRemoveItem(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#e74c3c" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleMoveToWishlist(item)}
        >
          <Ionicons name="heart-outline" size={20} color="#3498db" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="cart-outline" size={80} color="#ccc" />
      <Text style={styles.emptyTitle}>Your cart is empty</Text>
      <Text style={styles.emptySubtitle}>Looks like you haven't added any products to your cart yet.</Text>
      <TouchableOpacity 
        style={styles.shopNowButton}
        onPress={() => router.replace('/(drawer)/(tabs)/Home')}
      >
        <Text style={styles.shopNowButtonText}>Shop Now</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading your cart...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchCartItems}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Shopping Cart</Text>
      
      {cartItems.length === 0 ? (
        renderEmptyCart()
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={item => item.id.toString()}
            renderItem={renderCartItem}
            contentContainerStyle={styles.cartList}
            showsVerticalScrollIndicator={false}
          />
          
          <View style={styles.summaryContainer}>
            {/* Promo Code Section */}
            {!promoApplied ? (
              <View style={styles.promoContainer}>
                <TextInput
                  style={styles.promoInput}
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChangeText={setPromoCode}
                />
                <TouchableOpacity 
                  style={styles.promoButton}
                  onPress={handleApplyPromo}
                  disabled={!promoCode.trim()}
                >
                  <Text style={styles.promoButtonText}>Apply</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.appliedPromoContainer}>
                <View style={styles.appliedPromo}>
                  <Ionicons name="pricetag" size={16} color="#27ae60" />
                  <Text style={styles.appliedPromoText}>Promo "SAVE20" applied</Text>
                </View>
                <TouchableOpacity onPress={handleRemovePromo}>
                  <Ionicons name="close-circle" size={20} color="#e74c3c" />
                </TouchableOpacity>
              </View>
            )}
            
            {/* Order Summary */}
            <View style={styles.summarySection}>
              <Text style={styles.summaryTitle}>Order Summary</Text>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal ({cartItems.length} items)</Text>
                <Text style={styles.summaryValue}>${calculateSubtotal().toFixed(2)}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping</Text>
                <Text style={styles.summaryValue}>
                  {calculateShipping() === 0 ? 'Free' : `$${calculateShipping().toFixed(2)}`}
                </Text>
              </View>
              
              {promoApplied && (
                <View style={styles.summaryRow}>
                  <Text style={styles.discountLabel}>Discount</Text>
                  <Text style={styles.discountValue}>-${discountAmount.toFixed(2)}</Text>
                </View>
              )}
              
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${calculateTotal().toFixed(2)}</Text>
              </View>
            </View>
            
            {/* Checkout Button */}
            <TouchableOpacity 
              style={styles.checkoutButton}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 15,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  cartList: {
    paddingBottom: 20,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  itemVariant: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  colorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#eee',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  quantityText: {
    paddingHorizontal: 10,
    fontSize: 14,
    fontWeight: '500',
  },
  itemActions: {
    justifyContent: 'space-around',
    paddingLeft: 10,
  },
  actionButton: {
    padding: 5,
  },
  summaryContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  promoContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  promoInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  promoButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  promoButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  appliedPromoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e8f7f0',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  appliedPromo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appliedPromoText: {
    marginLeft: 5,
    color: '#27ae60',
    fontWeight: '500',
  },
  summarySection: {
    marginBottom: 15,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  discountLabel: {
    fontSize: 14,
    color: '#27ae60',
  },
  discountValue: {
    fontSize: 14,
    color: '#27ae60',
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 5,
    paddingTop: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3498db',
  },
  checkoutButton: {
    backgroundColor: '#3498db',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  shopNowButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  shopNowButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginHorizontal: 20,
  },
  retryButton: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#3498db',
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CartScreen;