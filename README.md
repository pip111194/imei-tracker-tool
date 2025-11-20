# 📱 IMEI Tracker Tool

A complete, professional IMEI (International Mobile Equipment Identity) tracker and validator tool built with pure HTML, CSS, and JavaScript.

## 🌟 Features

- ✅ **Real IMEI Validation** - Uses Luhn algorithm for accurate validation
- 🔍 **Device Information** - Extracts TAC, Serial Number, and Check Digit
- 📊 **Manufacturer Detection** - Identifies device manufacturer and type
- 🎨 **Modern UI** - Beautiful gradient design with smooth animations
- 📱 **Responsive Design** - Works perfectly on all devices
- ⚡ **Fast & Lightweight** - No external dependencies
- 🔒 **Privacy First** - All processing happens locally in browser

## 🚀 Live Demo

Visit: `https://[your-username].github.io/imei-tracker-tool/`

## 📖 What is IMEI?

IMEI (International Mobile Equipment Identity) is a unique 15-digit number that identifies mobile devices. It consists of:

- **TAC (Type Allocation Code)**: First 8 digits - identifies manufacturer and model
- **Serial Number**: Next 6 digits - unique device identifier
- **Check Digit**: Last digit - validation digit calculated using Luhn algorithm

## 🛠️ How It Works

1. **Input Validation**: Ensures 15-digit numeric input
2. **Luhn Algorithm**: Validates IMEI authenticity using checksum
3. **TAC Lookup**: Identifies manufacturer from TAC database
4. **Information Display**: Shows complete device details

## 💻 Technical Details

### IMEI Structure
```
IMEI: 123456789012345
├─ TAC: 12345678 (Type Allocation Code)
├─ SNR: 901234 (Serial Number)
└─ CD: 5 (Check Digit)
```

### Validation Algorithm (Luhn)
The tool uses the Luhn algorithm to validate IMEI numbers:
1. Double every second digit from right to left
2. If doubled digit > 9, subtract 9
3. Sum all digits
4. Check if sum % 10 equals check digit

## 📦 Installation

### Option 1: GitHub Pages (Recommended)
1. Fork this repository
2. Go to Settings → Pages
3. Select `main` branch as source
4. Your site will be live at `https://[username].github.io/imei-tracker-tool/`

### Option 2: Local Setup
```bash
# Clone the repository
git clone https://github.com/pip111194/imei-tracker-tool.git

# Navigate to directory
cd imei-tracker-tool

# Open in browser
open index.html
```

## 🎯 Usage

1. Open the tool in your browser
2. Enter a 15-digit IMEI number
3. Click "Track IMEI" button
4. View detailed device information

### Example IMEI Numbers for Testing
- `123456789012345` - Generic test IMEI
- `357174051234567` - Apple iPhone
- `358240051234567` - Samsung Galaxy

## 🔧 Customization

### Adding More Manufacturers
Edit `tracker.js` and add entries to `tacDatabase`:

```javascript
const tacDatabase = {
    '35123': { manufacturer: 'Apple', type: 'iPhone 13' },
    // Add your entries here
};
```

### Styling
Modify `index.html` `<style>` section to customize colors, fonts, and layout.

## 📱 Supported Manufacturers

- Apple (iPhone series)
- Samsung (Galaxy series)
- Xiaomi (Redmi/Mi series)
- OnePlus
- Oppo
- Vivo
- Realme
- Nokia
- Motorola
- Huawei
- Google (Pixel series)
- Sony (Xperia series)
- LG
- HTC

## 🔐 Privacy & Security

- **100% Client-Side**: All processing happens in your browser
- **No Data Collection**: No IMEI numbers are stored or transmitted
- **No External APIs**: Works completely offline
- **Open Source**: Full transparency - inspect the code yourself

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## ⚠️ Disclaimer

This tool is for educational and informational purposes only. IMEI tracking should only be performed on devices you own or have permission to check. The accuracy of manufacturer detection depends on the TAC database coverage.

## 🙏 Acknowledgments

- IMEI validation based on Luhn algorithm
- TAC database compiled from public sources
- UI inspired by modern web design principles

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Contribute to improve the tool

## 🌟 Star This Repository

If you find this tool useful, please consider giving it a star ⭐

---

**Made with ❤️ for the developer community**