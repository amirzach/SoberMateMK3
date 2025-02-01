import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath, mood }) => {
        return { _id, firstName, lastName, occupation, location, picturePath, mood };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((fId) => fId !== friendId);
      friend.friends = friend.friends.filter((fId) => fId !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const updateMood = async (req, res) => {
  try {
    const { id } = req.params;
    const { mood } = req.body;
    
    // Validate mood value
    const validMoods = ["happy", "excited", "neutral", "sad", "angry"];
    if (!validMoods.includes(mood)) {
      return res.status(400).json({ message: "Invalid mood value" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.mood = mood;
    await user.save();

    res.status(200).json({ mood: user.mood });
  } catch (err) {
    console.error("Error in updateMood:", err);
    res.status(500).json({ 
      message: "Failed to update mood",
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};