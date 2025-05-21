import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [orderSummary, setOrderSummary] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [shippingAddresses, setShippingAddresses] = useState<AddressType[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddNewAddress, setShowAddNewAddress] = useState(false);
  
  // Form fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  
  // New address fields
  const [newAddressFullName, setNewAddressFullName] = useState('');
  const [newAddressLine1, setNewAddressLine1] = useState('');
  const [newAddressLine2, setNewAddressLine2] = useState('');
  const [newAddressCity, setNewAddressCity] = useState('');
  const [newAddressState, setNewAddressState] = useState('');
  const [newAddressZip, setNewAddressZip] = useState('');
  const [newAddressCountry, setNewAddressCountry] = useState('United States');
  const [newAddressPhone, setNewAddressPhone] = useState('');

  useEffect(() => {
    fetchOrderSummary();
    fetchShippingAddresses();
  }, []);

  type AddressType = {
    id: number;
    fullName: string;
    line1: string;
    line2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: string;
    isDefault: boolean;
  };

  const fetchOrderSummary = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await fetch('https://api.example.com/checkout/summary');
      const data = await response.json();
      setOrderSummary(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching order summary:', err);
      setLoading(false);
      Alert.alert('Error', 'Failed to load checkout information. Please try again.');
    }
  };

  const fetchShippingAddresses = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch('https://api.example.com/user/addresses');
      const data = await response.json();
      setShippingAddresses(data);
      
      // Select the default address if available
      const defaultAddress = data.find(address => address.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      } else if (data.length > 0) {
        setSelectedAddressId(data[0].id);
      }
    } catch (err) {
      console.error('Error fetching shipping addresses:', err);
      Alert.alert('Error', 'Failed to load shipping addresses. Please try again.');
    }
  };

  const handleCardNumberChange = (text) => {
    // Format card number with spaces every 4 digits
    const formatted = text.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted.substring(0, 19)); // Limit to 16 digits + 3 spaces
  };

  const handleCardExpiryChange = (text) => {
    // Format as MM/YY
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length <= 2) {
      setCardExpiry(cleaned);
    } else {
      setCardExpiry(`${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`);
    }
  };

  const validateCardDetails = () => {
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      Alert.alert('Invalid Card', 'Please enter a valid 16-digit card number.');
      return false;
    }
    
    if (cardName.trim().length < 3) {
      Alert.alert('Invalid Name', 'Please enter the cardholder name.');
      return false;
    }
    
    if (cardExpiry.length !== 5) {
      Alert.alert('Invalid Expiry', 'Please enter a valid expiry date (MM/YY).');
      return false;
    }
    
    if (cardCvv.length < 3) {
      Alert.alert('Invalid CVV', 'Please enter a valid CVV code.');
      return false;
    }
    
    return true;
  };

  const validateShippingDetails = () => {
    if (!selectedAddressId && !showAddNewAddress) {
      Alert.alert('Shipping Address', 'Please select a shipping address.');
      return false;
    }
    
    if (showAddNewAddress) {
      if (!newAddressFullName || !newAddressLine1 || !newAddressCity || 
          !newAddressState || !newAddressZip || !newAddressPhone) {
        Alert.alert('Incomplete Address', 'Please fill in all required address fields.');
        return false;
      }
    }
    
    return true;
  };

  const handleAddNewAddress = () => {
    // Validate address fields
    if (!newAddressFullName || !newAddressLine1 || !newAddressCity || 
        !newAddressState || !newAddressZip || !newAddressPhone) {
      Alert.alert('Incomplete Address', 'Please fill in all required address fields.');
      return;
    }
    
    // Create a new address object
    const newAddress = {
      id: Date.now().toString(), // Temporary ID
      fullName: newAddressFullName,
      addressLine1: newAddressLine1,
      addressLine2: newAddressLine2,
      city: newAddressCity,
      state: newAddressState,
      zip: newAddressZip,
      country: newAddressCountry,
      phone: newAddressPhone,
      isDefault: shippingAddresses.length === 0
    };
    
    // Add to addresses list
    const updatedAddresses = [...shippingAddresses, newAddress];
    setShippingAddresses(updatedAddresses);
    setSelectedAddressId(newAddress.id);
    setShowAddNewAddress(false);
    
    // Reset form fields
    setNewAddressFullName('');
    setNewAddressLine1('');
    setNewAddressLine2('');
    setNewAddressCity('');
    setNewAddressState('');
    setNewAddressZip('');
    setNewAddressCountry('United States');
    setNewAddressPhone('');
    
    // You would typically also send this to your backend
    console.log('New address added:', newAddress);
  };

  const handlePlaceOrder = async () => {
    // Validate all details before proceeding
    if (!validateCardDetails() || !validateShippingDetails()) {
      return;
    }
    
    setProcessingPayment(true);
    
    // Simulate API call for payment processing
    setTimeout(() => {
      setProcessingPayment(false);
      
      // Generate a random order number
      const orderNumber = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Navigate to order confirmation
      navigation.reset({
        index: 0,
        routes: [{ 
          name: 'OrderConfirmation',
          params: { 
            orderNumber,
            orderTotal: orderSummary.total
          }
        }]
      });
    }, 2000);
  };

  const formatDeliveryDate = (method) => {
    const date = new Date();
    let days = 0;
    
    switch (method) {
      case 'express':
        days = 2;
        break;
      case 'nextDay':
        days = 1;
        break;
      case 'standard':
      default:
        days = 5;
        break;
    }
    
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getDeliveryCost = (method) => {
    switch (method) {
      case 'express':
        return 9.99;
      case 'nextDay':
        return 14.99;
      case 'standard':
      default:
        return 19.99;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkout</Text>
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Order Summary</Text>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Subtotal:</Text>
          <Text style={styles.summaryValue}>${orderSummary?.subtotal?.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Shipping:</Text>
          <Text style={styles.summaryValue}>${orderSummary?.shipping?.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Tax:</Text>
          <Text style={styles.summaryValue}>${orderSummary?.tax?.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total:</Text>
          <Text style={styles.summaryValue}>${orderSummary?.total?.toFixed(2)}</Text>
        </View>
      </View>
      <View style={styles.paymentContainer}>
        <Text style={styles.paymentTitle}>Payment Details</Text>
        <View style={styles.paymentItem}>
          <Text style={styles.paymentLabel}>Card Number:</Text>
          <Text style={styles.paymentValue}>{cardNumber}</Text>
        </View>
        <View style={styles.paymentItem}>
          <Text style={styles.paymentLabel}>Expiration Date:</Text>
          <Text style={styles.paymentValue}>{cardExpiry}</Text>
        </View>
        <View style={styles.paymentItem}>
          <Text style={styles.paymentLabel}>CVV:</Text>
          <Text style={styles.paymentValue}>{cardCvv}</Text>
        </View>
      </View>
      <View style={styles.shippingContainer}>
        <Text style={styles.shippingTitle}>Shipping Details</Text>
        <View style={styles.shippingItem}>
          <Text style={styles.shippingLabel}>Shipping Method:</Text>
          <Text style={styles.shippingValue}>{deliveryMethod}</Text>
        </View>
        <View style={styles.shippingItem}>
          <Text style={styles.shippingLabel}>Delivery Date:</Text>
          <Text style={styles.shippingValue}>{formatDeliveryDate(deliveryMethod)}</Text>
        </View>
        <View style={styles.shippingItem}>
          <Text style={styles.shippingLabel}>Delivery Cost:</Text>
          <Text style={styles.shippingValue}>${getDeliveryCost(deliveryMethod).toFixed(2)}</Text>
        </View>
      </View>
      <View style={styles.addressContainer}>
        <Text style={styles.addressTitle}>Shipping Address</Text>
        <View style={styles.addressItem}>
          <Text style={styles.addressLabel}>Full Name:</Text>
          <Text style={styles.addressValue}>{selectedAddress.fullName}</Text>
        </View>
        <View style={styles.addressItem}>
          <Text style={styles.addressLabel}>Address:</Text>
          <Text style={styles.addressValue}>{selectedAddress.line2}</Text>
        </View>
        <View style={styles.addressItem}>
          <Text style={styles.addressLabel}>City:</Text>
          <Text style={styles.addressValue}>{selectedAddress.city}</Text>
        </View>
        <View style={styles.addressItem}>
          <Text style={styles.addressLabel}>State:</Text>
          <Text style={styles.addressValue}>{selectedAddress.state}</Text>
        </View>
        <View style={styles.addressItem}>
          <Text style={styles.addressLabel}>Zip Code:</Text>
          <Text style={styles.addressValue}>{shippingAddress.zipCode}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
        <Text style={styles.placeOrderButtonText}>Place Order</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    summaryContainer: {
        marginBottom: 16,
        padding: 16,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    summaryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    summaryLabel: {
        fontWeight: 'bold',
    },
    summaryValue: {
        fontWeight: 'bold',
    },
    paymentContainer: {
        marginBottom: 16,
        padding: 16,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
    },
    paymentTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    paymentItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    paymentLabel: {
        fontWeight: 'bold',
    },
    paymentValue: {
        fontWeight: 'bold',
    },
    shippingContainer: {
        marginBottom: 16,
        padding: 16,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
    },
    shippingTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    shippingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    shippingLabel: {
        fontWeight: 'bold',
    },
    shippingValue: {
        fontWeight: 'bold',
    },
    addressContainer: {
        marginBottom: 16,
        padding: 16,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
    },
    addressTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,    
    },
    addressLabel: {
        fontWeight: 'bold',
    },
    addressValue: {
        fontWeight: 'bold',
    },
    addressItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    placeOrderButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    placeOrderButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default CheckoutScreen;
