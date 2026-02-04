import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  StatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card, CustomButton } from '../components/CommonComponents';
import AppHeader from '../components/AppHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const API_URL = 'http://10.0.2.2:5000/api/auth';
const FALLBACK_API_URL = 'http://192.168.1.4:5000/api/auth';

export default function ReportDownload({ navigation }) {
  const [downloading, setDownloading] = useState(false);
  const [reportData, setReportData] = useState(null);

  const handleDownloadPDF = async () => {
    try {
      setDownloading(true);

      // Get token from storage
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Authentication Error', 'Please login again');
        return;
      }

      console.log('📥 Requesting career report data...');

      const response = await fetch(`${API_URL}/download-report`, {
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

      const reportData = await response.json();
      console.log('✅ Report data received:', reportData);

      setReportData(reportData);

      // Generate PDF
      const htmlContent = generateReportHTML(reportData);
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });

      console.log('📄 PDF generated at:', uri);

      // Share the PDF
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Share Career Report',
        });
      } else {
        Alert.alert('Success', 'PDF generated successfully! File saved to device.');
      }

      // Also offer to view the report
      Alert.alert(
        'Report Generated',
        'Your career report PDF has been generated and shared!',
        [
          {
            text: 'View Report',
            onPress: () => {
              navigation.navigate('ReportView', { reportData });
            }
          },
          { text: 'OK' }
        ]
      );

    } catch (error) {
      console.error('⚠️ Download error:', error.message);
      Alert.alert(
        'Download Error',
        'Could not generate the report. Please try again later.',
      );
    } finally {
      setDownloading(false);
    }
  };

  const generateReportHTML = (data) => {
    const skills = data?.skills || [];
    const assessment = data?.assessment || {};
    const recommendations = JSON.parse(data?.recommendations?.recommendations || '[]');

    const technicalSkills = JSON.parse(assessment.technical_skills || '{}');
    const softSkills = JSON.parse(assessment.soft_skills || '{}');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Career Assessment Report</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              margin: 0;
              padding: 20px;
              background-color: #f8fafc;
              color: #1e293b;
            }
            .container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              border-radius: 12px;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 700;
            }
            .header p {
              margin: 10px 0 0 0;
              opacity: 0.9;
              font-size: 16px;
            }
            .section {
              padding: 30px;
              border-bottom: 1px solid #e2e8f0;
            }
            .section:last-child {
              border-bottom: none;
            }
            .section h2 {
              color: #1e293b;
              font-size: 22px;
              font-weight: 700;
              margin: 0 0 20px 0;
              display: flex;
              align-items: center;
            }
            .section h2::before {
              content: '📊';
              margin-right: 10px;
            }
            .user-info {
              background: #f8fafc;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
            }
            .info-label {
              font-weight: 600;
              color: #64748b;
            }
            .skills-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 15px;
              margin-bottom: 20px;
            }
            .skill-item {
              background: #f1f5f9;
              padding: 15px;
              border-radius: 8px;
              border-left: 4px solid #667eea;
            }
            .skill-name {
              font-weight: 600;
              color: #1e293b;
              margin-bottom: 5px;
            }
            .skill-level {
              color: #667eea;
              font-weight: 600;
            }
            .skills-section h3 {
              color: #374151;
              font-size: 18px;
              margin: 20px 0 15px 0;
            }
            .skill-bar {
              display: flex;
              align-items: center;
              margin-bottom: 10px;
            }
            .skill-bar-label {
              flex: 1;
              font-size: 14px;
              color: #374151;
            }
            .skill-bar-container {
              flex: 2;
              height: 8px;
              background: #e5e7eb;
              border-radius: 4px;
              margin: 0 12px;
              overflow: hidden;
            }
            .skill-bar-fill {
              height: 100%;
              background: #667eea;
              border-radius: 4px;
            }
            .skill-bar-value {
              width: 40px;
              text-align: right;
              font-size: 12px;
              color: #6b7280;
            }
            .recommendations {
              display: grid;
              gap: 20px;
            }
            .recommendation-card {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              padding: 20px;
            }
            .recommendation-header {
              display: flex;
              align-items: center;
              margin-bottom: 15px;
            }
            .rank-badge {
              width: 40px;
              height: 40px;
              border-radius: 20px;
              background: #667eea;
              color: white;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 700;
              margin-right: 15px;
            }
            .recommendation-title {
              font-size: 20px;
              font-weight: 700;
              color: #1e293b;
              margin: 0;
            }
            .match-percentage {
              color: #10b981;
              font-weight: 600;
              font-size: 16px;
              margin-bottom: 10px;
            }
            .recommendation-desc {
              color: #64748b;
              line-height: 1.6;
              margin-bottom: 15px;
            }
            .recommendation-details {
              display: flex;
              justify-content: space-between;
              font-size: 14px;
            }
            .detail-label {
              color: #6b7280;
              font-weight: 600;
            }
            .footer {
              background: #f8fafc;
              padding: 20px 30px;
              text-align: center;
              border-top: 1px solid #e2e8f0;
            }
            .footer-text {
              color: #6b7280;
              font-size: 12px;
              line-height: 1.5;
            }
            .generated-date {
              text-align: right;
              font-size: 12px;
              color: #6b7280;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎯 Career Assessment Report</h1>
              <p>Personalized Career Guidance Summary</p>
            </div>

            <div class="section">
              <h2>👤 Personal Information</h2>
              <div class="user-info">
                <div class="info-row">
                  <span class="info-label">Name:</span>
                  <span>${data?.user?.name || 'N/A'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Email:</span>
                  <span>${data?.user?.email || 'N/A'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Generated:</span>
                  <span>${new Date(data?.generatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            ${skills.length > 0 ? `
            <div class="section">
              <h2>🛠️ Your Skills</h2>
              <div class="skills-grid">
                ${skills.map(skill => `
                  <div class="skill-item">
                    <div class="skill-name">${skill.skill_name}</div>
                    <div class="skill-level">${skill.proficiency_level}</div>
                  </div>
                `).join('')}
              </div>
            </div>
            ` : ''}

            <div class="section skills-section">
              <h2>📈 Skill Assessment</h2>

              <h3>Technical Skills</h3>
              ${Object.entries(technicalSkills).map(([skill, level]) => `
                <div class="skill-bar">
                  <span class="skill-bar-label">${skill}</span>
                  <div class="skill-bar-container">
                    <div class="skill-bar-fill" style="width: ${(level / 10) * 100}%"></div>
                  </div>
                  <span class="skill-bar-value">${level}/10</span>
                </div>
              `).join('')}

              <h3>Soft Skills</h3>
              ${Object.entries(softSkills).map(([skill, level]) => `
                <div class="skill-bar">
                  <span class="skill-bar-label">${skill}</span>
                  <div class="skill-bar-container">
                    <div class="skill-bar-fill" style="width: ${(level / 10) * 100}%"></div>
                  </div>
                  <span class="skill-bar-value">${level}/10</span>
                </div>
              `).join('')}
            </div>

            ${recommendations.length > 0 ? `
            <div class="section">
              <h2>🎯 Career Recommendations</h2>
              <div class="recommendations">
                ${recommendations.map((rec, index) => `
                  <div class="recommendation-card">
                    <div class="recommendation-header">
                      <div class="rank-badge">${rec.rank}</div>
                      <h3 class="recommendation-title">${rec.role}</h3>
                    </div>
                    <div class="match-percentage">${rec.match_percentage}% Match</div>
                    <p class="recommendation-desc">${rec.description}</p>
                    <div class="recommendation-details">
                      <span class="detail-label">Salary: ${rec.salary_range}</span>
                      <span class="detail-label">Growth: ${rec.growth_potential}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
            ` : ''}

            <div class="footer">
              <p class="footer-text">
                This report is generated based on your skill assessment and interest analysis.
                Results may vary based on market conditions and personal circumstances.
              </p>
              <p class="generated-date">
                Report generated on ${new Date().toLocaleString()}
              </p>
            </div>
          </div>
        </body>
      </html>
    `;
  };

  const ReportSection = ({ icon, title, description, items }) => (
    <Card>
      <View style={styles.sectionHeader}>
        <MaterialCommunityIcons name={icon} size={24} color="#4F46E5" />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <Text style={styles.sectionDescription}>{description}</Text>
      <View style={styles.itemsList}>
        {items.map((item) => (
          <View key={item} style={styles.reportItem}>
            <MaterialCommunityIcons name="check-circle" size={16} color="#10B981" />
            <Text style={styles.reportItemText}>{item}</Text>
          </View>
        ))}
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
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Card style={styles.headerCard}>
          <View style={styles.headerContent}>
            <MaterialCommunityIcons name="file-certificate" size={40} color="#4F46E5" />
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Personalized Career Report</Text>
              <Text style={styles.headerSubtitle}>
                Your complete career guidance summary
              </Text>
            </View>
          </View>
        </Card>

        {/* Report Contents */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Report Includes:</Text>

          <ReportSection
            icon="target"
            title="Career Assessment Summary"
            description="Overview of your skills and interests"
            items={[
              'Your technical skill levels',
              'Soft skills evaluation',
              'Interest categories',
              'Career alignment scores',
            ]}
          />

          <ReportSection
            icon="lightbulb"
            title="Recommended Careers"
            description="Top career paths matched to your profile"
            items={[
              '5 recommended roles',
              'Match percentage for each role',
              'Salary expectations',
              'Growth potential analysis',
            ]}
          />

          <ReportSection
            icon="map"
            title="Learning Roadmap"
            description="Step-by-step path to success"
            items={[
              'Beginner phase (3-4 months)',
              'Intermediate phase (4-6 months)',
              'Advanced phase (6+ months)',
              'Recommended resources',
            ]}
          />

          <ReportSection
            icon="star"
            title="Actionable Insights"
            description="Next steps and recommendations"
            items={[
              'Skills to develop',
              'Projects to build',
              'Certifications recommended',
              'Networking opportunities',
            ]}
          />
        </View>

        {/* Download Section */}
        <View style={styles.downloadSection}>
          <Card style={styles.downloadCard}>
            <View style={styles.downloadContent}>
              <MaterialCommunityIcons name="file-pdf-box" size={40} color="#DC2626" />
              <Text style={styles.downloadTitle}>Download as PDF</Text>
              <Text style={styles.downloadDescription}>
                Get your complete report in PDF format to share with mentors and advisors
              </Text>
            </View>
          </Card>

          <CustomButton
            title={downloading ? 'Downloading...' : 'Download Report'}
            onPress={handleDownloadPDF}
            loading={downloading}
            disabled={downloading}
            icon="download"
            variant="primary"
          />

          <Text style={styles.downloadNote}>
            📧 You can also receive a copy via email when the backend is connected
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>Report Features</Text>

          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <MaterialCommunityIcons name="lock" size={18} color="#4F46E5" />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureName}>Secure & Private</Text>
                <Text style={styles.featureDesc}>Your data is encrypted and private</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <MaterialCommunityIcons name="share-variant" size={18} color="#06B6D4" />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureName}>Easy to Share</Text>
                <Text style={styles.featureDesc}>Share with colleges and advisors</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <MaterialCommunityIcons name="refresh" size={18} color="#10B981" />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureName}>Updateable</Text>
                <Text style={styles.featureDesc}>Retake assessments anytime</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <MaterialCommunityIcons name="chart-line" size={18} color="#F59E0B" />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureName}>Progress Tracking</Text>
                <Text style={styles.featureDesc}>Monitor your career journey</Text>
              </View>
            </View>
          </View>
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
  headerCard: {
    marginBottom: 24,
    backgroundColor: '#EEF2FF',
    borderLeftWidth: 4,
    borderLeftColor: '#4F46E5',
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
    fontSize: 16,
    fontWeight: '700',
    color: '#4F46E5',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 12,
  },
  sectionDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 10,
    lineHeight: 16,
  },
  itemsList: {
    gap: 8,
  },
  reportItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reportItemText: {
    fontSize: 13,
    color: '#4B5563',
    marginLeft: 8,
  },
  downloadSection: {
    marginBottom: 24,
  },
  downloadCard: {
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 16,
  },
  downloadContent: {
    alignItems: 'center',
  },
  downloadTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 4,
  },
  downloadDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
    marginTop: 4,
  },
  downloadNote: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  featuresSection: {
    marginBottom: 24,
  },
  featuresTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureText: {
    flex: 1,
  },
  featureName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 12,
    color: '#6B7280',
  },
  bottomPadding: {
    height: 20,
  },
});
