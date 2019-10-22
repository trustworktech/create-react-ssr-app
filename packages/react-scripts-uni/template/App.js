import React from 'react';
import { StyleSheet, Image, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>React Starter</Text>
      <Image
        source={require('./assets/icon.png')}
        style={{ marginVertical: 50, width: 192, height: 192 }}
      />
      <Text style={styles.bodyText}>
        Edit <Text style={styles.boldText}>src/App.js</Text> and save to reload.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282c34',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 48,
  },
  bodyText: {
    color: 'white',
    fontSize: 18,
  },
  boldText: {
    fontWeight: 'bold',
  },
});
