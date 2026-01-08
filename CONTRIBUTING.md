# Contributing to tech-svg-generator

Thanks for your interest in contributing! This document outlines how to get started.

## Development Setup

1. Clone the repository
```bash
git clone https://github.com/open-tech-svg-gen/tech-svg-generator.git
cd tech-svg-generator
```

2. Install dependencies
```bash
npm install
```

3. Build the project
```bash
npm run build
```

4. Run tests
```bash
npm test
```

## Making Changes

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests to ensure everything works
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to your branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Code Style

- Use TypeScript for all source files
- Follow existing code patterns
- Add tests for new features
- Update documentation as needed

## Adding New Scenes

To add a new scene type:

1. Add the scene type to `src/types.ts` in the `SceneType` union
2. Add keywords for detection in `src/generator.ts` in the `KEYWORDS` object
3. Create the scene renderer in `src/scenes.ts`
4. Add tests in `src/scenes.test.ts` and `src/generator.test.ts`

## Adding New Icons

To add new icons:

1. Add the icon path to `src/icons.ts` (24x24 viewBox, Lucide-style)
2. Add tests in `src/icons.test.ts`

## Adding New Themes

To add a new theme:

1. Define the theme colors in `src/themes.ts`
2. Add it to the `THEMES` object
3. Add tests in `src/themes.test.ts`

## Reporting Issues

- Use GitHub Issues for bug reports and feature requests
- Include reproduction steps for bugs
- Check existing issues before creating new ones

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
