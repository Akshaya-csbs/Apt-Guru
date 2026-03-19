import { useState, useEffect } from 'react';

/**
 * Task interface defines the structure of a single task
 * - id: unique identifier for the task
 * - text: the task description
 * - completed: boolean flag indicating if task is done
 * - createdAt: timestamp when task was created
 */
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

const STORAGE_KEY = 'todolist-tasks';

/**
 * Custom hook for managing tasks with localStorage persistence
 * 
 * This hook handles:
 * - Loading tasks from localStorage on mount
 * - Saving tasks to localStorage whenever they change
 * - Adding new tasks with unique IDs
 * - Toggling task completion status
 * - Deleting tasks
 * - Calculating task statistics
 * 
 * @returns Object containing tasks array and action functions
 */
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setTasks(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Failed to load tasks from localStorage:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      } catch (error) {
        console.error('Failed to save tasks to localStorage:', error);
      }
    }
  }, [tasks, isLoaded]);

  /**
   * Add a new task to the list
   * Generates a unique ID using timestamp and random number
   */
  const addTask = (text: string) => {
    if (!text.trim()) return;
    
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: text.trim(),
      completed: false,
      createdAt: Date.now(),
    };
    
    setTasks([newTask, ...tasks]);
  };

  /**
   * Toggle the completion status of a task
   */
  const toggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  /**
   * Delete a task from the list
   */
  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  /**
   * Clear all completed tasks
   */
  const clearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  /**
   * Calculate task statistics
   */
  const stats = {
    total: tasks.length,
    completed: tasks.filter(task => task.completed).length,
    pending: tasks.filter(task => !task.completed).length,
  };

  return {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    clearCompleted,
    stats,
    isLoaded,
  };
}
