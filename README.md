# Anniversary Puzzle App 💖

A romantic anniversary web app featuring jigsaw puzzles and love memories.

## Features

- 🔐 Password-protected (anniversary date)
- 🧩 3-5 jigsaw puzzles with your photos
- 💕 Emotional memory text after each puzzle
- 🎵 Background music
- 🎊 Confetti celebration on completion
- 📜 Link to handwritten love letter

## Quick Start

### 1. Install Dependencies

```bash
cd anniversary-app
npm install
```

### 2. Add Your Content

#### Photos
Add your photos to `public/photos/`:
- `photo1.jpg`
- `photo2.jpg`
- `photo3.jpg`
- `photo4.jpg`
- `photo5.jpg`

Recommended: Square or landscape photos, minimum 500x500px.

#### Background Music
Add a romantic MP3 to `public/music/`:
- `background.mp3`

Tip: Use royalty-free romantic music from sites like:
- https://pixabay.com/music/
- https://www.bensound.com/

#### Customize Memories
Edit `src/data/memories.js`:

```javascript
export const ANNIVERSARY_PASSWORD = "14-02-2020"; // Your anniversary date

export const memories = [
  {
    id: 1,
    image: "/photos/photo1.jpg",
    title: "Your Memory Title",
    description: "Your romantic description...",
    pieces: 9, // Easy: 9, Medium: 12-16, Hard: 20
  },
  // Add more memories...
];

export const finalMessage = {
  heading: "Happy Anniversary My Love ❤️",
  subheading: "Your custom message",
  letterLink: "https://docs.google.com/document/d/YOUR_DOC_ID/edit",
  letterButtonText: "Read My Letter to You",
};
```

### 3. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

### 4. Build for Production

```bash
npm run build
```

Output will be in `dist/` folder.

### 5. Deploy

Deploy the `dist/` folder to:
- **Netlify** (drag & drop)
- **Vercel** (`vercel --prod`)
- **GitHub Pages**
- **Firebase Hosting**

## Project Structure

```
anniversary-app/
├── public/
│   ├── photos/          # Your photos
│   ├── music/           # Background music
│   └── heart.svg        # Favicon
├── src/
│   ├── components/
│   │   ├── Welcome.jsx      # Password screen
│   │   ├── Puzzle.jsx       # Jigsaw puzzle
│   │   ├── Progress.jsx     # Heart progress bar
│   │   └── FinalReveal.jsx  # Celebration screen
│   ├── data/
│   │   └── memories.js      # Your content config
│   ├── App.jsx              # Main app logic
│   ├── main.jsx             # Entry point
│   └── index.css            # Tailwind styles
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## Customization

### Change Colors
Edit `tailwind.config.js` to modify the `romantic` color palette.

### Change Password Format
The password accepts formats: `DD-MM-YYYY`, `DD/MM/YYYY`, `DD.MM.YYYY`

### Adjust Puzzle Difficulty
In `memories.js`, set `pieces` property:
- Easy: 9 (3x3 grid)
- Medium: 12-16
- Hard: 20-25

## Tech Stack

- ⚛️ React 18
- ⚡ Vite
- 🎨 Tailwind CSS
- 🧩 headbreaker (puzzle engine)
- 🎬 Framer Motion
- 🎊 canvas-confetti

## Troubleshooting

### Puzzles not loading?
- Ensure images are in `public/photos/`
- Check browser console for errors
- Try smaller image files (< 2MB)

### Audio not playing?
- Browsers require user interaction before audio
- Click the music button after starting

### Mobile touch issues?
- The puzzle supports touch events
- For best experience, use a modern mobile browser

## License

MIT - Use freely for personal projects 💕
