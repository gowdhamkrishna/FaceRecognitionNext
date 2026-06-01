This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# Face Recognition System

A real-time face recognition application built using **FaceAPI.js**. The system detects faces from images or live camera feeds, extracts facial features, and identifies known individuals by comparing facial descriptors.

## Features

- Real-time face detection
- Face recognition and matching
- Facial landmark detection
- Face descriptor generation
- Webcam support
- Recognition from uploaded images
- Confidence score for matches
- Fast and lightweight browser-based processing
  he application loads known faces from `models/faces.json` and the corresponding images from `public/images`.
  
### Add .env at project root
```
GITHUB_SECRET=secret_value_for_github
GITHUB_ID=your_github_client_id
MONGODB_URI=mongodb://localhost:27017/attendance
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Folder Structure

```text
public/
├── images/
│   ├── albin.jpeg
│   ├── astin.jpeg
│   ├── gow.jpeg
│   ├── gowdham.jpeg
│   ├── jerin.jpeg
│   ├── johan.jpeg
│   ├── ron.png
│   └── image.png

models/
└── faces.json
```

### Configure Known Faces

Edit `models/faces.json`:

```json
[
  {
    "label": "Johan",
    "image": "/images/johan.jpeg"
  },
  {
    "label": "Gowdham",
    "image": "/images/gowdham.jpeg"
  },
  {
    "label": "Jerin",
    "image": "/images/jerin.jpeg"
  },
  {
    "label": "Astin",
    "image": "/images/astin.jpeg"
  }
]
```

### Adding a New Person

1. Add the person's image to the `public/images` directory.

Example:

```text
public/images/albin.jpeg
```

2. Add a new entry in `models/faces.json`:

```json
{
  "label": "Albin",
  "image": "/images/albin.jpeg"
}
```

### Guidelines

- `label` should contain the person's name.
- `image` should contain the relative path to the image inside the `public` directory.
- Use clear, front-facing images with good lighting for better recognition accuracy.
- Supported formats include JPG, JPEG, and PNG.

### Example with All Available Images

```json
[
  { "label": "Johan", "image": "/images/johan.jpeg" },
  { "label": "Gowdham", "image": "/images/gowdham.jpeg" },
  { "label": "Jerin", "image": "/images/jerin.jpeg" },
  { "label": "Astin", "image": "/images/astin.jpeg" },
  { "label": "Albin", "image": "/images/albin.jpeg" },
  { "label": "Ron", "image": "/images/ron.png" }
]
```
