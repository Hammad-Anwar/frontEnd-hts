import React, { useEffect, useRef, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import FeatherIcon from "react-native-vector-icons/Feather";
import { useQuery } from "@tanstack/react-query";
import apiRequest from "../../api/apiRequest";
import urlType from "../../constants/UrlConstants";
import { Colors } from "../../constants/theme";
import moment from "moment";
import io from "socket.io-client";

const Chat = ({ navigation, route }) => {
  const { orderId, loginUserId, otherUser } = route.params;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const socket = io(urlType.SOCKET_BACKEND);
  const flatListRef = useRef(null);

  const chatData = useQuery({
    queryKey: ["chatroomMessages", orderId],
    queryFn: async () => {
      const response = await apiRequest(urlType.BACKEND, {
        method: "get",
        url: `/chat/recievedMessage/${orderId}`,
      });
      return response.data;
    },
  });

  useEffect(() => {
    if (chatData.isSuccess && chatData.data) {
      setMessages(chatData.data);
    } else if (chatData.isError) {
      console.error("Error fetching messages:", chatData.error);
    }
  }, [chatData.data, chatData.isSuccess, chatData.isError]);

  // Join the room and listen for new messages using Socket.IO
  useEffect(() => {
    // Connect to the chat room
    socket.emit("joinRoom", orderId);

    // Listen for new messages
    socket.on("receiveMessage", (newMessage) => {
      console.log("New message received:", newMessage);

      if (newMessage.sender && typeof newMessage.sender === "string") {
        newMessage.sender = { _id: newMessage.sender };
      }

      setMessages((prevMessages) => [...prevMessages, newMessage]);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [orderId]);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        orderId: orderId,
        sender: loginUserId,
        content: message,
      };

      // Emit the sendMessage event with the new message data
      socket.emit("sendMessage", newMessage);

      setMessage("");
    }
  };

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <FeatherIcon
            name="arrow-left"
            size={26}
            color={Colors.primary.black}
          />
        </TouchableOpacity>
        <Image
          source={{
            uri:
              otherUser?.profileImage ||
              "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
          }}
          style={styles.profilePic}
        />
        <View style={styles.headerTextContainer}>
          <Text style={styles.username}>{otherUser?.fullName}</Text>
          <Text style={styles.status}>Active 27 minutes ago</Text>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item, index }) => {
          const showDateSeparator =
            index === 0 ||
            !moment(item.timestamp).isSame(
              messages[index - 1]?.timestamp,
              "day"
            );

          return (
            <>
              {showDateSeparator && (
                <View style={styles.dateSeparator}>
                  <Text style={styles.dateText}>
                    {moment(item.timestamp).format("dddd, MMMM D")}
                  </Text>
                </View>
              )}
              <View
                style={[
                  styles.messageContainer,
                  item.sender && item.sender._id === loginUserId
                    ? styles.userMessage
                    : styles.otherMessage,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    item.sender && item.sender._id === loginUserId
                      ? null
                      : { color: "#000" },
                  ]}
                >
                  {item.content}
                </Text>
                <Text style={styles.timeText}>
                  {moment(item.timestamp).format("h:mm A")}
                </Text>
              </View>
            </>
          );
        }}
        keyExtractor={(item) => item?._id}
        style={styles.chatContainer}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Write here..."
          value={message}
          onChangeText={(text) => setMessage(text)}
          placeholderTextColor="#7a7a7a"
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Icon name="send" size={20} color={Colors.primary.main} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e6e6e6",
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.primary.borderColor,
    backgroundColor: "#cccccc",
  },
  headerTextContainer: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  status: {
    fontSize: 14,
    color: "#6c757d",
  },
  chatContainer: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    maxWidth: "75%",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#007bff",
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#f1f3f5",
  },
  messageText: {
    fontSize: 16,
    color: "#fff",
    marginRight: 20,
  },
  timeText: {
    fontSize: 10,
    color: "#aaa",
    // marginTop: 1,
    alignSelf: "flex-end",
  },
  dateSeparator: {
    alignItems: "center",
    marginVertical: 10,
  },
  dateText: {
    fontSize: 14,
    color: "#6c757d",
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#dee2e6",
    backgroundColor: "#ffffff",
    marginTop: 5,
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 16,
    borderColor: "#ced4da",
    borderWidth: 1,
    backgroundColor: "#f8f9fa",
  },
  sendButton: {
    padding: 10,
    borderRadius: 20,
    marginLeft: 8,
  },
});

export default Chat;
