// fakeDB.js

/*
NEW USER DATABASE ENTRY:
{
  id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', // generated with uuid.v4()
  name: 'Alex Santos',                        // user input
  hashtag: 'alex123',                         // user input
  password: 'SecureP@ssw0rd',                 // user input
  photo: '',                                  // empty by default (will be added in profile picture screen) SAVED IN BASE64
  profiles: [],                               // initialized empty
  roles: [],                                  // initialized empty
  groups: [],                                 // initialized empty
  availabilities: [],                         // initialized empty
  chats: [],                                  // initialized empty
}

*/ 
const fakeDB = {
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
      availabilities: [
        {
          roleHashtag: "lucas-student",
          group: "dmgroup-A-2024-2",
          time: "08:00 - 10:00",
          repeats: false,
          date: "2025-04-20",
          locationType: "remote",
          complement: "Zoom - link will be shared :'https://zoom.us/j/xyz123'"
        },
        {
          roleHashtag: "lucas-tutor",
          group: "dmgroup-A-2024-2",
          time: "14:00 - 16:00",
          repeats: true,
          days: ["Monday", "Wednesday"],
          locationType: "onSite",
          coordinates: {
            latitude: 41.79662,
            longitude: -6.76844
          },
          radius: 100,
          complement: "ESTIG - Gabinet 72"
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
            {
              id: 3,
              name: "Alice Johnson",
              hashtag: "alicej789",
              status: null,
              message: "Hello, I would like to join your group."
            },
            {
              id: 4,
              name: "Bob Brown",
              hashtag: "bobbrown321",
              status: null,
              message: "Hi, I'm interested in joining your group."
            }
          ]
        }
      ],
      chats: [
        {
          id: "chat-d3bf6f91-6d80-4b1c-b410-0f04bebbf640",
          participants: ["lucasalopes", "user123"],
          pId: [1, 2],
          hashtag: "user123",
          isRead: 0,
          messages: [
            {
              sender: "lucasalopes",
              text: "Zoom link: https://zoom.us/j/xyz123",
              timestamp: "2025-04-19T10:35:31.837Z"
            },
            {
              sender: "user123",
              text: "Hey! Are you available to meet this week?",
              timestamp: "2025-04-19T08:33:31.837Z"
            },
            {
              sender: "user123",
              text: "Hey! Are you available to meet this week?",
              timestamp: "2025-04-19T14:01:31.837Z"
            }
          ]
        },
        {
          id: "chat-6a458464-8e20-4f75-b722-f5ac7fd19228",
          participants: ["lucasalopes", "alicej789"],
          pId: [1, 4],
          hashtag: "alicej789",
          isRead: 0,
          messages: [
            {
              sender: "lucasalopes",
              text: "Hey! Are you available to meet this week?",
              timestamp: "2025-04-19T14:16:31.838Z"
            },
            {
              sender: "alicej789",
              text: "Let's meet in ESTIG tomorrow?",
              timestamp: "2025-04-19T15:11:31.838Z"
            }
          ]
        },
        {
          id: "chat-a2d2aaf7-9751-43dd-a294-2cc841dd9f1e",
          participants: ["lucasalopes", "bobbrown321"],
          pId: [1, 5],
          hashtag: "bobbrown321",
          isRead: 0,
          messages: [
            {
              sender: "bobbrown321",
              text: "Let's meet in ESTIG tomorrow?",
              timestamp: "2025-04-19T16:31:31.838Z"
            },
            {
              sender: "lucasalopes",
              text: "Hey! Are you available to meet this week?",
              timestamp: "2025-04-19T14:12:31.838Z"
            },
            {
              sender: "bobbrown321",
              text: "Zoom link: https://zoom.us/j/xyz123",
              timestamp: "2025-04-19T14:38:31.838Z"
            }
          ]
        },
        {
          id: "chat-e8d54d76-1382-4467-b65f-7639fd2c4b18",
          participants: ["user123", "user456"],
          pId: [2, 3],
          hashtag: "user456",
          isRead: 0,
          messages: [
            {
              sender: "user456",
              text: "Zoom link: https://zoom.us/j/xyz123",
              timestamp: "2025-04-19T10:07:31.838Z"
            },
            {
              sender: "user456",
              text: "Zoom link: https://zoom.us/j/xyz123",
              timestamp: "2025-04-19T14:08:31.838Z"
            },
            {
              sender: "user456",
              text: "Hey! Are you available to meet this week?",
              timestamp: "2025-04-19T11:57:31.838Z"
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

/*

USER SCHEMA COMMENT YOUR CHANGES TO IT!!!

users:
{
  id: "string",                      // UUID
  name: "string",                   // Full name
  hashtag: "string",                // Unique user identifier (e.g. "alex123")
  password: "string",               // Encrypted password 
  photo: "string",                  // Base64 image string
  roles: [                          // List of roles this user has created
    {
      name: "string",              // e.g. "Tutor"
      hashtag: "string"           // e.g. "alex-tutor"
    }
  ],
  groups: [                         // Groups the user is part of or owns
    {
                                    //Lucas complete this when you can
    }
  ],
  availabilities: [                // Availability entries created by the user
    {
      roleHashtag: "string",      // Hashtag of the role this availability belongs to
      group: "string",            // Group name/ID
      time: "HH:mm - HH:mm",      // Time range
      repeats: boolean,           // If it repeats or is one-time
      // If repeats is false:
      date: "YYYY-MM-DD",         // One-time availability date
      // If repeats is true:
      days: ["Monday", "Wednesday"], // Repeated days
      locationType: "remote" | "onSite",
      coordinates: {              // Only for onSite
        latitude: number,
        longitude: number
      },
      radius: number,             // Only for onSite
      complement: "string"        // Details or remote link
    }
  ],
  notifications: [                // Alerts shown to this user
    {
      type: "announcement" | "studentRequests",
      title: "string",
      subject: "string",          // Typically the group
      group: "string",            // Group hashtag
      dateTime: "DD/MM/YYYY - HH:mm",
      // For announcements:
      announcement: "string",
      // For studentRequests:
      studentRequests: [
        {
          id: number,
          name: "string",
          hashtag: "string",
          status: null | "accepted" | "rejected",
          message: "string"
        }
      ]
    }
  ],
  chats: [                         // All chat conversations this user is part of
    {
      id: "string",               // Unique chat ID
      participants: ["hashtag1", "hashtag2"],
      pId: [number, number],      // Internal profile/user ids
      hashtag: "string",          // Hashtag of the person this user is chatting with
      isRead: number,             // 0 or 1 to indicate if user has read the last message
      messages: [
        {
          sender: "string",       // Hashtag of sender
          text: "string",         // Message text
          timestamp: "ISODate"    // Time sent (e.g. "2025-04-19T14:38:31.838Z")
        }
      ]
    }
  ]
}
*/