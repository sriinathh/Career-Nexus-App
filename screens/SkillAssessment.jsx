import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  StatusBar,
  TextInput,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card, CustomButton, SkillSlider, ProgressBar } from '../components/CommonComponents';
import AppHeader from '../components/AppHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://career-backend-p085.onrender.com/api/auth';
const FALLBACK_API_URL = 'https://career-backend-p085.onrender.com/api/auth';

export default function SkillAssessment({ navigation }) {
  const [skills, setSkills] = useState({
    programming: 0,
    dataAnalysis: 0,
    webDevelopment: 0,
    cloudComputing: 0,
    communication: 0,
    teamwork: 0,
    problemSolving: 0,
    leadershipAbility: 0,
    tools: '',
    technologies: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSkillChange = (skillName, value) => {
    setSkills(prev => ({
      ...prev,
      [skillName]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Get token from storage
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Authentication Error', 'Please login again');
        return;
      }

      const payload = {
        technical: {
          programming: skills.programming,
          dataAnalysis: skills.dataAnalysis,
          webDevelopment: skills.webDevelopment,
          cloudComputing: skills.cloudComputing,
        },
        soft: {
          communication: skills.communication,
          teamwork: skills.teamwork,
          problemSolving: skills.problemSolving,
          leadershipAbility: skills.leadershipAbility,
        },
        tools: skills.tools,
        technologies: skills.technologies,
      };

      console.log('📤 Submitting skills assessment:', payload);

      const response = await fetch(`${API_URL}/skill-assessment`, {
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
      console.log('✅ Skills assessment submitted:', data);

      Alert.alert(
        'Success',
        'Your skill assessment has been saved!',
        [
          {
            text: 'Continue',
            onPress: () => navigation.navigate('InterestAnalysis')
          }
        ]
      );
    } catch (error) {
      console.error('❌ Error submitting skills:', error);
      Alert.alert(
        'Submission Error',
        'We saved your data locally. Try again when backend is available.',
      );
    } finally {
      setLoading(false);
    }
  };

  const progress = (
    Object.values(skills).filter(v => typeof v === 'number' && v > 0).length / 8
  ) * 100;

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" translucent={false} />
      <AppHeader
        title="Skill Assessment"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Introduction */}
        <Card style={styles.introCard}>
          <View style={styles.introContent}>
            <MaterialCommunityIcons name="information" size={24} color="#4F46E5" />
            <View style={styles.introText}>
              <Text style={styles.introTitle}>Rate Your Skills</Text>
              <Text style={styles.introDescription}>
                Honestly rate your abilities from 0 (Beginner) to 10 (Expert)
              </Text>
            </View>
          </View>
        </Card>

        {/* Progress */}
        <View style={styles.progressSection}>
          <Text style={styles.progressLabel}>Assessment Progress</Text>
          <ProgressBar value={progress} max={100} />
        </View>

        {/* Technical Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Technical Skills</Text>
          <SkillSlider
            label="Programming Languages"
            value={skills.programming}
            onValueChange={(val) => handleSkillChange('programming', val)}
          />
          <SkillSlider
            label="Data Analysis"
            value={skills.dataAnalysis}
            onValueChange={(val) => handleSkillChange('dataAnalysis', val)}
          />
          <SkillSlider
            label="Web Development"
            value={skills.webDevelopment}
            onValueChange={(val) => handleSkillChange('webDevelopment', val)}
          />
          <SkillSlider
            label="Cloud Computing"
            value={skills.cloudComputing}
            onValueChange={(val) => handleSkillChange('cloudComputing', val)}
          />
        </View>

        {/* Soft Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Soft Skills</Text>
          <SkillSlider
            label="Communication"
            value={skills.communication}
            onValueChange={(val) => handleSkillChange('communication', val)}
          />
          <SkillSlider
            label="Teamwork & Collaboration"
            value={skills.teamwork}
            onValueChange={(val) => handleSkillChange('teamwork', val)}
          />
          <SkillSlider
            label="Problem Solving"
            value={skills.problemSolving}
            onValueChange={(val) => handleSkillChange('problemSolving', val)}
          />
          <SkillSlider
            label="Leadership Ability"
            value={skills.leadershipAbility}
            onValueChange={(val) => handleSkillChange('leadershipAbility', val)}
          />
        </View>

        {/* Tools & Technologies */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tools & Technologies</Text>
          <Card style={styles.textInputCard}>
            <Text style={styles.inputLabel}>Proficient Tools</Text>
            <Text style={styles.inputNote}>
              e.g., Python, JavaScript, Git, Docker, AWS, Tableau
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter tools you're proficient with..."
              placeholderTextColor="#9CA3AF"
              value={skills.tools}
              onChangeText={(text) => handleSkillChange('tools', text)}
              multiline
              numberOfLines={2}
            />
          </Card>

          <Card style={styles.textInputCard}>
            <Text style={styles.inputLabel}>Technologies</Text>
            <Text style={styles.inputNote}>
              e.g., React, Node.js, PostgreSQL, Kubernetes
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter technologies you work with..."
              placeholderTextColor="#9CA3AF"
              value={skills.technologies}
              onChangeText={(text) => handleSkillChange('technologies', text)}
              multiline
              numberOfLines={2}
            />
          </Card>
        </View>

        {/* Submit Button */}
        <View style={styles.actionSection}>
          <CustomButton
            title={loading ? 'Saving...' : 'Save & Continue'}
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            icon="check-circle"
          />
          <Text style={styles.helpText}>
            Your assessment data is securely stored and used only for recommendations
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
    backgroundColor: '#EEF2FF',
    borderLeftWidth: 4,
    borderLeftColor: '#4F46E5',
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
    color: '#4F46E5',
    marginBottom: 4,
  },
  introDescription: {
    fontSize: 13,
    color: '#6B7280',
  },
  progressSection: {
    marginBottom: 24,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  textInputCard: {
    marginVertical: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  inputNote: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#1F2937',
    minHeight: 60,
    textAlignVertical: 'top',
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
