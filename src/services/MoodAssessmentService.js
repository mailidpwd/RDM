class MoodAssessmentService {
  static moodData = {
    'sad': {
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
      ],
      habits: {
        grounding: {
          title: '2-minute Reality Anchor',
          description: 'Sit, name 5 things you can see, 4 things you can touch, 3 sounds, breathe slowly 3 times.',
          type: 'Grounding',
          message: 'Ground yourself gently — your system needs immediate calm.'
        },
        reflective: {
          title: '10-minute "Feel and Write"',
          description: 'Write one sentence: "Right now I feel ___ because ___."',
          type: 'Reflective',
          message: 'You\'re in a reflective zone — take 10 minutes to process and rebalance.'
        },
        growth: {
          title: 'Connection Act',
          description: 'Message someone you trust, "Just wanted to say hi — hope you\'re doing okay."',
          type: 'Growth',
          message: 'You\'re emotionally stable — build momentum or spread your positive energy.'
        }
      }
    },
    'neutral': {
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
      ],
      habits: {
        grounding: {
          title: 'Micro-Activation',
          description: '3 deep breaths, then stand and move for 90 seconds (stretch, walk, jump).',
          type: 'Grounding',
          message: 'Ground yourself gently — your system needs immediate calm.'
        },
        reflective: {
          title: 'Mini Dopamine Spark',
          description: 'Do a 5-min task that gives visible progress — clean one shelf, reply to one message.',
          type: 'Reflective',
          message: 'You\'re in a reflective zone — take 10 minutes to process and rebalance.'
        },
        growth: {
          title: 'Curiosity Habit',
          description: 'Watch/read something new for 10 min and jot 1 insight.',
          type: 'Growth',
          message: 'You\'re emotionally stable — build momentum or spread your positive energy.'
        }
      }
    },
    'content': {
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
      ],
      habits: {
        grounding: {
          title: 'Reflection Checkpoint',
          description: '3 sentences in journal: "What made today peaceful?"',
          type: 'Grounding',
          message: 'Ground yourself gently — your system needs immediate calm.'
        },
        reflective: {
          title: 'Balance Reinforcement',
          description: 'Plan tomorrow\'s first 10 minutes intentionally (music, tea, or breathwork).',
          type: 'Reflective',
          message: 'You\'re in a reflective zone — take 10 minutes to process and rebalance.'
        },
        growth: {
          title: 'Build Momentum',
          description: 'Do one creative or value-aligned action today.',
          type: 'Growth',
          message: 'You\'re emotionally stable — build momentum or spread your positive energy.'
        }
      }
    },
    'cheerful': {
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
      ],
      habits: {
        grounding: {
          title: 'Energy Anchor',
          description: 'Breathe, smile, notice 3 things you appreciate right now.',
          type: 'Grounding',
          message: 'Ground yourself gently — your system needs immediate calm.'
        },
        reflective: {
          title: 'Joy Reinforcement',
          description: 'Text 1 thank-you message or compliment someone.',
          type: 'Reflective',
          message: 'You\'re in a reflective zone — take 10 minutes to process and rebalance.'
        },
        growth: {
          title: 'Momentum Builder',
          description: 'Start a 15-min creative or impact action right now.',
          type: 'Growth',
          message: 'You\'re emotionally stable — build momentum or spread your positive energy.'
        }
      }
    },
    'loving': {
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
      ],
      habits: {
        grounding: {
          title: 'Warmth Reflection',
          description: 'Write one thing you love about yourself.',
          type: 'Grounding',
          message: 'Ground yourself gently — your system needs immediate calm.'
        },
        reflective: {
          title: 'Gratitude Ripple',
          description: 'Send one thank-you text or share an appreciation post.',
          type: 'Reflective',
          message: 'You\'re in a reflective zone — take 10 minutes to process and rebalance.'
        },
        growth: {
          title: 'Kindness Act',
          description: 'Do a small, quiet kindness today (no expectation).',
          type: 'Growth',
          message: 'You\'re emotionally stable — build momentum or spread your positive energy.'
        }
      }
    }
  };

  // Calculate Mood Assessment
  static calculateMoodAssessment(mood, answers) {
    console.log('=== MOOD ASSESSMENT CALCULATION ===');
    console.log('Mood:', mood);
    console.log('Raw answers:', answers);
    
    const scoreMapping = { 'A': 2, 'B': 1, 'C': 0 };
    
    // Ensure answers is an array
    const answersArray = Array.isArray(answers) ? answers : Object.values(answers);
    console.log('Answers array:', answersArray);
    
    const scores = answersArray.map(answer => {
      const score = scoreMapping[answer.toUpperCase()] || 0;
      console.log(`Answer: ${answer}, Score: ${score}`);
      return score;
    });
    const totalScore = scores.reduce((a, b) => a + b, 0);
    const moodIndex = Math.round((totalScore / 6) * 100);
    
    console.log('Total score:', totalScore);
    console.log('Mood Index:', moodIndex);

    let habitCategory;
    let message;

    if (moodIndex <= 40) {
      habitCategory = 'grounding';
      message = 'Ground yourself gently — your system needs immediate calm.';
    } else if (moodIndex <= 70) {
      habitCategory = 'reflective';
      message = 'You\'re in a reflective zone — take 10 minutes to process and rebalance.';
    } else {
      habitCategory = 'growth';
      message = 'You\'re emotionally stable — build momentum or spread your positive energy.';
    }

    console.log('Selected category:', habitCategory);
    
    const recommendedHabit = this.moodData[mood].habits[habitCategory];
    console.log('Recommended habit:', recommendedHabit);

    return {
      mood,
      moodIndex,
      habitCategory,
      message,
      recommendedHabit,
      answers: answersArray,
      scores,
      totalScore,
    };
  }

  static getQuestionsForMood(mood) {
    return [...this.moodData[mood].questions];
  }

  // Get dynamic action buttons based on mood and score
  static getActionButtons(mood, moodIndex) {
    const actionButtons = {
      'loving': {
        0: { left: 'Send 1 RDM to someone that you miss', right: 'Reach out with kindness' },
        41: { left: 'Thank someone who showed up', right: 'Celebrate unspoken care' },
        71: { left: 'Gift a gratitude token', right: 'Support a NGO' }
      },
      'cheerful': {
        0: { left: 'Share one small win', right: 'Express gratitude to your uplifter' },
        41: { left: 'Appreciate your teammate', right: 'Gift a RDM Token' },
        71: { left: 'Donate your happiness', right: 'Send celebration token' }
      },
      'content': {
        0: { left: 'Share a gratitude token', right: 'Reward yourself' },
        41: { left: 'Give your day\'s joy to someone', right: 'Celebrate your day with a donation' },
        71: { left: 'Support an education cause', right: 'Donate to uplift others' }
      },
      'neutral': {
        0: { left: 'Appreciate small acts', right: 'Celebrate unnoticed help' },
        41: { left: 'Gift yourself', right: 'Uplift a like-minded friend' },
        71: { left: 'Support community', right: 'Uplift others with RDM' }
      },
      'sad': {
        0: { left: 'Text someone you trust', right: 'Uplift a heart in need' },
        41: { left: 'Thank your quiet supporters', right: 'Send kindness forward' },
        71: { left: 'Donate for mental wellness', right: 'Gift RDM token' }
      }
    };

    const moodButtons = actionButtons[mood];
    if (!moodButtons) return { left: 'Thank a friend', right: 'Appreciate colleague' };

    // Determine which score range to use
    let buttonSet;
    if (moodIndex <= 40) {
      buttonSet = moodButtons[0];
    } else if (moodIndex <= 70) {
      buttonSet = moodButtons[41];
    } else {
      buttonSet = moodButtons[71];
    }

    return buttonSet || { left: 'Thank a friend', right: 'Appreciate colleague' };
  }
}

export default MoodAssessmentService;
