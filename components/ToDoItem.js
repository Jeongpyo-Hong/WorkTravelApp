import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "../color";
import { Entypo } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";

const toDosStorageKey = "@toDos";

const ToDoItem = ({ toDos, id, setToDos, saveToDos }) => {
  const [newText, setNewText] = useState(toDos[id]?.text);
  const [edit, setEdit] = useState(false);

  const deleteToDo = () => {
    if (Platform.OS === "web") {
      const ok = confirm("Do you want to delete this To Do?");
      if (ok) {
        const newToDos = { ...toDos };
        delete newToDos[id];
        setToDos(newToDos);
        saveToDos(newToDos);
      }
    } else {
      Alert.alert("Delete To Do", "Are you sure?", [
        { text: "Cancel" },
        {
          text: "I'm sure",
          onPress: () => {
            const newToDos = { ...toDos };
            delete newToDos[id];
            setToDos(newToDos);
            saveToDos(newToDos);
          },
        },
      ]);
    }
  };

  const doneToDo = () => {
    const newToDos = { ...toDos };
    newToDos[id].done = !newToDos[id].done;
    AsyncStorage.setItem(toDosStorageKey, JSON.stringify(newToDos));
    setToDos(newToDos);
  };

  const onChangeText = (payload) => {
    setNewText(payload);
  };
  const editHandler = () => {
    setEdit((prev) => !prev);
  };
  const updateToDo = () => {
    const newToDos = { ...toDos };
    newToDos[id].text = newText;
    AsyncStorage.setItem(toDosStorageKey, JSON.stringify(newToDos));
    setEdit((prev) => !prev);
    saveToDos(newToDos);
    setToDos(newToDos);
  };

  return (
    <View style={styles.toDo}>
      {!edit ? (
        <>
          <Text
            style={{
              ...styles.toDoText,
              color: toDos[id]?.done ? "gray" : "white",
              textDecorationLine: toDos[id]?.done ? "line-through" : "none",
            }}
          >
            {toDos[id]?.text}
          </Text>
          <View style={styles.toDoIcon}>
            <TouchableOpacity onPress={doneToDo} style={{ marginRight: 15 }}>
              <Text>
                <Fontisto name="check" size={18} color="white" />
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={editHandler} style={{ marginRight: 15 }}>
              <Text>
                <Entypo name="pencil" size={24} color="yellow" />
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={deleteToDo} style={styles.toDoIcon}>
              <Text>
                <Fontisto name="trash" size={18} color="tomato" />
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <TextInput
            returnKeyType="Done"
            onSubmitEditing={updateToDo}
            onChangeText={onChangeText}
            value={newText}
            style={{
              backgroundColor: "gray",
              width: 220,
              height: 50,
            }}
          />
          <View style={styles.toDoIcon}>
            <TouchableOpacity onPress={updateToDo} style={{ marginRight: 15 }}>
              <Text>
                <Entypo name="save" size={24} color="yellow" />
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default ToDoItem;

const styles = StyleSheet.create({
  toDo: {
    backgroundColor: theme.grey,
    marginBottom: 10,
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  toDoIcon: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
