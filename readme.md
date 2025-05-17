# All-in-One Converter

A versatile web-based conversion tool that allows users to convert between various file formats and unit measurements directly in the browser. The application is built with vanilla JavaScript, HTML, and CSS, with no backend required.

## Features

### File Conversions
- **JPG to PNG**: Convert JPG images to the transparent PNG format
- **PNG to JPG**: Convert PNG images to JPG format (with white background)
- **PDF to Image**: Convert PDF pages to JPG or PNG images
- **Image to PDF**: Combine multiple images into a single PDF document

### Unit Conversions
- **Temperature**: Convert between Celsius, Fahrenheit, and Kelvin
- **Weight**: Convert between kilograms, grams, pounds, and ounces
- **Length**: Convert between meters, kilometers, centimeters, millimeters, feet, inches, yards, and miles
- **Volume**: Convert between liters, milliliters, gallons, quarts, pints, cups, fluid ounces, tablespoons, and teaspoons

## Technologies Used

- **HTML5**: Modern, semantic HTML structure
- **CSS3**: Responsive design with animations and transitions
- **JavaScript (ES6+)**: Client-side functionality including drag-and-drop file handling
- **PDF.js**: Mozilla's PDF rendering library for PDF to image conversion
- **jsPDF**: Library for creating PDF documents from images
- **Font Awesome**: For icons and visual elements

## How It Works

All conversions happen directly in the browser without any server-side processing:

1. **File Conversions**: Uses HTML5 Canvas for image processing and conversion between formats
2. **PDF Processing**: Uses PDF.js to render PDF documents to canvas elements
3. **Image to PDF**: Uses jsPDF to generate PDFs from images
4. **Unit Conversions**: Uses JavaScript for mathematical calculations between different units

## Privacy and Security

- All processing happens locally in the user's browser
- No files are ever uploaded to a server
- No user data is collected or stored

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Local Development

To run the application locally:

1. Clone the repository
2. Navigate to the project directory
3. Open the `index.html` file in your browser

Alternatively, you can use a local development server like Python's built-in HTTP server:

```bash
# For Python 3
python -m http.server 8000

# For Python 2
python -m SimpleHTTPServer 8000
```

Then access the site at http://localhost:8000

## License

MIT License

## Credits

- PDF.js by Mozilla
- jsPDF library
- Font Awesome for icons