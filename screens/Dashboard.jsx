import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AppHeader from "../components/AppHeader";
import { Card, StatsCard } from "../components/CommonComponents";

export default function Dashboard({ navigation, route }) {
  const [user, setUser] = useState(route?.params?.user || {});
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Animation values
  const welcomeOpacity = useRef(new Animated.Value(0)).current;
  const welcomeTranslateY = useRef(new Animated.Value(30)).current;
  const statsOpacity = useRef(new Animated.Value(0)).current;
  const menuScale = useRef(new Animated.Value(1)).current;

  const API_URL = "https://career-backend-p085.onrender.com/api/auth";
  const FALLBACK_API_URL = "https://career-backend-p085.onrender.com/api/auth";

  useEffect(() => {
    fetchUserProfile();
    startAnimations();

    // Update time every minute for dynamic greeting
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timeInterval);
  }, []);

  const startAnimations = () => {
    // Welcome card animation
    Animated.parallel([
      Animated.timing(welcomeOpacity, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(welcomeTranslateY, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Stats animation with delay
    setTimeout(() => {
      Animated.timing(statsOpacity, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }, 400);
  };

  const fetchUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        setLoading(false);
        return;
      }

      // Helper function to fetch with timeout
      const fetchWithTimeout = (url, options, timeout = 10000) => {
        return Promise.race([
          fetch(url, options),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Request timeout")), timeout)
          ),
        ]);
      };

      let response;
      
      try {
        response = await fetchWithTimeout(`${API_URL}/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }, 5000);
      } catch (err) {
        console.log("⚠️ Primary URL failed, trying fallback");
        response = await fetchWithTimeout(`${FALLBACK_API_URL}/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }, 5000);
      }

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("Dashboard profile fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getMotivationalMessage = () => {
    const messages = [
      "Let&apos;s build your dream career! 🚀",
      "Every expert was once a beginner 🌟",
      "Your future self will thank you 💪",
      "Small steps, big dreams 🎯",
      "Knowledge is power 📚",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const animateMenuPress = () => {
    Animated.sequence([
      Animated.timing(menuScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(menuScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const navigateToGuidance = (screen) => {
    navigation.navigate("CareerGuidance", { screen });
  };

  const menuItems = [
    {
      id: "assessment",
      icon: "brain",
      title: "Skill Assessment",
      description: "Evaluate your technical & soft skills",
      color: "#4F46E5",
      progress: 75,
      onPress: () => {
        animateMenuPress();
        setTimeout(() => navigateToGuidance("SkillAssessment"), 150);
      },
    },
    {
      id: "interests",
      icon: "heart-multiple",
      title: "Interest Analysis",
      description: "Discover your career interests",
      color: "#06B6D4",
      progress: 45,
      onPress: () => {
        animateMenuPress();
        setTimeout(() => navigateToGuidance("InterestAnalysis"), 150);
      },
    },
    {
      id: "recommendation",
      icon: "lightbulb",
      title: "Career Recommendation",
      description: "Get AI-powered recommendations",
      color: "#F59E0B",
      progress: 20,
      onPress: () => {
        animateMenuPress();
        setTimeout(() => navigateToGuidance("CareerRecommendation"), 150);
      },
    },
    {
      id: "roadmap",
      icon: "road",
      title: "Learning Roadmap",
      description: "Step-by-step career path",
      color: "#10B981",
      progress: 10,
      onPress: () => {
        animateMenuPress();
        setTimeout(() => navigateToGuidance("LearningRoadmap"), 150);
      },
    },
  ];

  // Animated Card Component for staggered animations
  const AnimatedCard = ({ children, index }) => {
    const cardOpacity = useRef(new Animated.Value(0)).current;
    const cardTranslateY = useRef(new Animated.Value(20)).current;

    useEffect(() => {
      const delay = index * 150; // Stagger animation by 150ms per card
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(cardOpacity, {
            toValue: 1,
            duration: 500,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(cardTranslateY, {
            toValue: 0,
            duration: 500,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]).start();
      }, delay);
    }, [index]);

    return (
      <Animated.View
        style={{
          opacity: cardOpacity,
          transform: [{ translateY: cardTranslateY }],
        }}
      >
        {children}
      </Animated.View>
    );
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "left", "right", "bottom"]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="#4F46E5"
        translucent={true}
      />
      <AppHeader
        title=""
        showProfileButton
        onProfilePress={() => navigation.navigate("Profile")}
        user={user}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <Animated.View
          style={[
            styles.welcomeCard,
            {
              opacity: welcomeOpacity,
              transform: [{ translateY: welcomeTranslateY }],
            },
          ]}
        >
          <LinearGradient
            colors={["#667EEA", "#764BA2", "#F093FB", "#F5576C"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.welcomeGradient}
          >
            <View style={styles.welcomeContent}>
              <View style={styles.welcomeTextContainer}>
                <View style={styles.greetingBadge}>
                  <MaterialCommunityIcons
                    name="weather-sunny"
                    size={16}
                    color="#FFD700"
                  />
                  <Text style={styles.greetingBadgeText}>{getGreeting()}</Text>
                </View>
                <View style={styles.nameContainer}>
                  <Text style={styles.welcomeLabel}>Welcome back,</Text>
                  <Text style={styles.welcomeName}>
                    {user?.name?.split(" ")[0] || "Explorer"}! ✨
                  </Text>
                </View>
                <Text style={styles.welcomeText}>
                  {getMotivationalMessage()}
                </Text>
                <Text style={styles.welcomeSubtext}>
                  Ready to take the next step in your career journey?
                </Text>
              </View>
              <View style={styles.welcomeIconContainer}>
                <View style={styles.iconGlow}>
                  <MaterialCommunityIcons
                    name="rocket-launch"
                    size={60}
                    color="white"
                  />
                </View>
                <View style={styles.floatingElements}>
                  <View style={[styles.floatingDot, styles.dot1]} />
                  <View style={[styles.floatingDot, styles.dot2]} />
                  <View style={[styles.floatingDot, styles.dot3]} />
                </View>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Quick Stats */}
        <Animated.View style={[styles.section, { opacity: statsOpacity }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Progress</Text>
            <View style={styles.sectionDivider} />
          </View>
          <View style={styles.statsGrid}>
            <StatsCard
              icon="checkbox-marked-circle"
              title="Assessments"
              value="0/4"
              color="#667EEA"
              subtitle="Completed"
              style={styles.statCard}
            />
            <StatsCard
              icon="target"
              title="Goals"
              value="2/5"
              color="#764BA2"
              subtitle="Active"
              style={styles.statCard}
            />
            <StatsCard
              icon="fire"
              title="Streak"
              value="7 days"
              color="#F093FB"
              subtitle="Current"
              style={styles.statCard}
            />
            <StatsCard
              icon="trophy"
              title="Achievements"
              value="3"
              color="#F5576C"
              subtitle="Unlocked"
              style={styles.statCard}
            />
            <StatsCard
              icon="clock-outline"
              title="Study Hours"
              value="24h"
              color="#10B981"
              subtitle="This Week"
              style={styles.statCard}
            />
            <StatsCard
              icon="lightbulb-on"
              title="Skills Learned"
              value="8"
              color="#F59E0B"
              subtitle="New Skills"
              style={styles.statCard}
            />
          </View>
        </Animated.View>

        {/* New Features Section */}
        <View style={styles.newFeaturesSection}>
          {/* Career Map Preview */}
          <View style={styles.featureCard}>
            <LinearGradient
              colors={["rgba(59, 130, 246, 0.1)", "rgba(59, 130, 246, 0.05)"]}
              style={styles.featureCardGradient}
            >
              <Card style={styles.featureCardInner}>
                <View style={styles.featureHeader}>
                  <MaterialCommunityIcons
                    name="map"
                    size={20}
                    color="#3B82F6"
                  />
                  <Text style={styles.featureTitle}>Career Map Preview</Text>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.careerMapScroll}
                >
                  <View style={styles.careerMapContainer}>
                    <View style={[styles.careerStep, styles.completedStep]}>
                      <MaterialCommunityIcons name="account" size={16} color="white" />
                      <Text style={styles.careerStepText}>You</Text>
                    </View>
                    <MaterialCommunityIcons name="arrow-right" size={16} color="#64748B" />
                    <View style={[styles.careerStep, styles.completedStep]}>
                      <MaterialCommunityIcons name="brain" size={16} color="white" />
                      <Text style={styles.careerStepText}>Frontend Skills</Text>
                    </View>
                    <MaterialCommunityIcons name="arrow-right" size={16} color="#64748B" />
                    <View style={[styles.careerStep, styles.activeStep]}>
                      <MaterialCommunityIcons name="code-tags" size={16} color="white" />
                      <Text style={styles.careerStepText}>Frontend Developer</Text>
                    </View>
                    <MaterialCommunityIcons name="arrow-right" size={16} color="#64748B" />
                    <View style={[styles.careerStep, styles.lockedStep]}>
                      <MaterialCommunityIcons name="office-building" size={16} color="#9CA3AF" />
                      <Text style={styles.careerStepText}>Product Company</Text>
                    </View>
                  </View>
                </ScrollView>
              </Card>
            </LinearGradient>
          </View>

          {/* Resume Strength Meter */}
          <View style={styles.featureCard}>
            <LinearGradient
              colors={["rgba(16, 185, 129, 0.1)", "rgba(16, 185, 129, 0.05)"]}
              style={styles.featureCardGradient}
            >
              <Card style={styles.featureCardInner}>
                <View style={styles.featureHeader}>
                  <MaterialCommunityIcons
                    name="file-document"
                    size={20}
                    color="#10B981"
                  />
                  <Text style={styles.featureTitle}>Resume Strength</Text>
                  <Text style={styles.resumeStrengthPercent}>75%</Text>
                </View>
                <View style={styles.resumeIndicators}>
                  <View style={styles.indicatorItem}>
                    <MaterialCommunityIcons name="check-circle" size={16} color="#10B981" />
                    <Text style={styles.indicatorText}>Skills</Text>
                  </View>
                  <View style={styles.indicatorItem}>
                    <MaterialCommunityIcons name="close-circle" size={16} color="#EF4444" />
                    <Text style={styles.indicatorText}>Projects</Text>
                  </View>
                  <View style={styles.indicatorItem}>
                    <MaterialCommunityIcons name="check-circle" size={16} color="#10B981" />
                    <Text style={styles.indicatorText}>Certifications</Text>
                  </View>
                </View>
              </Card>
            </LinearGradient>
          </View>

          {/* Opportunity Radar */}
          <View style={styles.featureCard}>
            <LinearGradient
              colors={["rgba(245, 158, 11, 0.1)", "rgba(245, 158, 11, 0.05)"]}
              style={styles.featureCardGradient}
            >
              <Card style={styles.featureCardInner}>
                <TouchableOpacity style={styles.opportunityContent}>
                  <View style={styles.featureHeader}>
                    <MaterialCommunityIcons
                      name="radar"
                      size={20}
                      color="#F59E0B"
                    />
                    <Text style={styles.featureTitle}>Opportunity Radar</Text>
                  </View>
                  <Text style={styles.opportunityText}>3 new opportunities this week</Text>
                  <View style={styles.opportunityPulse} />
                </TouchableOpacity>
              </Card>
            </LinearGradient>
          </View>

          {/* Peer Comparison */}
          <View style={styles.featureCard}>
            <LinearGradient
              colors={["rgba(139, 92, 246, 0.1)", "rgba(139, 92, 246, 0.05)"]}
              style={styles.featureCardGradient}
            >
              <Card style={styles.featureCardInner}>
                <View style={styles.featureHeader}>
                  <MaterialCommunityIcons
                    name="account-group"
                    size={20}
                    color="#8B5CF6"
                  />
                  <Text style={styles.featureTitle}>Peer Comparison</Text>
                </View>
                <View style={styles.comparisonContent}>
                  <Text style={styles.comparisonText}>You are ahead of 62% learners this week</Text>
                  <View style={styles.comparisonBar}>
                    <LinearGradient
                      colors={["#8B5CF6", "#7C3AED"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[styles.comparisonFill, { width: "62%" }]}
                    />
                  </View>
                </View>
              </Card>
            </LinearGradient>
          </View>

          {/* Learning Style Analyzer */}
          <View style={styles.featureCard}>
            <LinearGradient
              colors={["rgba(236, 72, 153, 0.1)", "rgba(236, 72, 153, 0.05)"]}
              style={styles.featureCardGradient}
            >
              <Card style={styles.featureCardInner}>
                <View style={styles.featureHeader}>
                  <MaterialCommunityIcons
                    name="puzzle"
                    size={20}
                    color="#EC4899"
                  />
                  <Text style={styles.featureTitle}>Learning Style</Text>
                </View>
                <Text style={styles.learningStyleTitle}>Practice-based learner</Text>
                <Text style={styles.learningStyleDesc}>You learn best by hands-on practice</Text>
              </Card>
            </LinearGradient>
          </View>
        </View>

        {/* Today's Focus Card */}
        <Animated.View style={[styles.focusCard, { opacity: statsOpacity }]}>
          <LinearGradient
            colors={["rgba(34, 197, 94, 0.1)", "rgba(34, 197, 94, 0.05)"]}
            style={styles.focusCardGradient}
          >
            <Card style={styles.focusCardInner}>
              <View style={styles.focusCardContent}>
                <View style={styles.focusIconContainer}>
                  <LinearGradient
                    colors={["#22C55E", "#16A34A"]}
                    style={styles.focusIconGradient}
                  >
                    <MaterialCommunityIcons
                      name="target"
                      size={24}
                      color="white"
                    />
                  </LinearGradient>
                </View>
                <View style={styles.focusTextContainer}>
                  <Text style={styles.focusTitle}>Today's Focus</Text>
                  <Text style={styles.focusTask}>
                    Complete 1 Assessment to boost your profile
                  </Text>
                  <Text style={styles.focusSubtitle}>
                    Takes only 15 minutes • Earn 50 XP
                  </Text>
                </View>
                <TouchableOpacity style={styles.focusActionButton}>
                  <MaterialCommunityIcons
                    name="arrow-right"
                    size={20}
                    color="#22C55E"
                  />
                </TouchableOpacity>
              </View>
            </Card>
          </LinearGradient>
        </Animated.View>

        {/* Skill Progress Bars */}
        <View style={styles.skillProgressSection}>
          <View style={styles.skillProgressHeader}>
            <Text style={styles.skillProgressTitle}>Skill Development</Text>
            <Text style={styles.skillProgressSubtitle}>Track your growth</Text>
          </View>

          <View style={styles.skillProgressContainer}>
            {/* Technical Skills */}
            <View style={styles.skillProgressItem}>
              <View style={styles.skillProgressLabel}>
                <Text style={styles.skillProgressName}>Technical Skills</Text>
                <Text style={styles.skillProgressPercent}>75%</Text>
              </View>
              <View style={styles.skillProgressBar}>
                <LinearGradient
                  colors={["#3B82F6", "#1D4ED8"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.skillProgressFill, { width: "75%" }]}
                />
              </View>
            </View>

            {/* Communication */}
            <View style={styles.skillProgressItem}>
              <View style={styles.skillProgressLabel}>
                <Text style={styles.skillProgressName}>Communication</Text>
                <Text style={styles.skillProgressPercent}>60%</Text>
              </View>
              <View style={styles.skillProgressBar}>
                <LinearGradient
                  colors={["#8B5CF6", "#7C3AED"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.skillProgressFill, { width: "60%" }]}
                />
              </View>
            </View>

            {/* Problem Solving */}
            <View style={styles.skillProgressItem}>
              <View style={styles.skillProgressLabel}>
                <Text style={styles.skillProgressName}>Problem Solving</Text>
                <Text style={styles.skillProgressPercent}>45%</Text>
              </View>
              <View style={styles.skillProgressBar}>
                <LinearGradient
                  colors={["#F59E0B", "#D97706"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.skillProgressFill, { width: "45%" }]}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Quick Action Buttons */}
        <View style={styles.quickActionsSection}>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() =>
                navigation.navigate("CareerGuidance", {
                  screen: "SkillAssessment",
                })
              }
            >
              <LinearGradient
                colors={["#667EEA", "#764BA2"]}
                style={styles.quickActionGradient}
              >
                <MaterialCommunityIcons name="brain" size={24} color="white" />
                <Text style={styles.quickActionText}>Start Assessment</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionButton}>
              <LinearGradient
                colors={["#F093FB", "#F5576C"]}
                style={styles.quickActionGradient}
              >
                <MaterialCommunityIcons name="target" size={24} color="white" />
                <Text style={styles.quickActionText}>Set New Goal</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() =>
                navigation.navigate("CareerGuidance", {
                  screen: "LearningRoadmap",
                })
              }
            >
              <LinearGradient
                colors={["#4ECDC4", "#44A08D"]}
                style={styles.quickActionGradient}
              >
                <MaterialCommunityIcons name="road" size={24} color="white" />
                <Text style={styles.quickActionText}>View Career Path</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Motivational Insight */}
        <LinearGradient
          colors={["rgba(251, 191, 36, 0.1)", "rgba(251, 191, 36, 0.05)"]}
          style={styles.insightCard}
        >
          <Card style={styles.insightCardInner}>
            <View style={styles.insightContent}>
              <View style={styles.insightIconContainer}>
                <LinearGradient
                  colors={["#FBBF24", "#F59E0B"]}
                  style={styles.insightIconGradient}
                >
                  <MaterialCommunityIcons
                    name="lightbulb"
                    size={20}
                    color="white"
                  />
                </LinearGradient>
              </View>
              <View style={styles.insightTextContainer}>
                <Text style={styles.insightTitle}>Motivational Insight</Text>
                <Text style={styles.insightMessage}>
                  You&apos;re 63% closer to your goal than last week! Keep pushing
                  forward 🚀
                </Text>
              </View>
            </View>
          </Card>
        </LinearGradient>

        {/* Achievement Badges */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Achievements</Text>
            <View style={styles.sectionDivider} />
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.achievementsScroll}
          >
            <View style={styles.achievementsRow}>
              <View style={styles.achievementCard}>
                <LinearGradient
                  colors={["#667EEA", "#764BA2"]}
                  style={styles.achievementGradient}
                >
                  <View style={styles.achievementIconContainer}>
                    <MaterialCommunityIcons
                      name="star"
                      size={24}
                      color="white"
                    />
                  </View>
                  <Text style={styles.achievementTitle}>First Login</Text>
                  <Text style={styles.achievementSubtitle}>
                    Welcome aboard!
                  </Text>
                </LinearGradient>
              </View>

              <View style={styles.achievementCard}>
                <LinearGradient
                  colors={["#F093FB", "#F5576C"]}
                  style={styles.achievementGradient}
                >
                  <View style={styles.achievementIconContainer}>
                    <MaterialCommunityIcons
                      name="target"
                      size={24}
                      color="white"
                    />
                  </View>
                  <Text style={styles.achievementTitle}>Goal Setter</Text>
                  <Text style={styles.achievementSubtitle}>Setting goals!</Text>
                </LinearGradient>
              </View>

              <View style={styles.achievementCard}>
                <LinearGradient
                  colors={["#4ECDC4", "#44A08D"]}
                  style={styles.achievementGradient}
                >
                  <View style={styles.achievementIconContainer}>
                    <MaterialCommunityIcons
                      name="fire"
                      size={24}
                      color="white"
                    />
                  </View>
                  <Text style={styles.achievementTitle}>7 Day Streak</Text>
                  <Text style={styles.achievementSubtitle}>Keep it up!</Text>
                </LinearGradient>
              </View>

              <View style={styles.achievementCard}>
                <LinearGradient
                  colors={["#667EEA", "#764BA2"]}
                  style={styles.achievementGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.achievementIconContainer}>
                    <MaterialCommunityIcons
                      name="brain"
                      size={24}
                      color="white"
                    />
                  </View>
                  <Text style={styles.achievementTitle}>Smart Explorer</Text>
                  <Text style={styles.achievementSubtitle}>
                    First assessment
                  </Text>
                </LinearGradient>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* NeuroSpark Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.neurosparkHeader}>
              <LinearGradient
                colors={["#667EEA", "#764BA2", "#F093FB", "#F5576C"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.neurosparkGradient}
              >
                <View style={styles.neurosparkContent}>
                  <MaterialCommunityIcons
                    name="brain"
                    size={20}
                    color="white"
                  />
                  <Text style={styles.neurosparkTitle}>NeuroSpark</Text>
                  <MaterialCommunityIcons
                    name="sparkles"
                    size={16}
                    color="white"
                  />
                </View>
              </LinearGradient>
            </View>
            <View style={styles.sectionDivider} />
          </View>
          <Text style={styles.sectionDescription}>
            Complete these steps to get personalized career recommendations
          </Text>

          {menuItems.map((item, index) => (
            <AnimatedCard key={item.id} index={index}>
              <LinearGradient
                colors={[item.color + "12", item.color + "08"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.menuCardGradient}
              >
                <Card onPress={item.onPress} style={styles.menuCard}>
                  <Animated.View
                    style={[
                      styles.menuCardContent,
                      { transform: [{ scale: menuScale }] },
                    ]}
                  >
                    <LinearGradient
                      colors={[item.color, item.color + "CC"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={[
                        styles.menuIcon,
                        { 
                          backgroundColor: "transparent",
                          shadowColor: item.color,
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.3,
                          shadowRadius: 8,
                          elevation: 8,
                        },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={item.icon}
                        size={32}
                        color="white"
                      />
                    </LinearGradient>
                    <View style={styles.menuText}>
                      <Text style={styles.menuTitle}>{item.title}</Text>
                      <Text style={styles.menuDescription}>
                        {item.description}
                      </Text>
                      {item.progress > 0 && (
                        <View style={styles.progressContainer}>
                          <View style={styles.progressBar}>
                            <LinearGradient
                              colors={[item.color, item.color + "80"]}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              style={[
                                styles.progressFill,
                                { width: `${item.progress}%` },
                              ]}
                            />
                          </View>
                          <Text
                            style={[styles.progressText, { color: item.color }]}
                          >
                            {item.progress}% Complete
                          </Text>
                        </View>
                      )}
                    </View>
                    <View style={[styles.chevronContainer, { backgroundColor: item.color + "15" }]}>
                      <MaterialCommunityIcons
                        name="chevron-right"
                        size={24}
                        color="#9CA3AF"
                      />
                    </View>
                  </Animated.View>
                </Card>
              </LinearGradient>
            </AnimatedCard>
          ))}
        </View>

        {/* Roadmap Generator Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>90-Day Roadmap Generator</Text>
            <View style={styles.sectionDivider} />
          </View>
          <Text style={styles.sectionDescription}>
            Generate a personalized 90-day learning roadmap to accelerate your
            career growth
          </Text>

          <LinearGradient
            colors={["rgba(16, 185, 129, 0.1)", "rgba(16, 185, 129, 0.05)"]}
            style={styles.generatorCard}
          >
            <Card style={styles.generatorCardInner}>
              <TouchableOpacity
                style={styles.generatorContent}
                onPress={() => navigation.navigate("RoadmapGenerator")}
              >
                <View style={styles.generatorIconContainer}>
                  <LinearGradient
                    colors={["#10B981", "#059669"]}
                    style={styles.generatorIconGradient}
                  >
                    <MaterialCommunityIcons
                      name="calendar-clock"
                      size={28}
                      color="white"
                    />
                  </LinearGradient>
                </View>
                <View style={styles.generatorText}>
                  <Text style={styles.generatorTitle}>
                    Generate Your Roadmap
                  </Text>
                  <Text style={styles.generatorDescription}>
                    Create a structured 90-day plan with daily goals,
                    milestones, and progress tracking
                  </Text>
                  <View style={styles.generatorAction}>
                    <Text style={styles.generatorActionText}>
                      Start Generator
                    </Text>
                    <MaterialCommunityIcons
                      name="arrow-right"
                      size={16}
                      color="#10B981"
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </Card>
          </LinearGradient>
        </View>

        {/* Course & YouTube Suggestions Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Course & YouTube Suggestions
            </Text>
            <View style={styles.sectionDivider} />
          </View>
          <Text style={styles.sectionDescription}>
            Curated learning resources to boost your skills
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.suggestionsScroll}
          >
            <View style={styles.suggestionsRow}>
              {/* Course Suggestion */}
              <LinearGradient
                colors={["rgba(79, 70, 229, 0.1)", "rgba(79, 70, 229, 0.05)"]}
                style={styles.suggestionCard}
              >
                <Card style={styles.suggestionCardInner}>
                  <TouchableOpacity style={styles.suggestionContent}>
                    <View style={styles.suggestionIconContainer}>
                      <LinearGradient
                        colors={["#4F46E5", "#3730A3"]}
                        style={styles.suggestionIconGradient}
                      >
                        <MaterialCommunityIcons
                          name="school"
                          size={24}
                          color="white"
                        />
                      </LinearGradient>
                    </View>
                    <View style={styles.suggestionText}>
                      <Text style={styles.suggestionTitle}>
                        Python for Beginners
                      </Text>
                      <Text style={styles.suggestionSubtitle}>
                        Udemy Course
                      </Text>
                      <Text style={styles.suggestionDescription}>
                        Master Python fundamentals with hands-on projects
                      </Text>
                    </View>
                    <MaterialCommunityIcons
                      name="external-link"
                      size={20}
                      color="#4F46E5"
                    />
                  </TouchableOpacity>
                </Card>
              </LinearGradient>

              {/* YouTube Suggestion */}
              <LinearGradient
                colors={["rgba(239, 68, 68, 0.1)", "rgba(239, 68, 68, 0.05)"]}
                style={styles.suggestionCard}
              >
                <Card style={styles.suggestionCardInner}>
                  <TouchableOpacity style={styles.suggestionContent}>
                    <View style={styles.suggestionIconContainer}>
                      <LinearGradient
                        colors={["#EF4444", "#DC2626"]}
                        style={styles.suggestionIconGradient}
                      >
                        <MaterialCommunityIcons
                          name="youtube"
                          size={24}
                          color="white"
                        />
                      </LinearGradient>
                    </View>
                    <View style={styles.suggestionText}>
                      <Text style={styles.suggestionTitle}>
                        Data Structures Explained
                      </Text>
                      <Text style={styles.suggestionSubtitle}>
                        freeCodeCamp
                      </Text>
                      <Text style={styles.suggestionDescription}>
                        Visual guide to algorithms and data structures
                      </Text>
                    </View>
                    <MaterialCommunityIcons
                      name="external-link"
                      size={20}
                      color="#EF4444"
                    />
                  </TouchableOpacity>
                </Card>
              </LinearGradient>

              {/* Another Course */}
              <LinearGradient
                colors={["rgba(245, 158, 11, 0.1)", "rgba(245, 158, 11, 0.05)"]}
                style={styles.suggestionCard}
              >
                <Card style={styles.suggestionCardInner}>
                  <TouchableOpacity style={styles.suggestionContent}>
                    <View style={styles.suggestionIconContainer}>
                      <LinearGradient
                        colors={["#F59E0B", "#D97706"]}
                        style={styles.suggestionIconGradient}
                      >
                        <MaterialCommunityIcons
                          name="school"
                          size={24}
                          color="white"
                        />
                      </LinearGradient>
                    </View>
                    <View style={styles.suggestionText}>
                      <Text style={styles.suggestionTitle}>
                        React Native Mastery
                      </Text>
                      <Text style={styles.suggestionSubtitle}>Coursera</Text>
                      <Text style={styles.suggestionDescription}>
                        Build mobile apps with React Native framework
                      </Text>
                    </View>
                    <MaterialCommunityIcons
                      name="external-link"
                      size={20}
                      color="#F59E0B"
                    />
                  </TouchableOpacity>
                </Card>
              </LinearGradient>
            </View>
          </ScrollView>
        </View>

        {/* Progress Tracker Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Progress Tracker</Text>
            <View style={styles.sectionDivider} />
          </View>
          <Text style={styles.sectionDescription}>
            Track your learning journey and achievements
          </Text>

          <View style={styles.progressTrackerContainer}>
            {/* Overall Progress */}
            <LinearGradient
              colors={["rgba(255,255,255,0.9)", "rgba(255,255,255,0.7)"]}
              style={styles.progressCard}
            >
              <Card style={styles.progressCardInner}>
                <View style={styles.progressHeader}>
                  <MaterialCommunityIcons
                    name="chart-line"
                    size={24}
                    color="#1E293B"
                  />
                  <Text style={styles.progressTitle}>Overall Progress</Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBarBg}>
                    <LinearGradient
                      colors={["#10B981", "#059669"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[styles.progressBarFill, { width: "35%" }]}
                    />
                  </View>
                  <Text style={styles.progressPercent}>35% Complete</Text>
                </View>
                <Text style={styles.progressDescription}>
                  32 days completed out of 90-day roadmap
                </Text>
              </Card>
            </LinearGradient>

            {/* Weekly Goals */}
            <LinearGradient
              colors={["rgba(255,255,255,0.9)", "rgba(255,255,255,0.7)"]}
              style={styles.progressCard}
            >
              <Card style={styles.progressCardInner}>
                <View style={styles.progressHeader}>
                  <MaterialCommunityIcons
                    name="target"
                    size={24}
                    color="#1E293B"
                  />
                  <Text style={styles.progressTitle}>This Week</Text>
                </View>
                <View style={styles.weeklyGoals}>
                  <View style={styles.goalItem}>
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={20}
                      color="#10B981"
                    />
                    <Text style={styles.goalText}>Complete Python basics</Text>
                  </View>
                  <View style={styles.goalItem}>
                    <MaterialCommunityIcons
                      name="circle-outline"
                      size={20}
                      color="#64748B"
                    />
                    <Text style={styles.goalText}>Build calculator app</Text>
                  </View>
                  <View style={styles.goalItem}>
                    <MaterialCommunityIcons
                      name="circle-outline"
                      size={20}
                      color="#64748B"
                    />
                    <Text style={styles.goalText}>Learn Git fundamentals</Text>
                  </View>
                </View>
              </Card>
            </LinearGradient>
          </View>
        </View>

        {/* Help Section */}
        <LinearGradient
          colors={["rgba(102, 126, 234, 0.1)", "rgba(118, 75, 162, 0.1)"]}
          style={styles.helpCard}
        >
          <Card style={styles.helpCardInner}>
            <TouchableOpacity
              style={styles.helpContent}
              onPress={() => navigation.navigate("Help")}
            >
              <View style={styles.helpIconContainer}>
                <LinearGradient
                  colors={["#667EEA", "#764BA2"]}
                  style={styles.helpIconGradient}
                >
                  <MaterialCommunityIcons
                    name="help-circle"
                    size={28}
                    color="white"
                  />
                </LinearGradient>
              </View>
              <View style={styles.helpText}>
                <Text style={styles.helpTitle}>Need Help?</Text>
                <Text style={styles.helpDescription}>
                  Check out our guide to get the most out of your career
                  assessment journey
                </Text>
                <View style={styles.helpAction}>
                  <Text style={styles.helpActionText}>Learn More</Text>
                  <MaterialCommunityIcons
                    name="arrow-right"
                    size={16}
                    color="#667EEA"
                  />
                </View>
              </View>
            </TouchableOpacity>
          </Card>
        </LinearGradient>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  welcomeCard: {
    borderRadius: 24,
    marginBottom: 24,
    shadowColor: "#667EEA",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    overflow: "hidden",
  },
  welcomeGradient: {
    padding: 24,
  },
  welcomeContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeTextContainer: {
    flex: 1,
  },
  greetingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  greetingBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6,
  },
  nameContainer: {
    marginBottom: 12,
  },
  welcomeLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  welcomeName: {
    fontSize: 42,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -1,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "white",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.95)",
    marginBottom: 6,
  },
  welcomeSubtext: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 20,
  },
  welcomeIconContainer: {
    position: "relative",
  },
  iconGlow: {
    shadowColor: "white",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  floatingElements: {
    position: "absolute",
    top: -10,
    right: -10,
  },
  floatingDot: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  dot1: {
    top: 10,
    right: 20,
  },
  dot2: {
    top: 25,
    right: 5,
  },
  dot3: {
    top: 40,
    right: 15,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionDivider: {
    flex: 1,
    height: 2,
    backgroundColor: "#E2E8F0",
    marginLeft: 12,
    borderRadius: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    letterSpacing: -0.3,
  },
  sectionDescription: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 16,
    lineHeight: 20,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
  },
  statCard: {
    flex: 1,
    minWidth: '30%',
    maxWidth: '32%',
    padding: 4,
  },
  achievementsScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  achievementsRow: {
    flexDirection: "row",
    gap: 12,
  },
  achievementCard: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  achievementGradient: {
    padding: 16,
    alignItems: "center",
    minWidth: 120,
  },
  achievementIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
    marginBottom: 2,
  },
  achievementSubtitle: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  menuCardGradient: {
    borderRadius: 16,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  menuCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#F1F5F9",
    backgroundColor: "white",
    overflow: "hidden",
  },
  menuCardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  menuIcon: {
    width: 64,
    height: 64,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  iconBackground: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  menuDescription: {
    fontSize: 13,
    color: "#64748B",
    lineHeight: 18,
    fontWeight: "500",
  },
  progressContainer: {
    marginTop: 12,
  },
  progressBar: {
    height: 7,
    backgroundColor: "#E2E8F0",
    borderRadius: 4,
    marginBottom: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  chevronContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  helpCard: {
    borderRadius: 20,
    marginBottom: 32,
    padding: 2,
  },
  helpCardInner: {
    borderRadius: 18,
    backgroundColor: "white",
    borderWidth: 0,
  },
  helpContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  helpIconContainer: {
    marginRight: 16,
  },
  helpIconGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  helpText: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 4,
  },
  helpDescription: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
    marginBottom: 12,
  },
  helpAction: {
    flexDirection: "row",
    alignItems: "center",
  },
  helpActionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#667EEA",
    marginRight: 6,
  },
  bottomPadding: {
    height: 20,
  },
  // Roadmap Generator Styles
  generatorCard: {
    borderRadius: 20,
    marginBottom: 16,
    padding: 2,
  },
  generatorCardInner: {
    borderRadius: 18,
    backgroundColor: "white",
    borderWidth: 0,
  },
  generatorContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  generatorIconContainer: {
    marginRight: 16,
  },
  generatorIconGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  generatorText: {
    flex: 1,
  },
  generatorTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 4,
  },
  generatorDescription: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
    marginBottom: 12,
  },
  generatorAction: {
    flexDirection: "row",
    alignItems: "center",
  },
  generatorActionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#10B981",
    marginRight: 6,
  },
  // Course & YouTube Suggestions Styles
  suggestionsScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  suggestionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  suggestionCard: {
    borderRadius: 16,
    width: 280,
    marginVertical: 6,
    padding: 2,
  },
  suggestionCardInner: {
    borderRadius: 14,
    backgroundColor: "white",
    borderWidth: 0,
  },
  suggestionContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  suggestionIconContainer: {
    marginRight: 12,
  },
  suggestionIconGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  suggestionText: {
    flex: 1,
  },
  suggestionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 2,
  },
  suggestionSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 4,
  },
  suggestionDescription: {
    fontSize: 12,
    color: "#64748B",
    lineHeight: 16,
  },
  // Progress Tracker Styles
  progressTrackerContainer: {
    gap: 16,
  },
  progressCard: {
    borderRadius: 16,
    padding: 2,
  },
  progressCardInner: {
    borderRadius: 14,
    backgroundColor: "white",
    borderWidth: 0,
  },
  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    marginLeft: 8,
  },
  progressBarContainer: {
    marginBottom: 12,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: "#F1F5F9",
    borderRadius: 4,
    marginBottom: 8,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
    textAlign: "right",
  },
  progressDescription: {
    fontSize: 14,
    color: "#64748B",
  },
  weeklyGoals: {
    gap: 12,
  },
  goalItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  goalText: {
    fontSize: 14,
    color: "#374151",
    marginLeft: 12,
    flex: 1,
  },
  // Today's Focus Card Styles
  focusCard: {
    marginBottom: 24,
  },
  focusCardGradient: {
    borderRadius: 16,
    padding: 2,
  },
  focusCardInner: {
    borderRadius: 14,
    backgroundColor: "white",
    borderWidth: 0,
  },
  focusCardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  focusIconContainer: {
    marginRight: 12,
  },
  focusIconGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  focusTextContainer: {
    flex: 1,
  },
  focusTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  focusTask: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 2,
  },
  focusSubtitle: {
    fontSize: 12,
    color: "#64748B",
  },
  focusActionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  // Skill Progress Styles
  skillProgressSection: {
    marginBottom: 24,
  },
  skillProgressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  skillProgressTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
  },
  skillProgressSubtitle: {
    fontSize: 12,
    color: "#64748B",
  },
  skillProgressContainer: {
    gap: 16,
  },
  skillProgressItem: {
    gap: 8,
  },
  skillProgressLabel: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  skillProgressName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  skillProgressPercent: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
  },
  skillProgressBar: {
    height: 6,
    backgroundColor: "#F1F5F9",
    borderRadius: 3,
    overflow: "hidden",
  },
  skillProgressFill: {
    height: "100%",
    borderRadius: 3,
  },
  // Quick Actions Styles
  quickActionsSection: {
    marginBottom: 24,
  },
  quickActionsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionGradient: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: "center",
    gap: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
    textAlign: "center",
  },
  // Motivational Insight Styles
  insightCard: {
    borderRadius: 16,
    marginBottom: 24,
    padding: 2,
  },
  insightCardInner: {
    borderRadius: 14,
    backgroundColor: "white",
    borderWidth: 0,
  },
  insightContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  insightIconContainer: {
    marginRight: 12,
  },
  insightIconGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  insightTextContainer: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  insightMessage: {
    fontSize: 14,
    color: "#1E293B",
    lineHeight: 20,
  },
  // NeuroSpark Header Styles
  neurosparkHeader: {
    marginBottom: 12,
  },
  neurosparkGradient: {
    borderRadius: 20,
    padding: 2,
  },
  neurosparkContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
  },
  neurosparkTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1E293B",
    letterSpacing: -0.5,
  },
  // New Features Styles
  newFeaturesSection: {
    marginBottom: 24,
  },
  featureCard: {
    marginBottom: 16,
  },
  featureCardGradient: {
    borderRadius: 16,
    padding: 2,
  },
  featureCardInner: {
    borderRadius: 14,
    backgroundColor: "white",
    borderWidth: 0,
  },
  featureHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    marginLeft: 8,
    flex: 1,
  },
  // Career Map Styles
  careerMapScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  careerMapContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  careerStep: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  completedStep: {
    backgroundColor: "#10B981",
  },
  activeStep: {
    backgroundColor: "#3B82F6",
  },
  lockedStep: {
    backgroundColor: "#F3F4F6",
  },
  careerStepText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  // Resume Strength Styles
  resumeStrengthPercent: {
    fontSize: 16,
    fontWeight: "700",
    color: "#10B981",
  },
  resumeIndicators: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  indicatorItem: {
    alignItems: "center",
    gap: 4,
  },
  indicatorText: {
    fontSize: 12,
    color: "#64748B",
  },
  // Opportunity Radar Styles
  opportunityContent: {
    padding: 16,
  },
  opportunityText: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 4,
  },
  opportunityPulse: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F59E0B",
    shadowColor: "#F59E0B",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  // Peer Comparison Styles
  comparisonContent: {
    gap: 8,
  },
  comparisonText: {
    fontSize: 14,
    color: "#64748B",
  },
  comparisonBar: {
    height: 6,
    backgroundColor: "#F1F5F9",
    borderRadius: 3,
    overflow: "hidden",
  },
  comparisonFill: {
    height: "100%",
    borderRadius: 3,
  },
  // Learning Style Styles
  learningStyleTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#EC4899",
    marginBottom: 4,
  },
  learningStyleDesc: {
    fontSize: 14,
    color: "#64748B",
  },
});
