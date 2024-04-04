document.addEventListener('DOMContentLoaded', function() {
    const shapeImage = document.getElementById('pool-shape-image');
    const shapeSelect = document.getElementById('shape');
    const calculateButton = document.getElementById('calculate');
    const calculationTypeSelect = document.getElementById('calculation-type');
    const showVolumeCheckbox = document.getElementById('show-volume');

    // Update pool shape image based on selection
    shapeSelect.addEventListener('change', function() {
        updateShapeImage(this.value);
        toggleInputFields(this.value);
    });

    // Handle the calculate button click and touchend events
    calculateButton.addEventListener('click', handleCalculate);
    calculateButton.addEventListener('touchend', function(event) {
        event.preventDefault(); // Prevent the mouse event from firing
        handleCalculate();
    });

    // Show or hide the depth input based on calculation type selection
    calculationTypeSelect.addEventListener('change', function() {
        document.getElementById('depth-input').style.display = this.value === 'volume' ? '' : 'none';
        calculateVolume();
    });

    // Recalculate volume when the show volume checkbox changes
    showVolumeCheckbox.addEventListener('change', calculateVolume);

    function updateShapeImage(shape) {
        const images = {
            rectangle: 'rectangle.png',
            circle: 'circle.png',
            oval: 'oval.png'
        };
        shapeImage.src = images[shape] || 'default_pool_shape.jpg';
        shapeImage.alt = `${shape.charAt(0).toUpperCase() + shape.slice(1)} Pool`;
    }

    function toggleInputFields(shape) {
        document.querySelector('.rectangle-inputs').style.display = shape === 'rectangle' ? '' : 'none';
        document.querySelector('.circle-inputs').style.display = shape === 'circle' ? '' : 'none';
        document.querySelector('.oval-inputs').style.display = shape === 'oval' ? '' : 'none';
    }

    function handleCalculate() {
        calculateVolume();
    }

    function calculateVolume() {
        const shape = shapeSelect.value;
        const calculationType = calculationTypeSelect.value;
        const showVolume = showVolumeCheckbox.checked;
        let length, width, radius, major, minor, shallowDepth, deepDepth = 0;
        let surfaceArea = 0, volume = 0;
        let formula = '', volumeFormula = '';
        let occupancy = 0, adjustedOccupancy = 0;

        // Determine shape-specific calculations
        switch (shape) {
            case 'rectangle':
                length = parseFloat(document.getElementById('length').value);
                width = parseFloat(document.getElementById('width').value);
                if(isNaN(length) || isNaN(width) || length <= 0 || width <= 0) {
                    alert("Please enter positive numbers for length and width.");
                    return;
                }
                surfaceArea = length * width;
                formula = `Surface Area = length * width = ${length}m * ${width}m`;
                break;
            case 'circle':
                radius = parseFloat(document.getElementById('radius').value);
                if(isNaN(radius) || radius <= 0) {
                    alert("Please enter a positive number for radius.");
                    return;
                }
                surfaceArea = Math.PI * Math.pow(radius, 2);
                formula = `Surface Area = π * radius² = π * ${radius}²m`;
                break;
            case 'oval':
                major = parseFloat(document.getElementById('major').value);
                minor = parseFloat(document.getElementById('minor').value);
                if(isNaN(major) || isNaN(minor) || major <= 0 || minor <= 0) {
                    alert("Please enter positive numbers for major and minor axes.");
                    return;
                }
                surfaceArea = Math.PI * (major / 2) * (minor / 2);
                formula = `Surface Area = π * (major/2) * (minor/2) = π * (${major}/2)m * (${minor}/2)m`;
                break;
        }

        if (calculationType === 'volume') {
            shallowDepth = parseFloat(document.getElementById('shallow-depth').value);
            deepDepth = parseFloat(document.getElementById('deep-depth').value);
            if(isNaN(shallowDepth) || isNaN(deepDepth) || shallowDepth <= 0 || deepDepth <= 0) {
                alert("Please enter positive numbers for shallow and deep depths.");
                return;
            }
            let averageDepth = (shallowDepth + deepDepth) / 2;
            volume = surfaceArea * averageDepth;
            volumeFormula = `Volume = Surface Area * average depth = ${surfaceArea.toFixed(2)}m² * ${averageDepth.toFixed(2)}m = ${volume.toFixed(2)}m³`;
        }

        occupancy = (surfaceArea / 3).toFixed(2);
        adjustedOccupancy = occupancy * 0.8; // Deduct 20%

        // Update the UI with the results
        document.getElementById('result').innerText = showVolume && calculationType === 'volume' ? `Pool Volume: ${volume.toFixed(2)} m³` : '';
        document.getElementById('formula-box').innerText = calculationType === 'volume' ? volumeFormula : formula;
        document.getElementById('occupancy-box').innerText = `Max Occupancy (based on surface area): ${occupancy} people`;
        // Display adjusted occupancy
        document.getElementById('adjusted-occupancy-box').innerText = `Adjusted Occupancy (80% of max): ${adjustedOccupancy.toFixed(0)} people`;
    }
});

