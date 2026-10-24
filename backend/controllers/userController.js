const User = require("../models/User");
const cloudinary = require("../config/cloudinary");

const getOrCreateUser = async (req, res) => {
  try {
    const { uid, email, name, picture } = req.user;

    let user = await User.findOne({
      firebaseUID: uid
    });

    if (!user) {
      user = await User.create({
        firebaseUID: uid,
        displayName: name || "",
        email: email || "",
        photoURL: picture || ""
      });
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    console.error("User creation error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create or retrieve user"
    });
  }
};

const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Profile photo is required"
      });
    }

    const firebaseUID = req.user.uid;

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "xau-strategy/profile-photos",
            public_id: firebaseUID,
            overwrite: true,
            resource_type: "image"
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        )
        .end(req.file.buffer);
    });

    const user = await User.findOneAndUpdate(
      { firebaseUID },
      { photoURL: uploadResult.secure_url },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile photo uploaded successfully",
      photoURL: uploadResult.secure_url,
      user
    });

  } catch (error) {
    console.error("Profile photo upload error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to upload profile photo"
    });
  }
};

module.exports = {
  getOrCreateUser,
  uploadProfilePhoto
};