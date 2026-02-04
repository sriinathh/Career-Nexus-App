import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card, ProgressBar, CustomButton } from '../components/CommonComponents';
import AppHeader from '../components/AppHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://career-backend-p085.onrender.com/api/auth';
const FALLBACK_API_URL = 'https://career-backend-p085.onrender.com/api/auth';

// Mock data if API is not available
const MOCK_RECOMMENDATIONS = [
  {
    rank: 1,
    role: 'Software Engineer',
    match_percentage: 92,
    match_color: '#10B981',
    description: 'Build scalable applications using your strong programming skills',
    skills_required: ['Python', 'JavaScript', 'System Design', 'Problem Solving'],
    salary_range: '₹60L - ₹120L',
    growth_potential: 'Very High',
    reasoning: 'Your programming skills and problem-solving abilities align perfectly with this role.',
  },
  {
    rank: 2,
    role: 'Data Science Engineer',
    match_percentage: 87,
    match_color: '#F59E0B',
    description: 'Leverage data to drive business decisions',
    skills_required: ['Python', 'Statistics', 'Machine Learning', 'SQL'],
    salary_range: '₹55L - ₹110L',
    growth_potential: 'Very High',
    reasoning: 'Your analytical skills and technical background make you a great fit.',
  },
  {
    rank: 3,
    role: 'Cloud Solutions Architect',
    match_percentage: 82,
    match_color: '#06B6D4',
    description: 'Design cloud infrastructure for enterprise solutions',
    skills_required: ['AWS/Azure', 'Kubernetes', 'System Architecture', 'DevOps'],
    salary_range: '₹70L - ₹130L',
    growth_potential: 'High',
    reasoning: 'Your technical expertise and interest in cloud technologies align with this career.',
  },
];

