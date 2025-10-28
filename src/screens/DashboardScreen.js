import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { GoalsService } from '../services/GoalsService';
import { UserSessionService } from '../services/UserSessionService';
import UserDataService from '../services/UserDataService';
import MoodAssessmentService from '../services/MoodAssessmentService';
import BottomNavigationBar from '../components/BottomNavigationBar';
import MoodAssessmentScreen from './MoodAssessmentScreen';
import MoodHabitRecommendationsModal from '../components/MoodHabitRecommendationsModal';

export default function DashboardScreen({ navigation }) {
  const handleCheckScore = async () => {
    try {
      const isSignedUp = await UserSessionService.isCurrentUserSignedIn();
      if (isSignedUp) {
        navigation.navigate('QuizHub');
      } else {
        navigation.navigate('LeadershipIntro');
      }
    } catch (error) {
      navigation.navigate('LeadershipIntro');
    }
  };
  const [goals, setGoals] = useState([]);
  const [selectedMood, setSelectedMood] = useState(-1);
  const [isRdmSelected, setIsRdmSelected] = useState(true);
  const [username, setUsername] = useState('User');
  const [showMoodAssessment, setShowMoodAssessment] = useState(false);
  const [selectedMoodData, setSelectedMoodData] = useState(null);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [assessmentResults, setAssessmentResults] = useState(null);
  const [modifyHabitVisible, setModifyHabitVisible] = useState(false);
  const [habitToModify, setHabitToModify] = useState(null);
  const [modifiedHabitText, setModifiedHabitText] = useState('');
  const [showHabitOptions, setShowHabitOptions] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [isBottomBarVisible, setIsBottomBarVisible] = useState(true);
  const scrollY = React.useRef(0);
  const [mindfulnessScore, setMindfulnessScore] = useState(0);
  const [purposefulnessScore, setPurposefulnessScore] = useState(0);
  const [empathyScore, setEmpathyScore] = useState(0);

  // Handle long press on habit
  const handleHabitLongPress = (habit) => {
    setSelectedHabit(habit);
    setShowHabitOptions(true);
  };

  // Handle modify from options modal
  const handleModifyFromOptions = () => {
    if (selectedHabit) {
      setHabitToModify(selectedHabit);
      setModifiedHabitText(selectedHabit.title || selectedHabit.description);
      setShowHabitOptions(false);
      setModifyHabitVisible(true);
    }
  };

  // Handle delete from options modal
  const handleDeleteFromOptions = () => {
    if (selectedHabit) {
      setShowHabitOptions(false);
      handleDeleteHabit(selectedHabit);
      // Small delay to allow modal to close before showing delete confirmation
      setTimeout(() => {
        setSelectedHabit(null);
      }, 300);
    }
  };

  // Save modified habit
  const handleSaveModifiedHabit = async () => {
    if (!habitToModify || !modifiedHabitText.trim()) {
      Alert.alert('Error', 'Please enter a valid habit description.');
      return;
    }

    try {
      const isMoodHabit = habitToModify.category === 'Mood Assessment';
      const newTitle = modifiedHabitText.trim();

      if (isMoodHabit) {
        // Update mood habit
        await GoalsService.updateGoal({
          ...habitToModify,
          description: newTitle,
        });
      } else {
        // Update custom/configured habit
        await GoalsService.updateGoal({
          ...habitToModify,
          title: newTitle,
          description: newTitle,
        });
      }

      await loadAllHabits();
      setModifyHabitVisible(false);
      setHabitToModify(null);
      setModifiedHabitText('');
      Alert.alert('Success', 'Habit updated successfully!');
    } catch (error) {
      console.error('Error updating habit:', error);
      Alert.alert('Error', 'Failed to update habit.');
    }
  };

  // Delete habit
  const handleDeleteHabit = async (habit) => {
    try {
      await GoalsService.deleteGoal(habit.id);
      await loadAllHabits();
      // No confirmation needed, just delete immediately
    } catch (error) {
      console.error('Error deleting habit:', error);
      Alert.alert('Error', 'Failed to delete habit.');
    }
  };

  const moodData = {
    sad: {
      key: 'sad',
      emoji: '😢',
      name: 'SAD',
      description: 'I feel low, unseen, or emotionally heavy.',
      questions: [
        {
          question: 'When you notice this sadness, what do you usually do first?',
          options: {
            A: 'I pause and try to understand what triggered it.',
            B: 'I distract myself or keep busy.',
            C: 'I withdraw or shut down without realizing.'
          }
        },
        {
          question: 'Right now, what does your body feel like doing?',
          options: {
            A: 'Take a deep breath and maybe a small step forward.',
            B: 'Sit quietly and wait for it to pass.',
            C: 'Curl up, stay still, or sleep it off.'
          }
        },
        {
          question: 'Which thought feels most true right now?',
          options: {
            A: '"This will pass — I\'ve handled worse."',
            B: '"I just need a break."',
            C: '"Nothing really helps anymore."'
          }
        }
      ]
    },
    neutral: {
      key: 'neutral',
      emoji: '😐',
      name: 'NEUTRAL',
      description: 'I\'m okay but not really *in* life right now.',
      questions: [
        {
          question: 'Do you notice what\'s missing from your day today?',
          options: {
            A: 'Yes — I can sense I\'m under-stimulated.',
            B: 'Not really sure — I\'m floating through it.',
            C: 'I don\'t notice anything missing, but I feel numb.'
          }
        },
        {
          question: 'When you\'re in this state, what do you usually do?',
          options: {
            A: 'Try a light activity or talk to someone.',
            B: 'Keep scrolling or doing small tasks.',
            C: 'Withdraw into silence or avoid everything.'
          }
        },
        {
          question: 'Which line fits your headspace right now?',
          options: {
            A: '"I just need a spark."',
            B: '"Maybe tomorrow will feel different."',
            C: '"I feel disconnected from everything."'
          }
        }
      ]
    },
    content: {
      key: 'content',
      emoji: '🙂',
      name: 'CONTENT',
      description: 'I feel calm, balanced, or steady.',
      questions: [
        {
          question: 'What helps you sustain this balance?',
          options: {
            A: 'I know what grounds me and use it.',
            B: 'I enjoy the calm but don\'t think about maintaining it.',
            C: 'I fear it\'ll fade soon.'
          }
        },
        {
          question: 'How are you using your calmness today?',
          options: {
            A: 'Channeling it into something meaningful.',
            B: 'Taking it easy and staying low-key.',
            C: 'Not doing much — just drifting.'
          }
        },
        {
          question: 'What\'s in your mind right now?',
          options: {
            A: 'Gratitude or quiet focus.',
            B: '"I hope this feeling stays."',
            C: '"I don\'t feel much, just existing."'
          }
        }
      ]
    },
    cheerful: {
      key: 'cheerful',
      emoji: '😄',
      name: 'CHEERFUL',
      description: 'I\'m upbeat and playful.',
      questions: [
        {
          question: 'What\'s fueling your joy today?',
          options: {
            A: 'Gratitude or connection.',
            B: 'Random good vibe.',
            C: 'Not sure — it just happened.'
          }
        },
        {
          question: 'When you\'re happy, do you share it?',
          options: {
            A: 'Yes — I love spreading it.',
            B: 'Sometimes — if I have time.',
            C: 'Not really — I keep it private.'
          }
        },
        {
          question: 'What runs through your mind right now?',
          options: {
            A: '"I want to make someone\'s day."',
            B: '"This feels good, I\'ll enjoy it."',
            C: '"Hope this doesn\'t fade soon."'
          }
        }
      ]
    },
    loving: {
      key: 'loving',
      emoji: '🥰',
      name: 'LOVING',
      description: 'I feel connected, kind, or grateful.',
      questions: [
        {
          question: 'What\'s bringing this warmth today?',
          options: {
            A: 'Someone or something meaningful.',
            B: 'Just a general good vibe.',
            C: 'Not sure, it\'s random.'
          }
        },
        {
          question: 'How do you handle this emotional warmth?',
          options: {
            A: 'I share it or express it.',
            B: 'I hold it quietly.',
            C: 'I distract myself before it fades.'
          }
        },
        {
          question: 'What feels true in your mind now?',
          options: {
            A: '"I want to nurture this."',
            B: '"I want to remember this."',
            C: '"It probably won\'t last."'
          }
        }
      ]
    }
  };

  const moods = [
    { key: 'sad', emoji: '😢', name: 'SAD' },
    { key: 'neutral', emoji: '😐', name: 'NEUTRAL' },
    { key: 'content', emoji: '🙂', name: 'CONTENT' },
    { key: 'cheerful', emoji: '😄', name: 'CHEERFUL' },
    { key: 'loving', emoji: '🥰', name: 'LOVING' }
  ];

  // Load all habits
  const loadAllHabits = async () => {
    try {
      console.log('📊 Dashboard: Loading ALL habit types...');
      
      const email = await UserSessionService.getCurrentUserEmail();
      if (email) {
        setUsername(email.split('@')[0]);
      }
      
      // 1. Load ALL goals from GoalsService
      const userGoals = await GoalsService.getUserGoals();
      
      console.log('📊 Dashboard: All user goals loaded:', userGoals.length);
      console.log('   All goals:', userGoals.map(g => ({
        title: g.title,
        description: g.description,
        category: g.category,
        targetDate: g.targetDate
      })));
      
      // 2. Filter MOOD ASSESSMENT habits (from mood assessment flow)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const moodHabits = userGoals.filter(goal => {
        // Check if it's a mood habit
        if (goal.category === 'Mood Assessment') {
          console.log('   Found Mood Assessment habit:', goal.description);
          if (goal.targetDate) {
            const goalDate = new Date(goal.targetDate);
            goalDate.setHours(0, 0, 0, 0);
            const matches = goalDate.getTime() === today.getTime();
            console.log(`     Target date: ${goalDate.toISOString()}, Today: ${today.toISOString()}, Matches: ${matches}`);
            return matches;
          } else {
            // If no targetDate, show all mood habits (backwards compatibility)
            console.log('     No targetDate, showing anyway');
            return true;
          }
        }
        return false;
      });
      
      console.log('✅ Loaded MOOD ASSESSMENT habits:', moodHabits.length);
      console.log('   Mood habits list:', moodHabits);
      
      // 3. Load CONFIGURED habits (from Quiz Hub → ActionPicker → GoalConfigurationScreen)
      const configuredHabits = userGoals.filter(goal => 
        goal.category && 
        goal.category !== 'Mood Assessment' &&
        goal.category !== 'Custom Habits' // Filter out this category, will add to custom section
      );
      
      // 4. Load Custom Habits (from Dashboard → ActionPicker)
      const customHabits = userGoals.filter(goal => 
        goal.category === 'Custom Habits' || 
        goal.category === 'Custom'
      );
      
      // Combine configured and custom habits
      const allConfiguredHabits = [...configuredHabits, ...customHabits];
      
      console.log('✅ Loaded CONFIGURED habits:', configuredHabits.length);
      console.log('✅ Loaded CUSTOM habits:', customHabits.length);
      console.log('   Configured habits:', configuredHabits);
      console.log('   Custom habits:', customHabits);
      
      // Combine all types: mood habits + configured habits + custom habits
      const allHabits = [...moodHabits, ...allConfiguredHabits];
      
      console.log('📋 Total habits to display:', allHabits.length);
      console.log('   Final habits list:', allHabits.map(h => h.title || h.description));
      
      setGoals(allHabits);
    } catch (error) {
      console.error('❌ Error loading all habits:', error);
    }
  };

  // Load quiz scores for display
  const loadQuizScores = async () => {
    try {
      const mindfulness = await UserDataService.getQuizScore('Mindfulness');
      const purposeful = await UserDataService.getQuizScore('Purposefulness');
      const empathy = await UserDataService.getQuizScore('Empathy & Philanthropy');
      
      setMindfulnessScore(mindfulness || 0);
      setPurposefulnessScore(purposeful || 0);
      setEmpathyScore(empathy || 0);
    } catch (error) {
      console.error('Error loading quiz scores:', error);
    }
  };

  const handleMoodSelection = (moodKey) => {
    // Reset all previous state to ensure fresh start
    setShowRecommendations(false);
    setAssessmentResults(null);
    setSelectedMoodData(null);
    
    const moodIndex = moods.findIndex(m => m.key === moodKey);
    setSelectedMood(moodIndex);
    
    // Get complete mood data from MoodAssessmentService (includes habits)
    const fullMoodData = MoodAssessmentService.moodData[moodKey];
    setSelectedMoodData(fullMoodData);
    
    // Small delay to ensure state is cleared before opening modal
    setTimeout(() => {
      setShowMoodAssessment(true);
    }, 50);
  };

  useEffect(() => {
    loadAllHabits();
    loadQuizScores();
  }, []);

  // Refresh when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadAllHabits();
      loadQuizScores();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Title Bar with Gradient */}
      <LinearGradient
        colors={['#20C997', '#17A085', '#14B8A6']}
        style={styles.titleBar}
      >
        <View style={styles.titleBarContent}>
          <View style={styles.userHeader}>
            <View style={styles.logoContainer}>
              <View style={styles.logoWrapper}>
                <Text style={styles.logoR}>R</Text>
                <View style={styles.logoBracket} />
              </View>
              <Text style={styles.logoDM}>DM</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.headerIconButton}
                onPress={() => navigation.navigate('Profile')}
              >
                <View style={styles.iconBackground}>
                  <Ionicons name="person-outline" size={22} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerIconButton}>
                <View style={styles.iconBackground}>
                  <Ionicons name="menu" size={24} color="#FFFFFF" style={styles.menuIcon} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        onScroll={(event) => {
          const currentScrollY = event.nativeEvent.contentOffset.y;
          
          // Hide when scrolling down, show when scrolling up
          if (currentScrollY > scrollY.current && currentScrollY > 50) {
            if (isBottomBarVisible) setIsBottomBarVisible(false);
          } else if (currentScrollY < scrollY.current || currentScrollY < 100) {
            if (!isBottomBarVisible) setIsBottomBarVisible(true);
          }
          
          scrollY.current = currentScrollY;
        }}
        scrollEventThrottle={16}
      >
        {/* Top Row: Goal Meter + Portfolio */}
        <View style={styles.topRow}>
          {/* Goal Meter Card */}
          <View style={styles.goalMeterCard}>
            <Text style={styles.cardTitle}>Goal Meter</Text>
            <Text style={styles.cardSubtitle}>Wednesday, Sep 24</Text>
            <View style={styles.progressBarsContainer}>
              {[10, 11, 12, 13, 14, 15, 16].map((day, index) => {
                const heights = [0.3, 0.4, 0.2, 0.8, 0.3, 0.5, 0.4];
                const isActive = day === 13;
                return (
                  <View key={day} style={styles.barContainer}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: 50 * heights[index],
                          backgroundColor: isActive ? '#20C997' : '#D0D0D0',
                        },
                      ]}
                    />
                    <Text style={styles.barLabel}>{day}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Portfolio Card */}
          <View style={styles.portfolioCard}>
            <LinearGradient
              colors={['#20C997', '#17A2B8']}
              style={styles.portfolioGradient}
            >
              <View style={styles.portfolioHeader}>
                <MaterialIcons name="folder" color="#FFF" size={20} />
                <View style={styles.usdtLabelContainer}>
                  <Text style={styles.usdtLabelText}>USDT</Text>
                  <TouchableOpacity
                    onPress={() => setIsRdmSelected(!isRdmSelected)}
                    style={styles.toggleSwitchButton}
                  >
                    <View style={[
                      styles.toggleSwitchSlider,
                      { backgroundColor: isRdmSelected ? '#FFF' : 'rgba(255,255,255,0.5)' }
                    ]} />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.portfolioTitle}>PORTFOLIO</Text>
              <Text style={styles.portfolioAmount}>100.00</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Mood Card - Redesigned with Animations */}
        <MoodCardAnimated moods={moods} selectedMood={selectedMood} handleMoodSelection={handleMoodSelection} />

        {/* Base Purse Card */}
        <View style={styles.basePurseCard}>
          <View style={styles.basePurseLeft}>
            <Ionicons name="wallet-outline" color="#20C997" size={24} />
            <View style={styles.basePurseText}>
              <Text style={styles.basePurseAmount}>100.00</Text>
              <Text style={styles.basePurseLabel}>BASE PURSE</Text>
            </View>
          </View>
          <View style={styles.basePurseButtons}>
            <TouchableOpacity style={styles.topUpButton}>
              <Ionicons name="add" size={16} color="#FFF" />
              <Text style={styles.topUpText}>Top Up</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.withdrawButton}>
              <Ionicons name="chevron-down" size={16} color="#FFF" />
              <Text style={styles.withdrawText}>Withdraw</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* More Purse Card */}
        <View style={styles.morePurseCard}>
          <LinearGradient
            colors={['#20C997', '#17A085']}
            style={styles.morePurseIcon}
          >
            <MaterialIcons name="layers" color="#FFF" size={20} />
          </LinearGradient>
          <Text style={styles.morePurseText}>More Purse</Text>
          <Ionicons name="chevron-down" color="#808080" size={24} />
        </View>

               {/* Check Your Score Button */}
               <TouchableOpacity
                 style={styles.checkScoreButton}
                 onPress={handleCheckScore}
               >
          <LinearGradient
            colors={['#667eea', '#764ba2', '#f093fb']}
            style={styles.checkScoreGradient}
          >
            <View style={styles.checkScoreIcon}>
              <Ionicons name="bulb" size={24} color="#FFF" />
            </View>
            <View style={styles.checkScoreContent}>
              <Text style={styles.checkScoreTitle}>🎯 Check Your Score</Text>
              <Text style={styles.checkScoreSubtitle}>Discover your leadership potential</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#FFF" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Custom Habits Section */}
        <View style={styles.customHabitsSection}>
          <View style={styles.customHabitsHeader}>
            <Text style={styles.customHabitsTitle}>Custom Habits</Text>
            <TouchableOpacity
              style={styles.addHabitButton}
              onPress={() => navigation.navigate('ActionPicker', { 
                habitsWithPriority: null,
                selectedCategory: null 
              })}
            >
              <MaterialIcons name="add" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          {goals.length === 0 ? (
            <EmptyHabitsState />
          ) : (
            <>
              <HabitsList habits={goals} onHabitLongPress={handleHabitLongPress} />
              
              {/* Make your own AI custom Habit button - appears when 2+ habits */}
              {goals.length >= 2 && (
                <TouchableOpacity
                  style={styles.makeOwnHabitButtonWrapper}
                  onPress={() => {
                    // Navigate to Add Custom Habit screen
                    navigation.navigate('AddCustomHabit');
                  }}
                >
                  <LinearGradient
                    colors={['#20C997', '#17A085']}
                    style={styles.makeOwnHabitButton}
                  >
                    <Text style={styles.makeOwnHabitButtonText}>
                      Make your own AI custom Habit
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        {/* Leadership Profile Scores */}
        <View style={styles.quizScoresSection}>
          <View style={styles.quizScoresHeader}>
            <Text style={styles.quizScoresTitle}>Leadership Profile Scores</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('QuizHub')}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <QuizScoreItem title="Mindfulness" score={mindfulnessScore} icon="leaf-outline" color="#20C997" />
          <QuizScoreItem title="Purposefulness" score={purposefulnessScore} icon="flag-outline" color="#6C63FF" />
          <QuizScoreItem title="Empathy & Philanthropy" score={empathyScore} icon="heart-outline" color="#FF6B6B" />
        </View>
      </ScrollView>

      <BottomNavigationBar navigation={navigation} currentRoute="Dashboard" isVisible={isBottomBarVisible} />

      {/* Mood Assessment Modal - key ensures fresh start for each mood */}
      <MoodAssessmentScreen
        key={`mood-assessment-${selectedMoodData?.key || 'none'}`}
        visible={showMoodAssessment}
        onClose={() => {
          setShowMoodAssessment(false);
          // Don't set selectedMoodData to null here - we need it for recommendations modal
        }}
        moodData={selectedMoodData}
        navigation={navigation}
        onAssessmentComplete={(results) => {
          setAssessmentResults(results);
          setShowMoodAssessment(false);
          setShowRecommendations(true);
        }}
      />

      {/* Habit Recommendations Modal */}
      <MoodHabitRecommendationsModal
        visible={showRecommendations}
        onClose={() => {
          setShowRecommendations(false);
          setAssessmentResults(null);
          setSelectedMoodData(null); // Now we can clear it
          setSelectedMood(null); // Reset selected mood
        }}
        moodData={selectedMoodData}
        assessmentResults={assessmentResults}
        navigation={navigation}
      />

      {/* Habit Options Modal */}
      <HabitOptionsModal
        visible={showHabitOptions}
        habit={selectedHabit}
        onModify={handleModifyFromOptions}
        onDelete={handleDeleteFromOptions}
        onClose={() => {
          setShowHabitOptions(false);
          setTimeout(() => setSelectedHabit(null), 300);
        }}
      />

      {/* Modify Habit Modal */}
      {modifyHabitVisible && habitToModify && (
        <HabitModifyModal
          visible={modifyHabitVisible}
          habit={habitToModify}
          newText={modifiedHabitText}
          onTextChange={setModifiedHabitText}
          onSave={handleSaveModifiedHabit}
          onClose={() => {
            setModifyHabitVisible(false);
            setHabitToModify(null);
            setModifiedHabitText('');
          }}
        />
      )}
    </View>
  );
}

// Habit Options Modal Component
const HabitOptionsModal = ({ visible, habit, onModify, onDelete, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.habitOptionsOverlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <TouchableOpacity 
          style={styles.habitOptionsContainer} 
          activeOpacity={1}
        >
          {/* Close Button */}
          <TouchableOpacity 
            style={styles.habitOptionsCloseButton}
            onPress={onClose}
          >
            <Ionicons name="close-circle" size={28} color="#CBD5E0" />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.habitOptionsHeader}>
            <View style={styles.habitOptionsIconContainer}>
              <Ionicons name="options-outline" size={24} color="#20C997" />
            </View>
            <Text style={styles.habitOptionsTitle}>Habit Options</Text>
            <Text style={styles.habitOptionsSubtitle}>
              What would you like to do with this habit?
            </Text>
          </View>

          {/* Habit Preview */}
          {habit && (
            <View style={styles.habitPreviewCard}>
              <View style={styles.habitPreviewIcon}>
                <Ionicons name="checkmark-circle" size={20} color="#20C997" />
              </View>
              <View style={styles.habitPreviewText}>
                <Text 
                  style={styles.habitPreviewTitle} 
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {habit.title || habit.description}
                </Text>
              </View>
            </View>
          )}

          {/* Action Buttons - Side by Side */}
          <View style={styles.habitOptionsActions}>
            <TouchableOpacity 
              style={styles.habitOptionModifyButton}
              onPress={onModify}
              activeOpacity={0.8}
            >
              <Ionicons name="create-outline" size={26} color="#FFF" />
              <Text style={styles.habitOptionModifyButtonLabel}>Modify</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.habitOptionDeleteButton} 
              onPress={onDelete}
              activeOpacity={0.8}
            >
              <Ionicons name="trash-outline" size={26} color="#FFF" />
              <Text style={styles.habitOptionDeleteButtonLabel}>Delete</Text>
            </TouchableOpacity>
          </View>

        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

// Habit Modify Modal Component
const HabitModifyModal = ({ visible, habit, newText, onTextChange, onSave, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modifyModalOverlay}>
        <View style={styles.modifyModalContainer}>
          <Text style={styles.modifyModalTitle}>Modify Habit</Text>
          <TextInput
            style={styles.modifyModalInput}
            value={newText}
            onChangeText={onTextChange}
            multiline
            numberOfLines={4}
            placeholder="Enter habit description..."
          />
          <View style={styles.modifyModalButtons}>
            <TouchableOpacity style={styles.modifyModalCancelButton} onPress={onClose}>
              <Text style={styles.modifyModalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modifyModalSaveButton} onPress={onSave}>
              <Text style={styles.modifyModalSaveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Helper Components
const EmptyHabitsState = () => (
  <View style={styles.emptyState}>
    <LinearGradient
      colors={['#20C997', '#17A085']}
      style={styles.emptyStateIcon}
    >
      <MaterialIcons name="flag" size={40} color="#FFF" />
    </LinearGradient>
    <Text style={styles.emptyStateTitle}>No Habits Yet</Text>
    <Text style={styles.emptyStateText}>
      Create your first habit to start your mindful journey.
    </Text>
    <View style={styles.emptyStateQuote}>
      <Text style={styles.emptyStateQuoteText}>
        "Arise, Awake, and stop not till the habit is formed"
      </Text>
    </View>
  </View>
);

const HabitsList = ({ habits, onHabitLongPress }) => (
  <View>
    {habits.map((habit) => (
      <HabitCard 
        key={habit.id} 
        habit={habit} 
        onLongPress={onHabitLongPress}
      />
    ))}
  </View>
);

const HabitCard = ({ habit, onLongPress }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Determine if this is a configured habit or mood assessment habit
  const isMoodHabit = habit.category === 'Mood Assessment';
  
  // Get habit name based on type
  const habitName = isMoodHabit 
    ? (habit.description || 'Mood Habit')
    : (habit.title || habit.habitName || 'Unknown Habit');
  
  // Get metadata based on type
  const metadata = isMoodHabit 
    ? `Frequency: ${habit.frequency || 'Daily'} • RDM: ${habit.pledgeAmount || 1}`
    : `Frequency: ${habit.activityFrequency || 'Daily'} • Reflections: ${habit.reflections || 'Everyday'} • RDM: ${habit.pledgeRdm || 1}`;
  
  return (
    <TouchableOpacity 
      style={styles.habitCard}
      onPress={() => setIsExpanded(!isExpanded)}
      onLongPress={() => onLongPress(habit)}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={['#20C997', '#17A085']}
        style={styles.habitIcon}
      >
        <Ionicons name="checkmark-circle" size={20} color="#FFF" />
      </LinearGradient>
      <View style={styles.habitDetails}>
        <Text 
          style={styles.habitName} 
          numberOfLines={isExpanded ? undefined : 2}
          ellipsizeMode="tail"
        >
          {habitName}
        </Text>
        <Text style={styles.habitMeta}>{metadata}</Text>
      </View>
      <View style={styles.habitStatus} />
    </TouchableOpacity>
  );
};

const QuizScoreItem = ({ title, score, icon, color }) => (
  <View style={styles.quizScoreItem}>
    <View style={[styles.quizScoreIconContainer, { backgroundColor: `${color}15` }]}>
      <Ionicons name={icon} size={16} color={color} />
    </View>
    <View style={styles.quizScoreDetails}>
      <Text style={styles.quizScoreTitle}>{title}</Text>
      <View style={styles.quizScoreBarContainer}>
        <View style={[styles.quizScoreBar, { width: `${score}%`, backgroundColor: color }]} />
      </View>
    </View>
    <Text style={[styles.quizScorePercentage, { color }]}>{score}%</Text>
  </View>
);

// Animated Mood Card Component with Psychology-Based Design
const MoodCardAnimated = ({ moods, selectedMood, handleMoodSelection }) => {
  const [emojiAnimations] = useState(() =>
    moods.map(() => ({
      scale: new Animated.Value(0.8),
      pulse: new Animated.Value(1),
      rotate: new Animated.Value(0),
      glow: new Animated.Value(0),
    }))
  );

  useEffect(() => {
    // Sequential blinking color animation (one-time on mount)
    moods.forEach((mood, index) => {
      setTimeout(() => {
        Animated.sequence([
          Animated.timing(emojiAnimations[index].glow, {
            toValue: 1,
            duration: 180,
            useNativeDriver: false,
          }),
          Animated.timing(emojiAnimations[index].glow, {
            toValue: 0,
            duration: 180,
            useNativeDriver: false,
          }),
        ]).start();
      }, index * 180);
    });

    // Staggered entrance animation
    moods.forEach((mood, index) => {
      Animated.spring(emojiAnimations[index].scale, {
        toValue: 1,
        tension: 100,
        friction: 7,
        useNativeDriver: true,
      }).start();

      // Continuous subtle breathing animation for unselected moods
      if (selectedMood !== index) {
        const animateBreathing = () => {
          Animated.sequence([
            Animated.timing(emojiAnimations[index].pulse, {
              toValue: 1.06,
              duration: 2000,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(emojiAnimations[index].pulse, {
              toValue: 1,
              duration: 2000,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]).start(() => animateBreathing());
        };
        animateBreathing();
      }
    });
  }, [selectedMood]);

  const handleMoodPress = (moodKey, index) => {
    // Premium bounce effect with rotation on selection
    Animated.parallel([
      Animated.sequence([
        Animated.spring(emojiAnimations[index].scale, {
          toValue: 1.4,
          tension: 300,
          friction: 2,
          useNativeDriver: true,
        }),
        Animated.spring(emojiAnimations[index].scale, {
          toValue: 1.2,
          tension: 200,
          friction: 4,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(emojiAnimations[index].rotate, {
          toValue: -1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(emojiAnimations[index].rotate, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(emojiAnimations[index].rotate, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    handleMoodSelection(moodKey);
  };

  return (
    <Animated.View style={styles.moodCardAnimated}>
      <LinearGradient
        colors={['#E6FCF5', '#FFFFFF', '#F0FDF8']}
        style={styles.moodCardGradient}
      >
        <View style={styles.moodCardHeader}>
          <Text style={styles.moodTitle}>How are you feeling today?</Text>
        </View>

        <View style={styles.moodIconsContainerAnimated}>
          {moods.map((mood, index) => {
            const isSelected = selectedMood === index;
            const rotate = emojiAnimations[index].rotate.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '360deg'],
            });
            
            const opacityStyle = {
              transform: [
                { scale: isSelected ? emojiAnimations[index].scale : Animated.multiply(emojiAnimations[index].scale, emojiAnimations[index].pulse) },
              ],
            };

            const glowStyle = {
              opacity: emojiAnimations[index].glow,
            };

            return (
              <TouchableOpacity
                key={mood.key}
                activeOpacity={0.8}
                onPress={() => handleMoodPress(mood.key, index)}
                style={styles.moodIconWrapper}
              >
                <Animated.View
                  style={[
                    styles.moodIconAnimated,
                    isSelected && styles.moodIconSelectedAnimated,
                    opacityStyle,
                  ]}
                >
                  <Text style={styles.moodEmojiAnimated}>{mood.emoji}</Text>
                  {isSelected && (
                    <>
                      <View style={styles.selectedRing} />
                      <View style={styles.selectedRingInner} />
                      <View style={styles.selectedGlow} />
                    </>
                  )}
                </Animated.View>
                <Animated.View
                  style={[
                    styles.moodIconGlowOverlay,
                    glowStyle,
                  ]}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  titleBar: {
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  titleBarContent: {
    gap: 8,
  },
  titleText: {
    fontSize: 30,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    gap: 8,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  logoWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoR: {
    fontSize: 28,
    fontWeight: '900',
    color: '#20C997',
    letterSpacing: -1,
  },
  logoBracket: {
    position: 'absolute',
    top: -2,
    left: -6,
    right: -4,
    bottom: -2,
    borderRadius: 2,
    borderWidth: 2.5,
    borderColor: '#20C997',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: 'transparent',
  },
  logoDM: {
    fontSize: 28,
    fontWeight: '900',
    color: '#20C997',
    letterSpacing: -1,
  },
  // Legacy styles for backwards compatibility
  logoGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 14,
  },
  logoText: {
    color: '#20C997',
    fontWeight: '900',
    fontSize: 18,
    letterSpacing: 1,
  },
  username: {
    flex: 1,
    fontSize: 17,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 0.2,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerIconButton: {
    padding: 4,
  },
  iconBackground: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  menuIcon: {
    fontWeight: '900',
  },
  scrollView: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 160,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    gap: 12,
  },
  goalMeterCard: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5F7F3',
    shadowColor: '#20C997',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A202C',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#20C997',
    marginBottom: 12,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  progressBarsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-end',
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
  },
  bar: {
    width: 16,
    borderRadius: 5,
    marginBottom: 6,
  },
  barLabel: {
    fontSize: 10,
    color: '#20C997',
    fontWeight: '700',
  },
  portfolioCard: {
    flex: 1,
    borderRadius: 16,
    shadowColor: '#20C997',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
    borderWidth: 0,
  },
  portfolioGradient: {
    padding: 16,
    paddingTop: 14,
    paddingBottom: 18,
    flex: 1,
    justifyContent: 'space-between',
  },
  portfolioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  usdtLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  usdtLabelText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  toggleSwitchButton: {
    width: 50,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 12,
    padding: 2,
    justifyContent: 'center',
  },
  toggleSwitchSlider: {
    width: '50%',
    height: '100%',
    borderRadius: 10,
  },
  portfolioTitle: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '700',
    marginTop: 0,
    letterSpacing: 0.8,
  },
  portfolioAmount: {
    fontSize: 32,
    color: '#FFF',
    fontWeight: '900',
    marginTop: 4,
    letterSpacing: -0.8,
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  moodCardAnimated: {
    marginBottom: 20,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#20C997',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
  moodCardGradient: {
    padding: 24,
    paddingTop: 20,
  },
  moodCardHeader: {
    marginBottom: 8,
    alignItems: 'center',
  },
  moodTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1A202C',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  moodIconsContainerAnimated: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 0,
  },
  moodIconWrapper: {
    alignItems: 'center',
    position: 'relative',
  },
  moodIconAnimated: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 2.5,
    borderColor: '#E5E5E5',
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  moodIconSelectedAnimated: {
    backgroundColor: '#20C997',
    borderColor: '#20C997',
    shadowColor: '#20C997',
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  moodEmojiAnimated: {
    fontSize: 36,
    zIndex: 10,
  },
  selectedRing: {
    position: 'absolute',
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 3,
    borderColor: 'rgba(32, 201, 151, 0.3)',
    pointerEvents: 'none',
  },
  selectedRingInner: {
    position: 'absolute',
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  selectedGlow: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#20C997',
    opacity: 0.15,
    top: -4,
    left: -4,
  },
  moodIconGlowOverlay: {
    position: 'absolute',
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#20C997',
    borderWidth: 2.5,
    borderColor: '#20C997',
    top: 0,
    left: 0,
    zIndex: 5,
  },
  moodCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 16,
  },
  moodTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  moodIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  moodIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodIconSelected: {
    backgroundColor: '#4FD1C7',
    borderColor: '#4FD1C7',
  },
  moodEmoji: {
    fontSize: 24,
  },
  basePurseCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 16,
  },
  basePurseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  basePurseText: {
    marginLeft: 12,
  },
  basePurseAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  basePurseLabel: {
    fontSize: 12,
    color: '#808080',
    fontWeight: '500',
  },
  basePurseButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  topUpButton: {
    backgroundColor: '#20C997',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  topUpText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
  },
  withdrawButton: {
    backgroundColor: '#D0D0D0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  withdrawText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
  },
  morePurseCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  morePurseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  morePurseText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  checkScoreButton: {
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  checkScoreGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
  },
  checkScoreIcon: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkScoreContent: {
    flex: 1,
    marginLeft: 16,
  },
  checkScoreTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  checkScoreSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  customHabitsSection: {
    backgroundColor: '#FFF',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
    marginBottom: 20,
  },
  customHabitsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  customHabitsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  addHabitButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#20C997',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addHabitButtonText: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyStateIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#808080',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateQuote: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12,
    width: '100%',
  },
  emptyStateQuoteText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#808080',
    textAlign: 'center',
  },
  habitCard: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 12,
  },
  habitIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  habitDetails: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  habitMeta: {
    fontSize: 12,
    color: '#808080',
  },
  habitStatus: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#20C997',
    alignSelf: 'center',
  },
  aiCustomHabitButton: {
    backgroundColor: '#20C997',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  aiCustomHabitText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  quizScoresSection: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
    marginBottom: 32,
  },
  quizScoresHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  quizScoresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  viewAllText: {
    color: '#20C997',
    fontSize: 14,
    fontWeight: '600',
  },
  quizScoreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    paddingVertical: 4,
  },
  quizScoreIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  quizScoreDetails: {
    flex: 1,
  },
  quizScoreTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 6,
  },
  quizScoreBarContainer: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  quizScoreBar: {
    height: '100%',
    borderRadius: 2,
  },
  quizScorePercentage: {
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 12,
    minWidth: 40,
  },
  // Modify Habit Modal Styles
  modifyModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modifyModalContainer: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  modifyModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 16,
  },
  modifyModalInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1A202C',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  modifyModalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modifyModalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  modifyModalCancelText: {
    color: '#4A5568',
    fontSize: 16,
    fontWeight: '600',
  },
  modifyModalSaveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#20C997',
    alignItems: 'center',
  },
  modifyModalSaveText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Habit Options Modal Styles
  habitOptionsOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitOptionsContainer: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    width: '75%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 20,
    position: 'relative',
  },
  habitOptionsCloseButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
  },
  habitOptionsHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  habitOptionsIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  habitOptionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 6,
  },
  habitOptionsSubtitle: {
    fontSize: 13,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 18,
  },
  habitPreviewCard: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    padding: 10,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  habitPreviewIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#E6FFF9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    flexShrink: 0,
  },
  habitPreviewText: {
    flex: 1,
  },
  habitPreviewTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2D3748',
    lineHeight: 18,
  },
  habitOptionsActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  habitOptionModifyButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#20C997',
    paddingVertical: 14,
    borderRadius: 14,
    minHeight: 64,
    gap: 4,
  },
  habitOptionModifyButtonLabel: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 0,
  },
  habitOptionButton: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 2,
  },
  habitOptionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  habitOptionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  habitOptionDeleteButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B6B',
    paddingVertical: 14,
    borderRadius: 14,
    minHeight: 64,
    gap: 4,
  },
  habitOptionDeleteButtonLabel: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 0,
  },
  // Make your own AI custom Habit button styles
  makeOwnHabitButtonWrapper: {
    marginTop: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  makeOwnHabitButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  makeOwnHabitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.2,
  },
});
