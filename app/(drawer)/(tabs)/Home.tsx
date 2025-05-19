import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, RefreshControl, TextInput, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { images } from '@/assets/images';

const mockProducts = [
  { id: '1', title: 'Wireless Headphones', price: '$59.99', image: images.headphones },
  { id: '2', title: 'Smart Watch', price: '$129.99', image: images.watch },
  { id: '3', title: 'Bluetooth Speaker', price: '$39.99', image: images.speaker },
  { id: '4', title: 'Phones', price: '$449', image: images.phone },
];

const mockCategories = ['Headphones', 'Watches', 'Speakers', 'Phones'];

export default function HomeScreen() {
  
  type Product = {
    id: string;
    title: string;
    price: string;
    image: ImageSourcePropType;
  };

  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [products, setProducts] = useState(mockProducts); 
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setProducts(mockProducts);
    });
    return unsubscribe;
  }, [navigation]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate API refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const handleCategoryPress = (category: string) => {
    const filtered = mockProducts.filter(product =>
      product.title.toLowerCase().includes(category.toLowerCase())
    );
    setProducts(filtered);
  };
  

  const renderProduct = ({ item } : { item: Product }) => (
    <Pressable
      onPress={() => handleCategoryPress(item.title)}
      style={{
        margin: 10,
        borderRadius: 12,
        backgroundColor: '#fff',
        padding: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <Image source={item.image} style={{ width: '100%', height: 150, borderRadius: 10 }} resizeMode="contain" />
      <ThemedText style={{ color: '#333', marginTop: 10, fontSize: 16, fontWeight: '600' }}>{item.title}</ThemedText>
      <ThemedText style={{ color: '#999 ', fontSize: 14 }}>{item.price}</ThemedText>
    </Pressable>
  );

  return (
    <ThemedView style={{ flex: 1, paddingHorizontal: 16, paddingTop: 50 }}>
      {/* Header */}
      <ThemedText style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 12, color: '#333', lineHeight: 32 }}>Welcome 👋</ThemedText>

      {/* Search */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 12,
        paddingHorizontal: 10,
        marginBottom: 20,
      }}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          placeholder="Search products..."
          value={search}
          onChangeText={setSearch}
          style={{ flex: 1, marginLeft: 8, paddingVertical: 8 }}
        />
      </View>

      {/* Categories */}
      <FlatList
        horizontal
        data={mockCategories}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ marginBottom: 10, gap: 4 }}
        renderItem={({ item }) => (
            <ThemedText>{item}</ThemedText>
        )}
      />

      {/* Products */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 20, gap: 10 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}
