import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Linking } from 'react-native';
import { supabase } from '../lib/supabase';
import PayoutRequestCard from '../../components/PayoutRequestCard';

export default function LandlordPayouts() {
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [requests, setRequests] = useState<any[]>([]);
  const [landlordId, setLandlordId] = useState('');
  const [stripeAccount, setStripeAccount] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: landlord } = await supabase
        .from('landlords')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!landlord) return;
      setLandlordId(landlord.id);

      // Get available balance
      const { data: transactions } = await supabase
        .from('revenue_transactions')
        .select('landlord_amount')
        .eq('landlord_id', landlord.id);

      const { data: payouts } = await supabase
        .from('payout_requests')
        .select('amount')
        .eq('landlord_id', landlord.id)
        .in('status', ['completed', 'processing']);

      const earned = transactions?.reduce((sum, t) => sum + parseFloat(t.landlord_amount), 0) || 0;
      const paid = payouts?.reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0;
      setBalance(earned - paid);

      // Get payout requests
      const { data: reqData } = await supabase
        .from('payout_requests')
        .select('*')
        .eq('landlord_id', landlord.id)
        .order('created_at', { ascending: false });

      setRequests(reqData || []);

      // Get Stripe account
      const { data: acct } = await supabase
        .from('payout_accounts')
        .select('*')
        .eq('landlord_id', landlord.id)
        .single();

      setStripeAccount(acct);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupStripeConnect = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase.functions.invoke('setup-stripe-connect', {
        body: {
          landlordId,
          email: user?.email,
          returnUrl: 'myapp://landlord/payouts',
          refreshUrl: 'myapp://landlord/payouts'
        }
      });

      if (error) throw error;
      
      if (data.onboardingUrl) {
        await Linking.openURL(data.onboardingUrl);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const requestPayout = async () => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt < 50) {
      Alert.alert('Error', 'Minimum payout is $50');
      return;
    }

    if (amt > balance) {
      Alert.alert('Error', 'Insufficient balance');
      return;
    }

    try {
      const { error } = await supabase.functions.invoke('create-payout-request', {
        body: { landlordId, amount: amt }
      });

      if (error) throw error;

      Alert.alert('Success', 'Payout request submitted');
      setAmount('');
      loadData();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Payouts</Text>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceAmount}>${balance.toFixed(2)}</Text>
      </View>

      {!stripeAccount?.payouts_enabled ? (
        <TouchableOpacity style={styles.setupBtn} onPress={setupStripeConnect}>
          <Text style={styles.setupText}>Setup Payout Account</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.requestCard}>
          <Text style={styles.label}>Request Withdrawal (Min $50)</Text>
          <TextInput
            style={styles.input}
            placeholder="Amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          <TouchableOpacity style={styles.requestBtn} onPress={requestPayout}>
            <Text style={styles.requestText}>Request Payout</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.subtitle}>Payout History</Text>
      {requests.map(req => (
        <PayoutRequestCard key={req.id} request={req} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 16 },
  balanceCard: { backgroundColor: '#3b82f6', padding: 24, borderRadius: 16, marginBottom: 16 },
  balanceLabel: { color: '#fff', fontSize: 16, marginBottom: 8 },
  balanceAmount: { color: '#fff', fontSize: 36, fontWeight: 'bold' },
  setupBtn: { backgroundColor: '#10b981', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 16 },
  setupText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  requestCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 16 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 12, fontSize: 16 },
  requestBtn: { backgroundColor: '#3b82f6', padding: 14, borderRadius: 8, alignItems: 'center' },
  requestText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  subtitle: { fontSize: 20, fontWeight: 'bold', marginTop: 8, marginBottom: 12 }
});
