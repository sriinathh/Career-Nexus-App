import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

const Landing = ({ navigation }) => {
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);

  const handleJoinNow = () => {
    navigation?.navigate("LoginScreen");
  };

  // HEADER COMPONENT
  const Header = () => (
    <View style={[styles.header, isHeaderSticky && styles.headerSticky]}>
      <Text style={styles.logo}>CareerNexus</Text>
      <TouchableOpacity style={styles.joinNowBtn} onPress={handleJoinNow}>
        <Text style={styles.joinNowBtnText}>Join Now</Text>
      </TouchableOpacity>
    </View>
  );

  // HERO SECTION
  const HeroSection = () => (
    <View style={styles.heroSection}>
      <Text style={styles.heroLabel}>YOUR AI CAREER GUIDANCE OS</Text>
      <Text style={styles.heroTitle}>CareerNexus AI</Text>
      <Text style={styles.heroSubtitle}>
        Make confident career decisions using AI, analytics, and real-world
        signals.
      </Text>
      <TouchableOpacity style={styles.primaryBtn} onPress={handleJoinNow}>
        <Text style={styles.primaryBtnText}>Join Now</Text>
      </TouchableOpacity>
    </View>
  );

  // LIVE CAREER SNAPSHOT CARD
  const SnapshotCard = () => (
    <View style={styles.snapshotContainer}>
      <Text style={styles.snapshotTitle}>LIVE CAREER SNAPSHOT</Text>

      <View style={styles.statsGrid}>
        {/* Career XP */}
        <View style={[styles.statBlock, styles.statGreen]}>
          <Text style={styles.statNumber}>420</Text>
          <Text style={styles.statLabel}>Career XP</Text>
          <Text style={styles.statDelta}>+240 this week</Text>
        </View>

        {/* Career Streak */}
        <View style={[styles.statBlock, styles.statYellow]}>
          <Text style={styles.statNumber}>21</Text>
          <Text style={styles.statLabel}>Career Streak</Text>
          <Text style={styles.statDelta}>Days active</Text>
        </View>

        {/* Resume Strength */}
        <View style={[styles.statBlock, styles.statBlue]}>
          <Text style={styles.statNumber}>87</Text>
          <Text style={styles.statLabel}>Resume Strength</Text>
          <Text style={styles.statDelta}>ATS-Optimized</Text>
        </View>
      </View>

      <LinearGradient
        colors={["#E0E7FF", "#F0F4FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.infoBox}
      >
        <Text style={styles.infoBoxText}>
          AI-driven career roadmap & readiness visualization
        </Text>
      </LinearGradient>
    </View>
  );

  // WHAT WE OFFER SECTION
  const OfferingsSection = () => {
    const features = [
      { id: 1, title: "AI Personalized Learning", icon: "robot" },
      { id: 2, title: "Gamified XP, Badges, Streaks", icon: "trophy" },
      { id: 3, title: "AI Mentor (LearnBuddy)", icon: "school" },
      { id: 4, title: "AI Career Roadmap Generator", icon: "map" },
      { id: 5, title: "Internship & Placement Hub", icon: "briefcase" },
      { id: 6, title: "Resume Analyzer", icon: "file-document" },
      { id: 7, title: "Community Forums", icon: "forum" },
      { id: 8, title: "Certifications & Quizzes", icon: "check-circle" },
    ];

    return (
      <View style={styles.featureGrid}>
        {features.map((feature) => (
          <View key={feature.id} style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <MaterialCommunityIcons
                name={feature.icon}
                size={32}
                color="#4F46E5"
              />
            </View>
            <Text style={styles.featureTitle}>{feature.title}</Text>
          </View>
        ))}
      </View>
    );
  };

  // IMPACT STATS SECTION
  const ImpactSection = () => {
    const stats = [
      { label: "25K+", description: "Students Empowered" },
      { label: "8.2K", description: "AI-generated Roadmaps" },
      { label: "3.1K", description: "Internships & Placements" },
      { label: "+34%", description: "Resume Uplift" },
    ];

    return (
      <View style={styles.impactSection}>
        {stats.map((stat, idx) => (
          <View key={idx} style={styles.impactCard}>
            <Text style={styles.impactLabel}>{stat.label}</Text>
            <Text style={styles.impactDescription}>{stat.description}</Text>
          </View>
        ))}
      </View>
    );
  };

  // TESTIMONIALS SECTION
  const TestimonialsSection = () => {
    const testimonials = [
      {
        id: 1,
        quote:
          "CareerNexus AI completely transformed how I approach my career. The AI-driven roadmap was exactly what I needed!",
        name: "Ananya",
        role: "CS Undergrad",
      },
      {
        id: 2,
        quote:
          "As a mentor, I love how the platform helps students make data-driven decisions. Truly innovative!",
        name: "Rahul",
        role: "Full Stack Mentor",
      },
      {
        id: 3,
        quote:
          "Our placement rates improved by 40% after integrating CareerNexus AI. A game changer for institutions.",
        name: "Priya",
        role: "Placement Cell Admin",
      },
    ];

    return (
      <View style={styles.testimonialsSection}>
        <Text style={styles.sectionTitle}>
          Loved by students, mentors & admins
        </Text>

        <FlatList
          data={testimonials}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.testimonialCard}>
              <Text style={styles.testimonialQuote}>"{item.quote}"</Text>
              <Text style={styles.testimonialName}>{item.name}</Text>
              <Text style={styles.testimonialRole}>{item.role}</Text>
            </View>
          )}
        />
      </View>
    );
  };

  // FOOTER COMPONENT
  const Footer = () => (
    <View style={styles.footer}>
      <Text style={styles.footerBrand}>CareerNexus AI</Text>
      <View style={styles.footerLinks}>
        <TouchableOpacity>
          <Text style={styles.footerLink}>Privacy</Text>
        </TouchableOpacity>
        <Text style={styles.footerDivider}>•</Text>
        <TouchableOpacity>
          <Text style={styles.footerLink}>Terms</Text>
        </TouchableOpacity>
        <Text style={styles.footerDivider}>•</Text>
        <TouchableOpacity>
          <Text style={styles.footerLink}>Contact</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.footerCopyright}>
        © 2026 CareerNexus. All rights reserved.
      </Text>
    </View>
  );

  const handleScroll = (event) => {
    const scrollOffset = event.nativeEvent.contentOffset.y;
    setIsHeaderSticky(scrollOffset > 50);
  };

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#F8F9FC"
        translucent={false}
      />
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <Header />
        <HeroSection />
        <SnapshotCard />

        <View style={styles.offeringsSection}>
          <Text style={styles.sectionTitle}>
            A complete AI-first learning & career ecosystem
          </Text>
          <OfferingsSection />
        </View>

        <ImpactSection />
        <TestimonialsSection />
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FC",
    paddingTop: 40,
  },

  // HEADER STYLES
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "transparent",
  },
  headerSticky: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  logo: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4F46E5",
  },
  joinNowBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "rgba(79, 70, 229, 0.1)",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#4F46E5",
  },
  joinNowBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4F46E5",
  },

  // HERO SECTION STYLES
  heroSection: {
    paddingHorizontal: 20,
    paddingVertical: 50,
    alignItems: "center",
  },
  heroLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#7C3AED",
    letterSpacing: 1.2,
    marginBottom: 12,
    opacity: 0.8,
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 16,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 16,
    fontWeight: "400",
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
    maxWidth: "90%",
  },
  primaryBtn: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    backgroundColor: "#4F46E5",
    borderRadius: 10,
    marginBottom: 20,
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    textAlign: "center",
  },

  // SNAPSHOT CARD STYLES
  snapshotContainer: {
    marginHorizontal: 20,
    marginVertical: 30,
    padding: 24,
    backgroundColor: "#FFF",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
  },
  snapshotTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#7C3AED",
    letterSpacing: 1,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 12,
  },
  statBlock: {
    flex: 1,
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  statGreen: {
    backgroundColor: "#DCFCE7",
  },
  statYellow: {
    backgroundColor: "#FEF3C7",
  },
  statBlue: {
    backgroundColor: "#DBEAFE",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 6,
    color: "#1F2937",
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#4B5563",
    marginBottom: 4,
  },
  statDelta: {
    fontSize: 10,
    fontWeight: "500",
    color: "#6B7280",
  },
  infoBox: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  infoBoxText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#4338CA",
    textAlign: "center",
  },

  // OFFERINGS SECTION STYLES
  offeringsSection: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 36,
  },
  featureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureCard: {
    width: "48%",
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: "#FFF",
    borderRadius: 16,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(79, 70, 229, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  badgeNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1F2937",
    textAlign: "center",
    lineHeight: 18,
  },

  // IMPACT SECTION STYLES
  impactSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    paddingVertical: 30,
    justifyContent: "space-between",
  },
  impactCard: {
    width: "48%",
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: "#FFF",
    borderRadius: 16,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  impactLabel: {
    fontSize: 28,
    fontWeight: "800",
    color: "#4F46E5",
    marginBottom: 8,
  },
  impactDescription: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    textAlign: "center",
  },

  // TESTIMONIALS SECTION STYLES
  testimonialsSection: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  testimonialCard: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: "#FFF",
    borderRadius: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#4F46E5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  testimonialQuote: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    lineHeight: 22,
    marginBottom: 16,
    fontStyle: "italic",
  },
  testimonialName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  testimonialRole: {
    fontSize: 12,
    fontWeight: "500",
    color: "#9CA3AF",
  },

  // FOOTER STYLES
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#FFF",
    marginTop: 20,
  },
  footerBrand: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4F46E5",
    marginBottom: 16,
  },
  footerLinks: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  footerLink: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
    marginHorizontal: 8,
  },
  footerDivider: {
    color: "#D1D5DB",
    marginHorizontal: 4,
  },
  footerCopyright: {
    fontSize: 11,
    color: "#9CA3AF",
  },
});

export default Landing;
