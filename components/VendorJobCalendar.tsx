import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { supabase } from '../app/lib/supabase';

export default function VendorJobCalendar() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => { loadJobs(); }, []);

  const loadJobs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: userData } = await supabase.from('users').select('vendor_id').eq('id', user?.id).single();
      
      const { data } = await supabase
        .from('vendor_assignments')
        .select('*, maintenance_requests(*)')
        .eq('vendor_id', userData?.vendor_id)
        .in('status', ['assigned', 'in_progress'])
        .order('scheduled_date', { ascending: true });
      
      setJobs(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const getDaysInMonth = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
    for (let i = 1; i <= lastDay.getDate(); i++) days.push(i);
    
    return days;
  };

  const hasJobOnDate = (day: number) => {
    const dateStr = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day).toISOString().split('T')[0];
    return jobs.some(j => j.scheduled_date?.startsWith(dateStr));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}>
          <Text style={styles.navBtn}>←</Text>
        </TouchableOpacity>
        <Text style={styles.monthYear}>{selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</Text>
        <TouchableOpacity onPress={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}>
          <Text style={styles.navBtn}>→</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.weekDays}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <Text key={d} style={styles.weekDay}>{d}</Text>)}
      </View>
      
      <View style={styles.daysGrid}>
        {getDaysInMonth().map((day, i) => (
          <View key={i} style={styles.dayCell}>
            {day && <Text style={styles.dayNumber}>{day}</Text>}
            {day && hasJobOnDate(day) && <View style={styles.jobDot} />}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', borderRadius: 12, padding: 16, margin: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  navBtn: { fontSize: 24, color: '#007AFF', paddingHorizontal: 12 },
  monthYear: { fontSize: 18, fontWeight: '600' },
  weekDays: { flexDirection: 'row', marginBottom: 10 },
  weekDay: { flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '600', color: '#666' },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: '14.28%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  dayNumber: { fontSize: 14 },
  jobDot: { position: 'absolute', bottom: 8, width: 6, height: 6, borderRadius: 3, backgroundColor: '#007AFF' }
});
