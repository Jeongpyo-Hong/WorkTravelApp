import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "./color";
import ToDoItem from "./components/ToDoItem";

const workingStorageKey = "@menu";
const toDosStorageKey = "@toDos";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});

  useEffect(() => {
    loadMenu();
    loadToDos();
  }, []);

  const loadToDos = async () => {
    try {
      const res = await AsyncStorage.getItem(toDosStorageKey);
      if (res) {
        setToDos(JSON.parse(res));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onMenuHandler = async (payload) => {
    await AsyncStorage.setItem(workingStorageKey, `${payload}`);
    setWorking(payload);
  };

  const loadMenu = async () => {
    try {
      const res = await AsyncStorage.getItem(workingStorageKey);
      setWorking(JSON.parse(res));
    } catch (err) {
      console.log(err);
    }
  };

  const onChangeText = (payload) => {
    setText(payload);
  };

  const saveToDos = async (newToDos) => {
    await AsyncStorage.setItem(toDosStorageKey, JSON.stringify(newToDos));
  };

  const addToDo = async () => {
    if (text === "") {
      return;
    }
    const newToDos = { ...toDos, [Date.now()]: { text, working, done: false } };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onMenuHandler(true)}>
          <Text
            style={{ ...styles.btnText, color: working ? "white" : theme.grey }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onMenuHandler(false)}>
          <Text
            style={{
              ...styles.btnText,
              color: !working ? "white" : theme.grey,
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        returnKeyType="Done"
        onSubmitEditing={addToDo}
        onChangeText={onChangeText}
        value={text}
        placeholder={working ? "Add To Do" : "Where do you want to go?"}
        style={styles.input}
      />
      <ScrollView>
        {Object.keys(toDos)?.map((id) =>
          toDos[id].working === working ? (
            <ToDoItem
              toDos={toDos}
              key={id}
              id={id}
              setToDos={setToDos}
              saveToDos={saveToDos}
            />
          ) : null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    fontSize: 38,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 20,
    fontSize: 18,
    marginVertical: 20,
  },
});
