import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card } from '../components/CommonComponents';
import AppHeader from '../components/AppHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://10.0.2.2:5000/api/auth';
const FALLBACK_API_URL = 'http://192.168.1.4:5000/api/auth';

export default function Help({ navigation }) {
  const [helpData, setHelpData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHelpData();
  }, []);

  const fetchHelpData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get token from storage
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      console.log('📤 Fetching help data from backend...');

      const response = await fetch(`${API_URL}/help`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Help data received:', data);
      setHelpData(data);
    } catch (error) {
      console.error('⚠️ Error fetching help data:', error.message);
      setError(error.message);
      // Use mock data as fallback
      setHelpData({
        faqs: [
          {
            question: 'How do I complete the skill assessment?',
            answer: 'Rate your skills on a scale of 1-10 for each category. Be honest about your current proficiency level.'
          },
          {
            question: 'What should I include in the interest analysis?',
            answer: 'Answer based on your genuine preferences. There are no right or wrong answers.'
          },
          {
            question: 'How are career recommendations generated?',
            answer: 'Recommendations are based on your skill assessment and interest analysis results.'
          },
          {
            question: 'Can I retake the assessments?',
            answer: 'Yes, you can update your assessments anytime to get new recommendations.'
          }
        ],
        contact: {
          email: 'support@careernexus.com',
          phone: '+91-XXXXXXXXXX'
        },
        resources: [
          'Career Guidance Blog',
          'Skill Development Courses',
          'Industry Reports',
          'Mentorship Program'
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const FAQItem = ({ faq, index }) => (
    <Card key={index} style={styles.faqCard}>
      <View style={styles.faqContent}>
        <View style={styles.faqHeader}>
          <MaterialCommunityIcons name="help-circle" size={20} color="#4F46E5" />
          <Text style={styles.faqQuestion}>{faq.question}</Text>
        </View>
        <Text style={styles.faqAnswer}>{faq.answer}</Text>
      </View>
    </Card>
  );

  const ResourceItem = ({ resource, index }) => (
    <View key={index} style={styles.resourceItem}>
      <MaterialCommunityIcons name="link" size={20} color="#10B981" />
      <Text style={styles.resourceText}>{resource}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" translucent={false} />
      <AppHeader
        title="Help & Support"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text style={styles.loadingText}>Loading help information...</Text>
          </View>
        ) : error ? (
          <Card style={styles.errorCard}>
            <View style={styles.errorContent}>
              <MaterialCommunityIcons name="alert-circle" size={48} color="#EF4444" />
              <Text style={styles.errorTitle}>Unable to Load Help</Text>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={fetchHelpData}>
                <Text style={styles.retryText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          </Card>
        ) : (
          <>
            {/* Introduction */}
            <Card style={styles.introCard}>
              <View style={styles.introContent}>
                <MaterialCommunityIcons name="lifebuoy" size={24} color="#06B6D4" />
                <View style={styles.introText}>
                  <Text style={styles.introTitle}>How can we help you?</Text>
                  <Text style={styles.introDescription}>
                    Find answers to common questions and get support for your career journey
                  </Text>
                </View>
              </View>
            </Card>

            {/* FAQ Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
              {helpData?.faqs?.map((faq, index) => (
                <FAQItem key={index} faq={faq} index={index} />
              ))}
            </View>

            {/* Contact Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact Support</Text>
              <Card style={styles.contactCard}>
                <View style={styles.contactContent}>
                  <View style={styles.contactItem}>
                    <MaterialCommunityIcons name="email" size={20} color="#4F46E5" />
                    <Text style={styles.contactText}>{helpData?.contact?.email}</Text>
                  </View>
                  <View style={styles.contactItem}>
                    <MaterialCommunityIcons name="phone" size={20} color="#10B981" />
                    <Text style={styles.contactText}>{helpData?.contact?.phone}</Text>
                  </View>
                </View>
              </Card>
            </View>

            {/* Resources Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Additional Resources</Text>
              <Card style={styles.resourcesCard}>
                <View style={styles.resourcesContent}>
                  {helpData?.resources?.map((resource, index) => (
                    <ResourceItem key={index} resource={resource} index={index} />
                  ))}
                </View>
              </Card>
            </View>
          </>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  errorCard: {
    margin: 20,
    backgroundColor: '#FEF2F2',
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  errorContent: {
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#DC2626',
    marginTop: 12,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#7F1D1D',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  introCard: {
    backgroundColor: '#CFFAFE',
    borderLeftWidth: 4,
    borderLeftColor: '#06B6D4',
    marginBottom: 24,
  },
  introContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  introText: {
    marginLeft: 12,
    flex: 1,
  },
  introTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0C4A6E',
    marginBottom: 4,
  },
  introDescription: {
    fontSize: 14,
    color: '#0C4A6E',
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  faqCard: {
    marginBottom: 12,
  },
  faqContent: {
    padding: 16,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
    flex: 1,
    lineHeight: 22,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginLeft: 28,
  },
  contactCard: {
    backgroundColor: '#EEF2FF',
  },
  contactContent: {
    padding: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
  },
  resourcesCard: {
    backgroundColor: '#F0FDF4',
  },
  resourcesContent: {
    padding: 16,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  resourceText: {
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
  },
  bottomPadding: {
    height: 20,
  },
});