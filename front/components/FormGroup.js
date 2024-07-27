import React from "react";
import { View, Text, TextInput } from "react-native";

export default function FormGroup({ ...props }) {
  return (
    <View>
      <Text>{props.label}</Text>
      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        keyboardType={props.type === "textarea" ? "default" : "numeric"}
        onChangeText={props.onChange}
        value={props.value}
        required={props.required}
        autoFocus={props.autoFocus}
        placeholder={props.placeholder}
      />
      {props.feedback && <Text>{props.feedback}</Text>}
    </View>
  );
}
