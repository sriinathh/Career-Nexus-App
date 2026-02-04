import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card } from '../components/CommonComponents';
import AppHeader from '../components/AppHeader';

export default function ReportView({ navigation, route }) {
  const { reportData } = route.params;

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `My Career Assessment Report\n\nSkills: ${reportData?.skills?.map(s => s.skill_name).join(', ') || 'N/A'}\n\nGenerated on: ${new Date(reportData?.generatedAt).toLocaleDateString()}`,
        title: 'Career Report',
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share the report');
    }
  };

  const SkillItem = ({ skill }) => (
    <View style={styles.skillItem}>
      <Text style={styles.skillName}>{skill.skill_name}</Text>
      <Text style={styles.skillLevel}>{skill.proficiency_level}</Text>
    </View>
  );

  const RecommendationItem = ({ rec, index }) => (
    <Card style={styles.recommendationCard}>
      <View style={styles.recommendationHeader}>
        <View style={styles.rankBadge}>
          <Text style={styles.rankText}>{rec.rank}</Text>
        </View>
        <Text style={styles.recommendationTitle}>{rec.role}</Text>
      </View>
      <Text style={styles.recommendationMatch}>
        {rec.match_percentage}% Match
      </Text>
      <Text style={styles.recommendationDesc}>{rec.description}</Text>
      <View style={styles.recommendationDetails}>
        <Text style={styles.detailLabel}>Salary: {rec.salary_range}</Text>
        <Text style={styles.detailLabel}>Growth: {rec.growth_potential}</Text>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" translucent={false} />
      <AppHeader
        title="Career Report"
        showBackButton
        onBackPress={() => navigation.goBack()}
        rightIcon="share"
        onRightPress={handleShare}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Card style={styles.headerCard}>
          <View style={styles.headerContent}>
            <MaterialCommunityIcons name="file-chart" size={32} color="#667EEA" />
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Career Assessment Report</Text>
              <Text style={styles.headerSubtitle}>
                Generated on {new Date(reportData?.generatedAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </Card>

        {/* User Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <Card style={styles.infoCard}>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="account" size={20} color="#667EEA" />
              <Text style={styles.infoText}>
                {reportData?.user?.name || 'N/A'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="email" size={20} color="#667EEA" />
              <Text style={styles.infoText}>
                {reportData?.user?.email || 'N/A'}
              </Text>
            </View>
          </Card>
        </View>

        {/* Skills */}
        {reportData?.skills && reportData.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Skills</Text>
            <Card style={styles.skillsCard}>
              {reportData.skills.map((skill, index) => (
                <SkillItem key={index} skill={skill} />
              ))}
            </Card>
          </View>
        )}

        {/* Assessment Data */}
        {reportData?.assessment && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skill Assessment</Text>
            <Card style={styles.assessmentCard}>
              <Text style={styles.assessmentTitle}>Technical Skills</Text>
              {Object.entries(JSON.parse(reportData.assessment.technical_skills || '{}')).map(([skill, level]) => (
                <View key={skill} style={styles.skillRow}>
                  <Text style={styles.skillLabel}>{skill}</Text>
                  <View style={styles.skillBar}>
                    <View
                      style={[styles.skillFill, { width: `${(level / 10) * 100}%` }]}
                    />
                  </View>
                  <Text style={styles.skillValue}>{level}/10</Text>
                </View>
              ))}

              <Text style={styles.assessmentTitle}>Soft Skills</Text>
              {Object.entries(JSON.parse(reportData.assessment.soft_skills || '{}')).map(([skill, level]) => (
                <View key={skill} style={styles.skillRow}>
                  <Text style={styles.skillLabel}>{skill}</Text>
                  <View style={styles.skillBar}>
                    <View
                      style={[styles.skillFill, { width: `${(level / 10) * 100}%` }]}
                    />
                  </View>
                  <Text style={styles.skillValue}>{level}/10</Text>
                </View>
              ))}
            </Card>
          </View>
        )}

        {/* Recommendations */}
        {reportData?.recommendations && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Career Recommendations</Text>
            {JSON.parse(reportData.recommendations.recommendations || '[]').map((rec, index) => (
              <RecommendationItem key={index} rec={rec} index={index} />
            ))}
          </View>
        )}

        {/* Footer */}
        <Card style={styles.footerCard}>
          <View style={styles.footerContent}>
            <MaterialCommunityIcons name="information" size={20} color="#6B7280" />
            <Text style={styles.footerText}>
              This report is generated based on your skill assessment and interest analysis.
              Results may vary based on market conditions and personal circumstances.
            </Text>
          </View>
        </Card>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  headerCard: {
    marginBottom: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 16,
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  infoCard: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#1E293B',
    marginLeft: 12,
  },
  skillsCard: {
    padding: 16,
  },
  skillItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  skillName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  skillLevel: {
    fontSize: 14,
    color: '#667EEA',
    fontWeight: '600',
  },
  assessmentCard: {
    padding: 16,
  },
  assessmentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 12,
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  skillLabel: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  skillBar: {
    flex: 2,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  skillFill: {
    height: '100%',
    backgroundColor: '#667EEA',
    borderRadius: 4,
  },
  skillValue: {
    width: 40,
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'right',
  },
  recommendationCard: {
    marginBottom: 12,
    padding: 16,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#667EEA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  recommendationMatch: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
    marginBottom: 8,
  },
  recommendationDesc: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 12,
  },
  recommendationDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  footerCard: {
    marginBottom: 24,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
    marginLeft: 12,
    flex: 1,
  },
  bottomPadding: {
    height: 20,
  },
});