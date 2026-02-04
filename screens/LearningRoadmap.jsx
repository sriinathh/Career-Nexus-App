import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card } from '../components/CommonComponents';
import AppHeader from '../components/AppHeader';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

const API_URL = 'https://career-backend-p085.onrender.com/api/auth';
const FALLBACK_API_URL = 'https://career-backend-p085.onrender.com/api/auth';

const ROADMAP_DATA = [
  {
    phase: 'Beginner',
    duration: '3-4 Months',
    color: '#3B82F6',
    skills: [
      'Python Fundamentals',
      'Data Structures',
      'Git & GitHub',
      'SQL Basics',
    ],
    tools: ['Python', 'VS Code', 'Git', 'SQLite'],
    projects: ['Calculator App', 'Todo List', 'Data Analysis Script'],
  },
  {
    phase: 'Intermediate',
    duration: '4-6 Months',
    color: '#8B5CF6',
    skills: [
      'Web Development',
      'APIs & REST',
      'Database Design',
      'Testing',
    ],
    tools: ['Node.js', 'React', 'PostgreSQL', 'Jest'],
    projects: ['E-commerce API', 'Chat Application', 'Dashboard'],
  },
  {
    phase: 'Advanced',
    duration: '6+ Months',
    color: '#EC4899',
    skills: [
      'System Design',
      'Cloud Architecture',
      'DevOps',
      'Scalability',
    ],
    tools: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
    projects: ['Microservices', 'Cloud Migration', 'ML Pipeline'],
  },
];

