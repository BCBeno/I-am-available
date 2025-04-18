// fakeDB.js

const fakeDB = {
  users: [
    {
      id: "123e4567-e89b-12d3-a456-426614174000", // UUID
      name: "Lucas Alvarenga Lope",
      hashtag: "lucasalopes",
      password: "12345678",
      photo: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...", // base64 placeholder
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
      availabilities: [
        {
          roleHashtag: "lucas-student",
          startTime: "08:00",
          endTime: "10:00",
          repeat: ["S", "M", "T", "W", "T", "F", "S"], // or a date field
          location: "Zoom",
          group: "Group A"
        },
        {
          id: "avail-2",
          roleHashtag: "lucas-student",
          day: "Wednesday",
          time: "14:00 - 16:00",
          location: "Library Room 3",
          groupId: null
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
  return fakeDB.users.some((user) => user.hashtag === hashtag);
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

export { fakeDB }; 
