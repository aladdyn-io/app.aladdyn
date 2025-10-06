# Aladdyn

AI-Powered Generative Tools platform built with cutting-edge technologies and modern design principles.

## Features

- 🤖 **AI-Powered Tools** - Generative AI solutions and intelligent workflows
- ⚡️ **Vite** - Lightning-fast build tool and development server
- ⚛️ **React 18** - Latest React features with hooks and concurrent rendering
- 🔷 **TypeScript** - Type safety and better developer experience
- 🎨 **Tailwind CSS** - Utility-first CSS framework with emerald gradient theme
- 🧭 **React Router** - Declarative routing for React applications
- 🔧 **ESLint & Prettier** - Code quality and formatting tools
- 📱 **Responsive Design** - Mobile-first approach with beautiful UI
- 🎯 **Modern UI Components** - Clean, accessible components with shadcn/ui

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository or use this template
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout component
│   ├── Navbar.tsx      # Navigation bar
│   └── Footer.tsx      # Footer component
├── pages/              # Page components
│   ├── Home.tsx        # Home page
│   └── About.tsx       # About page
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── App.tsx             # Main App component
├── main.tsx            # Application entry point
└── index.css           # Global styles with Tailwind
```

## Customization

### Adding New Pages

1. Create a new component in `src/pages/`
2. Add the route in `src/App.tsx`
3. Add navigation link in `src/components/Navbar.tsx`

### Styling

The project uses Tailwind CSS with custom utility classes defined in `src/index.css`. You can:

- Use Tailwind utility classes directly in components
- Create custom component classes in the `@layer components` section
- Modify the theme in `tailwind.config.js`

### Adding Dependencies

```bash
npm install <package-name>
```

For TypeScript support, also install type definitions:

```bash
npm install -D @types/<package-name>
```

## Deployment

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Deploy automatically

### Deploy to Netlify

1. Build the project: `npm run build`
2. Deploy the `dist/` folder to [Netlify](https://netlify.com)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).