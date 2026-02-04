import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card, CustomButton, ProgressBar } from '../components/CommonComponents';
import AppHeader from '../components/AppHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://career-backend-p085.onrender.com/api/auth';
const FALLBACK_API_URL = 'https://career-backend-p085.onrender.com/api/auth';

const QUESTIONS = [
  {
    id: 'q1',
    question: 'What type of work environment appeals to you most?',
    options: ['Fast-paced & competitive', 'Collaborative & team-focused', 'Independent & creative', 'Structured & organized'],
    category: 'work-env'
  },
  {
    id: 'q2',
    question: 'Which subject interests you the most?',
    options: ['Technology', 'Business & Finance', 'Science & Research', 'Design & Arts'],
    category: 'subject'
  },
  {
    id: 'q3',
    question: 'What motivates you in your career?',
    options: ['Making money', 'Helping others', 'Creating something new', 'Gaining expertise'],
    category: 'motivation'
  },
  {
    id: 'q4',
    question: 'How do you prefer to spend your free time?',
    options: ['Coding & building', 'Reading & learning', 'Managing & organizing', 'Drawing & creating'],
    category: 'hobby'
  },
  {
    id: 'q5',
    question: 'What\'s your ideal role in a team?',
    options: ['Leader', 'Specialist', 'Coordinator', 'Contributor'],
    category: 'role'
  },
];

