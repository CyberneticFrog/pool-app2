document.addEventListener('DOMContentLoaded', function() {
    const shapeImage = document.getElementById('pool-shape-image');
    const shapeSelect = document.getElementById('shape');
    const calculateButton = document.getElementById('calculate');
    const calculationTypeSelect = document.getElementById('calculation-type');
    const showVolumeCheckbox = document.getElementById('show-volume');

    shapeSelect.addEventListener('change', function() {
        updateShapeImage(this.value);
        toggleInputFields(this.value);
    });

    calculateButton.addEventListener('click', handleCalculate);
    calculateButton.addEventListener('touchend', function(event) {
        event.preventDefault();
        handleCalculate();
    });

    calculationTypeSelect.addEventListener('change', function() {
        document.getElementById('depth-input').style.display = this.value === 'volume' ? '' : 'none';
        calculateVolume();
    });

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

        // Make elements visible
        document.getElementById('result').classList.remove('hidden');
        document.getElementById('formula-box').classList.remove('hidden');
        document.querySelector('.occupancy-info').classList.remove('hidden');
    }

    function calculateVolume() {
        const shape = shapeSelect.value;
        const calculationType = calculationTypeSelect.value;
        const showVolume = showVolumeCheckbox.checked;
        let length, width, radius, major, minor, shallowDepth, deepDepth = 0;
        let surfaceArea = 0, volume = 0, averageDepth = 0;
        let formula = '', volumeFormula = '', depthInfo = '';
        let occupancy = 0, adjustedOccupancy = 0, batherCalculation = '';

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
            averageDepth = (shallowDepth + deepDepth) / 2;
            volume = surfaceArea * averageDepth;
            volumeFormula = `Volume = Surface Area * average depth = ${surfaceArea.toFixed(2)}m² * ${averageDepth.toFixed(2)}m = ${volume.toFixed(2)}m³`;
            depthInfo = `Average Depth = ${(shallowDepth + deepDepth) / 2}m`;

            // Bather calculations based on depth
            if (averageDepth < 1) {
                occupancy = surfaceArea / 2.2;
                batherCalculation = `Bathers for shallow water (<1m): ${Math.floor(occupancy)} (1 per 2.2m²)`;
            } else if (averageDepth >= 1 && averageDepth <= 1.5) {
                occupancy = surfaceArea / 2.7;
                batherCalculation = `Bathers for standing water (1-1.5m): ${Math.floor(occupancy)} (1 per 2.7m²)`;
            } else if (averageDepth > 1.5) {
                occupancy = surfaceArea / 4;
                batherCalculation = `Bathers for deep water (>1.5m): ${Math.floor(occupancy)} (1 per 4m²)`;
            }
        } else {
            occupancy = surfaceArea / 3;
            batherCalculation = `Occupancy based on surface area (default): ${Math.floor(occupancy)} people (1 per 3m²)`;
        }

        adjustedOccupancy = occupancy * 0.8; // Adjust occupancy to 80%

        // Display average depth if volume calculation is selected
        formula += calculationType === 'volume' ? ` | ${depthInfo}` : '';

            // Safely set innerText with checks
    const setResultText = (id, text) => {
        const element = document.getElementById(id);
        if (element) {
            element.innerText = text;
        } else {
            console.error(`Element with ID '${id}' not found.`);
        }
    };

    setResultText('result', showVolume && calculationType === 'volume' ? `Pool Volume: ${volume.toFixed(2)} m³` : '');
    setResultText('formula-box', calculationType === 'volume' ? `${volumeFormula} | ${depthInfo}` : formula);
    setResultText('occupancy-info', batherCalculation);
    setResultText('adjusted-occupancy-box', `Adjusted Occupancy (80% of max): ${Math.floor(adjustedOccupancy)} people`);
}
});
