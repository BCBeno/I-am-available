// fakeDB.js

const fakeDB = {
  profiles: [
    {
      id: 1,
      name: "1",
      hashtag: "1",
      password:"1",
      photo: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...", // Base64
      groups: [
        {
          id: 1,
          name: "Physics Group",
          hashtag: "physicsgroup-2024-1",
          members: 3
        }
      ],
      availability: [
        {
          roleHashtag: "lucas-student",
          repeats: 1,
        },
        {
          day: "Monday",
          time: "08:00 - 10:00",
          location: "Zoom",
          group: "Group A"
        },
        {
          day: "Wednesday",
          time: "14:00 - 16:00",
          location: "Library Room 3"
        }
      ]
    }
  ],

  users: [
    {
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: "Lucas Alvarenga Lope",
      hashtag: "lucasalopes",
      password: "12345678",
      photo: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...",
      roles: [
        {
          name: "Student",
          hashtag: "lucas-student"
        },
        {
          name: "Tutor",
          hashtag: "lucas-tutor"
        }
      ],
      groups: [
        {
          id: "group-1",
          name: "Physics Group",
          description: "Group for physics tutoring",
          members: ["lucasalopes", "user123", "user456"]
        }
      ],
      chats: [
        {
          chatId: "chat-1",
          participants: ["lucasalopes", "user123"],
          messages: [
            {
              sender: "lucasalopes",
              text: "Hey! Are you available to meet this week?",
              timestamp: "2025-04-17T10:30:00Z"
            },
            {
              sender: "user123",
              text: "Sure! How about Wednesday afternoon?",
              timestamp: "2025-04-17T10:35:00Z"
            }
          ]
        }
      ]
    }
  ],

  chats: [
    {
      id: "chat-1",
      participants: ["lucasalopes", "user123"],
      pId: [1, 2],
      hashtag: "user123",
      isRead: 0,
      messages: [
        {
          sender: "lucasalopes",
          text: "Hey! Are you available to meet this week?",
          timestamp: "2025-04-17T10:30:00Z"
        },
        {
          sender: "user123",
          text: "Sure! How about Wednesday afternoon?",
          timestamp: "2025-04-17T10:35:00Z"
        }
      ]
    }
  ],

  notifications: [
    {
      type: "announcement",
      title: "New announcement from your group",
      subject: "Physics Group",
      group: "physicsgroup-2024-1",
      dateTime: "01/01/2025 - 14:00",
      announcement: "Don't forget about tomorrow's physics quiz prep!"
    },
    {
      type: "studentRequests",
      title: "New requests to join your group",
      subject: "Physics Group",
      group: "physicsgroup-2024-1",
      dateTime: "03/01/2025 - 23:59",
      studentRequests: [
        { id: 3, name: "Alice Johnson", hashtag: "alicej789", status: null, message: "Hello, I would like to join your group." },
        { id: 4, name: "Bob Brown", hashtag: "bobbrown321", status: null, message: "Hi, I'm interested in joining your group." }
      ]
    }
  ]
};


export const getUser = (hashtag) => {
  return fakeDB.users.find((user) => user.hashtag === hashtag);
};

export const updateUser = (hashtag, updatedData) => {
  const index = fakeDB.users.findIndex((user) => user.hashtag === hashtag);
  if (index !== -1) {
    fakeDB.users[index] = { ...fakeDB.users[index], ...updatedData };

    const { name, hashtag, roles } = fakeDB.users[index];
    console.log("✅ User updated:", { name, hashtag, roles });

    const base64 = fakeDB.users[index].photo;
    if (base64?.startsWith("data:image")) {
      console.log("🖼️ Photo updated (preview):", base64.slice(0, 50) + "...");
    }
  }
};


//  Check if a hashtag is already in use
//  TODO: Replace with GET /users/check-hashtag?value={hashtag}
export const isHashtagTaken = (hashtag) => {
  return fakeDB.users.some((user) =>
    user.roles?.some((r) => r.hashtag.toLowerCase() === hashtag.toLowerCase())
  );
};
//  Add a new user to the database
//  TODO: Replace with POST /signup and send JSON (name, hashtag, password, photo)
export const addUser = (newUser) => {
  fakeDB.users.push(newUser);
  console.log("User added:", newUser);
};

//  Authenticate user credentials
//  TODO: Replace with POST /login (get back a JWT token and user object)
export const authenticateUser = (hashtag, password) => {
  return fakeDB.users.find(
    (user) => user.hashtag === hashtag && user.password === password
  );
};

//  Get a specific user by their hashtag
//  TODO: Replace with GET /users/:hashtag or GET /me (if using JWT token)

//  Retrieve all users (mostly for debug/testing)
//  TODO: Replace with GET /users (admin or debug only)
export const getAllUsers = () => fakeDB.users;

//  Debug method for checking current users in the local DB
export const printUsers = () => {
  console.log("Current users:", fakeDB.users);
};

export default fakeDB;