export default function LearningRoadmap({ navigation }) {
  const [roadmap, setRoadmap] = useState(ROADMAP_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const fetchRoadmap = async () => {
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

      console.log('📤 Fetching learning roadmap from backend...');

      const response = await fetch(`${API_URL}/learning-roadmap`, {
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
      console.log('✅ Roadmap received:', data);
      setRoadmap(data);
    } catch (error) {
      console.error('⚠️ Error fetching roadmap:', error.message);
      setError(error.message);
      // Use mock data as fallback
      setRoadmap(ROADMAP_DATA);
    } finally {
      setLoading(false);
    }
  };

  const RoadmapPhase = ({ item }) => (
    <Card style={styles.phaseCard}>
      <LinearGradient
        colors={[item.color + '20', item.color + '05']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.phaseGradient}
      >
        <View style={styles.phaseHeader}>
          <View style={[styles.phaseBadge, { backgroundColor: item.color }]}>
            <MaterialCommunityIcons
              name={
                item.phase === 'Beginner'
                  ? 'play-circle'
                  : item.phase === 'Intermediate'
                  ? 'progress-clock'
                  : 'star'
              }
              size={24}
              color="white"
            />
          </View>
          <View style={styles.phaseInfo}>
            <Text style={styles.phaseName}>{item.phase}</Text>
            <Text style={styles.phaseDuration}>{item.duration}</Text>
          </View>
        </View>

        <View style={styles.phaseContent}>
          {/* Skills */}
          <View style={styles.contentSection}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="brain" size={16} color={item.color} />
              <Text style={[styles.sectionTitle, { color: item.color }]}>
                Skills to Learn
              </Text>
            </View>
            <View style={styles.itemsList}>
              {item.skills.map((skill) => (
                <View key={skill} style={styles.listItem}>
                  <Text style={styles.listDot}>•</Text>
                  <Text style={styles.listItemText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Tools */}
          <View style={styles.contentSection}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="wrench" size={16} color={item.color} />
              <Text style={[styles.sectionTitle, { color: item.color }]}>
                Tools & Technologies
              </Text>
            </View>
            <View style={styles.tagsContainer}>
              {item.tools.map((tool) => (
                <View
                  key={tool}
                  style={[styles.tag, { backgroundColor: item.color + '20' }]}
                >
                  <Text style={[styles.tagText, { color: item.color }]}>
                    {tool}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Projects */}
          <View style={styles.contentSection}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="clipboard-list" size={16} color={item.color} />
              <Text style={[styles.sectionTitle, { color: item.color }]}>
                Practice Projects
              </Text>
            </View>
            <View style={styles.itemsList}>
              {item.projects.map((project) => (
                <View key={project} style={styles.listItem}>
                  <Text style={styles.listDot}>✓</Text>
                  <Text style={styles.listItemText}>{project}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </LinearGradient>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" translucent={false} />
      <AppHeader
        title="Learning Roadmap"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text style={styles.loadingText}>Generating your personalized roadmap...</Text>
          </View>
        ) : error ? (
          <Card style={styles.errorCard}>
            <View style={styles.errorContent}>
              <MaterialCommunityIcons name="alert-circle" size={48} color="#EF4444" />
              <Text style={styles.errorTitle}>Unable to Load Roadmap</Text>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={fetchRoadmap}>
                <Text style={styles.retryText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          </Card>
        ) : (
          <>
            {/* Introduction */}
            <Card style={styles.introCard}>
              <View style={styles.introContent}>
                <MaterialCommunityIcons name="map" size={24} color="#06B6D4" />
                <View style={styles.introText}>
                  <Text style={styles.introTitle}>Your Personalized Path</Text>
                  <Text style={styles.introDescription}>
                    Follow this step-by-step roadmap to reach your career goal
                  </Text>
                </View>
              </View>
            </Card>

            {/* Timeline */}
            <View style={styles.timelineContainer}>
              {roadmap.map((phase, index) => (
                <View key={phase.phase}>
                  <RoadmapPhase item={phase} />
                  {index < roadmap.length - 1 && (
                    <View style={styles.timelineConnector}>
                      <MaterialCommunityIcons name="arrow-down" size={24} color="#D1D5DB" />
                    </View>
                  )}
                </View>
              ))}
            </View>

            {/* Estimated Timeline */}
            <Card style={styles.timelineCard}>
              <View style={styles.timelineCardContent}>
                <MaterialCommunityIcons name="clock" size={24} color="#10B981" />
                <View style={styles.timelineCardText}>
                  <Text style={styles.timelineCardTitle}>Total Timeline</Text>
                  <Text style={styles.timelineCardValue}>13-16 Months</Text>
                  <Text style={styles.timelineCardNote}>
                    Pace depends on your dedication and learning speed
                  </Text>
                </View>
              </View>
            </Card>

            {/* Tips */}
            <View style={styles.tipsSection}>
              <Text style={styles.tipsTitle}>💡 Tips for Success</Text>
              <View style={styles.tipsList}>
                <View style={styles.tipItem}>
                  <Text style={styles.tipNumber}>1</Text>
                  <Text style={styles.tipText}>Build 2-3 projects per phase</Text>
                </View>
                <View style={styles.tipItem}>
                  <Text style={styles.tipNumber}>2</Text>
                  <Text style={styles.tipText}>Join communities and share your work</Text>
                </View>
                <View style={styles.tipItem}>
                  <Text style={styles.tipNumber}>3</Text>
                  <Text style={styles.tipText}>Review and practice consistently</Text>
                </View>
                <View style={styles.tipItem}>
                  <Text style={styles.tipNumber}>4</Text>
                  <Text style={styles.tipText}>Seek mentorship and feedback</Text>
                </View>
              </View>
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
    fontSize: 15,
    fontWeight: '600',
    color: '#06B6D4',
    marginBottom: 4,
  },
  introDescription: {
    fontSize: 13,
    color: '#6B7280',
  },
  timelineContainer: {
    marginBottom: 24,
  },
  phaseCard: {
    marginVertical: 8,
    overflow: 'hidden',
  },
  phaseGradient: {
    padding: 16,
  },
  phaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  phaseBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  phaseInfo: {
    flex: 1,
  },
  phaseName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  phaseDuration: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  phaseContent: {
    gap: 12,
  },
  contentSection: {
    marginTop: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  itemsList: {
    gap: 6,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  listDot: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
    marginRight: 8,
  },
  listItemText: {
    fontSize: 13,
    color: '#4B5563',
    flex: 1,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  timelineConnector: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  timelineCard: {
    marginBottom: 24,
    backgroundColor: '#F0FDF4',
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  timelineCardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineCardText: {
    marginLeft: 12,
    flex: 1,
  },
  timelineCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
    marginBottom: 4,
  },
  timelineCardValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  timelineCardNote: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  tipsSection: {
    marginBottom: 24,
  },
  tipsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
  },
  tipNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4F46E5',
    color: 'white',
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '700',
    marginRight: 12,
  },
  tipText: {
    fontSize: 13,
    color: '#4B5563',
    flex: 1,
    lineHeight: 18,
  },
  bottomPadding: {
    height: 20,
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
});
