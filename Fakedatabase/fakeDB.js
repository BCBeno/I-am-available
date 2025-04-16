const fakeDB = {
  users: [
    {
      name: "Lucas Alvarenga Lopes",
      hashtag: "lucasalopes",
      password: "12345678",
      photo: "https://i.pravatar.cc/300",
    },
  ],
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
export const getUser = (hashtag) => {
  return fakeDB.users.find((user) => user.hashtag === hashtag);
};

//  Retrieve all users (mostly for debug/testing)
//  TODO: Replace with GET /users (admin or debug only)
export const getAllUsers = () => fakeDB.users;

//  Debug method for checking current users in the local DB
export const printUsers = () => {
  console.log("Current users:", fakeDB.users);
};
