import React, { useState } from 'react';
import { StyleSheet, Button, View, Image } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Picker } from '@react-native-picker/picker';
import ParallaxScrollView from '@/components/parallax-scroll-view'; // Import lại ParallaxScrollView
import { ThemedView } from '@/components/themed-view';

// Tải dữ liệu gợi ý từ file JSON
const suggestionsData = require('@/assets/data/suggestions.json');

// Định nghĩa kiểu dữ liệu cho suggestions
type SuggestionsMap = Record<string, Record<string, string[]>>;

// Các lựa chọn cố định cho dropdown
const moods = ['Vui', 'Buồn', 'Chán'];
const weathers = ['Nắng', 'Mưa', 'Mát / Mây'];

export default function HomeScreen() {
  // State để lưu lựa chọn của người dùng
  const [selectedMood, setSelectedMood] = useState(moods[0]);
  const [selectedWeather, setSelectedWeather] = useState(weathers[0]);
  
  // State để lưu kết quả gợi ý
  const [currentSuggestion, setCurrentSuggestion] = useState('');
  const [currentList, setCurrentList] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  const suggestions: SuggestionsMap = suggestionsData;

  // Xử lý khi nhấn nút "Gợi ý cho tôi"
  const generateSuggestion = () => {
    // Kết hợp (Tâm trạng + Thời tiết) để lấy danh sách gợi ý
    const list = suggestions[selectedMood]?.[selectedWeather] || [];
    
    if (list.length === 0) {
      setCurrentSuggestion('Không tìm thấy gợi ý phù hợp.');
      setCurrentList([]);
      setShowResult(true);
      return;
    }

    // Chọn ngẫu nhiên 1 gợi ý
    const randomIndex = Math.floor(Math.random() * list.length);
    const suggestion = list[randomIndex];

    setCurrentList(list); // Lưu lại danh sách hiện tại để dùng cho "Gợi ý khác"
    setCurrentSuggestion(suggestion); // Hiển thị gợi ý
    setShowResult(true); // Hiển thị khu vực kết quả và nút "Gợi ý khác"
  };

  // Xử lý khi nhấn nút "Gợi ý khác"
  const generateAnotherSuggestion = () => {
    if (currentList.length === 0) {
      generateSuggestion();
      return;
    }

    if (currentList.length === 1) {
      setCurrentSuggestion(currentList[0]);
      return;
    }

    let newSuggestion = currentSuggestion;
    // Lặp để đảm bảo không lặp lại gợi ý trước đó
    do {
      const randomIndex = Math.floor(Math.random() * currentList.length);
      newSuggestion = currentList[randomIndex];
    } while (newSuggestion === currentSuggestion);

    setCurrentSuggestion(newSuggestion); // Hiển thị gợi ý khác
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      
      {/* Tiêu đề */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.title}>
          Gợi ý theo tâm trạng & thời tiết
        </ThemedText>
      </ThemedView>

      {/* Lựa chọn tâm trạng */}
      <ThemedView style={styles.stepContainer}>
        <ThemedText style={styles.label}>Tâm trạng hiện tại:</ThemedText>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedMood}
            onValueChange={(itemValue) => setSelectedMood(itemValue)}
            style={styles.picker}>
            {moods.map((mood) => (
              <Picker.Item key={mood} label={mood} value={mood} />
            ))}
          </Picker>
        </View>
      </ThemedView>

      {/* Lựa chọn thời tiết */}
      <ThemedView style={styles.stepContainer}>
        <ThemedText style={styles.label}>Thời tiết hiện tại:</ThemedText>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedWeather}
            onValueChange={(itemValue) => setSelectedWeather(itemValue)}
            style={styles.picker}>
            {weathers.map((weather) => (
              <Picker.Item key={weather} label={weather} value={weather} />
            ))}
          </Picker>
        </View>
      </ThemedView>

      {/* Nút "Gợi ý cho tôi" */}
      <ThemedView style={styles.stepContainer}>
        <Button title="Gợi ý cho tôi" onPress={generateSuggestion} />
      </ThemedView>

      {/* Khu vực kết quả (hiển thị có điều kiện) */}
      {showResult && (
        <>
          {/* Hiển thị gợi ý */}
          <ThemedView style={[styles.stepContainer, styles.resultBox]}>
            <ThemedText style={styles.resultText}>
              {currentSuggestion}
            </ThemedText>
          </ThemedView>
          
          {/* Nút "Gợi ý khác" */}
          <ThemedView style={styles.stepContainer}>
            <Button title="Gợi ý khác" onPress={generateAnotherSuggestion} />
          </ThemedView>
        </>
      )}
    </ParallaxScrollView>
  );
}

// StyleSheet để định dạng giao diện
const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  title: {
    textAlign: 'center',
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    justifyContent: 'center',
    backgroundColor: '#fff', // Thêm màu nền để picker dễ nhìn hơn
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#000', // Đảm bảo text trong picker có màu (quan trọng cho dark mode)
  },
  resultBox: {
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  resultText: {
    fontSize: 20,
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#333',
  },
});