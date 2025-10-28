import AsyncStorage from '@react-native-async-storage/async-storage';
import LocalStorageService from './LocalStorageService';
import { v4 as uuidv4 } from 'uuid';

class GoalsService {
  static GOALS_KEY = 'user_goals';

  // Get user-specific goals key
  static async getUserGoalsKey() {
    const email = await LocalStorageService.getCurrentUserEmail();
    return email ? `user_goals_${email}` : 'user_goals';
  }

  // Add a new goal
  static async addGoal(goal) {
    try {
      console.log('GoalsService: Adding goal:', goal.title);
      const goalsKey = await this.getUserGoalsKey();
      const goalsJson = await AsyncStorage.getItem(goalsKey);

      let goals = [];
      if (goalsJson) {
        goals = JSON.parse(goalsJson);
      }

      const newGoal = {
        id: goal.id || uuidv4(),
        title: goal.title,
        description: goal.description || '',
        category: goal.category || 'general',
        targetDate: goal.targetDate || null,
        frequency: goal.frequency || 'daily',
        reflection: goal.reflection || '',
        pledgeAmount: goal.pledgeAmount || 0,
        createdAt: goal.createdAt ? goal.createdAt.toISOString() : new Date().toISOString(),
        completed: false
      };

      goals.push(newGoal);

      await AsyncStorage.setItem(goalsKey, JSON.stringify(goals));
      console.log('GoalsService: ✅ Goal saved successfully');
      return newGoal;
    } catch (error) {
      console.error('GoalsService: Error adding goal:', error);
      throw new Error(`Failed to add goal: ${error.message}`);
    }
  }

  // Get all goals for current user
  static async getUserGoals() {
    try {
      const goalsKey = await this.getUserGoalsKey();
      const goalsJson = await AsyncStorage.getItem(goalsKey);

      if (!goalsJson) {
        return [];
      }

      return JSON.parse(goalsJson).map(data => ({
        id: data.id,
        title: data.title,
        description: data.description,
        category: data.category,
        targetDate: data.targetDate ? new Date(data.targetDate) : null,
        frequency: data.frequency,
        reflection: data.reflection,
        pledgeAmount: data.pledgeAmount,
        createdAt: new Date(data.createdAt),
        completed: data.completed || false
      }));
    } catch (error) {
      console.error('GoalsService: Error fetching goals:', error);
      return [];
    }
  }

  // Update a goal
  static async updateGoal(goal) {
    try {
      const goalsKey = await this.getUserGoalsKey();
      const goalsJson = await AsyncStorage.getItem(goalsKey);

      if (!goalsJson) {
        throw new Error('No goals found');
      }

      let goals = JSON.parse(goalsJson);
      const goalIndex = goals.findIndex(g => g.id === goal.id);

      if (goalIndex === -1) {
        throw new Error('Goal not found');
      }

      goals[goalIndex] = {
        id: goal.id,
        title: goal.title,
        description: goal.description || '',
        category: goal.category || 'general',
        targetDate: goal.targetDate ? goal.targetDate.toISOString() : null,
        frequency: goal.frequency || 'daily',
        reflection: goal.reflection || '',
        pledgeAmount: goal.pledgeAmount || 0,
        createdAt: goal.createdAt.toISOString(),
        completed: goal.completed || false
      };

      await AsyncStorage.setItem(goalsKey, JSON.stringify(goals));
      return goal;
    } catch (error) {
      throw new Error(`Failed to update goal: ${error.message}`);
    }
  }

  // Delete a goal
  static async deleteGoal(goalId) {
    try {
      const goalsKey = await this.getUserGoalsKey();
      const goalsJson = await AsyncStorage.getItem(goalsKey);

      if (!goalsJson) {
        throw new Error('No goals found');
      }

      let goals = JSON.parse(goalsJson);
      goals = goals.filter(g => g.id !== goalId);

      await AsyncStorage.setItem(goalsKey, JSON.stringify(goals));
    } catch (error) {
      throw new Error(`Failed to delete goal: ${error.message}`);
    }
  }
}

export { GoalsService };

