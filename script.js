document.addEventListener('DOMContentLoaded', () => {
    // Set PDF.js worker path
    if (window.pdfjsLib) {
        try {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
        } catch (error) {
            console.error('Error setting PDF.js worker path:', error);
        }
    }
    
    // Category tabs functionality
    const categoryBtns = document.querySelectorAll('.category-btn');
    const categoryContents = document.querySelectorAll('.category-content');
    
    // Tab functionality within each category
    const fileTabBtns = document.querySelectorAll('#file-conversions .tab-btn');
    const fileTabContents = document.querySelectorAll('#file-conversions .tab-content');
    
    const unitTabBtns = document.querySelectorAll('#unit-conversions .tab-btn');
    const unitTabContents = document.querySelectorAll('#unit-conversions .tab-content');
    
    // DOM elements
    const fileList = document.getElementById('fileList');
    const fileListContainer = document.getElementById('files');
    const convertBtn = document.getElementById('convertBtn');
    const loadingSpinner = document.getElementById('loadingSpinner');
    
    // Current active tabs
    let activeCategory = 'file';
    let activeFileTab = 'jpg-to-png';
    let activeUnitTab = 'temperature';
    
    // Upload area elements
    const uploadAreas = {
        jpgToPng: document.getElementById('uploadAreaJpgToPng'),
        pngToJpg: document.getElementById('uploadAreaPngToJpg'),
        pdfToImg: document.getElementById('uploadAreaPdfToImg'),
        imgToPdf: document.getElementById('uploadAreaImgToPdf')
    };
    
    // File input elements
    const fileInputs = {
        jpgToPng: document.getElementById('fileInputJpgToPng'),
        pngToJpg: document.getElementById('fileInputPngToJpg'),
        pdfToImg: document.getElementById('fileInputPdfToImg'),
        imgToPdf: document.getElementById('fileInputImgToPdf')
    };
    
    // PDF output format radios
    const pdfOutputFormat = document.getElementsByName('pdfOutputFormat');
    
    // Unit conversion elements
    const unitConverters = {
        temperature: {
            input: document.getElementById('tempInput'),
            fromUnit: document.getElementById('tempFromUnit'),
            toUnit: document.getElementById('tempToUnit'),
            result: document.getElementById('tempResult'),
            formula: document.getElementById('tempFormula'),
            convertBtn: document.getElementById('convertTempBtn'),
            swapIcon: document.querySelector('#temperature .swap-icon')
        },
        weight: {
            input: document.getElementById('weightInput'),
            fromUnit: document.getElementById('weightFromUnit'),
            toUnit: document.getElementById('weightToUnit'),
            result: document.getElementById('weightResult'),
            formula: document.getElementById('weightFormula'),
            convertBtn: document.getElementById('convertWeightBtn'),
            swapIcon: document.querySelector('#weight .swap-icon')
        },
        length: {
            input: document.getElementById('lengthInput'),
            fromUnit: document.getElementById('lengthFromUnit'),
            toUnit: document.getElementById('lengthToUnit'),
            result: document.getElementById('lengthResult'),
            formula: document.getElementById('lengthFormula'),
            convertBtn: document.getElementById('convertLengthBtn'),
            swapIcon: document.querySelector('#length .swap-icon')
        },
        volume: {
            input: document.getElementById('volumeInput'),
            fromUnit: document.getElementById('volumeFromUnit'),
            toUnit: document.getElementById('volumeToUnit'),
            result: document.getElementById('volumeResult'),
            formula: document.getElementById('volumeFormula'),
            convertBtn: document.getElementById('convertVolumeBtn'),
            swapIcon: document.querySelector('#volume .swap-icon')
        }
    };
    
    // Selected files
    let selectedFiles = [];
    
    // Handle category switching
    categoryBtns.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryBtns.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Update active category
            activeCategory = button.getAttribute('data-category');
            
            // Hide all category contents
            categoryContents.forEach(content => content.classList.remove('active'));
            
            // Show selected category content
            document.getElementById(`${activeCategory}-conversions`).classList.add('active');
        });
    });
    
    // Handle tab switching within file conversions
    fileTabBtns.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            fileTabBtns.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Update active tab
            activeFileTab = button.getAttribute('data-tab');
            
            // Hide all tab contents
            fileTabContents.forEach(content => content.classList.remove('active'));
            
            // Show selected tab content
            document.getElementById(activeFileTab).classList.add('active');
            
            // Clear selected files when switching tabs
            selectedFiles = [];
            fileListContainer.innerHTML = '';
            fileList.style.display = 'none';
        });
    });
    
    // Handle tab switching within unit conversions
    unitTabBtns.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            unitTabBtns.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Update active tab
            activeUnitTab = button.getAttribute('data-tab');
            
            // Hide all tab contents
            unitTabContents.forEach(content => content.classList.remove('active'));
            
            // Show selected tab content
            document.getElementById(activeUnitTab).classList.add('active');
        });
    });
    
    // Add drag and drop functionality to all upload areas
    Object.keys(uploadAreas).forEach(key => {
        const uploadArea = uploadAreas[key];
        const fileInput = fileInputs[key];
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('active');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('active');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('active');
            
            const files = e.dataTransfer.files;
            handleFiles(files, key);
        });
        
        // Trigger file input when clicking on upload area
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });
        
        // Handle file selection
        fileInput.addEventListener('change', () => {
            const files = fileInput.files;
            handleFiles(files, key);
        });
    });
    
    // Process selected files
    function handleFiles(files, type) {
        if (files.length === 0) return;
        
        // Filter for the correct file types based on conversion
        const validFiles = Array.from(files).filter(file => {
            const fileType = file.type.toLowerCase();
            
            switch (type) {
                case 'jpgToPng':
                    return fileType === 'image/jpeg' || fileType === 'image/jpg';
                case 'pngToJpg':
                    return fileType === 'image/png';
                case 'pdfToImg':
                    return fileType === 'application/pdf';
                case 'imgToPdf':
                    return fileType === 'image/jpeg' || fileType === 'image/jpg' || fileType === 'image/png';
                default:
                    return false;
            }
        });
        
        if (validFiles.length === 0) {
            alert('Please select valid files for the selected conversion type.');
            return;
        }
        
        // Add valid files to the selectedFiles array
        selectedFiles = [...selectedFiles, ...validFiles];
        
        // Show file list
        fileList.style.display = 'block';
        
        // Update UI
        updateFileList();
    }
    
    // Update the file list in the UI
    function updateFileList() {
        fileListContainer.innerHTML = '';
        
        selectedFiles.forEach((file, index) => {
            const fileItem = document.createElement('li');
            
            const fileName = document.createElement('span');
            fileName.textContent = file.name;
            
            const removeBtn = document.createElement('button');
            removeBtn.innerHTML = '<i class="fas fa-times"></i>';
            removeBtn.classList.add('remove-btn');
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                selectedFiles.splice(index, 1);
                updateFileList();
                
                if (selectedFiles.length === 0) {
                    fileList.style.display = 'none';
                }
            });
            
            fileItem.appendChild(fileName);
            fileItem.appendChild(removeBtn);
            fileListContainer.appendChild(fileItem);
        });
    }
    
    // Handle file conversion process
    convertBtn.addEventListener('click', () => {
        if (selectedFiles.length === 0) {
            alert('Please select at least one file to convert.');
            return;
        }
        
        // Show loading spinner
        loadingSpinner.style.display = 'flex';
        
        // Determine which conversion to perform based on active tab
        switch (activeFileTab) {
            case 'jpg-to-png':
                convertJpgToPng();
                break;
            case 'png-to-jpg':
                convertPngToJpg();
                break;
            case 'pdf-to-img':
                convertPdfToImage();
                break;
            case 'img-to-pdf':
                convertImageToPdf();
                break;
            default:
                loadingSpinner.style.display = 'none';
                alert('Please select a conversion type.');
        }
    });
    
    // JPG to PNG conversion
    function convertJpgToPng() {
        Promise.all(selectedFiles.map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                
                reader.onload = function(event) {
                    const img = new Image();
                    img.onload = function() {
                        // Create canvas to draw the image
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        
                        // Draw image on canvas
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0);
                        
                        // Convert to PNG
                        const pngDataUrl = canvas.toDataURL('image/png');
                        
                        // Create download link
                        downloadFile(pngDataUrl, file.name.replace(/\.(jpg|jpeg)$/i, '.png'));
                        resolve();
                    };
                    
                    img.src = event.target.result;
                };
                
                reader.readAsDataURL(file);
            });
        })).then(() => {
            finishConversion();
        });
    }
    
    // PNG to JPG conversion
    function convertPngToJpg() {
        Promise.all(selectedFiles.map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                
                reader.onload = function(event) {
                    const img = new Image();
                    img.onload = function() {
                        // Create canvas to draw the image
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        
                        // Draw image on canvas with white background (JPG doesn't support transparency)
                        const ctx = canvas.getContext('2d');
                        ctx.fillStyle = 'white';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(img, 0, 0);
                        
                        // Convert to JPG
                        const jpgDataUrl = canvas.toDataURL('image/jpeg', 0.9);
                        
                        // Create download link
                        downloadFile(jpgDataUrl, file.name.replace(/\.png$/i, '.jpg'));
                        resolve();
                    };
                    
                    img.src = event.target.result;
                };
                
                reader.readAsDataURL(file);
            });
        })).then(() => {
            finishConversion();
        });
    }
    
    // PDF to Image conversion
    function convertPdfToImage() {
        if (!window.pdfjsLib) {
            alert('PDF.js library not loaded. Please try again or reload the page.');
            loadingSpinner.style.display = 'none';
            return;
        }
        
        // Get selected output format
        let outputFormat = 'png';
        for (const radio of pdfOutputFormat) {
            if (radio.checked) {
                outputFormat = radio.value;
                break;
            }
        }
        
        const mimeType = outputFormat === 'png' ? 'image/png' : 'image/jpeg';
        const fileExtension = outputFormat === 'png' ? '.png' : '.jpg';
        const quality = outputFormat === 'png' ? 1.0 : 0.9;
        
        let processedFiles = 0;
        let totalPages = 0;
        
        if (selectedFiles.length === 0) {
            alert('Please select at least one PDF file to convert.');
            loadingSpinner.style.display = 'none';
            return;
        }
        
        Promise.all(selectedFiles.map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                
                reader.onload = async function(event) {
                    const typedArray = new Uint8Array(event.target.result);
                    
                    try {
                        // Load the PDF document
                        const pdf = await pdfjsLib.getDocument(typedArray).promise;
                        totalPages += pdf.numPages;
                        
                        // Process each page
                        for (let i = 1; i <= pdf.numPages; i++) {
                            const page = await pdf.getPage(i);
                            const viewport = page.getViewport({ scale: 1.5 });
                            
                            // Create canvas
                            const canvas = document.createElement('canvas');
                            const ctx = canvas.getContext('2d');
                            canvas.width = viewport.width;
                            canvas.height = viewport.height;
                            
                            try {
                                // Render PDF page to canvas
                                await page.render({
                                    canvasContext: ctx,
                                    viewport: viewport
                                }).promise;
                                
                                // Create output filename
                                let outputFilename = file.name.replace('.pdf', '');
                                if (pdf.numPages > 1) {
                                    outputFilename += `_page${i}`;
                                }
                                outputFilename += fileExtension;
                                
                                // Convert to image format
                                const imageData = canvas.toDataURL(mimeType, quality);
                                
                                // Download the image
                                downloadFile(imageData, outputFilename);
                                
                                processedFiles++;
                            } catch (error) {
                                console.error('Error rendering PDF page:', error);
                                alert(`Error rendering page ${i} of ${file.name}. Skipping this page.`);
                            }
                        }
                        
                        resolve();
                    } catch (error) {
                        console.error('Error processing PDF:', error);
                        alert('Error processing PDF. Please try a different file.');
                        resolve();
                    }
                };
                
                reader.readAsArrayBuffer(file);
            });
        })).then(() => {
            finishConversion();
        });
    }
    
    // Image to PDF conversion
    function convertImageToPdf() {
        if (typeof window.jspdf === 'undefined') {
            alert('jsPDF library not loaded. Please try again or reload the page.');
            loadingSpinner.style.display = 'none';
            return;
        }
        
        // Get PDF filename
        let pdfName = document.getElementById('pdfName').value || 'converted_document';
        if (!pdfName.endsWith('.pdf')) {
            pdfName += '.pdf';
        }
        
        // Create a new jsPDF instance
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        
        // Track loading of images
        let loadedImages = 0;
        
        // Array to store loaded images
        let images = [];
        
        // Use promises to load all images
        Promise.all(selectedFiles.map((file, index) => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                
                reader.onload = function(event) {
                    const img = new Image();
                    img.onload = function() {
                        // Store loaded image with its dimensions
                        images.push({
                            src: event.target.result,
                            width: img.width,
                            height: img.height,
                            index: index
                        });
                        resolve();
                    };
                    
                    img.src = event.target.result;
                };
                
                reader.readAsDataURL(file);
            });
        })).then(() => {
            // Sort images by original order
            images.sort((a, b) => a.index - b.index);
            
            // Add each image to PDF
            images.forEach((image, i) => {
                if (i > 0) {
                    // Add new page for each additional image
                    doc.addPage();
                }
                
                // Calculate dimensions to fit on PDF page
                const pageWidth = doc.internal.pageSize.getWidth();
                const pageHeight = doc.internal.pageSize.getHeight();
                
                let imgWidth = image.width;
                let imgHeight = image.height;
                
                // Scale image to fit within the page
                const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
                imgWidth *= ratio;
                imgHeight *= ratio;
                
                // Center the image on the page
                const x = (pageWidth - imgWidth) / 2;
                const y = (pageHeight - imgHeight) / 2;
                
                // Add image to PDF
                doc.addImage(image.src, 'JPEG', x, y, imgWidth, imgHeight);
            });
            
            // Save the PDF
            doc.save(pdfName);
            
            finishConversion();
        });
    }
    
    // Unit conversion handlers
    
    // Temperature conversion
    const tempConverter = unitConverters.temperature;
    if (tempConverter.convertBtn) {
        tempConverter.convertBtn.addEventListener('click', () => {
            if (!tempConverter.input.value) {
                alert('Please enter a value to convert.');
                return;
            }
            
            const value = parseFloat(tempConverter.input.value);
            const fromUnit = tempConverter.fromUnit.value;
            const toUnit = tempConverter.toUnit.value;
            let result;
            
            // Convert to Celsius first as a common unit
            let celsius;
            switch (fromUnit) {
                case 'celsius':
                    celsius = value;
                    break;
                case 'fahrenheit':
                    celsius = (value - 32) * 5/9;
                    break;
                case 'kelvin':
                    celsius = value - 273.15;
                    break;
            }
            
            // Convert from Celsius to target unit
            switch (toUnit) {
                case 'celsius':
                    result = celsius;
                    break;
                case 'fahrenheit':
                    result = (celsius * 9/5) + 32;
                    break;
                case 'kelvin':
                    result = celsius + 273.15;
                    break;
            }
            
            // Update formula display
            updateFormula('temperature', fromUnit, toUnit);
            
            // Display result
            tempConverter.result.value = result.toFixed(2);
        });
        
        // Swap units
        tempConverter.swapIcon.addEventListener('click', () => {
            const fromUnit = tempConverter.fromUnit.value;
            tempConverter.fromUnit.value = tempConverter.toUnit.value;
            tempConverter.toUnit.value = fromUnit;
            
            // If there's already a value, convert it
            if (tempConverter.input.value) {
                tempConverter.convertBtn.click();
            }
            
            // Update formula
            updateFormula('temperature', tempConverter.fromUnit.value, tempConverter.toUnit.value);
        });
        
        // Update formula when units change
        tempConverter.fromUnit.addEventListener('change', () => {
            updateFormula('temperature', tempConverter.fromUnit.value, tempConverter.toUnit.value);
        });
        
        tempConverter.toUnit.addEventListener('change', () => {
            updateFormula('temperature', tempConverter.fromUnit.value, tempConverter.toUnit.value);
        });
    }
    
    // Weight conversion
    const weightConverter = unitConverters.weight;
    if (weightConverter.convertBtn) {
        weightConverter.convertBtn.addEventListener('click', () => {
            if (!weightConverter.input.value) {
                alert('Please enter a value to convert.');
                return;
            }
            
            const value = parseFloat(weightConverter.input.value);
            const fromUnit = weightConverter.fromUnit.value;
            const toUnit = weightConverter.toUnit.value;
            
            // Conversion factors to kg
            const toKg = {
                kg: 1,
                g: 0.001,
                lb: 0.453592,
                oz: 0.0283495
            };
            
            // Conversion factors from kg
            const fromKg = {
                kg: 1,
                g: 1000,
                lb: 2.20462,
                oz: 35.274
            };
            
            // Convert to kg first then to target unit
            const kg = value * toKg[fromUnit];
            const result = kg * fromKg[toUnit];
            
            // Update formula display
            updateFormula('weight', fromUnit, toUnit);
            
            // Display result
            weightConverter.result.value = result.toFixed(4);
        });
        
        // Swap units
        weightConverter.swapIcon.addEventListener('click', () => {
            const fromUnit = weightConverter.fromUnit.value;
            weightConverter.fromUnit.value = weightConverter.toUnit.value;
            weightConverter.toUnit.value = fromUnit;
            
            // If there's already a value, convert it
            if (weightConverter.input.value) {
                weightConverter.convertBtn.click();
            }
            
            // Update formula
            updateFormula('weight', weightConverter.fromUnit.value, weightConverter.toUnit.value);
        });
        
        // Update formula when units change
        weightConverter.fromUnit.addEventListener('change', () => {
            updateFormula('weight', weightConverter.fromUnit.value, weightConverter.toUnit.value);
        });
        
        weightConverter.toUnit.addEventListener('change', () => {
            updateFormula('weight', weightConverter.fromUnit.value, weightConverter.toUnit.value);
        });
    }
    
    // Length conversion
    const lengthConverter = unitConverters.length;
    if (lengthConverter.convertBtn) {
        lengthConverter.convertBtn.addEventListener('click', () => {
            if (!lengthConverter.input.value) {
                alert('Please enter a value to convert.');
                return;
            }
            
            const value = parseFloat(lengthConverter.input.value);
            const fromUnit = lengthConverter.fromUnit.value;
            const toUnit = lengthConverter.toUnit.value;
            
            // Conversion factors to meters
            const toMeters = {
                m: 1,
                km: 1000,
                cm: 0.01,
                mm: 0.001,
                ft: 0.3048,
                in: 0.0254,
                yd: 0.9144,
                mi: 1609.34
            };
            
            // Conversion factors from meters
            const fromMeters = {
                m: 1,
                km: 0.001,
                cm: 100,
                mm: 1000,
                ft: 3.28084,
                in: 39.3701,
                yd: 1.09361,
                mi: 0.000621371
            };
            
            // Convert to meters first then to target unit
            const meters = value * toMeters[fromUnit];
            const result = meters * fromMeters[toUnit];
            
            // Update formula display
            updateFormula('length', fromUnit, toUnit);
            
            // Display result
            lengthConverter.result.value = result.toFixed(6);
        });
        
        // Swap units
        lengthConverter.swapIcon.addEventListener('click', () => {
            const fromUnit = lengthConverter.fromUnit.value;
            lengthConverter.fromUnit.value = lengthConverter.toUnit.value;
            lengthConverter.toUnit.value = fromUnit;
            
            // If there's already a value, convert it
            if (lengthConverter.input.value) {
                lengthConverter.convertBtn.click();
            }
            
            // Update formula
            updateFormula('length', lengthConverter.fromUnit.value, lengthConverter.toUnit.value);
        });
        
        // Update formula when units change
        lengthConverter.fromUnit.addEventListener('change', () => {
            updateFormula('length', lengthConverter.fromUnit.value, lengthConverter.toUnit.value);
        });
        
        lengthConverter.toUnit.addEventListener('change', () => {
            updateFormula('length', lengthConverter.fromUnit.value, lengthConverter.toUnit.value);
        });
    }
    
    // Volume conversion
    const volumeConverter = unitConverters.volume;
    if (volumeConverter.convertBtn) {
        volumeConverter.convertBtn.addEventListener('click', () => {
            if (!volumeConverter.input.value) {
                alert('Please enter a value to convert.');
                return;
            }
            
            const value = parseFloat(volumeConverter.input.value);
            const fromUnit = volumeConverter.fromUnit.value;
            const toUnit = volumeConverter.toUnit.value;
            
            // Conversion factors to liters
            const toLiters = {
                l: 1,
                ml: 0.001,
                gal: 3.78541,
                qt: 0.946353,
                pt: 0.473176,
                cup: 0.236588,
                oz: 0.0295735,
                tbsp: 0.0147868,
                tsp: 0.00492892
            };
            
            // Conversion factors from liters
            const fromLiters = {
                l: 1,
                ml: 1000,
                gal: 0.264172,
                qt: 1.05669,
                pt: 2.11338,
                cup: 4.22675,
                oz: 33.814,
                tbsp: 67.628,
                tsp: 202.884
            };
            
            // Convert to liters first then to target unit
            const liters = value * toLiters[fromUnit];
            const result = liters * fromLiters[toUnit];
            
            // Update formula display
            updateFormula('volume', fromUnit, toUnit);
            
            // Display result
            volumeConverter.result.value = result.toFixed(6);
        });
        
        // Swap units
        volumeConverter.swapIcon.addEventListener('click', () => {
            const fromUnit = volumeConverter.fromUnit.value;
            volumeConverter.fromUnit.value = volumeConverter.toUnit.value;
            volumeConverter.toUnit.value = fromUnit;
            
            // If there's already a value, convert it
            if (volumeConverter.input.value) {
                volumeConverter.convertBtn.click();
            }
            
            // Update formula
            updateFormula('volume', volumeConverter.fromUnit.value, volumeConverter.toUnit.value);
        });
        
        // Update formula when units change
        volumeConverter.fromUnit.addEventListener('change', () => {
            updateFormula('volume', volumeConverter.fromUnit.value, volumeConverter.toUnit.value);
        });
        
        volumeConverter.toUnit.addEventListener('change', () => {
            updateFormula('volume', volumeConverter.fromUnit.value, volumeConverter.toUnit.value);
        });
    }
    
    // Update the conversion formula display
    function updateFormula(type, fromUnit, toUnit) {
        let formula = '';
        
        switch(type) {
            case 'temperature':
                if (fromUnit === toUnit) {
                    formula = 'No conversion needed';
                } else if (fromUnit === 'celsius' && toUnit === 'fahrenheit') {
                    formula = '°F = (°C × 9/5) + 32';
                } else if (fromUnit === 'fahrenheit' && toUnit === 'celsius') {
                    formula = '°C = (°F - 32) × 5/9';
                } else if (fromUnit === 'celsius' && toUnit === 'kelvin') {
                    formula = 'K = °C + 273.15';
                } else if (fromUnit === 'kelvin' && toUnit === 'celsius') {
                    formula = '°C = K - 273.15';
                } else if (fromUnit === 'fahrenheit' && toUnit === 'kelvin') {
                    formula = 'K = (°F - 32) × 5/9 + 273.15';
                } else if (fromUnit === 'kelvin' && toUnit === 'fahrenheit') {
                    formula = '°F = (K - 273.15) × 9/5 + 32';
                }
                unitConverters.temperature.formula.textContent = formula;
                break;
                
            case 'weight':
                if (fromUnit === toUnit) {
                    formula = 'No conversion needed';
                } else {
                    const weightFormulas = {
                        kg: {
                            g: 'g = kg × 1000',
                            lb: 'lb = kg × 2.20462',
                            oz: 'oz = kg × 35.274'
                        },
                        g: {
                            kg: 'kg = g ÷ 1000',
                            lb: 'lb = g × 0.00220462',
                            oz: 'oz = g × 0.03527396'
                        },
                        lb: {
                            kg: 'kg = lb × 0.453592',
                            g: 'g = lb × 453.592',
                            oz: 'oz = lb × 16'
                        },
                        oz: {
                            kg: 'kg = oz × 0.0283495',
                            g: 'g = oz × 28.3495',
                            lb: 'lb = oz ÷ 16'
                        }
                    };
                    
                    formula = weightFormulas[fromUnit][toUnit];
                }
                unitConverters.weight.formula.textContent = formula;
                break;
                
            case 'length':
                if (fromUnit === toUnit) {
                    formula = 'No conversion needed';
                } else {
                    const lengthFormulas = {
                        m: {
                            km: 'km = m ÷ 1000',
                            cm: 'cm = m × 100',
                            mm: 'mm = m × 1000',
                            ft: 'ft = m × 3.28084',
                            in: 'in = m × 39.3701',
                            yd: 'yd = m × 1.09361',
                            mi: 'mi = m × 0.000621371'
                        },
                        km: {
                            m: 'm = km × 1000',
                            cm: 'cm = km × 100000',
                            mm: 'mm = km × 1000000',
                            ft: 'ft = km × 3280.84',
                            in: 'in = km × 39370.1',
                            yd: 'yd = km × 1093.61',
                            mi: 'mi = km × 0.621371'
                        },
                        cm: {
                            m: 'm = cm ÷ 100',
                            km: 'km = cm ÷ 100000',
                            mm: 'mm = cm × 10',
                            ft: 'ft = cm × 0.0328084',
                            in: 'in = cm × 0.393701',
                            yd: 'yd = cm × 0.0109361',
                            mi: 'mi = cm × 0.00000621371'
                        },
                        mm: {
                            m: 'm = mm ÷ 1000',
                            km: 'km = mm ÷ 1000000',
                            cm: 'cm = mm ÷ 10',
                            ft: 'ft = mm × 0.00328084',
                            in: 'in = mm × 0.0393701',
                            yd: 'yd = mm × 0.00109361',
                            mi: 'mi = mm × 6.2137e-7'
                        },
                        ft: {
                            m: 'm = ft × 0.3048',
                            km: 'km = ft × 0.0003048',
                            cm: 'cm = ft × 30.48',
                            mm: 'mm = ft × 304.8',
                            in: 'in = ft × 12',
                            yd: 'yd = ft ÷ 3',
                            mi: 'mi = ft ÷ 5280'
                        },
                        in: {
                            m: 'm = in × 0.0254',
                            km: 'km = in × 0.0000254',
                            cm: 'cm = in × 2.54',
                            mm: 'mm = in × 25.4',
                            ft: 'ft = in ÷ 12',
                            yd: 'yd = in ÷ 36',
                            mi: 'mi = in ÷ 63360'
                        },
                        yd: {
                            m: 'm = yd × 0.9144',
                            km: 'km = yd × 0.0009144',
                            cm: 'cm = yd × 91.44',
                            mm: 'mm = yd × 914.4',
                            ft: 'ft = yd × 3',
                            in: 'in = yd × 36',
                            mi: 'mi = yd ÷ 1760'
                        },
                        mi: {
                            m: 'm = mi × 1609.34',
                            km: 'km = mi × 1.60934',
                            cm: 'cm = mi × 160934',
                            mm: 'mm = mi × 1609340',
                            ft: 'ft = mi × 5280',
                            in: 'in = mi × 63360',
                            yd: 'yd = mi × 1760'
                        }
                    };
                    
                    formula = lengthFormulas[fromUnit][toUnit];
                }
                unitConverters.length.formula.textContent = formula;
                break;
                
            case 'volume':
                if (fromUnit === toUnit) {
                    formula = 'No conversion needed';
                } else {
                    const volumeFormulas = {
                        l: {
                            ml: 'mL = L × 1000',
                            gal: 'gal = L × 0.264172',
                            qt: 'qt = L × 1.05669',
                            pt: 'pt = L × 2.11338',
                            cup: 'cup = L × 4.22675',
                            oz: 'fl oz = L × 33.814',
                            tbsp: 'tbsp = L × 67.628',
                            tsp: 'tsp = L × 202.884'
                        },
                        ml: {
                            l: 'L = mL ÷ 1000',
                            gal: 'gal = mL × 0.000264172',
                            qt: 'qt = mL × 0.00105669',
                            pt: 'pt = mL × 0.00211338',
                            cup: 'cup = mL × 0.00422675',
                            oz: 'fl oz = mL × 0.033814',
                            tbsp: 'tbsp = mL × 0.067628',
                            tsp: 'tsp = mL × 0.202884'
                        },
                        gal: {
                            l: 'L = gal × 3.78541',
                            ml: 'mL = gal × 3785.41',
                            qt: 'qt = gal × 4',
                            pt: 'pt = gal × 8',
                            cup: 'cup = gal × 16',
                            oz: 'fl oz = gal × 128',
                            tbsp: 'tbsp = gal × 256',
                            tsp: 'tsp = gal × 768'
                        },
                        qt: {
                            l: 'L = qt × 0.946353',
                            ml: 'mL = qt × 946.353',
                            gal: 'gal = qt ÷ 4',
                            pt: 'pt = qt × 2',
                            cup: 'cup = qt × 4',
                            oz: 'fl oz = qt × 32',
                            tbsp: 'tbsp = qt × 64',
                            tsp: 'tsp = qt × 192'
                        },
                        pt: {
                            l: 'L = pt × 0.473176',
                            ml: 'mL = pt × 473.176',
                            gal: 'gal = pt ÷ 8',
                            qt: 'qt = pt ÷ 2',
                            cup: 'cup = pt × 2',
                            oz: 'fl oz = pt × 16',
                            tbsp: 'tbsp = pt × 32',
                            tsp: 'tsp = pt × 96'
                        },
                        cup: {
                            l: 'L = cup × 0.236588',
                            ml: 'mL = cup × 236.588',
                            gal: 'gal = cup ÷ 16',
                            qt: 'qt = cup ÷ 4',
                            pt: 'pt = cup ÷ 2',
                            oz: 'fl oz = cup × 8',
                            tbsp: 'tbsp = cup × 16',
                            tsp: 'tsp = cup × 48'
                        },
                        oz: {
                            l: 'L = fl oz × 0.0295735',
                            ml: 'mL = fl oz × 29.5735',
                            gal: 'gal = fl oz ÷ 128',
                            qt: 'qt = fl oz ÷ 32',
                            pt: 'pt = fl oz ÷ 16',
                            cup: 'cup = fl oz ÷ 8',
                            tbsp: 'tbsp = fl oz × 2',
                            tsp: 'tsp = fl oz × 6'
                        },
                        tbsp: {
                            l: 'L = tbsp × 0.0147868',
                            ml: 'mL = tbsp × 14.7868',
                            gal: 'gal = tbsp ÷ 256',
                            qt: 'qt = tbsp ÷ 64',
                            pt: 'pt = tbsp ÷ 32',
                            cup: 'cup = tbsp ÷ 16',
                            oz: 'fl oz = tbsp ÷ 2',
                            tsp: 'tsp = tbsp × 3'
                        },
                        tsp: {
                            l: 'L = tsp × 0.00492892',
                            ml: 'mL = tsp × 4.92892',
                            gal: 'gal = tsp ÷ 768',
                            qt: 'qt = tsp ÷ 192',
                            pt: 'pt = tsp ÷ 96',
                            cup: 'cup = tsp ÷ 48',
                            oz: 'fl oz = tsp ÷ 6',
                            tbsp: 'tbsp = tsp ÷ 3'
                        }
                    };
                    
                    formula = volumeFormulas[fromUnit][toUnit];
                }
                unitConverters.volume.formula.textContent = formula;
                break;
        }
    }
    
    // Function to trigger download
    function downloadFile(dataUrl, fileName) {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = fileName;
        link.click();
    }
    
    // Finish conversion
    function finishConversion() {
        // Hide loading spinner
        loadingSpinner.style.display = 'none';
        
        // Show success message
        alert('Conversion completed! Your files will download shortly.');
        
        // Reset after conversion
        selectedFiles = [];
        fileListContainer.innerHTML = '';
        fileList.style.display = 'none';
    }
    
    // Add visual feedback styles
    document.querySelectorAll('.upload-btn, .convert-btn, .tab-btn, .category-btn, .swap-icon').forEach(button => {
        button.addEventListener('mousedown', () => {
            button.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('mouseup', () => {
            button.style.transform = '';
        });
    });
    
    // Initialize formulas on page load
    updateFormula('temperature', 'celsius', 'fahrenheit');
    updateFormula('weight', 'kg', 'lb');
    updateFormula('length', 'm', 'ft');
    updateFormula('volume', 'l', 'gal');

    // For Temperature conversion
    // Add input event to show real-time formula updates
    if (unitConverters.temperature.input) {
        unitConverters.temperature.input.addEventListener('input', () => {
            if (unitConverters.temperature.input.value) {
                const fromUnit = unitConverters.temperature.fromUnit.value;
                const toUnit = unitConverters.temperature.toUnit.value;
                updateFormula('temperature', fromUnit, toUnit);
            }
        });
    }

    // For Weight conversion
    if (unitConverters.weight.input) {
        unitConverters.weight.input.addEventListener('input', () => {
            if (unitConverters.weight.input.value) {
                const fromUnit = unitConverters.weight.fromUnit.value;
                const toUnit = unitConverters.weight.toUnit.value;
                updateFormula('weight', fromUnit, toUnit);
            }
        });
    }

    // For Length conversion
    if (unitConverters.length.input) {
        unitConverters.length.input.addEventListener('input', () => {
            if (unitConverters.length.input.value) {
                const fromUnit = unitConverters.length.fromUnit.value;
                const toUnit = unitConverters.length.toUnit.value;
                updateFormula('length', fromUnit, toUnit);
            }
        });
    }

    // For Volume conversion
    if (unitConverters.volume.input) {
        unitConverters.volume.input.addEventListener('input', () => {
            if (unitConverters.volume.input.value) {
                const fromUnit = unitConverters.volume.fromUnit.value;
                const toUnit = unitConverters.volume.toUnit.value;
                updateFormula('volume', fromUnit, toUnit);
            }
        });
    }
}); 