import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  SafeAreaView,
} from 'react-native';

import { GameSettings } from '../utils/types';

interface SettingsScreenProps {
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
  onBack: () => void;
}

export function SettingsScreen({ settings, onSettingsChange, onBack }: SettingsScreenProps) {
  const updateSetting = <K extends keyof GameSettings>(
    key: K,
    value: GameSettings[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const difficultyOptions = [
    { label: 'Easy', value: 'easy' as const },
    { label: 'Medium', value: 'medium' as const },
    { label: 'Hard', value: 'hard' as const },
  ];

  const volumeOptions = [
    { label: 'Off', value: 0 },
    { label: 'Low', value: 0.3 },
    { label: 'Medium', value: 0.6 },
    { label: 'High', value: 1.0 },
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Settings</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Audio Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Audio</Text>
            
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Sound Effects</Text>
              <Switch
                value={settings.soundEnabled}
                onValueChange={(value) => updateSetting('soundEnabled', value)}
                trackColor={{ false: '#767577', true: '#4CAF50' }}
                thumbColor={settings.soundEnabled ? '#fff' : '#f4f3f4'}
              />
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Vibration</Text>
              <Switch
                value={settings.vibrationEnabled}
                onValueChange={(value) => updateSetting('vibrationEnabled', value)}
                trackColor={{ false: '#767577', true: '#4CAF50' }}
                thumbColor={settings.vibrationEnabled ? '#fff' : '#f4f3f4'}
              />
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Music Volume</Text>
              <View style={styles.volumeContainer}>
                {volumeOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.volumeButton,
                      settings.musicVolume === option.value && styles.volumeButtonActive,
                    ]}
                    onPress={() => updateSetting('musicVolume', option.value)}
                  >
                    <Text
                      style={[
                        styles.volumeButtonText,
                        settings.musicVolume === option.value && styles.volumeButtonTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Gameplay Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gameplay</Text>
            
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Difficulty</Text>
              <View style={styles.difficultyContainer}>
                {difficultyOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.difficultyButton,
                      settings.difficulty === option.value && styles.difficultyButtonActive,
                    ]}
                    onPress={() => updateSetting('difficulty', option.value)}
                  >
                    <Text
                      style={[
                        styles.difficultyButtonText,
                        settings.difficulty === option.value && styles.difficultyButtonTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Particle Effects</Text>
              <Switch
                value={settings.particleEffects}
                onValueChange={(value) => updateSetting('particleEffects', value)}
                trackColor={{ false: '#767577', true: '#4CAF50' }}
                thumbColor={settings.particleEffects ? '#fff' : '#f4f3f4'}
              />
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Auto Save</Text>
              <Switch
                value={settings.autoSave}
                onValueChange={(value) => updateSetting('autoSave', value)}
                trackColor={{ false: '#767577', true: '#4CAF50' }}
                thumbColor={settings.autoSave ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>

          {/* About Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <View style={styles.aboutContainer}>
              <Text style={styles.aboutText}>
                Glorius, Bio Commander of the Corpus Humanus
              </Text>
              <Text style={styles.versionText}>Version 1.0.0</Text>
              <Text style={styles.descriptionText}>
                Defend the human body from pathogens in this exciting beat &apos;em up adventure!
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 20,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingLabel: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  volumeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  volumeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  volumeButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  volumeButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  volumeButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  difficultyContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  difficultyButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  difficultyButtonActive: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  difficultyButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  difficultyButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  aboutContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  aboutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  versionText: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 10,
  },
  descriptionText: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});