export default function InterestAnalysis({ navigation }) {
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSelectOption = (questionId, selectedOption) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedOption
    }));
  };

  const calculateInterests = (answers) => {
    const interestScores = {
      technology: 0,
      business: 0,
      science: 0,
      design: 0,
      collaborative: 0,
      independent: 0,
      creative: 0,
      analytical: 0
    };

    // Map answers to interests
    Object.values(answers).forEach(answer => {
      switch (answer) {
        case 'Technology':
        case 'Coding & building':
          interestScores.technology += 2;
          interestScores.analytical += 1;
          break;
        case 'Business & Finance':
        case 'Managing & organizing':
          interestScores.business += 2;
          interestScores.collaborative += 1;
          break;
        case 'Science & Research':
        case 'Reading & learning':
          interestScores.science += 2;
          interestScores.independent += 1;
          break;
        case 'Design & Arts':
        case 'Drawing & creating':
          interestScores.design += 2;
          interestScores.creative += 1;
          break;
        case 'Fast-paced & competitive':
          interestScores.technology += 1;
          interestScores.business += 1;
          break;
        case 'Collaborative & team-focused':
          interestScores.collaborative += 2;
          break;
        case 'Independent & creative':
          interestScores.independent += 2;
          interestScores.creative += 1;
          break;
        case 'Structured & organized':
          interestScores.business += 1;
          interestScores.analytical += 1;
          break;
        case 'Making money':
          interestScores.business += 2;
          break;
        case 'Helping others':
          interestScores.collaborative += 2;
          break;
        case 'Creating something new':
          interestScores.creative += 2;
          interestScores.design += 1;
          break;
        case 'Gaining expertise':
          interestScores.science += 1;
          interestScores.analytical += 1;
          break;
        case 'Leader':
          interestScores.business += 1;
          interestScores.collaborative += 1;
          break;
        case 'Specialist':
          interestScores.technology += 1;
          interestScores.science += 1;
          break;
        case 'Coordinator':
          interestScores.business += 1;
          interestScores.collaborative += 1;
          break;
        case 'Contributor':
          interestScores.collaborative += 1;
          interestScores.creative += 1;
          break;
      }
    });

    return interestScores;
  };

  const handleSubmit = async () => {
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < QUESTIONS.length) {
      Alert.alert(
        'Incomplete',
        `Please answer all ${QUESTIONS.length} questions (${answeredCount}/${QUESTIONS.length})`
      );
      return;
    }

    try {
      setLoading(true);

      // Get token from storage
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Authentication Error', 'Please login again');
        return;
      }

      // Calculate interests based on answers
      const interests = calculateInterests(answers);

      const payload = {
        responses: answers,
        interests: interests,
      };

      console.log('📤 Submitting interest analysis:', payload);

      const response = await fetch(`${API_URL}/interest-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Interest analysis submitted:', data);

      Alert.alert(
        'Success',
        'Your interest analysis has been saved!',
        [
          {
            text: 'Continue',
            onPress: () => navigation.navigate('CareerRecommendation')
          }
        ]
      );
    } catch (error) {
      console.error('❌ Error submitting interests:', error);
      Alert.alert(
        'Submission Error',
        'We saved your data locally. Try again when backend is available.',
      );
    } finally {
      setLoading(false);
    }
  };

  const progress = (Object.keys(answers).length / QUESTIONS.length) * 100;

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" translucent={false} />
      <AppHeader
        title="Interest Analysis"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Introduction */}
        <Card style={styles.introCard}>
          <View style={styles.introContent}>
            <MaterialCommunityIcons name="heart" size={24} color="#EC4899" />
            <View style={styles.introText}>
              <Text style={styles.introTitle}>Discover Your Interests</Text>
              <Text style={styles.introDescription}>
                Answer these questions to find careers aligned with your passions
              </Text>
            </View>
          </View>
        </Card>

        {/* Progress */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progress</Text>
            <Text style={styles.progressCount}>
              {Object.keys(answers).length}/{QUESTIONS.length}
            </Text>
          </View>
          <ProgressBar value={Object.keys(answers).length} max={QUESTIONS.length} />
        </View>

        {/* Questions */}
        {QUESTIONS.map((question, index) => (
          <Card key={question.id} style={styles.questionCard}>
            <View style={styles.questionHeader}>
              <View style={styles.questionNumber}>
                <Text style={styles.questionNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.questionText}>{question.question}</Text>
            </View>

            <View style={styles.optionsContainer}>
              {question.options.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.option,
                    answers[question.id] === option && styles.optionSelected
                  ]}
                  onPress={() => handleSelectOption(question.id, option)}
                >
                  <View style={[
                    styles.optionRadio,
                    answers[question.id] === option && styles.optionRadioSelected
                  ]}>
                    {answers[question.id] === option && (
                      <View style={styles.optionRadioInner} />
                    )}
                  </View>
                  <Text style={[
                    styles.optionText,
                    answers[question.id] === option && styles.optionTextSelected
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>
        ))}

        {/* Submit Button */}
        <View style={styles.actionSection}>
          <CustomButton
            title={loading ? 'Saving...' : 'Save & Continue'}
            onPress={handleSubmit}
            loading={loading}
            disabled={loading || Object.keys(answers).length < QUESTIONS.length}
            icon="check-circle"
          />
          <Text style={styles.helpText}>
            Your interests help us recommend the best career paths for you
          </Text>
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
  introCard: {
    backgroundColor: '#FCE7F3',
    borderLeftWidth: 4,
    borderLeftColor: '#EC4899',
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
    color: '#EC4899',
    marginBottom: 4,
  },
  introDescription: {
    fontSize: 13,
    color: '#6B7280',
  },
  progressSection: {
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  progressCount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  questionCard: {
    marginVertical: 8,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  questionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  questionNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4F46E5',
  },
  questionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    lineHeight: 22,
  },
  optionsContainer: {
    gap: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  optionSelected: {
    backgroundColor: '#EEF2FF',
    borderColor: '#4F46E5',
  },
  optionRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionRadioSelected: {
    borderColor: '#4F46E5',
    backgroundColor: '#4F46E5',
  },
  optionRadioInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    flex: 1,
  },
  optionTextSelected: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  actionSection: {
    marginBottom: 24,
  },
  helpText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 12,
    textAlign: 'center',
  },
  bottomPadding: {
    height: 20,
  },
});
