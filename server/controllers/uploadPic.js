const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const uploadProfilePic = async (req, res) => {
  try {
    const src = await cloudinary.uploader.upload(
      req.files.image.tempFilePath,
      {
        use_filename: true,
        folder: "Social Session 1"
      }
    )
    fs.unlinkSync(req.files.image.tempFilePath);
    return res.status(200).json({ src: src.secure_url });
  } catch (err) {
    console.log(err);
    return res.status(500).send("The image failed to upload to Cloudinary!")
  }
}

module.exports = { uploadProfilePic }