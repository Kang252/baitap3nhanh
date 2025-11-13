import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Button,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';

// --- Dữ liệu Gợi ý (Copy từ Bước 1 vào đây) ---
const suggestionsData = {
  "Vui": {
    "Nắng": ["Ra ngoài dạo phố hoặc chụp vài bức ảnh", "Đi ăn kem cùng bạn bè!", "Chơi thể thao ngoài trời (ví dụ: đá bóng, cầu lông)"],
    "Mưa": ["Nghe một playlist nhạc vui vẻ và nhảy theo", "Xem một bộ phim hài sảng khoái", "Rủ bạn bè chơi board game hoặc game online"],
    "Mát / Mây": ["Đi dạo công viên và tận hưởng không khí", "Tổ chức một buổi picnic nhỏ ở ban công hoặc sân thượng", "Đọc một cuốn sách hay bên cửa sổ"]
  },
  "Buồn": {
    "Nắng": ["Đi dạo nhẹ nhàng ở nơi có nhiều cây xanh", "Nghe một podcast chữa lành (healing)", "Viết nhật ký ở một quán cà phê yên tĩnh"],
    "Mưa": ["Nghe nhạc lo-fi và pha tách trà nóng", "Xem một bộ phim sâu lắng hoặc hợp tâm trạng", "Ngâm mình trong bồn nước ấm với tinh dầu"],
    "Mát / Mây": ["Ngồi ở ban công, hít thở sâu và ngắm mây trời", "Đi dạo bộ ở một nơi vắng vẻ, yên tĩnh", "Thử tập yoga hoặc thiền để thư giãn tâm trí"]
  },
  "Chán": {
    "Nắng": ["Thử đi một con đường mới chưa bao giờ đi", "Đến nhà sách và chọn một cuốn sách ngẫu nhiên", "Tập thể dục cường độ cao để giải phóng năng lượng"],
    "Mưa": ["Sắp xếp lại phòng ốc hoặc dọn dẹp nhà cửa", "Học một kỹ năng online mới (ví dụ: một công thức nấu ăn, một mẹo vặt)", "Viết ra 3 điều bạn muốn làm trong tuần tới"],
    "Mát / Mây": ["Đi dạo không mục đích và quan sát mọi thứ xung quanh", "Lên kế hoạch cho một chuyến đi ngắn ngày", "Tìm hiểu về một chủ đề mới lạ trên internet"]
  }
};

const moods = ["Vui", "Buồn", "Chán"]; //
const weathers = ["Nắng", "Mưa", "Mát / Mây"]; //
// --------------------------------------------------

const App = () => {
  // --- State (Trạng thái) ---
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedWeather, setSelectedWeather] = useState(null);
  const [currentSuggestion, setCurrentSuggestion] = useState("");
  // Lưu index của gợi ý trước đó để tránh lặp lại
  const [lastSuggestionIndex, setLastSuggestionIndex] = useState(-1);

  // --- Hàm trợ giúp (Helpers) ---

  /**
   * Hàm này tạo ra một nhóm các nút radio (dùng TouchableOpacity)
   *
   */
  const renderRadioButtons = (options, selectedValue, onSelect) => {
    return options.map((option) => (
      <TouchableOpacity
        key={option}
        style={[
          styles.radioButton,
          selectedValue === option && styles.radioButtonSelected,
        ]}
        onPress={() => onSelect(option)}>
        <Text
          style={[
            styles.radioText,
            selectedValue === option && styles.radioTextSelected,
          ]}>
          {option}
        </Text>
      </TouchableOpacity>
    ));
  };

  // --- Hàm xử lý logic chính ---

  /**
   * Xử lý khi nhấn nút "Gợi ý cho tôi"
   *
   */
  const handleGetSuggestion = () => {
    if (!selectedMood || !selectedWeather) {
      alert('Vui lòng chọn tâm trạng và thời tiết!');
      return;
    }

    // Lấy danh sách gợi ý dựa trên lựa chọn
    const suggestionList = suggestionsData[selectedMood][selectedWeather];

    // Chọn ngẫu nhiên 1 gợi ý
    const randomIndex = Math.floor(Math.random() * suggestionList.length);

    // Hiển thị gợi ý
    setCurrentSuggestion(suggestionList[randomIndex]);
    // Lưu lại index đã chọn
    setLastSuggestionIndex(randomIndex);
  };

  /**
   * Xử lý khi nhấn nút "Gợi ý khác"
   *
   */
  const handleGetAnotherSuggestion = () => {
    if (!selectedMood || !selectedWeather) {
      alert('Vui lòng chọn tâm trạng và thời tiết trước.');
      return;
    }
    
    // Nếu chưa có gợi ý nào, hãy chạy chức năng "Gợi ý cho tôi"
    if (!currentSuggestion) {
      handleGetSuggestion();
      return;
    }

    const suggestionList = suggestionsData[selectedMood][selectedWeather];

    // Xử lý trường hợp danh sách chỉ có 1 gợi ý
    if (suggestionList.length <= 1) {
      // Không thể chọn cái khác, chỉ cần hiển thị lại
      setCurrentSuggestion(suggestionList[0]);
      setLastSuggestionIndex(0);
      return;
    }

    // Tìm một index mới khác với index trước đó
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * suggestionList.length);
    } while (newIndex === lastSuggestionIndex);

    // Hiển thị gợi ý mới
    setCurrentSuggestion(suggestionList[newIndex]);
    // Cập nhật lại index
    setLastSuggestionIndex(newIndex);
  };

  // --- Giao diện (Render) ---
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Tiêu đề */}
        <Text style={styles.title}>Gợi ý theo tâm trạng & thời tiết</Text>

        {/* Lựa chọn Tâm trạng */}
        <Text style={styles.label}>Tâm trạng của bạn:</Text>
        <View style={styles.radioGroup}>
          {renderRadioButtons(moods, selectedMood, setSelectedMood)}
        </View>

        {/* Lựa chọn Thời tiết */}
        <Text style={styles.label}>Thời tiết hôm nay:</Text>
        <View style={styles.radioGroup}>
          {renderRadioButtons(weathers, selectedWeather, setSelectedWeather)}
        </View>

        {/* Nút hành động */}
        <View style={styles.buttonContainer}>
          <Button
            title="Gợi ý cho tôi" //
            onPress={handleGetSuggestion}
          />
          <View style={styles.buttonSpacer} />
          <Button
            title="Gợi ý khác" //
            onPress={handleGetAnotherSuggestion}
            color="#6c757d" // Màu xám cho nút phụ
          />
        </View>

        {/* Khu vực kết quả */}
        <View style={styles.resultBox}>
          {currentSuggestion ? (
            <Text style={styles.resultText}>
              💡 {currentSuggestion} {/* */}
            </Text>
          ) : (
            <Text style={styles.resultPlaceholder}>
              Hãy chọn tâm trạng và thời tiết để nhận gợi ý...
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- CSS (Styles) ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: { //
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  label: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 15,
    marginBottom: 10,
    color: '#495057',
  },
  radioGroup: { //
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  radioButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  radioButtonSelected: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  radioText: {
    fontSize: 16,
    color: '#333',
  },
  radioTextSelected: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  buttonContainer: { //
    marginTop: 25,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  buttonSpacer: {
    width: 20, // Khoảng cách giữa 2 nút
  },
  resultBox: { //
    marginTop: 30,
    padding: 25,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultText: { //
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    color: '#343a40',
    lineHeight: 28,
  },
  resultPlaceholder: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#888',
  },
});

export default App;