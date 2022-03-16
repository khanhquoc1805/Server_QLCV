import cloudinary from "cloudinary";

export function uploadToCloudinary(image) {
    return new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload(image, (err, url) => {
            if (err) return reject(err);
            return resolve(url);
        });
    });
}
