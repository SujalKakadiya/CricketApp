import React, { useEffect, useState, useCallback } from 'react';
import { View,  FlatList,  RefreshControl,  TextInput,  Image,  Pressable,  ActivityIndicator,  StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from 'react-native';
import Api from '@/services/api/client';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/products/cart/actions';
import { Product } from '@/products/types';
import { router } from 'expo-router';

export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  // Get cart total items count from Redux store
  const cartItemsCount = useSelector((state: any) => state.cart?.totalItems ?? 0);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await Api.get('/products');
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
      Alert.alert(
        'Error',
        'Failed to load products. Please try again later.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  }, []);

  const handleAddToCart = (product: Product) => {
    // Dispatch add to cart action
    dispatch(addToCart(product));
    
    // Show success message
    Alert.alert(
      'Added to Cart',
      `${product.title} has been added to your cart.`,
      [
        { 
          text: 'View Cart',
          onPress: () => router.replace('../screens/CartScreen'),
        },
        { 
          text: 'Continue Shopping',
          style: 'cancel'
        }
      ]
    );
  };

  const handleBuyNow = (product: Product) => {
    // Add to cart and navigate to checkout
    dispatch(addToCart(product));
    navigation.navigate('Checkout', { directBuy: true, productId: product.id });
  };

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <Pressable
        onPress={() => {
          router.replace('../screens/ProductDetails', { productId: item.id });
        }}
        style={styles.productImageContainer}
      >
        <Image
          source={{ uri: item.thumbnail }}
          style={styles.productImage}
        />
      </Pressable>
      
      <View style={styles.productInfo}>
        <Text 
          style={styles.productTitle}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.title}
        </Text>
        <Text style={styles.productPrice}>${item.price}</Text>
        
        <View style={styles.productActions}>
          <TouchableOpacity 
            style={styles.addToCartButton}
            onPress={() => handleAddToCart(item)}
          >
            <Ionicons name="cart-outline" size={18} color="#FFFFFF" />
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.buyNowButton}
            onPress={() => handleBuyNow(item)}
          >
            <Text style={styles.buttonText}>Buy</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome 👋</Text>  
        <TouchableOpacity 
          style={styles.cartButton}
          onPress={() => router.push("/cart")
}
        >
          <Ionicons name="cart" size={24} color="#007AFF" />
          {cartItemsCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {cartItemsCount > 99 ? '99+' : cartItemsCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          placeholder="Search products..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Loading Indicator */}
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProductItem}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={['#007AFF']} 
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>
                {search ? 'No products found matching your search.' : 'No products available.'}
              </Text>
            </View>
          }
          numColumns={2}
          columnWrapperStyle={styles.productRow}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  cartButton: {
    padding: 8,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 10,
    fontSize: 15,
  },
  loader: {
    marginTop: 50
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
  },
  productRow: {
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  productCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  productImageContainer: {
    width: '100%',
    aspectRatio: 1,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 10,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 8,
  },
  productActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  addToCartButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyNowButton: {
    flex: 1,
    backgroundColor: '#FF3B30',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 2,
  }
});