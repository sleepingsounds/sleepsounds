import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Switch, Image } from 'react-native';
import { Audio } from 'expo-av';

const sounds = [
  { id: '1', title: 'Waterfall', file: require('./assets/waterfall.mp3'), image: require('./assets/waterfall.jpg') },
  { id: '2', title: 'River', file: require('./assets/river.mp3'), image: require('./assets/river.jpg') },
  { id: '3', title: 'Forest', file: require('./assets/forest.mp3'), image: require('./assets/forest.jpg') },
  { id: '4', title: 'Fan', file: require('./assets/fan.mp3'), image: require('./assets/fan.jpg') },
  // Add more sounds here
];

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const App = () => {
  const [playingSound, setPlayingSound] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const shuffledSounds = [...sounds];
    const randomIndex = getRandomInt(2, shuffledSounds.length - 1);
    shuffledSounds.splice(randomIndex, 0, { id: 'ad-random', ad: true });
    setData([...shuffledSounds, { id: 'ad-bottom', ad: true }]);
  }, []);

  useEffect(() => {
    const configureAudio = async () => {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: true,
      });
    };

    configureAudio();
  }, []);

  const playSound = async (item) => {
    if (playingSound?.id === item.id) {
      await playingSound.sound.stopAsync();
      setPlayingSound(null);
      return;
    }

    if (playingSound) {
      await playingSound.sound.stopAsync();
    }

    const { sound } = await Audio.Sound.createAsync(item.file, { isLooping: true });
    await sound.playAsync();
    setPlayingSound({ id: item.id, sound });
  };

  const renderItem = ({ item }) => {
    if (item.ad) {
      return (
        <View style={[styles.item, styles.adContainer, isDarkMode ? styles.adContainerDark : styles.adContainerLight]}>
          <Text style={isDarkMode ? styles.adTextDark : styles.adTextLight}>Ad Placeholder</Text>
        </View>
      );
    }

    const isPlaying = playingSound?.id === item.id;

    return (
      <TouchableOpacity
        style={[styles.item, isDarkMode ? styles.itemDark : styles.itemLight, isPlaying ? styles.itemPlaying : null]}
        onPress={() => playSound(item)}
      >
        <Image source={item.image} style={styles.itemImage} />
        <Text style={[styles.itemText, isDarkMode ? styles.itemTextDark : styles.itemTextLight]}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, isDarkMode ? styles.containerDark : styles.containerLight]}>
      <Text style={[styles.title, isDarkMode ? styles.titleDark : styles.titleLight]}>Sleep Noise Maker</Text>
      <View style={styles.toggleContainer}>
        <Text style={[styles.toggleLabel, isDarkMode ? styles.toggleLabelDark : styles.toggleLabelLight]}>Dark Mode</Text>
        <Switch
          value={isDarkMode}
          onValueChange={() => setIsDarkMode((prevMode) => !prevMode)}
          style={styles.switch}
        />
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
      />
      <View style={[styles.adContainerBottom, isDarkMode ? styles.adContainerBottomDark : styles.adContainerBottomLight]}>
        <Text style={isDarkMode ? styles.adTextDark : styles.adTextLight}>Ad Placeholder Bottom</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerLight: {
    backgroundColor: '#F5FCFF',
  },
  containerDark: {
    backgroundColor: '#333',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  titleLight: {
    color: '#000',
  },
  titleDark: {
    color: '#FFF',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  toggleLabel: {
    fontSize: 18,
    marginRight: 10,
  },
  toggleLabelLight: {
    color: '#000',
  },
  toggleLabelDark: {
    color: '#FFF',
  },
  switch: {
    marginBottom: 20,
  },
  grid: {
    justifyContent: 'center',
  },
  row: {
    flex: 1,
    justifyContent: 'space-around',
  },
  item: {
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    width: 150,
    height: 150,
  },
  itemLight: {
    backgroundColor: '#DDDDDD',
  },
  itemDark: {
    backgroundColor: '#555',
  },
  itemPlaying: {
    borderWidth: 2,
    borderColor: '#00FF00',
  },
  itemImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 5,
  },
  itemText: {
    fontSize: 18,
    textAlign: 'center',
  },
  itemTextLight: {
    color: '#000',
  },
  itemTextDark: {
    color: '#FFF',
  },
  adContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 150,
    height: 150,
    margin: 10,
  },
  adContainerLight: {
    backgroundColor: '#DDD',
  },
  adContainerDark: {
    backgroundColor: '#555',
  },
  adContainerBottom: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 50,
    marginTop: 10,
  },
  adContainerBottomLight: {
    backgroundColor: '#DDD',
  },
  adContainerBottomDark: {
    backgroundColor: '#555',
  },
  adTextLight: {
    color: '#000',
  },
  adTextDark: {
    color: '#FFF',
  },
});

export default App;
