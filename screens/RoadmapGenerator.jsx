import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card } from '../components/CommonComponents';
import AppHeader from '../components/AppHeader';
import { LinearGradient } from 'expo-linear-gradient';

export default function RoadmapGenerator({ navigation }) {
  const [roadmap, setRoadmap] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Days', color: '#6B7280' },
    { id: 'foundation', name: 'Foundation', color: '#3B82F6' },
    { id: 'intermediate', name: 'Intermediate', color: '#8B5CF6' },
    { id: 'advanced', name: 'Advanced', color: '#EC4899' },
  ];

  useEffect(() => {
    generateRoadmap();
  }, []);

  const generateRoadmap = () => {
    const roadmapData = [];
    const startDate = new Date();

    // Foundation Phase (Days 1-30)
    for (let day = 1; day <= 30; day++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + day - 1);

      roadmapData.push({
        day,
        date: date.toLocaleDateString(),
        phase: 'foundation',
        title: getFoundationTitle(day),
        description: getFoundationDescription(day),
        tasks: getFoundationTasks(day),
        completed: false,
      });
    }

    // Intermediate Phase (Days 31-60)
    for (let day = 31; day <= 60; day++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + day - 1);

      roadmapData.push({
        day,
        date: date.toLocaleDateString(),
        phase: 'intermediate',
        title: getIntermediateTitle(day),
        description: getIntermediateDescription(day),
        tasks: getIntermediateTasks(day),
        completed: false,
      });
    }

    // Advanced Phase (Days 61-90)
    for (let day = 61; day <= 90; day++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + day - 1);

      roadmapData.push({
        day,
        date: date.toLocaleDateString(),
        phase: 'advanced',
        title: getAdvancedTitle(day),
        description: getAdvancedDescription(day),
        tasks: getAdvancedTasks(day),
        completed: false,
      });
    }

    setRoadmap(roadmapData);
  };

  const getFoundationTitle = (day) => {
    const titles = [
      'Introduction to Programming',
      'Variables and Data Types',
      'Control Structures',
      'Functions and Methods',
      'Arrays and Lists',
      'Object-Oriented Basics',
      'File I/O Operations',
      'Error Handling',
      'Basic Algorithms',
      'Version Control with Git',
    ];
    return titles[(day - 1) % titles.length];
  };

  const getFoundationDescription = (day) => {
    const descriptions = [
      'Learn the basics of programming logic and syntax',
      'Understand different data types and variable declaration',
      'Master conditional statements and loops',
      'Create reusable code blocks with functions',
      'Work with collections of data',
      'Introduction to classes and objects',
      'Read and write files in your programs',
      'Handle errors gracefully in your code',
      'Implement basic sorting and searching algorithms',
      'Learn to track changes with Git',
    ];
    return descriptions[(day - 1) % descriptions.length];
  };

  const getFoundationTasks = (day) => {
    const taskSets = [
      ['Install development environment', 'Write "Hello World" program', 'Practice basic syntax'],
      ['Declare variables of different types', 'Perform type conversions', 'Use constants'],
      ['Write if-else statements', 'Create for and while loops', 'Use switch statements'],
      ['Define functions with parameters', 'Return values from functions', 'Use built-in functions'],
      ['Create and manipulate arrays', 'Use array methods', 'Work with multidimensional arrays'],
      ['Define classes and objects', 'Create constructors', 'Implement methods'],
      ['Open and read text files', 'Write data to files', 'Handle file exceptions'],
      ['Use try-catch blocks', 'Create custom exceptions', 'Debug common errors'],
      ['Implement bubble sort', 'Create linear search', 'Understand algorithm complexity'],
      ['Initialize Git repository', 'Make commits', 'Push to GitHub'],
    ];
    return taskSets[(day - 1) % taskSets.length];
  };

  const getIntermediateTitle = (day) => {
    const titles = [
      'Database Fundamentals',
      'API Development',
      'Web Frameworks',
      'Testing Strategies',
      'Data Structures Deep Dive',
      'Design Patterns',
      'Security Basics',
      'Performance Optimization',
      'Code Review Practices',
      'Deployment Basics',
    ];
    return titles[(day - 31) % titles.length];
  };

  const getIntermediateDescription = (day) => {
    const descriptions = [
      'Learn SQL and database design principles',
      'Build RESTful APIs with proper endpoints',
      'Master popular web development frameworks',
      'Write unit and integration tests',
      'Implement advanced data structures',
      'Apply common design patterns',
      'Implement security best practices',
      'Optimize code for better performance',
      'Conduct effective code reviews',
      'Deploy applications to production',
    ];
    return descriptions[(day - 31) % descriptions.length];
  };

  const getIntermediateTasks = (day) => {
    const taskSets = [
      ['Design database schema', 'Write SQL queries', 'Use ORM tools'],
      ['Create REST endpoints', 'Handle HTTP methods', 'Implement authentication'],
      ['Set up framework project', 'Create routes and views', 'Add middleware'],
      ['Write unit tests', 'Create test suites', 'Use mocking libraries'],
      ['Implement stacks and queues', 'Create hash tables', 'Use trees and graphs'],
      ['Apply Singleton pattern', 'Use Factory pattern', 'Implement Observer pattern'],
      ['Implement input validation', 'Use encryption', 'Handle authentication'],
      ['Profile code performance', 'Optimize algorithms', 'Cache frequently used data'],
      ['Review pull requests', 'Provide constructive feedback', 'Follow coding standards'],
      ['Set up CI/CD pipeline', 'Configure deployment', 'Monitor application health'],
    ];
    return taskSets[(day - 31) % taskSets.length];
  };

  const getAdvancedTitle = (day) => {
    const titles = [
      'Microservices Architecture',
      'Cloud Computing',
      'Machine Learning Basics',
      'DevOps Practices',
      'System Design',
      'Scalability Patterns',
      'Blockchain Fundamentals',
      'IoT Development',
      'Cybersecurity',
      'Career Development',
    ];
    return titles[(day - 61) % titles.length];
  };

  const getAdvancedDescription = (day) => {
    const descriptions = [
      'Design and implement microservices',
      'Deploy applications to cloud platforms',
      'Build machine learning models',
      'Implement CI/CD pipelines',
      'Design large-scale systems',
      'Handle high-traffic applications',
      'Understand blockchain technology',
      'Develop IoT applications',
      'Advanced security practices',
      'Prepare for technical interviews',
    ];
    return descriptions[(day - 61) % descriptions.length];
  };

  const getAdvancedTasks = (day) => {
    const taskSets = [
      ['Design service boundaries', 'Implement service communication', 'Handle service failures'],
      ['Deploy to AWS/GCP/Azure', 'Configure cloud resources', 'Use serverless functions'],
      ['Collect and preprocess data', 'Train ML models', 'Evaluate model performance'],
      ['Set up automated testing', 'Configure deployment pipelines', 'Monitor applications'],
      ['Design for millions of users', 'Implement caching strategies', 'Handle distributed systems'],
      ['Implement load balancing', 'Use message queues', 'Scale horizontally'],
      ['Understand consensus algorithms', 'Create smart contracts', 'Build blockchain applications'],
      ['Interface with sensors', 'Process IoT data', 'Build IoT dashboards'],
      ['Implement encryption', 'Conduct security audits', 'Handle compliance'],
      ['Practice coding problems', 'Prepare for interviews', 'Build portfolio projects'],
    ];
    return taskSets[(day - 61) % taskSets.length];
  };

  const filteredRoadmap = selectedCategory === 'all'
    ? roadmap
    : roadmap.filter(item => item.phase === selectedCategory);

  const toggleTaskCompletion = (dayIndex, taskIndex) => {
    const updatedRoadmap = [...roadmap];
    const dayItem = updatedRoadmap.find(item => item.day === dayIndex + 1);
    if (dayItem && dayItem.tasks) {
      // For now, just show alert as we don't have persistent storage
      Alert.alert('Task Completed!', 'Great job! Keep up the momentum!');
    }
  };

  const getPhaseColor = (phase) => {
    switch (phase) {
      case 'foundation': return '#3B82F6';
      case 'intermediate': return '#8B5CF6';
      case 'advanced': return '#EC4899';
      default: return '#6B7280';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />
      <AppHeader title="90-Day Roadmap" showBackButton onBackPress={() => navigation.goBack()} />

      <ScrollView style={styles.content}>
        {/* Category Filter */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.filterButton,
                  selectedCategory === category.id && { backgroundColor: category.color }
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={[
                  styles.filterButtonText,
                  selectedCategory === category.id && { color: 'white' }
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Roadmap Days */}
        {filteredRoadmap.map((item, index) => (
          <View key={item.day} style={styles.dayContainer}>
            <LinearGradient
              colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
              style={styles.dayCard}
            >
              <Card style={styles.dayCardInner}>
                <View style={styles.dayHeader}>
                  <View style={styles.dayInfo}>
                    <Text style={styles.dayNumber}>Day {item.day}</Text>
                    <Text style={styles.dayDate}>{item.date}</Text>
                  </View>
                  <View style={[styles.phaseBadge, { backgroundColor: getPhaseColor(item.phase) + '20' }]}>
                    <Text style={[styles.phaseText, { color: getPhaseColor(item.phase) }]}>
                      {item.phase.charAt(0).toUpperCase() + item.phase.slice(1)}
                    </Text>
                  </View>
                </View>

                <Text style={styles.dayTitle}>{item.title}</Text>
                <Text style={styles.dayDescription}>{item.description}</Text>

                <View style={styles.tasksContainer}>
                  <Text style={styles.tasksTitle}>Today's Tasks:</Text>
                  {item.tasks.map((task, taskIndex) => (
                    <TouchableOpacity
                      key={taskIndex}
                      style={styles.taskItem}
                      onPress={() => toggleTaskCompletion(index, taskIndex)}
                    >
                      <MaterialCommunityIcons
                        name="circle-outline"
                        size={20}
                        color="#64748B"
                      />
                      <Text style={styles.taskText}>{task}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </Card>
            </LinearGradient>
          </View>
        ))}

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
  },
  filterContainer: {
    marginVertical: 20,
  },
  filterScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  filterButton: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  dayContainer: {
    marginBottom: 16,
  },
  dayCard: {
    borderRadius: 16,
    padding: 2,
  },
  dayCardInner: {
    borderRadius: 14,
    backgroundColor: 'white',
    borderWidth: 0,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayInfo: {
    flex: 1,
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  dayDate: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  phaseBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  phaseText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  dayDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 16,
  },
  tasksContainer: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
  },
  tasksTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 12,
    flex: 1,
  },
  bottomPadding: {
    height: 20,
  },
});