export default function CareerRecommendation({ navigation }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
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

      console.log('📤 Fetching career recommendations from backend...');

      const response = await fetch(`${API_URL}/career-recommendations`, {
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
      console.log('✅ Recommendations received:', data);
      setRecommendations(data);
    } catch (error) {
      console.error('⚠️ Error fetching recommendations:', error.message);
      setError(error.message);
      // Use mock data as fallback
      setRecommendations(MOCK_RECOMMENDATIONS);
    } finally {
      setLoading(false);
    }
  };

  const TopMatch = ({ item }) => (
    <Card style={styles.topMatchCard}>
      <View style={styles.topMatchHeader}>
        <View style={styles.rankBadge}>
          <MaterialCommunityIcons name="crown" size={20} color="#FFD700" />
        </View>
        <View style={styles.topMatchTitle}>
          <Text style={styles.roleTitle}>{item.role}</Text>
          <Text style={styles.roleSubtitle}>Best Match for You</Text>
        </View>
      </View>

      <View style={styles.matchPercentageContainer}>
        <ProgressBar
          value={item.match_percentage}
          max={100}
          style={styles.matchProgressBar}
        />
      </View>

      <Text style={styles.description}>{item.description}</Text>

      <View style={styles.detailsGrid}>
        <View style={styles.detailItem}>
          <MaterialCommunityIcons name="currency-inr" size={18} color="#4F46E5" />
          <Text style={styles.detailLabel}>Salary</Text>
          <Text style={styles.detailValue}>{item.salary_range}</Text>
        </View>
        <View style={styles.detailItem}>
          <MaterialCommunityIcons name="trending-up" size={18} color="#10B981" />
          <Text style={styles.detailLabel}>Growth</Text>
          <Text style={styles.detailValue}>{item.growth_potential}</Text>
        </View>
      </View>

      <View style={styles.reasoningBox}>
        <MaterialCommunityIcons name="lightbulb" size={16} color="#F59E0B" />
        <Text style={styles.reasoningText}>{item.reasoning}</Text>
      </View>

      <Text style={styles.skillsLabel}>Required Skills:</Text>
      <View style={styles.skillsContainer}>
        {item.skills_required.map((skill) => (
          <View key={skill} style={styles.skillTag}>
            <Text style={styles.skillTagText}>{skill}</Text>
          </View>
        ))}
      </View>
    </Card>
  );

  const OtherRecommendation = ({ item }) => (
    <Card style={styles.recommendationCard}>
      <View style={styles.recommendationHeader}>
        <View style={styles.rankNumber}>
          <Text style={styles.rankText}>{item.rank}</Text>
        </View>
        <View style={styles.recommendationInfo}>
          <Text style={styles.recommendationRole}>{item.role}</Text>
          <Text style={styles.recommendationDescription}>{item.description}</Text>
        </View>
      </View>

      <View style={styles.recommendationMatch}>
        <View style={[styles.matchBadge, { backgroundColor: item.match_color + '20' }]}>
          <Text style={[styles.matchText, { color: item.match_color }]}>
            {item.match_percentage}%
          </Text>
        </View>
        <Text style={styles.matchLabel}>Match</Text>
      </View>
    </Card>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <AppHeader
          title="Career Recommendations"
          showBackButton
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Analyzing your profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" translucent={false} />
      <AppHeader
        title="Career Recommendations"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Introduction */}
        <Card style={styles.introCard}>
          <View style={styles.introContent}>
            <MaterialCommunityIcons name="lightbulb-on" size={24} color="#F59E0B" />
            <View style={styles.introText}>
              <Text style={styles.introTitle}>Your Best Matches</Text>
              <Text style={styles.introDescription}>
                Based on your skills and interests
              </Text>
            </View>
          </View>
        </Card>

        {/* Top Match */}
        {recommendations.length > 0 && (
          <TopMatch item={recommendations[0]} />
        )}

        {/* Other Recommendations */}
        {recommendations.length > 1 && (
          <View style={styles.otherSection}>
            <Text style={styles.otherTitle}>Other Great Matches</Text>
            {recommendations.slice(1).map((item) => (
              <OtherRecommendation key={item.role} item={item} />
            ))}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <CustomButton
            title="View Learning Roadmap"
            onPress={() => navigation.navigate('LearningRoadmap')}
            icon="road"
            style={styles.primaryButton}
          />
          <CustomButton
            title="Download Report"
            onPress={() => navigation.navigate('ReportDownload')}
            icon="download"
            variant="success"
            style={styles.secondaryButton}
          />
        </View>

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
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#4F46E5',
  },
  introCard: {
    backgroundColor: '#FFFBEB',
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
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
    fontSize: 15,
    fontWeight: '600',
    color: '#F59E0B',
    marginBottom: 4,
  },
  introDescription: {
    fontSize: 13,
    color: '#6B7280',
  },
  topMatchCard: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#4F46E5',
  },
  topMatchHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  rankBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  topMatchTitle: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  roleSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  matchPercentageContainer: {
    marginBottom: 16,
  },
  matchProgressBar: {
    marginVertical: 0,
  },
  description: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 16,
    lineHeight: 20,
  },
  detailsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 4,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 2,
  },
  reasoningBox: {
    backgroundColor: '#FFFBEB',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  reasoningText: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  skillsLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillTag: {
    backgroundColor: '#EEF2FF',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  skillTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5',
  },
  otherSection: {
    marginBottom: 24,
  },
  otherTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  recommendationCard: {
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recommendationHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  rankNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4F46E5',
  },
  recommendationInfo: {
    flex: 1,
  },
  recommendationRole: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  recommendationDescription: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  recommendationMatch: {
    alignItems: 'center',
    marginLeft: 12,
  },
  matchBadge: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  matchText: {
    fontSize: 14,
    fontWeight: '700',
  },
  matchLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  actionSection: {
    marginBottom: 24,
  },
  primaryButton: {
    marginBottom: 12,
  },
  secondaryButton: {
    marginBottom: 12,
  },
  bottomPadding: {
    height: 20,
  },
});
