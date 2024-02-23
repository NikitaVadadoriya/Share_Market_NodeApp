const multer = require("multer");

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            console.log("file", file);
            let directory = "/upload/";
            if (file.fieldname === "userProfile") directory = "/upload/userProfile/"

            file.directory = directory;
            console.log("~ FILE ~", file);
            cb(null, __basedir + directory);
        },
        filename: (req, file, cb) => {
            file.location = file.directory + "" + file.originalname.split(" ").join("");
            cb(null, file.originalname.split(" ").join(""));
        },
    }),
    // limits: { fileSize: size, files: 10 },
});

module.exports = { upload };