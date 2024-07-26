import React, { useState } from "react";
import { Button, View, Text } from "react-native";

const QuantityPicker = ({ onChange, defaultValue = 1, disabled, max = 5 }) => {
  const [quantity, setQuantity] = useState(defaultValue);

  const handleIncrement = () => {
    setQuantity(quantity + 1);
    onChange(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      onChange(quantity - 1);
    }
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "lightgrey",
        borderRadius: 10,
      }}
    >
      <Button
        title="-"
        disabled={quantity === 1 || disabled}
        onPress={handleDecrement}
      />
      <Text style={{ marginHorizontal: 10 }}>{quantity}</Text>
      <Button
        title="+"
        disabled={quantity === 5 || disabled || quantity === max}
        onPress={handleIncrement}
      />
    </View>
  );
};

export default QuantityPicker;
